import { Notice, Plugin, TFile, normalizePath } from 'obsidian';
import { XPEngine } from './xp-engine';
import { VaultWatcher } from './vault-watcher';
import { ManualLogger } from './manual-logger';
import { MilestoneModal } from './milestone-modal';
import { StatusBar } from './status-bar';
import { ScholarQuestSettings } from './settings';
import { OnboardingModal, emptyCareerData } from './onboarding-modal';
import { SidebarView, SIDEBAR_VIEW_TYPE } from './sidebar-view';
import { OnboardingData, PluginData, XPSettings } from './types';
import { DEFAULT_MILESTONE_TEMPLATES, DEFAULT_SETTINGS, ACHIEVEMENTS } from './constants';
import { checkAchievement, checkNewAchievements } from './achievement-engine';

const DEFAULT_DATA: PluginData = {
  totalXP: 0,
  level: 1,
  activities: [],
  snapshots: {},
  milestones: {},
  todayXP: 0,
  todayDate: new Date().toISOString().split('T')[0],
  hasOnboarded: false,
  unlockedAchievements: {},
  archivedProjects: [],
};

export default class ScholarQuestPlugin extends Plugin {
  settings!: XPSettings;
  pluginData!: PluginData;
  engine!: XPEngine;
  watcher!: VaultWatcher;
  statusBar!: StatusBar;
  private initialSaveComplete = false;
  private vaultReady = false;
  private sidebarDebounceTimer: number | null = null;
  private metadataDebounce = new Map<string, number>();

  async onload(): Promise<void> {
    await this.loadPluginData();

    this.engine = new XPEngine(this.pluginData, this.settings, () => this.savePluginData());

    // H1: Point-of-action XP toast. Skip career-init, milestone-completed (already noticed
    // via sidebar click), manual-log (already noticed via ManualLogger), and writing-progress
    // < 20 XP (sub-threshold increments accumulate silently).
    this.engine.onXPAwarded = (xp, type, label) => {
      const suppress = new Set<typeof type>(['career-init', 'milestone-completed', 'manual-log', 'vault-scan']);
      if (suppress.has(type)) return;
      if (type === 'writing-progress' && xp < 20) return;
      new Notice(`+${xp} XP — ${label}`);
    };

    this.watcher = new VaultWatcher(
      this.engine,
      this.settings,
      this.app.vault,
      this.app.metadataCache
    );
    this.watcher.onUpdate = () => this.refreshSidebar();

    const scrollSrc = this.app.vault.adapter.getResourcePath(
      normalizePath(`${this.manifest.dir}/assets/sprites/scroll-icon.png`)
    );
    this.statusBar = new StatusBar(this.addStatusBarItem(), this.engine, scrollSrc);
    this.statusBar.update();

    this.registerView(SIDEBAR_VIEW_TYPE, leaf => new SidebarView(leaf, this));

    this.addRibbonIcon('graduation-cap', 'Scholar Quest', () => this.activateSidebar());

    this.registerEvent(
      this.app.vault.on('create', file => {
        if (file instanceof TFile) this.watcher.onFileCreate(file);
      })
    );

    this.registerEvent(
      this.app.metadataCache.on('changed', file => {
        if (!this.vaultReady) return;
        const existing = this.metadataDebounce.get(file.path);
        if (existing) clearTimeout(existing);
        const timer = window.setTimeout(() => {
          this.metadataDebounce.delete(file.path);
          this.watcher.onMetadataChange(file);
        }, 300);
        this.metadataDebounce.set(file.path, timer);
      })
    );

    this.registerEvent(
      this.app.vault.on('rename', (file, oldPath) => {
        if (!(file instanceof TFile)) return;
        const data = this.engine.getData();
        if (data.snapshots[oldPath]) {
          data.snapshots[file.path] = data.snapshots[oldPath];
          delete data.snapshots[oldPath];
        }
      })
    );

    this.registerEvent(
      this.app.vault.on('delete', file => {
        if (!(file instanceof TFile)) return;
        const data = this.engine.getData();
        delete data.snapshots[file.path];
      })
    );

    this.registerInterval(window.setInterval(() => this.statusBar.update(), 30_000));

    this.addCommand({
      id: 'log-activity',
      name: 'Log activity',
      callback: () => new ManualLogger(this.app, this.engine, this.settings).open(),
    });

    this.addCommand({
      id: 'complete-milestone',
      name: 'Complete milestone',
      callback: () => new MilestoneModal(this.app, this.engine, this.settings).open(),
    });

    this.addCommand({
      id: 'show-xp-summary',
      name: 'Show XP summary',
      callback: () => {
        const { totalXP, level, todayXP } = this.engine.getData();
        const tier = this.engine.getTierName(level);
        new Notice(`📜 ${tier} Lv ${level} · ${totalXP} XP total · +${todayXP} today`);
      },
    });

    this.addCommand({
      id: 'open-sidebar',
      name: 'Open Scholar Quest panel',
      callback: () => this.activateSidebar(),
    });

    this.addCommand({
      id: 'import-career-history',
      name: 'Import career history',
      callback: () => this.openOnboarding(),
    });

    this.addSettingTab(new ScholarQuestSettings(this.app, this));

    this.app.workspace.onLayoutReady(() => {
      this.vaultReady = true;
      this.initProjectMilestones();
      if (!this.pluginData.hasOnboarded) {
        this.openOnboarding();
      } else {
        this.awardDailyPresence();
      }
    });
  }

  async onunload(): Promise<void> {
    if (this.sidebarDebounceTimer) clearTimeout(this.sidebarDebounceTimer);
    for (const timer of this.metadataDebounce.values()) clearTimeout(timer);
    this.app.workspace.detachLeavesOfType(SIDEBAR_VIEW_TYPE);
  }

  private openOnboarding(): void {
    // Capture before modal opens so the callback closure sees the pre-open state.
    const isReopen = !!(this.pluginData.careerData ?? this.pluginData.hasOnboarded);
    const initialData = this.pluginData.careerData ??
      (this.pluginData.hasOnboarded
        ? emptyCareerData(this.pluginData.avatarTheme ?? 'purple')
        : undefined);

    new OnboardingModal(this.app, this.engine, async (xp, careerData) => {
      const prev = this.pluginData.activities.find(a => a.type === 'career-init');
      const prevXP = prev?.xp ?? 0;

      if (prev) {
        this.pluginData.totalXP = Math.max(0, this.pluginData.totalXP - prev.xp);
        this.pluginData.todayXP = Math.max(0, this.pluginData.todayXP - prev.xp);
        this.pluginData.activities = this.pluginData.activities.filter(a => a.type !== 'career-init');
        this.engine.recalculateLevel();
      }
      if (xp > 0) {
        await this.engine.awardXP(xp, 'career-init', 'Career history imported');
      }

      const careerIds = this.resolveCareerAchievements(careerData);
      const newCareerAchs = careerIds
        .filter(id => !(id in this.pluginData.unlockedAchievements))
        .map(id => {
          this.pluginData.unlockedAchievements[id] = Date.now();
          return ACHIEVEMENTS.find(a => a.id === id);
        })
        .filter((a): a is typeof ACHIEVEMENTS[0] => a !== undefined);

      this.pluginData.avatarTheme = careerData.avatarTheme ?? 'purple';
      this.pluginData.careerData = careerData;
      this.pluginData.hasOnboarded = true;
      await this.savePluginData();

      if (isReopen) {
        const delta = xp - prevXP;
        const sign = delta >= 0 ? '+' : '';
        new Notice(`Career history updated — ${sign}${delta} XP (Level ${this.pluginData.level})`);
      } else {
        const themeName = (this.pluginData.avatarTheme ?? 'purple').charAt(0).toUpperCase()
          + (this.pluginData.avatarTheme ?? 'purple').slice(1);
        new Notice(`🎓 Starting at Level ${this.pluginData.level}. Your dragon is ${themeName}!`);
        await this.awardDailyPresence();
      }

      for (const ach of newCareerAchs) {
        new Notice(`🏆 Achievement unlocked: ${ach.name} — ${ach.description}`, 6000);
      }
    }, initialData).open();
  }

  private resolveCareerAchievements(d: OnboardingData): string[] {
    const ids: string[] = [];
    if (d.phd || d.masters)                                                              ids.push('defended');
    if (d.invitedTalks > 0 || d.conferenceTalks > 0)                                    ids.push('talk-delivered');
    if (d.grantsPI > 0 || d.grantsCoI > 0)                                              ids.push('awarded');
    if (d.firstAuthorPapers > 0 || d.coAuthorPapers > 0 || d.editedVolumes > 0) {
      ids.push('submitted');
      ids.push('accepted');
    }
    return ids;
  }

  async activateSidebar(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(SIDEBAR_VIEW_TYPE);
    if (existing.length) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: SIDEBAR_VIEW_TYPE, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }

  async runVaultScan(): Promise<void> {
    const isFirst = !this.pluginData.hasVaultScanned;
    const { papers, notes, xp } = await this.watcher.scanVault(isFirst);
    if (isFirst && xp > 0) {
      await this.engine.awardXP(xp, 'vault-scan',
        `Vault import: ${papers} papers, ${notes} notes`);
    }
    this.pluginData.hasVaultScanned = true;
    await this.savePluginData();

    const action = isFirst ? 'Vault import complete' : 'Vault rescan complete';
    const detail = isFirst
      ? `Found ${papers} papers, ${notes} atomic notes. +${xp} XP for your reading history.`
      : `Rebuilt baselines for ${papers} papers, ${notes} atomic notes. No XP awarded.`;
    new Notice(`📚 ${action} — ${detail}`, 6000);
  }

  private async initProjectMilestones(): Promise<void> {
    const files = this.app.vault.getMarkdownFiles();
    let anyAdded = false;
    for (const file of files) {
      if (!file.path.startsWith(this.settings.projectsFolder + '/')) continue;
      if (this.engine.getMilestoneRecord(file.path)) continue;
      const cache = this.app.metadataCache.getFileCache(file);
      const rawTags = cache?.frontmatter?.tags;
      const tags: string[] = Array.isArray(rawTags) ? rawTags : [];
      const projectType = this.detectProjectType(tags);
      if (projectType) {
        await this.engine.initMilestoneRecord(file.path, projectType, false);
        anyAdded = true;
      }
    }
    if (anyAdded) await this.savePluginData();
  }

  private detectProjectType(tags: string[]): string | null {
    for (const [type, tag] of Object.entries(this.settings.projectTags)) {
      if (tags.includes(tag) || tags.includes('#' + tag)) return type;
    }
    return null;
  }

  refreshSidebar(): void {
    if (this.sidebarDebounceTimer) clearTimeout(this.sidebarDebounceTimer);
    this.sidebarDebounceTimer = window.setTimeout(() => {
      this.sidebarDebounceTimer = null;
      this.app.workspace.getLeavesOfType(SIDEBAR_VIEW_TYPE).forEach(leaf => {
        if (leaf.view instanceof SidebarView) leaf.view.render();
      });
    }, 400);
  }

  async loadPluginData(): Promise<void> {
    const saved = await this.loadData();
    const savedSettings = saved?.settings ?? {} as any;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, savedSettings);
    // Migrate stale tierNames (old versions had fewer tiers with different names)
    if (!this.settings.tierNames || this.settings.tierNames.length !== DEFAULT_SETTINGS.tierNames.length) {
      this.settings.tierNames = [...DEFAULT_SETTINGS.tierNames];
    }
    // Migrate old builtinActivities/customActivities to manualActivities
    if (savedSettings.builtinActivities !== undefined || savedSettings.customActivities !== undefined) {
      this.settings.manualActivities = [
        ...(savedSettings.builtinActivities ?? []),
        ...(savedSettings.customActivities ?? []),
      ];
    }
    this.pluginData = {
      totalXP: saved?.totalXP ?? 0,
      level: saved?.level ?? 1,
      activities: saved?.activities ?? [],
      snapshots: saved?.snapshots ?? {},
      milestones: saved?.milestones ?? {},
      todayXP: saved?.todayXP ?? 0,
      todayDate: saved?.todayDate ?? DEFAULT_DATA.todayDate,
      hasOnboarded: saved?.hasOnboarded ?? ((saved?.activities?.length ?? 0) > 0),
      unlockedAchievements: saved?.unlockedAchievements ?? {},
      archivedProjects: saved?.archivedProjects ?? [],
      lastPresenceDate: saved?.lastPresenceDate,
      currentStreak: saved?.currentStreak ?? 0,
      hasVaultScanned: saved?.hasVaultScanned ?? false,
      careerData: saved?.careerData,
    };

    // Migration: mark built-in milestones and enforce default XP values
    for (const [type, template] of Object.entries(this.settings.projectTemplates)) {
      const defaults = DEFAULT_MILESTONE_TEMPLATES[type] ?? [];
      for (const milestone of template.milestones) {
        const def = defaults.find(d => d.name === milestone.name);
        if (def) {
          milestone.builtin = true;
          milestone.xp = def.xp;
        }
      }
    }

    if (saved?.unlockedAchievements === undefined) {
      for (const def of ACHIEVEMENTS) {
        if (checkAchievement(def, this.pluginData)) {
          this.pluginData.unlockedAchievements[def.id] = Date.now();
        }
      }
      await this.saveData({ settings: this.settings, ...this.pluginData });
    }
  }

  async savePluginData(): Promise<void> {
    await this.saveData({ settings: this.settings, ...this.pluginData });
    this.statusBar?.update();
    this.refreshSidebar();
    const newlyUnlocked = checkNewAchievements(this.pluginData, ACHIEVEMENTS);
    if (newlyUnlocked.length > 0) {
      await this.saveData({ settings: this.settings, ...this.pluginData });
      if (!this.initialSaveComplete && newlyUnlocked.length > 2) {
        // Batch on first save to avoid flooding notices after an XP curve migration
        new Notice(`🎉 ${newlyUnlocked.length} achievements unlocked!`, 4000);
      } else {
        for (const ach of newlyUnlocked) {
          new Notice(`🏆 Achievement unlocked: ${ach.name} — ${ach.description}`, 6000);
        }
      }
    }
    this.initialSaveComplete = true;
  }

  private async awardDailyPresence(): Promise<void> {
    const today = this.engine.getTodayDate();
    if (this.pluginData.lastPresenceDate === today) return;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    this.pluginData.currentStreak = this.pluginData.lastPresenceDate === yesterdayStr
      ? (this.pluginData.currentStreak ?? 1) + 1
      : 1;
    this.pluginData.lastPresenceDate = today;
    // Persist the guard immediately so a plugin reload mid-operation doesn't double-award.
    await this.saveData({ settings: this.settings, ...this.pluginData });

    await this.engine.awardXP(
      this.settings.xpDailyPresence ?? 5,
      'daily-presence',
      'Daily presence'
    );
  }
}

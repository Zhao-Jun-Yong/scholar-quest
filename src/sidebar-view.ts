import { ItemView, Notice, WorkspaceLeaf } from 'obsidian';
import { ACHIEVEMENTS, TIER_LEVEL_RANGES } from './constants';
import { THEME_AVATARS, THEMES, AvatarTheme } from './tier-avatars';
import { PluginData } from './types';
import type ScholarQuestPlugin from './main';

export const SIDEBAR_VIEW_TYPE = 'scholar-quest-sidebar';

const MAX_VISIBLE_PROJECTS = 3;

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? 'yesterday' : `${d}d ago`;
}

export class SidebarView extends ItemView {
  private plugin: ScholarQuestPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: ScholarQuestPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string { return SIDEBAR_VIEW_TYPE; }
  getDisplayText(): string { return 'Scholar Quest'; }
  getIcon(): string { return 'graduation-cap'; }

  async onOpen(): Promise<void> { this.render(); }
  async onClose(): Promise<void> {}

  render(): void {
    const el = this.containerEl.children[1] as HTMLElement;
    el.empty();
    el.style.cssText = 'padding: 12px; overflow-y: auto;';

    const engine = this.plugin.engine;
    const data = engine.getData();
    const settings = engine.getSettings();
    const { level, totalXP, todayXP } = data;

    const tierIdx = Math.max(0, TIER_LEVEL_RANGES.findIndex(r => level >= r.min && level <= r.max));
    const tierName = settings.tierNames[tierIdx];

    // Profile header
    const header = el.createDiv();
    header.style.cssText = 'text-align: center; margin-bottom: 12px;';
    const avatarEl = header.createDiv();
    avatarEl.style.cssText = 'width: 80px; height: 80px; margin: 0 auto 6px;';
    const theme = (this.plugin.pluginData.avatarTheme ?? 'purple') as AvatarTheme;
    const avatars = THEME_AVATARS[THEMES.includes(theme) ? theme : 'purple'];
    avatarEl.innerHTML = avatars[tierIdx];
    header.createDiv({ text: `Level ${level} · ${tierName}` }).style.cssText = 'font-weight: 600; font-size: 1.05em; margin-top: 4px;';
    header.createDiv({ text: `${totalXP.toLocaleString()} XP total · +${todayXP} today` }).style.cssText = 'color: var(--text-muted); font-size: 0.82em; margin-top: 2px;';

    // XP progress bar
    const xpNeeded = engine.xpToNextLevel(level);
    const xpEarned = xpNeeded - engine.getXPNeededForNextLevel();
    const pct = Math.round((xpEarned / xpNeeded) * 100);

    const barWrap = el.createDiv();
    barWrap.style.cssText = 'margin: 10px 0 4px; background: var(--background-secondary); border-radius: 4px; height: 8px; overflow: hidden;';
    const barFill = barWrap.createDiv();
    barFill.style.cssText = `width: ${pct}%; height: 100%; background: var(--interactive-accent); border-radius: 4px;`;

    el.createDiv({ text: `${xpEarned} / ${xpNeeded} XP to next level` })
      .style.cssText = 'color: var(--text-faint); font-size: 0.78em; text-align: center; margin-bottom: 4px;';

    // Writing session bonus progress
    const todayStr = engine.getTodayDate();
    const bonusThreshold = settings.writingSessionBonusThreshold ?? 500;
    const todayWords = Object.values(data.snapshots)
      .filter(s => s.dailyWritingDate === todayStr)
      .reduce((sum, s) => sum + Math.max(0, (s.wordCount ?? 0) - (s.dailyWritingStart ?? s.wordCount ?? 0)), 0);
    const bonusAlreadyAwarded = Object.values(data.snapshots).some(s => s.dailyWritingDate === todayStr && s.writingBonusAwarded);
    if (todayWords > 0) {
      const wordsLeft = bonusThreshold - todayWords;
      const bonusText = bonusAlreadyAwarded || wordsLeft <= 0
        ? `${todayWords} words today · bonus ✓`
        : `${todayWords} words today · ${wordsLeft} to bonus`;
      el.createDiv({ text: bonusText })
        .style.cssText = 'color: var(--text-faint); font-size: 0.75em; text-align: center; margin-bottom: 6px;';
    } else {
      el.createDiv().style.marginBottom = '6px';
    }

    // Streak
    const streak = data.currentStreak ?? 0;
    if (streak >= 2) {
      const streakRow = el.createDiv();
      streakRow.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 0.82em; color: var(--text-muted); margin-bottom: 14px;';
      const flameEl = streakRow.createDiv();
      flameEl.style.cssText = 'width: 14px; height: 14px; flex-shrink: 0;';
      flameEl.innerHTML = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuUlEQVR4nO2VP0vDQBjGnzQdql6LRRdHN8HBuYuuLp0yl84OjvEjOJjNfoLi7OQixUUR3NwEwU9QsBhsqW1tcw75Q42Xe980kSL4QCnhLu/zy/vnDvjXH5fMGqCwTPOsAOg1K5lBMgFoJMEESwPwI6A58OBaIr4me80KOztpM5BL3RcBkMGXKqXIQu6SriVUdZWuJVRrv9IDKqjoIZYFI/jlC0ClWtWQuQLMm1zslgAApSb5ihZioRK4lkB9pxg9qyAO9g9lMIpacQGM9csBuenqeQoEtb+9u2YF1gGwO3nU9v8bT6PoXc7XUwB4qVdDEECRhYT6pzoPtADn4+3EzleZh2PpWgLmwMsMYLQ6j8oFXefPnw0b7XeAOA9YTUjNP2MUswGEEPH7oFhraSE4d4R2CnQXUBJEHISCYGVg5ajMhghBuGIByGE/ggiDx03j4kKQADNRgLHqm+syUay1lFAzobegrszoRBONNZh7p8R2X9OHY3hdEx/3khxFKgNGEADDzifLHADbnFyck3w72QQAlG1Hu7Hv2PC6E5Z5GgAgGKXxzVZiKfqOjerZa6rYaQC+geQcc3n6AihinAwinp+tAAAAAElFTkSuQmCC" width="14" height="14" style="image-rendering:pixelated;"/>`;
      streakRow.createSpan({ text: `${streak}-day streak` });
    } else {
      el.createDiv().style.marginBottom = '14px';
    }

    // Recent activity — collapse consecutive writing-progress entries for the same file
    this.sectionHeading(el, 'Recent Activity');
    const collapsed: typeof data.activities = [];
    for (const act of data.activities) {
      const prev = collapsed[collapsed.length - 1];
      if (act.type === 'writing-progress' && prev?.type === 'writing-progress' && act.filePath === prev.filePath) {
        prev.xp += act.xp;
      } else {
        collapsed.push({ ...act });
      }
    }
    const recent = collapsed.slice(0, 10);
    if (recent.length === 0) {
      el.createDiv({ text: 'No activity yet.' }).style.color = 'var(--text-faint)';
    } else {
      for (const act of recent) {
        const row = el.createDiv();
        row.style.cssText = 'display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; font-size: 0.83em;';
        const label = row.createDiv();
        label.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;';
        label.createSpan({ text: act.label.length > 36 ? act.label.slice(0, 34) + '…' : act.label });
        const meta = row.createDiv();
        meta.style.cssText = 'color: var(--text-muted); white-space: nowrap; margin-left: 8px; flex-shrink: 0;';
        meta.createSpan({ text: `+${act.xp}` }).style.color = 'var(--color-green)';
        meta.createSpan({ text: ' · ' + timeAgo(act.timestamp) });
      }

      // L3: show which manual activities were already logged today
      const todayStr = engine.getTodayDate();
      const loggedToday = data.activities
        .filter(a => a.type === 'manual-log' &&
          new Date(a.timestamp).toISOString().split('T')[0] === todayStr)
        .map(a => a.label);
      if (loggedToday.length > 0) {
        const note = el.createDiv();
        note.style.cssText = 'color: var(--text-faint); font-size: 0.75em; margin-top: 4px; margin-bottom: 4px;';
        note.setText(`Logged today: ${loggedToday.join(', ')}`);
      }
    }

    // Achievements
    this.renderAchievements(el, data);

    // Active projects
    this.renderProjects(el, data);
  }

  private renderProjects(el: HTMLElement, data: PluginData): void {
    const engine = this.plugin.engine;
    const archived = new Set(data.archivedProjects ?? []);
    const all = engine.getAllProjectsWithPendingMilestones();
    const active = all.filter(p => !archived.has(p.filePath));
    const archivedProjects = all.filter(p => archived.has(p.filePath));

    if (active.length === 0 && archivedProjects.length === 0) return;

    this.sectionHeading(el, 'Active Projects');

    const visible = active.slice(0, MAX_VISIBLE_PROJECTS);
    const hidden = active.slice(MAX_VISIBLE_PROJECTS);

    for (const proj of visible) this.renderProject(el, proj);

    if (hidden.length > 0) {
      const details = el.createEl('details');
      details.style.cssText = 'margin-top: 4px;';
      const summary = details.createEl('summary');
      summary.style.cssText = 'color: var(--text-faint); font-size: 0.78em; cursor: pointer; margin-bottom: 6px;';
      summary.setText(`+${hidden.length} more project${hidden.length > 1 ? 's' : ''}…`);
      for (const proj of hidden) this.renderProject(details, proj);
    }

    // Archived section
    if (archivedProjects.length > 0) {
      const details = el.createEl('details');
      details.style.cssText = 'margin-top: 8px;';
      const summary = details.createEl('summary');
      summary.style.cssText = 'color: var(--text-faint); font-size: 0.78em; cursor: pointer; margin-bottom: 6px;';
      summary.setText(`Archived (${archivedProjects.length})`);

      for (const proj of archivedProjects) {
        const name = proj.filePath.split('/').pop()?.replace(/\.md$/, '') ?? proj.filePath;
        const row = details.createDiv();
        row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; opacity: 0.6;';
        row.createSpan({ text: name }).style.cssText = 'font-size: 0.83em; font-weight: 500;';

        const btn = row.createEl('button', { text: 'Unarchive' });
        btn.style.cssText = 'font-size: 0.72em; padding: 2px 6px; cursor: pointer;';
        btn.onclick = async () => {
          this.plugin.pluginData.archivedProjects =
            (this.plugin.pluginData.archivedProjects ?? []).filter(p => p !== proj.filePath);
          await this.plugin.savePluginData();
        };
      }
    }
  }

  private renderProject(el: HTMLElement, proj: { filePath: string; projectType: string; pending: { name: string; xp: number }[] }): void {
    const name = proj.filePath.split('/').pop()?.replace(/\.md$/, '') ?? proj.filePath;
    const projEl = el.createDiv();
    projEl.style.cssText = 'margin-bottom: 10px;';

    // Title row with archive button
    const titleRow = projEl.createDiv();
    titleRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;';

    const titleEl = titleRow.createDiv();
    titleEl.style.cssText = 'font-weight: 600; font-size: 0.88em; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;';
    titleEl.createSpan({ text: name + ' ' });
    titleEl.createSpan({ text: `[${proj.projectType}]` }).style.cssText = 'color: var(--text-muted); font-weight: normal; font-size: 0.9em;';

    const archiveBtn = titleRow.createEl('button');
    archiveBtn.setText('Archive');
    archiveBtn.style.cssText = 'font-size: 0.68em; padding: 1px 5px; cursor: pointer; flex-shrink: 0; margin-left: 6px; color: var(--text-faint);';
    archiveBtn.onclick = async () => {
      if (!this.plugin.pluginData.archivedProjects) this.plugin.pluginData.archivedProjects = [];
      this.plugin.pluginData.archivedProjects.push(proj.filePath);
      await this.plugin.savePluginData();
    };

    // Clickable milestones
    for (const m of proj.pending.slice(0, 5)) {
      const mEl = projEl.createDiv();
      mEl.style.cssText = 'display: flex; align-items: center; gap: 5px; font-size: 0.8em; color: var(--text-muted); padding-left: 10px; margin-bottom: 2px; cursor: pointer;';
      mEl.setAttribute('aria-label', `Complete milestone: ${m.name} (+${m.xp} XP)`);

      const box = mEl.createSpan({ text: '□' });
      box.style.cssText = 'font-size: 1.05em; flex-shrink: 0;';
      mEl.createSpan({ text: `${m.name}` });
      mEl.createSpan({ text: ` +${m.xp} XP` }).style.cssText = 'color: var(--text-faint); font-size: 0.9em;';

      mEl.onmouseenter = () => { box.setText('☑'); mEl.style.color = 'var(--text-normal)'; };
      mEl.onmouseleave = () => { box.setText('□'); mEl.style.color = 'var(--text-muted)'; };

      mEl.onclick = async () => {
        const xp = await this.plugin.engine.completeMilestone(proj.filePath, m.name);
        if (xp > 0) new Notice(`+${xp} XP — ${m.name}`);
      };
    }

    if (proj.pending.length > 5) {
      projEl.createDiv({ text: `  +${proj.pending.length - 5} more…` })
        .style.cssText = 'font-size: 0.78em; color: var(--text-faint); padding-left: 10px;';
    }
  }

  private renderAchievements(el: HTMLElement, data: PluginData): void {
    const unlocked = ACHIEVEMENTS.filter(a => a.id in data.unlockedAchievements);
    const locked = ACHIEVEMENTS.filter(a => !(a.id in data.unlockedAchievements));

    this.sectionHeading(el, `Achievements (${unlocked.length} / ${ACHIEVEMENTS.length})`);

    if (unlocked.length === 0) {
      el.createDiv({ text: 'No achievements yet — keep going!' })
        .style.cssText = 'color: var(--text-faint); font-size: 0.82em; margin-bottom: 8px;';
    } else {
      const grid = el.createDiv();
      grid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;';
      for (const ach of unlocked) {
        const chip = grid.createDiv();
        chip.style.cssText = 'display: flex; align-items: center; gap: 4px; padding: 3px 8px; background: var(--background-secondary); border-radius: 12px; font-size: 0.8em;';
        chip.setAttribute('aria-label', `${ach.name}: ${ach.description}`);
        chip.setAttribute('data-tooltip-position', 'top');
        const iconEl = chip.createDiv();
        iconEl.style.cssText = 'width:16px;height:16px;flex-shrink:0;';
        iconEl.innerHTML = ach.icon;
        chip.createSpan({ text: ach.name });
      }
    }

    if (locked.length > 0) {
      const details = el.createEl('details');
      details.style.cssText = 'margin-bottom: 12px;';
      const summary = details.createEl('summary');
      summary.style.cssText = 'color: var(--text-faint); font-size: 0.78em; cursor: pointer;';
      summary.setText(`${locked.length} locked`);
      const grid = details.createDiv();
      grid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;';
      for (const ach of locked) {
        const chip = grid.createDiv();
        chip.style.cssText = 'display: flex; align-items: center; gap: 4px; padding: 3px 8px; background: var(--background-secondary); border-radius: 12px; font-size: 0.8em; opacity: 0.4;';
        chip.setAttribute('aria-label', ach.description);
        chip.setAttribute('data-tooltip-position', 'top');
        const iconEl = chip.createDiv();
        iconEl.style.cssText = 'width:16px;height:16px;flex-shrink:0;';
        iconEl.innerHTML = ach.icon;
        chip.createSpan({ text: ach.name });
      }
    }
  }

  private sectionHeading(el: HTMLElement, text: string): void {
    el.createEl('h4', { text }).style.cssText =
      'margin: 0 0 8px; color: var(--text-muted); font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 4px;';
  }
}

import { App, ButtonComponent, Notice, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_MILESTONE_TEMPLATES, MAX_MANUAL_ACTIVITY_XP, MAX_MILESTONE_XP } from './constants';
import type ScholarQuestPlugin from './main';

export class ScholarQuestSettings extends PluginSettingTab {
  plugin: ScholarQuestPlugin;

  constructor(app: App, plugin: ScholarQuestPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  private async save(): Promise<void> {
    await this.plugin.savePluginData();
  }

  private section(el: HTMLElement, title: string, desc?: string): void {
    el.createEl('h3', { text: title });
    if (desc) el.createEl('p', { text: desc, cls: 'setting-item-description' });
  }

  private subsection(el: HTMLElement, title: string): void {
    const p = el.createEl('p', { text: title });
    p.style.cssText = 'margin: 16px 0 2px; font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted);';
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Scholar Quest' });

    // ── Vault Configuration ──────────────────────────────────────────────────
    // Folders, reading tags, and note tags all determine what the vault scan
    // picks up, so they live together under one Save/Discard flow.
    this.section(containerEl, 'Vault Configuration',
      'Define where your notes live and how Scholar Quest identifies them. Save changes before running a scan.');

    const DRAFT_KEYS = [
      'sourcesFolder', 'ideasFolder', 'projectsFolder',
      'readingStatusField', 'readingTagUnprocessed', 'readingTagSkimmed', 'readingTagCompleted',
      'atomTag', 'atomNoteTagField',
    ] as const;

    const draft: Record<string, string> = {};
    for (const k of DRAFT_KEYS) draft[k] = (this.plugin.settings as any)[k];

    let saveBtn: ButtonComponent | undefined;
    const updateSaveBtn = () => {
      const dirty = DRAFT_KEYS.some(k => draft[k] !== (this.plugin.settings as any)[k]);
      if (dirty) saveBtn?.setCta(); else saveBtn?.removeCta();
    };

    const addDraftField = (name: string, desc: string, key: string) =>
      new Setting(containerEl).setName(name).setDesc(desc).addText(t =>
        t.setValue(draft[key]).onChange(v => { draft[key] = v; updateSaveBtn(); })
      );

    this.subsection(containerEl, 'Folder paths');
    addDraftField('Sources folder', 'Papers, lectures, and other source notes', 'sourcesFolder');
    addDraftField('Ideas folder', 'Atomic / permanent notes', 'ideasFolder');
    addDraftField('Projects folder', 'Project files tracked for milestones', 'projectsFolder');

    this.subsection(containerEl, 'Reading tracking');
    addDraftField('Reading status field', 'Frontmatter property that holds the reading status (e.g. keywords, status)', 'readingStatusField');
    addDraftField('Unprocessed tag', 'Tag value meaning "not yet read" — used as baseline (e.g. 📥, inbox, toread)', 'readingTagUnprocessed');
    addDraftField('Skimmed tag', 'Tag value meaning "in progress / skimmed" — awards skimmed XP (e.g. 👀, reading)', 'readingTagSkimmed');
    addDraftField('Completed tag', 'Tag value meaning "fully read" — awards completed XP (e.g. ✅, done)', 'readingTagCompleted');

    this.subsection(containerEl, 'Note tracking');
    addDraftField('Atomic note tag', 'Tag that marks a note as atomic (e.g. cards/atom)', 'atomTag');
    addDraftField('Atomic note tag field', 'Frontmatter property that contains the atomic note tag (e.g. tags)', 'atomNoteTagField');

    new Setting(containerEl)
      .addButton(b => b
        .setButtonText('Discard')
        .onClick(() => this.display()))
      .addButton(b => {
        saveBtn = b;
        b.setButtonText('Save Configuration')
          .onClick(async () => {
            for (const k of DRAFT_KEYS) (this.plugin.settings as any)[k] = draft[k];
            await this.save();
            new Notice('Configuration saved. Run Scan Vault to update tracking.');
            this.display();
          });
      });

    new Setting(containerEl)
      .setName('Scan Vault')
      .setDesc(this.plugin.pluginData.hasVaultScanned
        ? 'Rebuild baselines from current configuration. No XP is awarded on rescans.'
        : 'First-time scan: awards XP for papers already read and atomic notes already created.')
      .addButton(b => {
        b.setButtonText(this.plugin.pluginData.hasVaultScanned ? 'Rescan Vault' : 'Scan Vault & Import History');
        if (!this.plugin.pluginData.hasVaultScanned) b.setCta();
        b.onClick(async () => {
          b.setButtonText('Scanning…').setDisabled(true);
          await this.plugin.runVaultScan();
          this.display();
        });
      });

    // ── Project Tracking ─────────────────────────────────────────────────────
    this.section(containerEl, 'Project Tracking',
      'How Scholar Quest identifies project files and their types.');

    this.addTextSetting(containerEl, 'Project tag field',
      'Frontmatter property that contains the project type tag (e.g. tags)', 'projectTagField');

    // Project tags — collapsible to reduce noise
    const tagDetails = containerEl.createEl('details');
    tagDetails.style.cssText = 'margin: 4px 0 12px; padding: 0 12px 8px; background: var(--background-secondary); border-radius: 6px;';
    const tagCount = Object.keys(this.plugin.settings.projectTags).length;
    const tagSummary = tagDetails.createEl('summary');
    tagSummary.style.cssText = 'padding: 10px 0; cursor: pointer; font-weight: 500; color: var(--text-muted);';
    tagSummary.setText(`Project tags  (${tagCount} types — expand to edit)`);

    for (const [type, tag] of Object.entries(this.plugin.settings.projectTags)) {
      new Setting(tagDetails)
        .setName(type)
        .addText(t => t.setValue(tag).onChange(async v => {
          this.plugin.settings.projectTags[type] = v;
          await this.save();
        }));
    }

    // ── Manual Log Activities ────────────────────────────────────────────────
    this.section(containerEl, 'Manual Log Activities',
      `For academic work done outside Obsidian. Max ${MAX_MANUAL_ACTIVITY_XP} XP per activity · once per day per activity.`);

    for (const activity of this.plugin.settings.manualActivities) {
      new Setting(containerEl)
        .setName(activity.name)
        .addText(t => {
          t.setPlaceholder('Activity name').setValue(activity.name);
          t.inputEl.style.width = '180px';
          t.onChange(async v => { activity.name = v; await this.save(); });
        })
        .addText(t => {
          t.setPlaceholder('XP').setValue(String(activity.xp));
          t.inputEl.type = 'number';
          t.inputEl.min = '1';
          t.inputEl.max = String(MAX_MANUAL_ACTIVITY_XP);
          t.inputEl.style.width = '60px';
          t.onChange(async v => {
            const n = Math.min(parseInt(v) || 1, MAX_MANUAL_ACTIVITY_XP);
            activity.xp = n; await this.save();
          });
        })
        .addExtraButton(b => b
          .setIcon('trash')
          .setTooltip('Remove activity')
          .onClick(async () => {
            this.plugin.settings.manualActivities =
              this.plugin.settings.manualActivities.filter(a => a !== activity);
            await this.save();
            this.display();
          }));
    }

    new Setting(containerEl)
      .addButton(b => b
        .setButtonText('+ Add activity')
        .onClick(async () => {
          this.plugin.settings.manualActivities.push({ name: 'New activity', xp: 40 });
          await this.save();
          this.display();
        }));

    // ── Milestone Templates ──────────────────────────────────────────────────
    this.section(containerEl, 'Milestone Templates',
      `Customise milestones per project type. XP is capped at ${MAX_MILESTONE_XP}.`);

    for (const [type, template] of Object.entries(this.plugin.settings.projectTemplates)) {
      const details = containerEl.createEl('details');
      details.style.cssText = 'margin: 4px 0; padding: 0 12px 8px; background: var(--background-secondary); border-radius: 6px;';

      const summary = details.createEl('summary');
      summary.style.cssText = 'padding: 10px 0; cursor: pointer; font-weight: 500;';
      summary.setText(`${type}  (${template.milestones.length} milestones)`);

      for (const milestone of template.milestones) {
        const row = new Setting(details)
          .addText(t => {
            t.setPlaceholder('Milestone name').setValue(milestone.name);
            t.inputEl.style.flex = '1';
            t.onChange(async v => { milestone.name = v; await this.save(); });
          })
          .addText(t => {
            t.setPlaceholder('XP').setValue(String(milestone.xp));
            t.inputEl.type = 'number';
            t.inputEl.min = '1';
            t.inputEl.max = String(MAX_MILESTONE_XP);
            t.inputEl.style.width = '60px';
            t.onChange(async v => {
              const n = Math.min(parseInt(v) || 1, MAX_MILESTONE_XP);
              milestone.xp = n; await this.save();
            });
          })
          .addExtraButton(b => b
            .setIcon('trash')
            .setTooltip('Remove milestone')
            .onClick(async () => {
              template.milestones = template.milestones.filter(m => m !== milestone);
              await this.save();
              this.display();
            }));
        row.settingEl.style.borderTop = 'none';
      }

      const controls = details.createEl('div');
      controls.style.cssText = 'display: flex; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--background-modifier-border);';

      const addBtn = controls.createEl('button', { text: '+ Add milestone' });
      addBtn.onclick = async () => {
        template.milestones.push({ name: 'New milestone', xp: 50 });
        await this.save();
        this.display();
      };

      const resetBtn = controls.createEl('button', { text: 'Reset to defaults' });
      resetBtn.style.color = 'var(--text-muted)';
      resetBtn.onclick = async () => {
        const defaults = DEFAULT_MILESTONE_TEMPLATES[type];
        if (defaults) {
          template.milestones = defaults.map(m => ({ ...m }));
          await this.save();
          this.display();
        }
      };
    }

    // ── XP Values ────────────────────────────────────────────────────────────
    const xpDetails = containerEl.createEl('details');
    xpDetails.style.cssText = 'margin: 4px 0 16px; padding: 0 12px 8px; background: var(--background-secondary); border-radius: 6px;';
    const xpSummary = xpDetails.createEl('summary');
    xpSummary.style.cssText = 'padding: 10px 0; cursor: pointer; font-weight: 500; color: var(--text-muted);';
    xpSummary.setText('XP Values  (expand to edit)');

    this.addNumberSetting(xpDetails, 'Paper skimmed', 'XP per paper skimmed', 'xpPaperSkimmed');
    this.addNumberSetting(xpDetails, 'Paper completed', 'XP per paper fully read', 'xpPaperCompleted');
    this.addNumberSetting(xpDetails, 'Atomic note created', 'XP for creating a new atomic note', 'xpAtomicNoteCreated');
    this.addNumberSetting(xpDetails, 'Atomic note developed', 'XP each time a note is significantly developed', 'xpAtomicNoteDeveloped');
    this.addNumberSetting(xpDetails, 'Writing progress (per 100 words)', 'XP awarded per 100 net new words', 'xpWritingProgressPer100Words');
    this.addNumberSetting(xpDetails, 'Writing session bonus', 'Bonus XP for writing a lot in one day', 'xpWritingSessionBonus');
    this.addNumberSetting(xpDetails, 'Writing session bonus threshold (words)', 'Net new words needed to trigger the bonus', 'writingSessionBonusThreshold');
    this.addNumberSetting(xpDetails, 'Daily presence', 'XP for opening Obsidian each day', 'xpDailyPresence');

    // ── Danger Zone ──────────────────────────────────────────────────────────
    this.section(containerEl, 'Danger Zone');

    new Setting(containerEl)
      .setName('Clear activity log')
      .setDesc('Remove all log entries. XP and level are kept.')
      .addButton(b => b.setButtonText('Clear log').setWarning().onClick(async () => {
        if (window.confirm('Clear all activity log entries? XP and level will not change.')) {
          this.plugin.pluginData.activities = [];
          await this.save();
          new Notice('Activity log cleared.');
        }
      }));

    new Setting(containerEl)
      .setName('Reset all progress')
      .setDesc('Reset XP, level, activity log, and achievements to zero.')
      .addButton(b => b.setButtonText('Reset progress').setWarning().onClick(async () => {
        if (window.confirm('Reset all XP, level, and activity log? This cannot be undone.')) {
          this.plugin.pluginData.totalXP = 0;
          this.plugin.pluginData.level = 1;
          this.plugin.pluginData.todayXP = 0;
          this.plugin.pluginData.activities = [];
          this.plugin.pluginData.hasOnboarded = false;
          this.plugin.pluginData.unlockedAchievements = {};
          this.plugin.engine.recalculateLevel();
          await this.save();
          new Notice('Progress reset.');
        }
      }));
  }

  private addTextSetting(el: HTMLElement, name: string, desc: string, key: string): void {
    new Setting(el).setName(name).setDesc(desc).addText(t =>
      t.setValue((this.plugin.settings as any)[key]).onChange(async v => {
        (this.plugin.settings as any)[key] = v; await this.save();
      }));
  }

  private addNumberSetting(el: HTMLElement, name: string, desc: string, key: string): void {
    new Setting(el).setName(name).setDesc(desc).addText(t => {
      t.inputEl.type = 'number';
      t.inputEl.min = '0';
      t.inputEl.style.width = '70px';
      t.setValue(String((this.plugin.settings as any)[key] ?? 0));
      t.onChange(async v => {
        const n = parseInt(v);
        if (!isNaN(n) && n >= 0) {
          (this.plugin.settings as any)[key] = n;
          await this.save();
        }
      });
    });
  }
}

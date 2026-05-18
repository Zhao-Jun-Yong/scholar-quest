import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_MILESTONE_TEMPLATES } from './constants';
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

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Scholar Quest' });

    // Vault Paths
    containerEl.createEl('h3', { text: 'Vault Paths' });
    this.addTextSetting(containerEl, 'Sources folder', 'Folder with source notes (papers, lectures)', 'sourcesFolder');
    this.addTextSetting(containerEl, 'Ideas folder', 'Folder with atomic notes', 'ideasFolder');
    this.addTextSetting(containerEl, 'Projects folder', 'Folder with Efforts/project files', 'projectsFolder');

    // Tags
    containerEl.createEl('h3', { text: 'Tags' });
    this.addTextSetting(containerEl, 'Atomic note tag', 'Tag identifying atomic notes', 'atomTag');
    for (const [type, tag] of Object.entries(this.plugin.settings.projectTags)) {
      new Setting(containerEl)
        .setName(`${type} tag`)
        .addText(t => t.setValue(tag).onChange(async v => {
          this.plugin.settings.projectTags[type] = v;
          await this.save();
        }));
    }

    // XP Values
    containerEl.createEl('h3', { text: 'XP Values' });
    const xpFields: { key: string; label: string }[] = [
      { key: 'xpPaperSkimmed', label: 'Paper skimmed (📥→👀)' },
      { key: 'xpPaperCompleted', label: 'Paper completed (→✅)' },
      { key: 'xpAtomicNoteCreated', label: 'New atomic note' },
      { key: 'xpAtomicNoteDeveloped', label: 'Atomic note developed' },
      { key: 'xpWritingProgressPer100Words', label: 'Writing progress per 100 words' },
    ];
    for (const { key, label } of xpFields) {
      this.addNumberSetting(containerEl, label, '', key);
    }
    this.addNumberSetting(containerEl, 'Writing progress threshold (words)', '', 'writingProgressWordThreshold');
    this.addNumberSetting(containerEl, 'Atomic development threshold (words)', '', 'atomicDevelopmentWordThreshold');
    this.addNumberSetting(containerEl, 'Development cooldown (minutes)', '', 'atomicDevelopmentCooldownMinutes');

    // Manual Activities
    containerEl.createEl('h3', { text: 'Manual Log Activities' });
    for (const activity of this.plugin.settings.builtinActivities) {
      new Setting(containerEl)
        .setName(activity.name)
        .setDesc('Built-in')
        .addText(t => t.setValue(String(activity.xp)).onChange(async v => {
          const n = parseInt(v);
          if (!isNaN(n) && n >= 0) { activity.xp = n; await this.save(); }
        }));
    }
    containerEl.createEl('h4', { text: 'Custom Activities' });
    for (const activity of this.plugin.settings.customActivities) {
      new Setting(containerEl)
        .addText(t => t.setPlaceholder('Name').setValue(activity.name).onChange(async v => {
          activity.name = v; await this.save();
        }))
        .addText(t => t.setPlaceholder('XP').setValue(String(activity.xp)).onChange(async v => {
          const n = parseInt(v);
          if (!isNaN(n)) { activity.xp = n; await this.save(); }
        }))
        .addButton(b => b.setButtonText('Remove').onClick(async () => {
          this.plugin.settings.customActivities =
            this.plugin.settings.customActivities.filter(a => a !== activity);
          await this.save();
          this.display();
        }));
    }
    new Setting(containerEl).addButton(b => b.setButtonText('Add custom activity').onClick(async () => {
      this.plugin.settings.customActivities.push({ name: 'New activity', xp: 40 });
      await this.save();
      this.display();
    }));

    // Level System
    containerEl.createEl('h3', { text: 'Level System' });
    new Setting(containerEl).setName('Status bar icon').addText(t =>
      t.setValue(this.plugin.settings.statusBarIcon).onChange(async v => {
        this.plugin.settings.statusBarIcon = v; await this.save();
      }));
    const tierLabels = ['Lv 1–5', 'Lv 6–10', 'Lv 11–15', 'Lv 16–20', 'Lv 21–25'];
    this.plugin.settings.tierNames.forEach((name, i) => {
      new Setting(containerEl).setName(`Tier ${i + 1} name (${tierLabels[i]})`).addText(t =>
        t.setValue(name).onChange(async v => {
          this.plugin.settings.tierNames[i] = v; await this.save();
        }));
    });

    // Milestone Templates
    containerEl.createEl('h3', { text: 'Milestone Templates' });
    for (const [type, template] of Object.entries(this.plugin.settings.projectTemplates)) {
      const details = containerEl.createEl('details');
      details.createEl('summary').setText(type);

      for (const milestone of template.milestones) {
        const row = details.createEl('div');
        Object.assign(row.style, { display: 'flex', gap: '8px', marginBottom: '4px' });

        const nameInput = row.createEl('input');
        nameInput.type = 'text';
        nameInput.value = milestone.name;
        nameInput.style.flex = '1';
        nameInput.onchange = async () => { milestone.name = nameInput.value; await this.save(); };

        const xpInput = row.createEl('input');
        xpInput.type = 'number';
        xpInput.value = String(milestone.xp);
        xpInput.style.width = '60px';
        xpInput.onchange = async () => {
          const n = parseInt(xpInput.value);
          if (!isNaN(n)) { milestone.xp = n; await this.save(); }
        };

        const removeBtn = row.createEl('button');
        removeBtn.setText('×');
        removeBtn.onclick = async () => {
          template.milestones = template.milestones.filter(m => m !== milestone);
          await this.save();
          this.display();
        };
      }

      const addBtn = details.createEl('button');
      addBtn.setText('+ Add milestone');
      addBtn.style.marginRight = '8px';
      addBtn.onclick = async () => {
        template.milestones.push({ name: 'New milestone', xp: 50 });
        await this.save();
        this.display();
      };

      const resetBtn = details.createEl('button');
      resetBtn.setText('Reset to defaults');
      resetBtn.onclick = async () => {
        const defaults = DEFAULT_MILESTONE_TEMPLATES[type];
        if (defaults) {
          template.milestones = defaults.map(m => ({ ...m }));
          await this.save();
          this.display();
        }
      };
    }

    // Danger Zone
    containerEl.createEl('h3', { text: 'Danger Zone' });

    new Setting(containerEl)
      .setName('Clear activity log')
      .setDesc('Remove all entries from the activity log. XP and level are kept.')
      .addButton(b => b.setButtonText('Clear log').setWarning().onClick(async () => {
        if (window.confirm('Clear all activity log entries? XP and level will not change.')) {
          this.plugin.pluginData.activities = [];
          await this.save();
          new Notice('Activity log cleared.');
        }
      }));

    new Setting(containerEl)
      .setName('Reset all progress')
      .setDesc('Reset XP, level, and activity log to zero. Milestone records are kept.')
      .addButton(b => b.setButtonText('Reset progress').setWarning().onClick(async () => {
        if (window.confirm('Reset all XP, level, and activity log? This cannot be undone.')) {
          this.plugin.pluginData.totalXP = 0;
          this.plugin.pluginData.level = 1;
          this.plugin.pluginData.todayXP = 0;
          this.plugin.pluginData.activities = [];
          this.plugin.pluginData.hasOnboarded = false;
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
    new Setting(el).setName(name).setDesc(desc).addText(t =>
      t.setValue(String((this.plugin.settings as any)[key])).onChange(async v => {
        const n = parseInt(v);
        if (!isNaN(n) && n >= 0) { (this.plugin.settings as any)[key] = n; await this.save(); }
      }));
  }
}

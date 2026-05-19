import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
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

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Scholar Quest' });

    // Vault Paths
    containerEl.createEl('h3', { text: 'Vault Paths' });
    this.addTextSetting(containerEl, 'Sources folder', 'Folder containing source notes (papers, lectures)', 'sourcesFolder');
    this.addTextSetting(containerEl, 'Ideas folder', 'Folder containing atomic notes', 'ideasFolder');
    this.addTextSetting(containerEl, 'Projects folder', 'Folder containing project files', 'projectsFolder');

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

    // Manual Activities
    containerEl.createEl('h3', { text: 'Manual Log Activities' });
    containerEl.createEl('p', {
      text: `Activities for work done outside Obsidian. Max ${MAX_MANUAL_ACTIVITY_XP} XP per activity. Each activity can only be logged once per day.`,
      cls: 'setting-item-description',
    });
    for (const activity of this.plugin.settings.manualActivities) {
      new Setting(containerEl)
        .addText(t => t.setPlaceholder('Activity name').setValue(activity.name).onChange(async v => {
          activity.name = v; await this.save();
        }))
        .addText(t => {
          t.setPlaceholder('XP').setValue(String(activity.xp));
          t.inputEl.type = 'number';
          t.inputEl.min = '1';
          t.inputEl.max = String(MAX_MANUAL_ACTIVITY_XP);
          t.onChange(async v => {
            const n = Math.min(parseInt(v) || 1, MAX_MANUAL_ACTIVITY_XP);
            activity.xp = n; await this.save();
          });
        })
        .addButton(b => b.setButtonText('Remove').onClick(async () => {
          this.plugin.settings.manualActivities =
            this.plugin.settings.manualActivities.filter(a => a !== activity);
          await this.save();
          this.display();
        }));
    }
    new Setting(containerEl).addButton(b => b.setButtonText('Add activity').onClick(async () => {
      this.plugin.settings.manualActivities.push({ name: 'New activity', xp: 40 });
      await this.save();
      this.display();
    }));

    // Milestone Templates
    containerEl.createEl('h3', { text: 'Milestone Templates' });
    containerEl.createEl('p', {
      text: `Customise milestone names and XP values per project type. XP is capped at ${MAX_MILESTONE_XP}.`,
      cls: 'setting-item-description',
    });
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
        xpInput.min = '1';
        xpInput.max = String(MAX_MILESTONE_XP);
        xpInput.style.width = '60px';
        xpInput.onchange = async () => {
          const n = Math.min(parseInt(xpInput.value) || 1, MAX_MILESTONE_XP);
          milestone.xp = n; await this.save();
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
}

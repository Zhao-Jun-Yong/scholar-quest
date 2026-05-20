import { App, ButtonComponent, Notice, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_MILESTONE_TEMPLATES, MANUAL_ACTIVITY_CATALOG, MAX_MILESTONE_XP, MAX_USER_MILESTONE_XP } from './constants';
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
    addDraftField('Sources folder', 'Folder containing reference notes (papers, books, articles). Scholar Quest tracks reading progress here. e.g. References, Literature, Reading', 'sourcesFolder');
    addDraftField('Notes folder', 'Folder containing your developed notes. XP is awarded when tagged notes are created here. e.g. Notes, Ideas, Wiki', 'ideasFolder');
    addDraftField('Projects folder', 'Folder containing project files. Milestones are tracked for files with a recognised project tag. e.g. Projects, Work, Research', 'projectsFolder');

    this.subsection(containerEl, 'Reading tracking');
    addDraftField('Reading status field', 'Frontmatter property used to track reading progress. e.g. status, stage, keywords', 'readingStatusField');
    addDraftField('Unread value', 'Value meaning the source has not been read — no XP awarded. e.g. unread, inbox, 📥', 'readingTagUnprocessed');
    addDraftField('Skimmed value', 'Value meaning the source has been partially read — awards skimmed XP. e.g. reading, in-progress, 👀', 'readingTagSkimmed');
    addDraftField('Completed value', 'Value meaning the source has been fully read — awards completed XP. e.g. done, read, ✅', 'readingTagCompleted');

    this.subsection(containerEl, 'Note tracking');
    addDraftField('Note tag', 'Tag that identifies a developed note eligible for XP. e.g. note, permanent, evergreen', 'atomTag');
    addDraftField('Note tag field', 'Frontmatter property containing the note tag above. e.g. tags, type', 'atomNoteTagField');

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
      'Activities available in the manual log (once per day each). "Other" (+30 XP) is always shown and cannot be removed.');

    // Personal list — updated in place; never triggers a full display() re-render
    const personalListEl = containerEl.createDiv();
    const catalogBtns = new Map<string, HTMLButtonElement>();

    const renderPersonalList = () => {
      personalListEl.empty();
      if (this.plugin.settings.manualActivities.length === 0) {
        personalListEl.createEl('p', {
          text: 'Your list is empty. Add activities from the catalog below.',
          cls: 'setting-item-description',
        }).style.cssText = 'margin: 0 0 8px; font-style: italic;';
      }
      for (const activity of this.plugin.settings.manualActivities) {
        new Setting(personalListEl)
          .setName(`${activity.name}  (+${activity.xp} XP)`)
          .addExtraButton(b => b
            .setIcon('trash')
            .setTooltip('Remove from my list')
            .onClick(async () => {
              this.plugin.settings.manualActivities =
                this.plugin.settings.manualActivities.filter(a => a !== activity);
              await this.save();
              renderPersonalList();
              syncCatalogBtns();
            }));
      }
    };

    const syncCatalogBtns = () => {
      for (const [name, btn] of catalogBtns) {
        const added = this.plugin.settings.manualActivities.some(m => m.name === name);
        btn.textContent = added ? 'Added' : '+ Add';
        btn.disabled = added;
        btn.style.opacity = added ? '0.4' : '1';
      }
    };

    renderPersonalList();

    // Catalog browser — collapsed by default
    const catalogDetails = containerEl.createEl('details');
    catalogDetails.style.cssText = 'margin-top: 12px; padding: 0 12px 12px; background: var(--background-secondary); border-radius: 6px;';
    const catalogSummary = catalogDetails.createEl('summary');
    catalogSummary.style.cssText = 'padding: 10px 0; cursor: pointer; font-size: 0.8em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted);';
    catalogSummary.setText('Browse catalog');
    const catalogWrap = catalogDetails.createDiv();

    const searchInput = catalogWrap.createEl('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search activities…';
    searchInput.style.cssText = 'width: 100%; padding: 6px 8px; margin-bottom: 10px; border: 1px solid var(--background-modifier-border); border-radius: 4px; background: var(--background-primary); color: var(--text-normal);';

    const catalogListEl = catalogWrap.createDiv();

    const renderCatalog = (query: string) => {
      catalogListEl.empty();
      catalogBtns.clear();
      const q = query.toLowerCase().trim();
      const filtered = MANUAL_ACTIVITY_CATALOG.filter(a =>
        !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
      );

      const byCategory = new Map<string, typeof filtered>();
      for (const a of filtered) {
        if (!byCategory.has(a.category)) byCategory.set(a.category, []);
        byCategory.get(a.category)!.push(a);
      }

      if (byCategory.size === 0) {
        catalogListEl.createEl('p', { text: 'No activities match.' })
          .style.cssText = 'color: var(--text-muted); font-style: italic; margin: 4px 0;';
        return;
      }

      for (const [category, activities] of byCategory) {
        catalogListEl.createEl('p', { text: category })
          .style.cssText = 'margin: 10px 0 4px; font-size: 0.75em; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted);';

        for (const a of activities) {
          const row = catalogListEl.createDiv();
          row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-top: 1px solid var(--background-modifier-border);';

          row.createSpan({ text: `${a.name}  (+${a.xp} XP)` })
            .style.cssText = 'font-size: 0.9em; color: var(--text-normal);';

          const alreadyAdded = this.plugin.settings.manualActivities.some(m => m.name === a.name);
          const addBtn = row.createEl('button', { text: alreadyAdded ? 'Added' : '+ Add' });
          addBtn.disabled = alreadyAdded;
          addBtn.style.cssText = `font-size: 0.8em; padding: 2px 8px; opacity: ${alreadyAdded ? '0.4' : '1'};`;
          catalogBtns.set(a.name, addBtn);

          addBtn.onclick = async () => {
            if (this.plugin.settings.manualActivities.some(m => m.name === a.name)) return;
            this.plugin.settings.manualActivities.push({ name: a.name, xp: a.xp });
            await this.save();
            renderPersonalList();
            syncCatalogBtns();
          };
        }
      }
    };

    renderCatalog('');
    searchInput.oninput = () => renderCatalog(searchInput.value);

    // ── Milestone Templates ──────────────────────────────────────────────────
    this.section(containerEl, 'Milestone Templates',
      `Built-in milestone XP values are fixed. Custom milestones are capped at ${MAX_USER_MILESTONE_XP} XP.`);

    for (const [type, template] of Object.entries(this.plugin.settings.projectTemplates)) {
      const details = containerEl.createEl('details');
      details.style.cssText = 'margin: 4px 0; padding: 0 12px 8px; background: var(--background-secondary); border-radius: 6px;';

      const summary = details.createEl('summary');
      summary.style.cssText = 'padding: 10px 0; cursor: pointer; font-weight: 500;';
      summary.setText(`${type}  (${template.milestones.length} milestones)`);

      for (const milestone of template.milestones) {
        const isBuiltin = milestone.builtin === true;
        const row = new Setting(details)
          .addText(t => {
            t.setPlaceholder('Milestone name').setValue(milestone.name);
            t.inputEl.style.flex = '1';
            if (isBuiltin) {
              t.setDisabled(true);
            } else {
              t.onChange(async v => { milestone.name = v; await this.save(); });
            }
          });

        if (isBuiltin) {
          // Read-only XP badge for built-in milestones
          const xpBadge = row.settingEl.createSpan({ text: `${milestone.xp} XP` });
          xpBadge.style.cssText = 'font-size: 0.85em; color: var(--text-muted); margin-right: 8px; white-space: nowrap;';
          row.settingEl.querySelector('.setting-item-control')?.prepend(xpBadge);
        } else {
          row.addText(t => {
            t.setPlaceholder('XP').setValue(String(milestone.xp));
            t.inputEl.type = 'number';
            t.inputEl.min = '1';
            t.inputEl.max = String(MAX_USER_MILESTONE_XP);
            t.inputEl.style.width = '60px';
            t.onChange(async v => {
              const n = Math.min(parseInt(v) || 1, MAX_USER_MILESTONE_XP);
              milestone.xp = n; await this.save();
            });
          });
          row.addExtraButton(b => b
            .setIcon('trash')
            .setTooltip('Remove milestone')
            .onClick(async () => {
              template.milestones = template.milestones.filter(m => m !== milestone);
              await this.save();
              this.display();
            }));
        }

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

}

import { Notice, Plugin, TFile } from 'obsidian';
import { XPEngine } from './xp-engine';
import { VaultWatcher } from './vault-watcher';
import { ManualLogger } from './manual-logger';
import { MilestoneModal } from './milestone-modal';
import { StatusBar } from './status-bar';
import { ScholarQuestSettings } from './settings';
import { PluginData, XPSettings } from './types';
import { DEFAULT_SETTINGS } from './constants';

const DEFAULT_DATA: PluginData = {
  totalXP: 0,
  level: 1,
  activities: [],
  snapshots: {},
  milestones: {},
  todayXP: 0,
  todayDate: new Date().toISOString().split('T')[0],
};

export default class ScholarQuestPlugin extends Plugin {
  settings!: XPSettings;
  pluginData!: PluginData;
  engine!: XPEngine;
  watcher!: VaultWatcher;
  statusBar!: StatusBar;

  async onload(): Promise<void> {
    await this.loadPluginData();

    this.engine = new XPEngine(this.pluginData, this.settings, () => this.savePluginData());

    this.watcher = new VaultWatcher(
      this.engine,
      this.settings,
      this.app.vault,
      this.app.metadataCache
    );

    this.statusBar = new StatusBar(this.addStatusBarItem(), this.engine);
    this.statusBar.update();

    this.registerEvent(
      this.app.vault.on('create', file => {
        if (file instanceof TFile) this.watcher.onFileCreate(file);
      })
    );

    this.registerEvent(
      this.app.metadataCache.on('changed', file => {
        this.watcher.onMetadataChange(file);
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
        const icon = this.settings.statusBarIcon;
        new Notice(`${icon} ${tier} Lv ${level} · ${totalXP} XP total · +${todayXP} today`);
      },
    });

    this.addSettingTab(new ScholarQuestSettings(this.app, this));
  }

  async loadPluginData(): Promise<void> {
    const saved = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved?.settings ?? {});
    this.pluginData = {
      totalXP: saved?.totalXP ?? 0,
      level: saved?.level ?? 1,
      activities: saved?.activities ?? [],
      snapshots: saved?.snapshots ?? {},
      milestones: saved?.milestones ?? {},
      todayXP: saved?.todayXP ?? 0,
      todayDate: saved?.todayDate ?? DEFAULT_DATA.todayDate,
    };
  }

  async savePluginData(): Promise<void> {
    await this.saveData({ settings: this.settings, ...this.pluginData });
    this.statusBar?.update();
  }
}

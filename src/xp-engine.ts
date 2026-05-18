import { ActivityEntry, ActivityType, MilestoneItem, MilestoneRecord, PluginData, XPSettings } from './types';
import { MAX_ACTIVITIES_LOG, TIER_LEVEL_RANGES } from './constants';

export class XPEngine {
  private data: PluginData;
  private settings: XPSettings;
  private saveCallback: () => Promise<void>;

  constructor(data: PluginData, settings: XPSettings, saveCallback: () => Promise<void>) {
    this.data = data;
    this.settings = settings;
    this.saveCallback = saveCallback;
  }

  getTierIndex(level: number): number {
    const idx = TIER_LEVEL_RANGES.findIndex(r => level >= r.min && level <= r.max);
    return idx >= 0 ? idx : TIER_LEVEL_RANGES.length - 1;
  }

  getTierName(level: number): string {
    return this.settings.tierNames[this.getTierIndex(level)];
  }

  xpToNextLevel(level: number): number {
    return 300 * level;
  }

  recalculateLevel(): void {
    let remaining = this.data.totalXP;
    let level = 1;
    while (level < 25) {
      const needed = this.xpToNextLevel(level);
      if (remaining < needed) break;
      remaining -= needed;
      level++;
    }
    this.data.level = level;
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  resetTodayXPIfNewDay(): void {
    const today = this.getTodayDate();
    if (this.data.todayDate !== today) {
      this.data.todayXP = 0;
      this.data.todayDate = today;
    }
  }

  async awardXP(xp: number, type: ActivityType, label: string, filePath?: string): Promise<void> {
    this.resetTodayXPIfNewDay();
    this.data.totalXP += xp;
    this.data.todayXP += xp;
    this.recalculateLevel();

    const entry: ActivityEntry = { timestamp: Date.now(), type, xp, label, filePath };
    this.data.activities.unshift(entry);
    if (this.data.activities.length > MAX_ACTIVITIES_LOG) {
      this.data.activities.length = MAX_ACTIVITIES_LOG;
    }

    await this.saveCallback();
  }

  getRemainingXPInLevel(): number {
    let remaining = this.data.totalXP;
    let level = 1;
    while (level < this.data.level) {
      remaining -= this.xpToNextLevel(level);
      level++;
    }
    return this.xpToNextLevel(this.data.level) - remaining;
  }

  getProgressBar(segments = 6): string {
    const needed = this.xpToNextLevel(this.data.level);
    const earned = needed - this.getRemainingXPInLevel();
    const filled = Math.round((earned / needed) * segments);
    return '█'.repeat(filled) + '░'.repeat(segments - filled);
  }

  getStatusBarText(): string {
    this.resetTodayXPIfNewDay();
    const { level, todayXP } = this.data;
    const icon = this.settings.statusBarIcon;
    const bar = this.getProgressBar();
    return `${icon} Lv ${level} · ${bar} · +${todayXP} today`;
  }

  getData(): PluginData { return this.data; }
  getSettings(): XPSettings { return this.settings; }

  getMilestoneRecord(filePath: string): MilestoneRecord | undefined {
    return this.data.milestones[filePath];
  }

  async initMilestoneRecord(filePath: string, projectType: string): Promise<void> {
    const template = this.settings.projectTemplates[projectType];
    if (!template) return;
    this.data.milestones[filePath] = {
      projectType,
      filePath,
      milestones: template.milestones.map(m => ({ name: m.name, xp: m.xp })),
    };
    await this.saveCallback();
  }

  async completeMilestone(filePath: string, milestoneName: string): Promise<number> {
    const record = this.data.milestones[filePath];
    if (!record) return 0;
    const milestone = record.milestones.find(m => m.name === milestoneName && !m.completedAt);
    if (!milestone) return 0;
    milestone.completedAt = Date.now();
    await this.awardXP(milestone.xp, 'milestone-completed', `Milestone: ${milestoneName}`, filePath);
    return milestone.xp;
  }

  getAllProjectsWithPendingMilestones(): { filePath: string; projectType: string; pending: MilestoneItem[] }[] {
    return Object.values(this.data.milestones)
      .map(r => ({
        filePath: r.filePath,
        projectType: r.projectType,
        pending: r.milestones.filter(m => !m.completedAt),
      }))
      .filter(r => r.pending.length > 0);
  }
}

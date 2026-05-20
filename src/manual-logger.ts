import { App, Modal, Notice } from 'obsidian';
import { XPEngine } from './xp-engine';
import { XPSettings } from './types';

export class ManualLogger extends Modal {
  private engine: XPEngine;
  private settings: XPSettings;

  constructor(app: App, engine: XPEngine, settings: XPSettings) {
    super(app);
    this.engine = engine;
    this.settings = settings;
  }

  private isLoggedToday(activityName: string): boolean {
    const today = this.engine.getData().todayDate;
    return this.engine.getData().activities.some(a =>
      a.type === 'manual-log' &&
      a.label === activityName &&
      new Date(a.timestamp).toISOString().split('T')[0] === today
    );
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: 'Log academic activity' });

    const allActivities = [
      ...this.settings.manualActivities,
      { name: 'Other', xp: 30 },
    ];

    for (const activity of allActivities) {
      const alreadyDone = this.isLoggedToday(activity.name);
      const btn = contentEl.createEl('button', {
        text: alreadyDone
          ? `✓ ${activity.name}  (logged today)`
          : `${activity.name}  (+${activity.xp} XP)`,
      });
      Object.assign(btn.style, {
        display: 'block',
        width: '100%',
        marginBottom: '8px',
        padding: '10px',
        cursor: alreadyDone ? 'default' : 'pointer',
        textAlign: 'left',
        opacity: alreadyDone ? '0.45' : '1',
      });
      if (!alreadyDone) btn.onclick = async () => {
        if (this.isLoggedToday(activity.name)) {
          new Notice(`Already logged "${activity.name}" today.`);
          return;
        }
        await this.engine.awardXP(activity.xp, 'manual-log', activity.name);
        new Notice(`+${activity.xp} XP — ${activity.name}`);
        this.close();
      };
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

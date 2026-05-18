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

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: 'Log academic activity' });

    const allActivities = [
      ...this.settings.builtinActivities,
      ...this.settings.customActivities,
    ];

    for (const activity of allActivities) {
      const btn = contentEl.createEl('button', {
        text: `${activity.name}  (+${activity.xp} XP)`,
      });
      Object.assign(btn.style, {
        display: 'block',
        width: '100%',
        marginBottom: '8px',
        padding: '10px',
        cursor: 'pointer',
        textAlign: 'left',
      });
      btn.onclick = async () => {
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

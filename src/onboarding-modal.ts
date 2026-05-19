import { App, Modal, Setting } from 'obsidian';
import { XPEngine } from './xp-engine';
import { ONBOARDING_XP, TIER_ICONS, TIER_LEVEL_RANGES } from './constants';

export interface OnboardingData {
  phd: boolean;
  masters: boolean;
  authoredBooks: number;
  firstAuthorPapers: number;
  coAuthorPapers: number;
  grantsPI: number;
  grantsCoI: number;
  invitedTalks: number;
  conferenceTalks: number;
  phdStudents: number;
  mastersStudents: number;
  peerReviews: number;
}

export class OnboardingModal extends Modal {
  private engine: XPEngine;
  private onConfirm: (xp: number, careerData: OnboardingData) => Promise<void>;
  private data: OnboardingData;
  private previewEl!: HTMLElement;

  constructor(app: App, engine: XPEngine, onConfirm: (xp: number, careerData: OnboardingData) => Promise<void>) {
    super(app);
    this.engine = engine;
    this.onConfirm = onConfirm;
    this.data = {
      phd: false, masters: false,
      authoredBooks: 0,
      firstAuthorPapers: 0, coAuthorPapers: 0,
      grantsPI: 0, grantsCoI: 0,
      invitedTalks: 0, conferenceTalks: 0,
      phdStudents: 0, mastersStudents: 0,
      peerReviews: 0,
    };
  }

  private calcXP(): number {
    const x = ONBOARDING_XP;
    const d = this.data;
    return (
      (d.phd ? x.phd : 0) +
      (d.masters ? x.masters : 0) +
      d.authoredBooks * x.authoredBook +
      d.firstAuthorPapers * x.firstAuthorPaper +
      d.coAuthorPapers * x.coAuthorPaper +
      d.grantsPI * x.grantPI +
      d.grantsCoI * x.grantCoI +
      d.invitedTalks * x.invitedTalk +
      d.conferenceTalks * x.conferenceTalk +
      d.phdStudents * x.phdStudentSupervised +
      d.mastersStudents * x.mastersStudentSupervised +
      d.peerReviews * x.peerReview
    );
  }

  private calcLevel(xp: number): number {
    let remaining = xp;
    let level = 1;
    while (level < 25) {
      const needed = 300 * level;
      if (remaining < needed) break;
      remaining -= needed;
      level++;
    }
    return level;
  }

  private updatePreview(): void {
    const xp = this.calcXP();
    const level = this.calcLevel(xp);
    const tierIdx = TIER_LEVEL_RANGES.findIndex(r => level >= r.min && level <= r.max);
    const idx = tierIdx >= 0 ? tierIdx : TIER_LEVEL_RANGES.length - 1;
    const tierName = this.engine.getSettings().tierNames[idx];
    const icon = TIER_ICONS[idx];
    this.previewEl.setText(`${icon} ${tierName} · Level ${level} · ${xp.toLocaleString()} XP`);
  }

  private numField(setting: Setting, setter: (v: number) => void): void {
    setting.addText(t => {
      t.setPlaceholder('0');
      t.inputEl.type = 'number';
      t.inputEl.min = '0';
      t.onChange(v => {
        setter(Math.max(0, parseInt(v) || 0));
        this.updatePreview();
      });
    });
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: 'Welcome to Scholar Quest' });
    contentEl.createEl('p', {
      text: 'Tell us about your academic career so far. Rough estimates are fine — this calibrates your starting level.',
      cls: 'setting-item-description',
    });

    contentEl.createEl('h3', { text: 'Degrees' });
    new Setting(contentEl).setName('PhD completed')
      .addToggle(t => t.onChange(v => { this.data.phd = v; this.updatePreview(); }));
    new Setting(contentEl).setName('Masters completed')
      .addToggle(t => t.onChange(v => { this.data.masters = v; this.updatePreview(); }));

    contentEl.createEl('h3', { text: 'Publications' });
    this.numField(
      new Setting(contentEl).setName('Authored books')
        .setDesc('Sole or primary-authored monographs'),
      v => { this.data.authoredBooks = v; }
    );
    this.numField(
      new Setting(contentEl).setName('First-author papers')
        .setDesc('Journal articles or book chapters where you are listed first'),
      v => { this.data.firstAuthorPapers = v; }
    );
    this.numField(
      new Setting(contentEl).setName('Co-author papers')
        .setDesc('Published works where you contributed but are not first author'),
      v => { this.data.coAuthorPapers = v; }
    );

    contentEl.createEl('h3', { text: 'Grants' });
    this.numField(
      new Setting(contentEl).setName('Grants as PI'),
      v => { this.data.grantsPI = v; }
    );
    this.numField(
      new Setting(contentEl).setName('Grants as co-I / collaborator'),
      v => { this.data.grantsCoI = v; }
    );

    contentEl.createEl('h3', { text: 'Talks' });
    this.numField(
      new Setting(contentEl).setName('Invited talks / keynotes'),
      v => { this.data.invitedTalks = v; }
    );
    this.numField(
      new Setting(contentEl).setName('Conference presentations'),
      v => { this.data.conferenceTalks = v; }
    );

    contentEl.createEl('h3', { text: 'Supervision' });
    this.numField(
      new Setting(contentEl).setName('PhD students supervised to completion'),
      v => { this.data.phdStudents = v; }
    );
    this.numField(
      new Setting(contentEl).setName('Masters students supervised to completion'),
      v => { this.data.mastersStudents = v; }
    );

    contentEl.createEl('h3', { text: 'Service' });
    this.numField(
      new Setting(contentEl).setName('Peer reviews completed')
        .setDesc('Estimate is fine — include all formal journal and grant reviews'),
      v => { this.data.peerReviews = v; }
    );

    const preview = contentEl.createDiv();
    preview.style.cssText = 'margin: 16px 0; padding: 12px; background: var(--background-secondary); border-radius: 6px; text-align: center; font-size: 1.1em;';
    preview.createSpan({ text: 'Estimated starting rank: ' });
    this.previewEl = preview.createEl('strong', { text: '✨ Spark · Level 1 · 0 XP' });

    new Setting(contentEl)
      .addButton(b => b
        .setButtonText('Start at Level 1')
        .onClick(async () => {
          await this.onConfirm(0, this.data);
          this.close();
        }))
      .addButton(b => b
        .setButtonText('Set starting level')
        .setCta()
        .onClick(async () => {
          await this.onConfirm(this.calcXP(), this.data);
          this.close();
        }));
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

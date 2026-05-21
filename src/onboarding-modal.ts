import { App, Modal, Setting } from 'obsidian';
import { XPEngine } from './xp-engine';
import { ONBOARDING_XP, TIER_LEVEL_RANGES } from './constants';
import { THEMES, THEME_AVATARS, AvatarTheme } from './tier-avatars';
import { OnboardingData } from './types';

const DRAGON_PREVIEW_IDX = 10; // T11 dragon

export function emptyCareerData(avatarTheme: string = 'purple'): OnboardingData {
  return {
    phd: false, masters: false, postdocs: 0,
    authoredBooks: 0, editedVolumes: 0,
    firstAuthorPapers: 0, coAuthorPapers: 0, softwareDatasets: 0,
    grantsPI: 0, grantsCoI: 0, patents: 0,
    invitedTalks: 0, conferenceTalks: 0, majorAwards: 0,
    phdStudents: 0, mastersStudents: 0,
    peerReviews: 0, thesesExamined: 0, editorialRoles: 0,
    avatarTheme: avatarTheme as AvatarTheme,
  };
}

export class OnboardingModal extends Modal {
  private engine: XPEngine;
  private onConfirm: (xp: number, careerData: OnboardingData) => Promise<void>;
  private data: OnboardingData;
  private previewEl!: HTMLElement;
  private themeCards: Map<AvatarTheme, HTMLElement> = new Map();
  private isReopen: boolean;

  constructor(
    app: App,
    engine: XPEngine,
    onConfirm: (xp: number, careerData: OnboardingData) => Promise<void>,
    initialData?: OnboardingData,
  ) {
    super(app);
    this.engine = engine;
    this.onConfirm = onConfirm;
    this.isReopen = !!initialData;
    this.data = initialData ? { ...initialData } : emptyCareerData('purple');
  }

  private selectTheme(theme: AvatarTheme): void {
    this.data.avatarTheme = theme;
    for (const [t, card] of this.themeCards) {
      card.style.border = t === theme
        ? '2px solid var(--interactive-accent)'
        : '2px solid var(--background-modifier-border)';
      card.style.background = t === theme
        ? 'var(--background-secondary-alt)'
        : 'transparent';
    }
  }

  private calcXP(): number {
    const x = ONBOARDING_XP;
    const d = this.data;
    return (
      (d.phd ? x.phd : 0) +
      (d.masters ? x.masters : 0) +
      d.postdocs * x.postdoc +
      d.authoredBooks * x.authoredBook +
      d.editedVolumes * x.editedVolume +
      d.firstAuthorPapers * x.firstAuthorPaper +
      d.coAuthorPapers * x.coAuthorPaper +
      d.softwareDatasets * x.softwareDataset +
      d.grantsPI * x.grantPI +
      d.grantsCoI * x.grantCoI +
      d.patents * x.patent +
      d.invitedTalks * x.invitedTalk +
      d.conferenceTalks * x.conferenceTalk +
      d.majorAwards * x.majorAward +
      d.phdStudents * x.phdStudentSupervised +
      d.mastersStudents * x.mastersStudentSupervised +
      d.peerReviews * x.peerReview +
      d.thesesExamined * x.thesisExamined +
      d.editorialRoles * x.editorialRole
    );
  }

  private calcLevel(xp: number): number {
    let remaining = xp;
    let level = 1;
    while (level < 60) {
      const needed = this.engine.xpToNextLevel(level);
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
    this.previewEl.setText(`${tierName} · Level ${level} · ${xp.toLocaleString()} XP`);
  }

  // ── UI helpers ────────────────────────────────────────────────────────────

  private sectionHeader(label: string): void {
    const wrap = this.contentEl.createDiv();
    wrap.style.cssText = 'display: flex; align-items: center; gap: 8px; margin: 20px 0 8px;';
    wrap.createEl('span', { text: label }).style.cssText =
      'font-size: 0.72em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); white-space: nowrap;';
    wrap.createDiv().style.cssText = 'flex: 1; height: 1px; background: var(--background-modifier-border);';
  }

  private makeGrid(): HTMLElement {
    const g = this.contentEl.createDiv();
    g.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px;';
    return g;
  }

  private numCell(
    parent: HTMLElement,
    label: string,
    desc: string | null,
    getter: () => number,
    setter: (v: number) => void,
    fullWidth = false,
  ): void {
    const cell = parent.createDiv();
    cell.style.cssText =
      (fullWidth ? 'grid-column: 1 / -1; ' : '') +
      'padding: 8px 10px; background: var(--background-secondary); border-radius: 6px;';

    const row = cell.createDiv();
    row.style.cssText = 'display: flex; align-items: center; gap: 6px;';

    const textWrap = row.createDiv();
    textWrap.style.cssText = 'flex: 1; min-width: 0;';
    textWrap.createEl('span', { text: label }).style.cssText =
      'font-size: 0.83em; font-weight: 500; color: var(--text-normal); line-height: 1.3; display: block;';
    if (desc) {
      textWrap.createEl('span', { text: desc }).style.cssText =
        'font-size: 0.7em; color: var(--text-muted); line-height: 1.2; display: block;';
    }

    const input = row.createEl('input');
    input.type = 'number';
    input.min = '0';
    input.placeholder = '0';
    const iv = getter();
    if (iv > 0) input.value = String(iv);
    input.style.cssText =
      'width: 56px; flex-shrink: 0; text-align: right; padding: 3px 6px; ' +
      'background: var(--background-primary); border: 1px solid var(--background-modifier-border); ' +
      'border-radius: 4px; font-size: 0.85em; color: var(--text-normal);';
    input.oninput = () => {
      setter(Math.max(0, parseInt(input.value) || 0));
      this.updatePreview();
    };
  }

  private toggleCell(
    parent: HTMLElement,
    label: string,
    getter: () => boolean,
    setter: (v: boolean) => void,
  ): void {
    const s = new Setting(parent).setName(label);
    s.addToggle(t => {
      t.setValue(getter());
      t.onChange(v => { setter(v); this.updatePreview(); });
    });
    s.settingEl.style.cssText =
      'flex: 1; margin: 0; padding: 8px 12px; background: var(--background-secondary); border-radius: 6px;';
  }

  // ── onOpen ────────────────────────────────────────────────────────────────

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', {
      text: this.isReopen ? 'Update Career History' : 'Welcome to Scholar Quest',
    });

    if (!this.isReopen) {
      // Dragon picker
      const dragonSection = contentEl.createDiv();
      dragonSection.style.cssText =
        'margin: 16px 0 20px; padding: 16px; background: var(--background-secondary); border-radius: 10px;';
      dragonSection.createEl('p', { text: 'Choose your dragon. This cannot be changed later.' })
        .style.cssText = 'margin: 0 0 12px; color: var(--text-muted); font-size: 0.9em; text-align: center;';

      const grid = dragonSection.createDiv();
      grid.style.cssText = 'display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;';

      this.themeCards.clear();
      for (const theme of THEMES) {
        const card = grid.createDiv();
        card.style.cssText =
          'display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; ' +
          'border-radius: 8px; cursor: pointer; border: 2px solid var(--background-modifier-border); transition: border 0.1s;';

        const avatarEl = card.createDiv();
        avatarEl.style.cssText = 'width: 64px; height: 64px; image-rendering: pixelated;';
        avatarEl.innerHTML = THEME_AVATARS[theme][DRAGON_PREVIEW_IDX];

        card.createSpan({ text: theme.charAt(0).toUpperCase() + theme.slice(1) })
          .style.cssText = 'font-size: 0.72em; color: var(--text-muted);';

        this.themeCards.set(theme, card);
        card.onclick = () => this.selectTheme(theme);
      }
      this.selectTheme(this.data.avatarTheme);

      contentEl.createEl('p', {
        text: 'Tell us about your academic career so far. Rough estimates are fine — this calibrates your starting level.',
        cls: 'setting-item-description',
      });
    } else {
      const themeName = this.data.avatarTheme.charAt(0).toUpperCase() + this.data.avatarTheme.slice(1);
      contentEl.createEl('p', {
        text: `Your ${themeName} dragon is locked. Update any fields that have changed — previous values are pre-filled.`,
        cls: 'setting-item-description',
      });
    }

    // ── Credentials ──────────────────────────────────────────────────────────
    this.sectionHeader('Credentials');

    const toggleRow = contentEl.createDiv();
    toggleRow.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px;';
    this.toggleCell(toggleRow, 'PhD completed', () => this.data.phd, v => { this.data.phd = v; });
    this.toggleCell(toggleRow, 'Masters completed', () => this.data.masters, v => { this.data.masters = v; });

    const credGrid = this.makeGrid();
    this.numCell(credGrid, 'Postdoctoral positions', 'Number of positions, not years — e.g. two 2-year postdocs = 2',
      () => this.data.postdocs, v => { this.data.postdocs = v; }, true);

    // ── Publications ─────────────────────────────────────────────────────────
    this.sectionHeader('Publications');
    const pubGrid = this.makeGrid();
    this.numCell(pubGrid, 'First-author papers', 'Journal articles or book chapters (first author)',
      () => this.data.firstAuthorPapers, v => { this.data.firstAuthorPapers = v; });
    this.numCell(pubGrid, 'Co-author papers', 'Published works where you are not first author',
      () => this.data.coAuthorPapers, v => { this.data.coAuthorPapers = v; });
    this.numCell(pubGrid, 'Authored books', 'Sole or primary-authored monographs',
      () => this.data.authoredBooks, v => { this.data.authoredBooks = v; });
    this.numCell(pubGrid, 'Edited volumes', 'Collections or volumes you edited',
      () => this.data.editedVolumes, v => { this.data.editedVolumes = v; });
    this.numCell(pubGrid, 'Software / datasets', 'Formally released research software or deposited datasets',
      () => this.data.softwareDatasets, v => { this.data.softwareDatasets = v; });

    // ── Grants & Patents ─────────────────────────────────────────────────────
    this.sectionHeader('Grants & Patents');
    const grantGrid = this.makeGrid();
    this.numCell(grantGrid, 'Grants as PI', null,
      () => this.data.grantsPI, v => { this.data.grantsPI = v; });
    this.numCell(grantGrid, 'Grants as co-I / collaborator', null,
      () => this.data.grantsCoI, v => { this.data.grantsCoI = v; });
    this.numCell(grantGrid, 'Patents granted', null,
      () => this.data.patents, v => { this.data.patents = v; });

    // ── Recognition ──────────────────────────────────────────────────────────
    this.sectionHeader('Recognition');
    const recGrid = this.makeGrid();
    this.numCell(recGrid, 'Invited talks / keynotes', null,
      () => this.data.invitedTalks, v => { this.data.invitedTalks = v; });
    this.numCell(recGrid, 'Conference presentations', null,
      () => this.data.conferenceTalks, v => { this.data.conferenceTalks = v; });
    this.numCell(recGrid, 'Major awards / honors', 'Career prizes, early-career awards, learned-society fellowships',
      () => this.data.majorAwards, v => { this.data.majorAwards = v; });

    // ── Supervision & Service ─────────────────────────────────────────────────
    this.sectionHeader('Supervision & Service');
    const supGrid = this.makeGrid();
    this.numCell(supGrid, 'PhD students supervised', 'Completed to degree',
      () => this.data.phdStudents, v => { this.data.phdStudents = v; });
    this.numCell(supGrid, 'Masters students supervised', 'Completed to degree',
      () => this.data.mastersStudents, v => { this.data.mastersStudents = v; });
    this.numCell(supGrid, 'PhD theses examined', 'External or internal examiner',
      () => this.data.thesesExamined, v => { this.data.thesesExamined = v; });
    this.numCell(supGrid, 'Peer reviews completed', 'Journal and grant reviews — estimate is fine',
      () => this.data.peerReviews, v => { this.data.peerReviews = v; });
    this.numCell(supGrid, 'Editorial board roles', 'Associate editor, handling editor, editor-in-chief',
      () => this.data.editorialRoles, v => { this.data.editorialRoles = v; });

    // ── Preview ───────────────────────────────────────────────────────────────
    const preview = contentEl.createDiv();
    preview.style.cssText =
      'margin: 16px 0; padding: 12px; background: var(--background-secondary); ' +
      'border-radius: 6px; text-align: center; font-size: 1.1em;';
    preview.createSpan({ text: 'Estimated starting rank: ' });
    this.previewEl = preview.createEl('strong');
    this.updatePreview();

    // ── Buttons ───────────────────────────────────────────────────────────────
    if (this.isReopen) {
      new Setting(contentEl)
        .addButton(b => b
          .setButtonText('Cancel')
          .onClick(() => this.close()))
        .addButton(b => b
          .setButtonText('Update career history')
          .setCta()
          .onClick(async () => {
            await this.onConfirm(this.calcXP(), this.data);
            this.close();
          }));
    } else {
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
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

import { MetadataCache, TFile, Vault } from 'obsidian';
import { FileSnapshot, XPSettings } from './types';
import { XPEngine } from './xp-engine';

export class VaultWatcher {
  private engine: XPEngine;
  private settings: XPSettings;
  private vault: Vault;
  private metadataCache: MetadataCache;
  private loadedAt: number;
  onUpdate?: () => void;

  constructor(engine: XPEngine, settings: XPSettings, vault: Vault, metadataCache: MetadataCache) {
    this.engine = engine;
    this.settings = settings;
    this.vault = vault;
    this.metadataCache = metadataCache;
    this.loadedAt = Date.now();
  }

  // --- Pure analysis functions (unit-tested) ---

  countWords(content: string): number {
    const body = content.replace(/^---[\s\S]*?---\n/, '');
    return body.trim().split(/\s+/).filter(Boolean).length;
  }

  countWikilinks(content: string): number {
    return (content.match(/\[\[.*?\]\]/g) ?? []).length;
  }

  extractKeywords(frontmatter: Record<string, unknown> | null): string[] {
    const field = this.settings.readingStatusField;
    if (!frontmatter?.[field]) return [];
    const kw = frontmatter[field];
    if (Array.isArray(kw)) return kw.map(String);
    if (typeof kw === 'string') return [kw];
    return [];
  }

  detectReadingProgress(old: string[], next: string[]): 'skimmed' | 'completed' | null {
    const { readingTagSkimmed: skim, readingTagCompleted: done } = this.settings;
    const hadCompleted = old.some(k => k.includes(done));
    const hasCompleted = next.some(k => k.includes(done));
    const hadSkimmed = old.some(k => k.includes(skim));
    const hasSkimmed = next.some(k => k.includes(skim));

    if (hasCompleted && !hadCompleted) return 'completed';
    if (hasSkimmed && !hadSkimmed && !hasCompleted) return 'skimmed';
    return null;
  }

  isInFolder(filePath: string, folder: string): boolean {
    const normalised = folder.endsWith('/') ? folder : folder + '/';
    return filePath.startsWith(normalised);
  }

  hasTag(tags: string[] | undefined, tag: string): boolean {
    if (!tags) return false;
    return tags.some(t => t === tag || t === '#' + tag);
  }

  isSummaryFile(fileName: string): boolean {
    return fileName.startsWith('summary_');
  }

  shouldAwardDevelopmentXP(snapshot: FileSnapshot, newWordCount: number, newLinkCount: number): boolean {
    const wordGrowth = newWordCount - snapshot.wordCount >= this.settings.atomicDevelopmentWordThreshold;
    const linkGrowth = newLinkCount > snapshot.linkCount;
    if (!wordGrowth && !linkGrowth) return false;

    if (snapshot.lastDevelopmentAt) {
      const cooldownMs = this.settings.atomicDevelopmentCooldownMinutes * 60 * 1000;
      if (Date.now() - snapshot.lastDevelopmentAt < cooldownMs) return false;
    }
    return true;
  }

  writingProgressXP(peakWordCount: number, newWordCount: number): number {
    if (newWordCount <= peakWordCount) return 0;
    const newWords = newWordCount - peakWordCount;
    const threshold = this.settings.writingProgressWordThreshold;
    return Math.floor(newWords / threshold) * this.settings.xpWritingProgressPer100Words;
  }

  // --- Vault event handlers ---

  async onFileCreate(file: TFile): Promise<void> {
    const data = this.engine.getData();
    const cache = this.metadataCache.getFileCache(file);
    const rawTags = cache?.frontmatter?.[this.settings.atomNoteTagField];
    const tags: string[] = Array.isArray(rawTags) ? rawTags : [];

    // Only award XP for files genuinely created after this plugin session started.
    // Obsidian fires 'create' for pre-existing files during initial vault indexing.
    const isNewFile = file.stat.ctime >= this.loadedAt;

    if (
      isNewFile &&
      this.isInFolder(file.path, this.settings.ideasFolder) &&
      this.hasTag(tags, this.settings.atomTag) &&
      !this.isSummaryFile(file.name)
    ) {
      await this.engine.awardXP(
        this.settings.xpAtomicNoteCreated,
        'atomic-note-created',
        `New note: ${file.basename}`,
        file.path
      );
    }

    const content = await this.vault.read(file);
    const wordCount = this.countWords(content);
    data.snapshots[file.path] = {
      wordCount,
      linkCount: this.countWikilinks(content),
      keywords: this.extractKeywords((cache?.frontmatter as Record<string, unknown>) ?? null),
      peakWordCount: wordCount,
    };
  }

  async onMetadataChange(file: TFile): Promise<void> {
    const data = this.engine.getData();
    const cache = this.metadataCache.getFileCache(file);
    const frontmatter = (cache?.frontmatter as Record<string, unknown>) ?? null;

    const inSources = this.isInFolder(file.path, this.settings.sourcesFolder);
    const inIdeas = this.isInFolder(file.path, this.settings.ideasFolder);
    const inProjects = this.isInFolder(file.path, this.settings.projectsFolder);

    // B2 + B3: skip files outside all tracked folders entirely
    if (!inSources && !inIdeas && !inProjects) return;

    const snapshot = data.snapshots[file.path];
    const newKeywords = this.extractKeywords(frontmatter);

    // Reading progress (sources folder only)
    if (inSources) {
      if (snapshot) {
        const progress = this.detectReadingProgress(snapshot.keywords, newKeywords);
        if (progress === 'skimmed') {
          await this.engine.awardXP(
            this.settings.xpPaperSkimmed, 'paper-skimmed', `Skimmed: ${file.basename}`, file.path
          );
        } else if (progress === 'completed') {
          await this.engine.awardXP(
            this.settings.xpPaperCompleted, 'paper-completed', `Completed: ${file.basename}`, file.path
          );
        }
      }
      // B4: bootstrap snapshot if missing so the next change can diff correctly
      const content = await this.vault.read(file);
      const wordCount = this.countWords(content);
      data.snapshots[file.path] = {
        wordCount,
        linkCount: this.countWikilinks(content),
        keywords: newKeywords,
        peakWordCount: snapshot?.peakWordCount ?? wordCount,
        lastDevelopmentAt: snapshot?.lastDevelopmentAt,
      };
      this.onUpdate?.();
      return;
    }

    // Ideas and projects folders need content for word/link counts
    const content = await this.vault.read(file);
    const newWordCount = this.countWords(content);
    const newLinkCount = this.countWikilinks(content);

    if (inIdeas) {
      const rawAtomTags = cache?.frontmatter?.[this.settings.atomNoteTagField];
      const atomTags: string[] = Array.isArray(rawAtomTags) ? rawAtomTags : [];

      if (this.hasTag(atomTags, this.settings.atomTag) && snapshot) {
        if (this.shouldAwardDevelopmentXP(snapshot, newWordCount, newLinkCount)) {
          await this.engine.awardXP(
            this.settings.xpAtomicNoteDeveloped,
            'atomic-note-developed',
            `Developed: ${file.basename}`,
            file.path
          );
          snapshot.lastDevelopmentAt = Date.now();
        }
      }

      data.snapshots[file.path] = {
        wordCount: newWordCount,
        linkCount: newLinkCount,
        keywords: newKeywords,
        peakWordCount: snapshot?.peakWordCount ?? newWordCount,
        lastDevelopmentAt: snapshot?.lastDevelopmentAt,
      };
    }

    if (inProjects) {
      const rawProjectTags = cache?.frontmatter?.[this.settings.projectTagField];
      const projectTags: string[] = Array.isArray(rawProjectTags) ? rawProjectTags : [];
      const manuscriptTag = this.settings.projectTags['manuscript'];

      if (snapshot && this.hasTag(projectTags, manuscriptTag)) {
        const xp = this.writingProgressXP(snapshot.peakWordCount, newWordCount);
        if (xp > 0) {
          await this.engine.awardXP(xp, 'writing-progress', `Writing: ${file.basename}`, file.path);
        }

        const today = this.engine.getTodayDate();
        if (snapshot.dailyWritingDate !== today) {
          snapshot.dailyWritingDate = today;
          snapshot.dailyWritingStart = snapshot.wordCount;
          snapshot.writingBonusAwarded = false;
        }
        const dailyProgress = newWordCount - (snapshot.dailyWritingStart ?? newWordCount);
        const bonusThreshold = this.settings.writingSessionBonusThreshold ?? 500;
        const bonusXP = this.settings.xpWritingSessionBonus ?? 50;
        if (!snapshot.writingBonusAwarded && dailyProgress >= bonusThreshold) {
          await this.engine.awardXP(bonusXP, 'writing-progress', `Writing session bonus: ${file.basename}`, file.path);
          snapshot.writingBonusAwarded = true;
        }

        data.snapshots[file.path] = {
          wordCount: newWordCount,
          linkCount: newLinkCount,
          keywords: newKeywords,
          peakWordCount: Math.max(snapshot.peakWordCount ?? 0, newWordCount),
          lastDevelopmentAt: snapshot.lastDevelopmentAt,
          dailyWritingDate: snapshot.dailyWritingDate,
          dailyWritingStart: snapshot.dailyWritingStart,
          writingBonusAwarded: snapshot.writingBonusAwarded,
        };
      }
    }

    this.onUpdate?.();
  }

  async scanVault(awardXP: boolean): Promise<{ papers: number; notes: number }> {
    const data = this.engine.getData();
    const files = this.vault.getMarkdownFiles();
    let papers = 0;
    let notes = 0;

    for (const file of files) {
      const cache = this.metadataCache.getFileCache(file);
      const frontmatter = (cache?.frontmatter as Record<string, unknown>) ?? null;
      const content = await this.vault.read(file);
      const wordCount = this.countWords(content);
      const linkCount = this.countWikilinks(content);
      const keywords = this.extractKeywords(frontmatter);

      if (this.isInFolder(file.path, this.settings.sourcesFolder)) {
        if (awardXP) {
          const isCompleted = keywords.some(k => k.includes(this.settings.readingTagCompleted));
          const isSkimmed = keywords.some(k => k.includes(this.settings.readingTagSkimmed));
          if (isCompleted) {
            await this.engine.awardXP(
              this.settings.xpPaperCompleted, 'paper-completed',
              `History: ${file.basename}`, file.path
            );
          } else if (isSkimmed) {
            await this.engine.awardXP(
              this.settings.xpPaperSkimmed, 'paper-skimmed',
              `History: ${file.basename}`, file.path
            );
          }
        }
        data.snapshots[file.path] = { wordCount, linkCount, keywords, peakWordCount: wordCount };
        papers++;
      } else if (this.isInFolder(file.path, this.settings.ideasFolder)) {
        const rawTags = cache?.frontmatter?.[this.settings.atomNoteTagField];
        const tags: string[] = Array.isArray(rawTags) ? rawTags : [];
        if (this.hasTag(tags, this.settings.atomTag) && !this.isSummaryFile(file.name)) {
          if (awardXP) {
            await this.engine.awardXP(
              this.settings.xpAtomicNoteCreated, 'atomic-note-created',
              `History: ${file.basename}`, file.path
            );
          }
          notes++;
        }
        data.snapshots[file.path] = { wordCount, linkCount, keywords, peakWordCount: wordCount };
      }
    }

    return { papers, notes };
  }
}

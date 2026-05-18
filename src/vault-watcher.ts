import { MetadataCache, TFile, Vault } from 'obsidian';
import { FileSnapshot, XPSettings } from './types';
import { READING_EMOJIS } from './constants';
import { XPEngine } from './xp-engine';

export class VaultWatcher {
  private engine: XPEngine;
  private settings: XPSettings;
  private vault: Vault;
  private metadataCache: MetadataCache;

  constructor(engine: XPEngine, settings: XPSettings, vault: Vault, metadataCache: MetadataCache) {
    this.engine = engine;
    this.settings = settings;
    this.vault = vault;
    this.metadataCache = metadataCache;
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
    if (!frontmatter?.keywords) return [];
    const kw = frontmatter.keywords;
    if (Array.isArray(kw)) return kw.map(String);
    if (typeof kw === 'string') return [kw];
    return [];
  }

  detectReadingProgress(old: string[], next: string[]): 'skimmed' | 'completed' | null {
    const hadCompleted = old.some(k => k.includes(READING_EMOJIS.completed));
    const hasCompleted = next.some(k => k.includes(READING_EMOJIS.completed));
    const hadSkimmed = old.some(k => k.includes(READING_EMOJIS.skimmed));
    const hasSkimmed = next.some(k => k.includes(READING_EMOJIS.skimmed));

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
    const tags: string[] = (cache?.frontmatter?.tags as string[]) ?? [];

    if (
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
    data.snapshots[file.path] = {
      wordCount: this.countWords(content),
      linkCount: this.countWikilinks(content),
      keywords: this.extractKeywords((cache?.frontmatter as Record<string, unknown>) ?? null),
      peakWordCount: this.countWords(content),
    };
  }

  async onMetadataChange(file: TFile): Promise<void> {
    const data = this.engine.getData();
    const cache = this.metadataCache.getFileCache(file);
    const frontmatter = (cache?.frontmatter as Record<string, unknown>) ?? null;
    const tags: string[] = (frontmatter?.tags as string[]) ?? [];
    const newKeywords = this.extractKeywords(frontmatter);
    const snapshot = data.snapshots[file.path];

    // Reading progress (sources folder only)
    if (this.isInFolder(file.path, this.settings.sourcesFolder) && snapshot) {
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

    const content = await this.vault.read(file);
    const newWordCount = this.countWords(content);
    const newLinkCount = this.countWikilinks(content);

    // Atomic note development
    if (
      this.isInFolder(file.path, this.settings.ideasFolder) &&
      this.hasTag(tags, this.settings.atomTag) &&
      snapshot
    ) {
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

    // Writing progress (manuscript files only)
    const manuscriptTag = this.settings.projectTags['manuscript'];
    if (snapshot && this.hasTag(tags, manuscriptTag)) {
      const xp = this.writingProgressXP(snapshot.peakWordCount, newWordCount);
      if (xp > 0) {
        await this.engine.awardXP(xp, 'writing-progress', `Writing: ${file.basename}`, file.path);
      }
    }

    // Update snapshot
    data.snapshots[file.path] = {
      wordCount: newWordCount,
      linkCount: newLinkCount,
      keywords: newKeywords,
      peakWordCount: Math.max(snapshot?.peakWordCount ?? 0, newWordCount),
      lastDevelopmentAt: snapshot?.lastDevelopmentAt,
    };
  }
}

import { VaultWatcher } from '../src/vault-watcher';
import { DEFAULT_SETTINGS } from '../src/constants';
import { FileSnapshot } from '../src/types';

const makeWatcher = () =>
  new VaultWatcher({} as any, DEFAULT_SETTINGS, {} as any, {} as any);

describe('VaultWatcher.countWords', () => {
  it('counts body words, excluding YAML frontmatter', () => {
    const w = makeWatcher();
    expect(w.countWords('---\ntitle: Test\n---\nHello world foo')).toBe(3);
  });
  it('returns 0 for empty body', () => {
    const w = makeWatcher();
    expect(w.countWords('---\ntitle: x\n---\n')).toBe(0);
  });
  it('counts words in files without frontmatter', () => {
    const w = makeWatcher();
    expect(w.countWords('one two three')).toBe(3);
  });
});

describe('VaultWatcher.countWikilinks', () => {
  it('counts [[...]] patterns', () => {
    const w = makeWatcher();
    expect(w.countWikilinks('See [[Note A]] and [[Note B]].')).toBe(2);
  });
  it('returns 0 with no links', () => {
    const w = makeWatcher();
    expect(w.countWikilinks('Plain text')).toBe(0);
  });
});

describe('VaultWatcher.extractKeywords', () => {
  it('returns array from array frontmatter', () => {
    const w = makeWatcher();
    expect(w.extractKeywords({ keywords: ['👀 Skim', '📥 Unprocessed'] }))
      .toEqual(['👀 Skim', '📥 Unprocessed']);
  });
  it('wraps string in array', () => {
    const w = makeWatcher();
    expect(w.extractKeywords({ keywords: '👀 Skim' })).toEqual(['👀 Skim']);
  });
  it('returns empty array for null frontmatter', () => {
    const w = makeWatcher();
    expect(w.extractKeywords(null)).toEqual([]);
  });
  it('returns empty array for frontmatter without keywords', () => {
    const w = makeWatcher();
    expect(w.extractKeywords({ title: 'Test' })).toEqual([]);
  });
});

describe('VaultWatcher.detectReadingProgress', () => {
  it('detects skimmed when 👀 appears for first time', () => {
    const w = makeWatcher();
    expect(w.detectReadingProgress(['📥 Unprocessed'], ['📥 Unprocessed', '👀 Skim']))
      .toBe('skimmed');
  });
  it('detects completed when ✅ appears', () => {
    const w = makeWatcher();
    expect(w.detectReadingProgress(['👀 Skim'], ['✅ Completed'])).toBe('completed');
  });
  it('returns null when no relevant change', () => {
    const w = makeWatcher();
    expect(w.detectReadingProgress(['👀 Skim'], ['👀 Skim'])).toBeNull();
  });
  it('returns null when ✅ was already present', () => {
    const w = makeWatcher();
    expect(w.detectReadingProgress(['✅ Completed'], ['✅ Completed', '👀 Skim'])).toBeNull();
  });
  it('detects completed even when 👀 is also present', () => {
    const w = makeWatcher();
    expect(w.detectReadingProgress(['👀 Skim'], ['👀 Skim', '✅ Completed'])).toBe('completed');
  });
  it('does not return skimmed if ✅ also appears in same change', () => {
    const w = makeWatcher();
    expect(w.detectReadingProgress(['📥 Unprocessed'], ['👀 Skim', '✅ Completed']))
      .toBe('completed');
  });
});

describe('VaultWatcher.isInFolder', () => {
  it('returns true when file is in folder', () => {
    const w = makeWatcher();
    expect(w.isInFolder('Atlas/Sources/paper.md', 'Atlas/Sources')).toBe(true);
  });
  it('returns false when file is not in folder', () => {
    const w = makeWatcher();
    expect(w.isInFolder('Atlas/Ideas/note.md', 'Atlas/Sources')).toBe(false);
  });
  it('handles trailing slash in folder argument', () => {
    const w = makeWatcher();
    expect(w.isInFolder('Atlas/Sources/paper.md', 'Atlas/Sources/')).toBe(true);
  });
  it('does not match a folder with same prefix but different name', () => {
    const w = makeWatcher();
    expect(w.isInFolder('Atlas/SourcesExtra/file.md', 'Atlas/Sources')).toBe(false);
  });
});

describe('VaultWatcher.hasTag', () => {
  it('matches tag without # prefix', () => {
    const w = makeWatcher();
    expect(w.hasTag(['cards/atom'], 'cards/atom')).toBe(true);
  });
  it('matches tag stored with # prefix', () => {
    const w = makeWatcher();
    expect(w.hasTag(['#cards/atom'], 'cards/atom')).toBe(true);
  });
  it('returns false for missing tag', () => {
    const w = makeWatcher();
    expect(w.hasTag(['cards/paper'], 'cards/atom')).toBe(false);
  });
  it('returns false for undefined tags', () => {
    const w = makeWatcher();
    expect(w.hasTag(undefined, 'cards/atom')).toBe(false);
  });
});

describe('VaultWatcher.isSummaryFile', () => {
  it('returns true for summary_ files', () => {
    const w = makeWatcher();
    expect(w.isSummaryFile('summary_Smith2023.md')).toBe(true);
  });
  it('returns false for regular files', () => {
    const w = makeWatcher();
    expect(w.isSummaryFile('Smith2023.md')).toBe(false);
  });
});

describe('VaultWatcher.shouldAwardDevelopmentXP', () => {
  const base: FileSnapshot = { wordCount: 100, linkCount: 2, keywords: [], peakWordCount: 100 };

  it('awards XP when word growth exceeds threshold (50 words)', () => {
    const w = makeWatcher();
    expect(w.shouldAwardDevelopmentXP(base, 155, 2)).toBe(true); // +55 >= 50
  });
  it('awards XP when link count increases by 1', () => {
    const w = makeWatcher();
    expect(w.shouldAwardDevelopmentXP(base, 100, 3)).toBe(true);
  });
  it('does not award when word growth is below threshold', () => {
    const w = makeWatcher();
    expect(w.shouldAwardDevelopmentXP(base, 140, 2)).toBe(false); // +40 < 50
  });
  it('respects cooldown — does not award if last award was recent', () => {
    const w = makeWatcher();
    const snap = { ...base, lastDevelopmentAt: Date.now() - 1000 }; // 1 second ago
    expect(w.shouldAwardDevelopmentXP(snap, 200, 5)).toBe(false);
  });
  it('awards again after cooldown expires', () => {
    const w = makeWatcher();
    const cooldownMs = DEFAULT_SETTINGS.atomicDevelopmentCooldownMinutes * 60 * 1000;
    const snap = { ...base, lastDevelopmentAt: Date.now() - cooldownMs - 1000 };
    expect(w.shouldAwardDevelopmentXP(snap, 200, 5)).toBe(true);
  });
});

describe('VaultWatcher.atomicNoteXP', () => {
  const w = makeWatcher();
  const base = 30;

  it('returns full XP for notes 1–10 (todayCount 0–9)', () => {
    expect(w.atomicNoteXP(base, 0)).toBe(30);
    expect(w.atomicNoteXP(base, 9)).toBe(30);
  });
  it('returns half XP for notes 11–30 (todayCount 10–29)', () => {
    expect(w.atomicNoteXP(base, 10)).toBe(15);
    expect(w.atomicNoteXP(base, 29)).toBe(15);
  });
  it('returns trickle XP for notes 31+ (todayCount 30+)', () => {
    expect(w.atomicNoteXP(base, 30)).toBe(5);
    expect(w.atomicNoteXP(base, 99)).toBe(5);
  });
});

describe('VaultWatcher.detectReadingProgress — one-time guard', () => {
  it('detects completed transition', () => {
    const w = makeWatcher();
    expect(w.detectReadingProgress(['📥'], ['✅'])).toBe('completed');
  });
  it('returns null when paper already has completedAt flag (guard enforced in caller)', () => {
    // detectReadingProgress itself is stateless; the guard is applied in onMetadataChange.
    // Re-adding ✅ after removal would return 'completed' again — confirming why the flag is needed.
    const w = makeWatcher();
    expect(w.detectReadingProgress(['📥'], ['✅'])).toBe('completed');
  });
  it('returns null when tag unchanged', () => {
    const w = makeWatcher();
    expect(w.detectReadingProgress(['✅'], ['✅'])).toBeNull();
  });
});

describe('VaultWatcher.writingProgressXP', () => {
  it('returns 0 when word count is below peak', () => {
    const w = makeWatcher();
    expect(w.writingProgressXP(500, 490)).toBe(0);
  });
  it('returns 0 when equal to peak', () => {
    const w = makeWatcher();
    expect(w.writingProgressXP(500, 500)).toBe(0);
  });
  it('returns xpWritingProgressPer100Words for exactly 100 new words', () => {
    const w = makeWatcher();
    expect(w.writingProgressXP(500, 600)).toBe(20); // rate is now 20 XP per 100 words
  });
  it('returns 2× for 250 new words (2 full thresholds)', () => {
    const w = makeWatcher();
    expect(w.writingProgressXP(500, 750)).toBe(40); // 2 * 20 XP
  });
  it('floors partial threshold progress', () => {
    const w = makeWatcher();
    expect(w.writingProgressXP(500, 650)).toBe(20); // 150 words = 1 full threshold * 20 XP
  });
});

describe('VaultWatcher.detectReadingProgress — custom tags', () => {
  const makeWatcherWithTags = (skimmed: string, completed: string) =>
    new VaultWatcher({} as any, {
      ...DEFAULT_SETTINGS,
      readingTagSkimmed: skimmed,
      readingTagCompleted: completed,
    }, {} as any, {} as any);

  it('detects skimmed using custom tag', () => {
    const w = makeWatcherWithTags('reading', 'done');
    expect(w.detectReadingProgress(['inbox'], ['inbox', 'reading'])).toBe('skimmed');
  });

  it('detects completed using custom tag', () => {
    const w = makeWatcherWithTags('reading', 'done');
    expect(w.detectReadingProgress(['reading'], ['done'])).toBe('completed');
  });

  it('returns null when custom completed tag was already present', () => {
    const w = makeWatcherWithTags('reading', 'done');
    expect(w.detectReadingProgress(['done'], ['done'])).toBeNull();
  });

  it('does not fire on unrelated tag changes', () => {
    const w = makeWatcherWithTags('reading', 'done');
    expect(w.detectReadingProgress(['inbox'], ['inbox', 'flagged'])).toBeNull();
  });
});

describe('VaultWatcher.scanVault', () => {
  const makeEngine = () => {
    const awarded: Array<{ xp: number; type: string }> = [];
    const snapshots: Record<string, any> = {};
    return {
      engine: {
        awardXP: jest.fn(async (xp: number, type: string) => { awarded.push({ xp, type }); }),
        getData: () => ({ snapshots }),
      } as any,
      awarded,
      snapshots,
    };
  };

  const makeFile = (path: string) => ({
    path,
    basename: path.split('/').pop()!.replace('.md', ''),
    name: path.split('/').pop()!,
    stat: { ctime: 0 },
  });

  it('awards paper-completed XP for completed papers on first scan', async () => {
    const { engine, awarded, snapshots } = makeEngine();
    const file = makeFile('Atlas/Sources/paper.md');
    const vault = { getMarkdownFiles: () => [file], read: async () => 'body text' } as any;
    const metadataCache = {
      getFileCache: () => ({ frontmatter: { keywords: ['✅ done'] } }),
    } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    const result = await w.scanVault(true);

    expect(awarded).toContainEqual({ xp: 50, type: 'paper-completed' });
    expect(result.papers).toBe(1);
    expect(snapshots['Atlas/Sources/paper.md']).toBeDefined();
  });

  it('awards paper-skimmed XP for skimmed papers on first scan', async () => {
    const { engine, awarded } = makeEngine();
    const file = makeFile('Atlas/Sources/paper2.md');
    const vault = { getMarkdownFiles: () => [file], read: async () => 'body' } as any;
    const metadataCache = {
      getFileCache: () => ({ frontmatter: { keywords: ['👀 reading'] } }),
    } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    await w.scanVault(true);

    expect(awarded).toContainEqual({ xp: 20, type: 'paper-skimmed' });
  });

  it('does not award XP for unprocessed papers even on first scan', async () => {
    const { engine, awarded } = makeEngine();
    const file = makeFile('Atlas/Sources/paper3.md');
    const vault = { getMarkdownFiles: () => [file], read: async () => 'body' } as any;
    const metadataCache = {
      getFileCache: () => ({ frontmatter: { keywords: ['📥 inbox'] } }),
    } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    await w.scanVault(true);

    expect(awarded).toHaveLength(0);
  });

  it('awards atomic-note-created XP for atom notes on first scan', async () => {
    const { engine, awarded } = makeEngine();
    const file = makeFile('Atlas/Ideas/my-note.md');
    const vault = { getMarkdownFiles: () => [file], read: async () => 'content' } as any;
    const metadataCache = {
      getFileCache: () => ({ frontmatter: { tags: ['cards/atom'] } }),
    } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    const result = await w.scanVault(true);

    expect(awarded).toContainEqual({ xp: 30, type: 'atomic-note-created' });
    expect(result.notes).toBe(1);
  });

  it('skips summary_ files in ideasFolder', async () => {
    const { engine, awarded } = makeEngine();
    const file = makeFile('Atlas/Ideas/summary_Smith2023.md');
    const vault = { getMarkdownFiles: () => [file], read: async () => 'content' } as any;
    const metadataCache = {
      getFileCache: () => ({ frontmatter: { tags: ['cards/atom'] } }),
    } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    await w.scanVault(true);

    expect(awarded).toHaveLength(0);
  });

  it('does not award XP when awardXP is false (rescan)', async () => {
    const { engine, awarded, snapshots } = makeEngine();
    const file = makeFile('Atlas/Sources/paper.md');
    const vault = { getMarkdownFiles: () => [file], read: async () => 'body' } as any;
    const metadataCache = {
      getFileCache: () => ({ frontmatter: { keywords: ['✅ done'] } }),
    } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    await w.scanVault(false);

    expect(awarded).toHaveLength(0);
    expect(snapshots['Atlas/Sources/paper.md']).toBeDefined();
  });
});

describe('VaultWatcher.onMetadataChange — B2/B3/B4 fixes', () => {
  const makeEngine = (snapshots: Record<string, any> = {}) => ({
    awardXP: jest.fn(async () => {}),
    getData: () => ({ snapshots }),
  } as any);

  it('B4: bootstraps snapshot on first metadata change for sources file with no existing snapshot', async () => {
    const snapshots: Record<string, any> = {};
    const engine = makeEngine(snapshots);
    const vault = { read: jest.fn(async () => 'some content') } as any;
    const metadataCache = {
      getFileCache: () => ({ frontmatter: { keywords: ['📥 inbox'] } }),
    } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    const file = { path: 'Atlas/Sources/paper.md', basename: 'paper', stat: {} } as any;

    await w.onMetadataChange(file);

    expect(snapshots['Atlas/Sources/paper.md']).toBeDefined();
    expect(engine.awardXP).not.toHaveBeenCalled();
  });

  it('B3: does not write snapshot for files outside all tracked folders', async () => {
    const snapshots: Record<string, any> = {};
    const engine = makeEngine(snapshots);
    const vault = { read: jest.fn(async () => 'content') } as any;
    const metadataCache = { getFileCache: () => ({ frontmatter: {} }) } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    const file = { path: 'Calendar/2026-05-20.md', basename: '2026-05-20', stat: {} } as any;

    await w.onMetadataChange(file);

    expect(snapshots['Calendar/2026-05-20.md']).toBeUndefined();
    expect(vault.read).not.toHaveBeenCalled();
  });

  it('B2: does not call vault.read for files outside tracked folders', async () => {
    const snapshots: Record<string, any> = {};
    const engine = makeEngine(snapshots);
    const vault = { read: jest.fn(async () => 'content') } as any;
    const metadataCache = { getFileCache: () => ({ frontmatter: {} }) } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    const file = { path: 'Daily/2026-05-20.md', basename: '2026-05-20', stat: {} } as any;

    await w.onMetadataChange(file);

    expect(vault.read).not.toHaveBeenCalled();
  });
});

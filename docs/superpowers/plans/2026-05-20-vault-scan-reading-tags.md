# Vault Scan, Configurable Reading Tags & Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add configurable reading status tags, a first-run vault scan with historical XP, a rescan button, restructured settings UI, and fix five known bugs in snapshot/watcher logic.

**Architecture:** Changes in sequence: (1) data model + constants, (2) watcher logic + bug fixes, (3) main.ts event wiring, (4) UI/settings. Each task is independently testable. No new files needed.

**Tech Stack:** TypeScript, Obsidian Plugin API, Jest + ts-jest

---

## File Map

| File | What changes |
|---|---|
| `src/types.ts` | Add `readingTagUnprocessed/Skimmed/Completed` to `XPSettings`; add `hasVaultScanned` to `PluginData` |
| `src/constants.ts` | Add three reading tag defaults to `DEFAULT_SETTINGS` |
| `src/vault-watcher.ts` | Remove `READING_EMOJIS` import; update `detectReadingProgress`; add `scanVault()`; fix B2+B3+B4 in `onMetadataChange` |
| `src/main.ts` | Load `hasVaultScanned`; expose `runVaultScan()`; add rename + delete handlers (B1, B5) |
| `src/settings.ts` | Add reading tag inputs; add scan button; restructure sections |
| `tests/vault-watcher.test.ts` | Tests for configurable tags, `scanVault`, and fixed `onMetadataChange` behavior |

## Known Bugs Being Fixed

| ID | File | Description |
|---|---|---|
| B1 | `main.ts` | No rename handler — renaming manuscript resets `peakWordCount` to 0, awards XP for existing words |
| B2 | `vault-watcher.ts` | `vault.read()` called for every file, not just relevant folders |
| B3 | `vault-watcher.ts` | Snapshot written for every file, bloating `data.json` |
| B4 | `vault-watcher.ts` | First reading emoji change after install silently skipped (no snapshot to diff against) |
| B5 | `main.ts` | No delete handler — stale snapshot entries accumulate |

---

## Task 1: Add reading tag fields to types and constants

**Files:**
- Modify: `src/types.ts`
- Modify: `src/constants.ts`

- [ ] **Step 1: Add fields to `XPSettings` in `src/types.ts`**

In the `XPSettings` interface, add after `readingStatusField: string;`:

```typescript
readingTagUnprocessed: string;
readingTagSkimmed: string;
readingTagCompleted: string;
```

In `PluginData`, add after `currentStreak?: number;`:

```typescript
hasVaultScanned?: boolean;
```

- [ ] **Step 2: Add defaults to `DEFAULT_SETTINGS` in `src/constants.ts`**

In `DEFAULT_SETTINGS`, add after `readingStatusField: 'keywords',`:

```typescript
readingTagUnprocessed: '📥',
readingTagSkimmed: '👀',
readingTagCompleted: '✅',
```

- [ ] **Step 3: Run tests to confirm nothing is broken**

```bash
cd ~/repos/scholar-quest && npm test 2>&1 | tail -20
```

Expected: all 59 tests pass (type additions are backward-compatible).

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/constants.ts
git commit -m "feat: add configurable reading tag fields to XPSettings and PluginData"
```

---

## Task 2: Update `detectReadingProgress` to use settings

**Files:**
- Modify: `src/vault-watcher.ts:1-10` (import), `src/vault-watcher.ts:42-51` (method body)
- Modify: `tests/vault-watcher.test.ts` (update + add tests)

- [ ] **Step 1: Write failing tests for configurable tag behavior**

In `tests/vault-watcher.test.ts`, add a new describe block after the existing `detectReadingProgress` block:

```typescript
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd ~/repos/scholar-quest && npm test -- --testPathPattern vault-watcher 2>&1 | tail -20
```

Expected: the 4 new tests fail because `detectReadingProgress` still uses hardcoded `READING_EMOJIS`.

- [ ] **Step 3: Update `detectReadingProgress` in `src/vault-watcher.ts`**

Remove the `READING_EMOJIS` import (line 3):
```typescript
// DELETE this line:
import { READING_EMOJIS } from './constants';
```

Replace the body of `detectReadingProgress` (lines 42–51):
```typescript
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
```

- [ ] **Step 4: Run all tests to confirm they pass**

```bash
cd ~/repos/scholar-quest && npm test 2>&1 | tail -20
```

Expected: all tests pass. The existing `detectReadingProgress` tests still pass because `DEFAULT_SETTINGS` now includes `readingTagSkimmed: '👀'` and `readingTagCompleted: '✅'`.

- [ ] **Step 5: Commit**

```bash
git add src/vault-watcher.ts tests/vault-watcher.test.ts
git commit -m "feat: make reading status tags configurable via settings"
```

---

## Task 3: Add `scanVault` method to `VaultWatcher`

**Files:**
- Modify: `src/vault-watcher.ts` (add method)
- Modify: `tests/vault-watcher.test.ts` (add tests)

The method scans `sourcesFolder` and `ideasFolder`. On first run (`awardXP = true`), it awards XP for papers already marked skimmed/completed and for existing atom notes. On re-runs (`awardXP = false`), it only rebuilds baselines.

- [ ] **Step 1: Write failing tests for `scanVault`**

Add at the end of `tests/vault-watcher.test.ts`:

```typescript
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

  const makeFile = (path: string, content: string, frontmatter: Record<string, unknown>) => ({
    path,
    basename: path.split('/').pop()!.replace('.md', ''),
    name: path.split('/').pop()!,
    stat: { ctime: 0 },
  });

  it('awards paper-completed XP for completed papers on first scan', async () => {
    const { engine, awarded, snapshots } = makeEngine();
    const completedFile = makeFile('Atlas/Sources/paper.md', 'body text', {});
    const vault = {
      getMarkdownFiles: () => [completedFile],
      read: async () => 'body text',
    } as any;
    const metadataCache = {
      getFileCache: () => ({
        frontmatter: { keywords: ['✅ done'] },
      }),
    } as any;
    const w = new VaultWatcher(engine, DEFAULT_SETTINGS, vault, metadataCache);
    const result = await w.scanVault(true);

    expect(awarded).toContainEqual({ xp: 50, type: 'paper-completed' });
    expect(result.papers).toBe(1);
    expect(snapshots['Atlas/Sources/paper.md']).toBeDefined();
  });

  it('awards paper-skimmed XP for skimmed papers on first scan', async () => {
    const { engine, awarded } = makeEngine();
    const file = makeFile('Atlas/Sources/paper2.md', 'body', {});
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
    const file = makeFile('Atlas/Sources/paper3.md', 'body', {});
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
    const file = makeFile('Atlas/Ideas/my-note.md', 'content', {});
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
    const file = makeFile('Atlas/Ideas/summary_Smith2023.md', 'content', {});
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
    const file = makeFile('Atlas/Sources/paper.md', 'body', {});
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd ~/repos/scholar-quest && npm test -- --testPathPattern vault-watcher 2>&1 | tail -20
```

Expected: 6 new tests fail with "w.scanVault is not a function".

- [ ] **Step 3: Implement `scanVault` in `src/vault-watcher.ts`**

Add after the `onMetadataChange` method (before the closing `}`):

```typescript
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
```

Note: `this.vault.getMarkdownFiles()` is available on Obsidian's `Vault` type.

- [ ] **Step 4: Run all tests**

```bash
cd ~/repos/scholar-quest && npm test 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/vault-watcher.ts tests/vault-watcher.test.ts
git commit -m "feat: add scanVault method for historical XP import and baseline rebuild"
```

---

## Task 4: Wire `scanVault` into `main.ts`

**Files:**
- Modify: `src/main.ts` (load `hasVaultScanned`, expose `runVaultScan()`)

- [ ] **Step 1: Load `hasVaultScanned` in `loadPluginData`**

In `loadPluginData` (around line 237), add to the `this.pluginData` object:

```typescript
hasVaultScanned: saved?.hasVaultScanned ?? false,
```

- [ ] **Step 2: Add `runVaultScan` public method to `ScholarQuestPlugin`**

Add after the `activateSidebar` method (around line 188):

```typescript
async runVaultScan(): Promise<void> {
  const isFirst = !this.pluginData.hasVaultScanned;
  const { papers, notes } = await this.watcher.scanVault(isFirst);
  this.pluginData.hasVaultScanned = true;
  await this.savePluginData();

  const action = isFirst ? 'Vault import complete' : 'Vault rescan complete';
  const detail = isFirst
    ? `Found ${papers} papers, ${notes} atomic notes. XP awarded for your reading history.`
    : `Rebuilt baselines for ${papers} papers, ${notes} atomic notes. No XP awarded.`;
  new Notice(`📚 ${action} — ${detail}`, 6000);
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd ~/repos/scholar-quest && npm run build 2>&1 | tail -20
```

Expected: build succeeds (no type errors).

- [ ] **Step 4: Commit**

```bash
git add src/main.ts
git commit -m "feat: expose runVaultScan on plugin, track hasVaultScanned flag"
```

---

## Task 5: Restructure settings UI

**Files:**
- Modify: `src/settings.ts` (full restructure)

This task replaces the `display()` method. The section order is:

1. **Vault Locations** — folder paths + scan button
2. **Reading Tracking** — status field + three tag inputs
3. **Note Tracking** — atom tag + atom tag field
4. **Project Tracking** — project tag field + project tags (collapsible)
5. **XP Values** — (collapsible, unchanged)
6. **Manual Activities** — (unchanged)
7. **Milestone Templates** — (unchanged)
8. **Danger Zone** — (unchanged)

- [ ] **Step 1: Replace `display()` in `src/settings.ts`**

Replace the entire `display()` method with:

```typescript
display(): void {
  const { containerEl } = this;
  containerEl.empty();
  containerEl.createEl('h2', { text: 'Scholar Quest' });

  // ── Vault Locations ──────────────────────────────────────────────────────
  this.section(containerEl, 'Vault Locations',
    'Where your notes live. Click "Scan Vault" after changing any path here.');

  this.addTextSetting(containerEl, 'Sources folder', 'Papers, lectures, and other source notes', 'sourcesFolder');
  this.addTextSetting(containerEl, 'Ideas folder', 'Atomic / permanent notes', 'ideasFolder');
  this.addTextSetting(containerEl, 'Projects folder', 'Project files tracked for milestones', 'projectsFolder');

  new Setting(containerEl)
    .setName('Scan Vault')
    .setDesc(this.plugin.pluginData.hasVaultScanned
      ? 'Rebuild baselines from current folder paths. No XP is awarded on rescans.'
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

  // ── Reading Tracking ─────────────────────────────────────────────────────
  this.section(containerEl, 'Reading Tracking',
    'The frontmatter field and tag values Scholar Quest reads to detect reading progress.');

  this.addTextSetting(containerEl, 'Reading status field',
    'Frontmatter property that holds the reading status (e.g. keywords, status)', 'readingStatusField');
  this.addTextSetting(containerEl, 'Unprocessed tag',
    'Tag value meaning "not yet read" — used as the baseline (e.g. 📥, inbox, toread)', 'readingTagUnprocessed');
  this.addTextSetting(containerEl, 'Skimmed tag',
    'Tag value meaning "in progress / skimmed" — awards skimmed XP (e.g. 👀, reading)', 'readingTagSkimmed');
  this.addTextSetting(containerEl, 'Completed tag',
    'Tag value meaning "fully read" — awards completed XP (e.g. ✅, done)', 'readingTagCompleted');

  // ── Note Tracking ────────────────────────────────────────────────────────
  this.section(containerEl, 'Note Tracking',
    'How Scholar Quest identifies atomic notes in your ideas folder.');

  this.addTextSetting(containerEl, 'Atomic note tag',
    'Tag that marks a note as atomic (e.g. cards/atom)', 'atomTag');
  this.addTextSetting(containerEl, 'Atomic note tag field',
    'Frontmatter property that contains the atomic note tag (e.g. tags)', 'atomNoteTagField');

  // ── Project Tracking ─────────────────────────────────────────────────────
  this.section(containerEl, 'Project Tracking',
    'How Scholar Quest identifies project files and their types.');

  this.addTextSetting(containerEl, 'Project tag field',
    'Frontmatter property that contains the project type tag (e.g. tags)', 'projectTagField');

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

  // ── XP Values ────────────────────────────────────────────────────────────
  const xpDetails = containerEl.createEl('details');
  xpDetails.style.cssText = 'margin: 4px 0 16px; padding: 0 12px 8px; background: var(--background-secondary); border-radius: 6px;';
  const xpSummary = xpDetails.createEl('summary');
  xpSummary.style.cssText = 'padding: 10px 0; cursor: pointer; font-weight: 500; color: var(--text-muted);';
  xpSummary.setText('XP Values  (expand to edit)');

  this.addNumberSetting(xpDetails, 'Paper skimmed', 'XP per paper skimmed', 'xpPaperSkimmed');
  this.addNumberSetting(xpDetails, 'Paper completed', 'XP per paper fully read', 'xpPaperCompleted');
  this.addNumberSetting(xpDetails, 'Atomic note created', 'XP for creating a new atomic note', 'xpAtomicNoteCreated');
  this.addNumberSetting(xpDetails, 'Atomic note developed', 'XP each time a note is significantly developed', 'xpAtomicNoteDeveloped');
  this.addNumberSetting(xpDetails, 'Writing progress (per 100 words)', 'XP awarded per 100 net new words', 'xpWritingProgressPer100Words');
  this.addNumberSetting(xpDetails, 'Writing session bonus', 'Bonus XP for writing a lot in one day', 'xpWritingSessionBonus');
  this.addNumberSetting(xpDetails, 'Writing session bonus threshold (words)', 'Net new words needed to trigger the bonus', 'writingSessionBonusThreshold');
  this.addNumberSetting(xpDetails, 'Daily presence', 'XP for opening Obsidian each day', 'xpDailyPresence');

  // ── Manual Log Activities ────────────────────────────────────────────────
  this.section(containerEl, 'Manual Log Activities',
    `For academic work done outside Obsidian. Max ${MAX_MANUAL_ACTIVITY_XP} XP per activity · once per day per activity.`);

  for (const activity of this.plugin.settings.manualActivities) {
    new Setting(containerEl)
      .setName(activity.name)
      .addText(t => {
        t.setPlaceholder('Activity name').setValue(activity.name);
        t.inputEl.style.width = '180px';
        t.onChange(async v => { activity.name = v; await this.save(); });
      })
      .addText(t => {
        t.setPlaceholder('XP').setValue(String(activity.xp));
        t.inputEl.type = 'number';
        t.inputEl.min = '1';
        t.inputEl.max = String(MAX_MANUAL_ACTIVITY_XP);
        t.inputEl.style.width = '60px';
        t.onChange(async v => {
          const n = Math.min(parseInt(v) || 1, MAX_MANUAL_ACTIVITY_XP);
          activity.xp = n; await this.save();
        });
      })
      .addExtraButton(b => b
        .setIcon('trash')
        .setTooltip('Remove activity')
        .onClick(async () => {
          this.plugin.settings.manualActivities =
            this.plugin.settings.manualActivities.filter(a => a !== activity);
          await this.save();
          this.display();
        }));
  }

  new Setting(containerEl)
    .addButton(b => b
      .setButtonText('+ Add activity')
      .onClick(async () => {
        this.plugin.settings.manualActivities.push({ name: 'New activity', xp: 40 });
        await this.save();
        this.display();
      }));

  // ── Milestone Templates ──────────────────────────────────────────────────
  this.section(containerEl, 'Milestone Templates',
    `Customise milestones per project type. XP is capped at ${MAX_MILESTONE_XP}.`);

  for (const [type, template] of Object.entries(this.plugin.settings.projectTemplates)) {
    const details = containerEl.createEl('details');
    details.style.cssText = 'margin: 4px 0; padding: 0 12px 8px; background: var(--background-secondary); border-radius: 6px;';

    const summary = details.createEl('summary');
    summary.style.cssText = 'padding: 10px 0; cursor: pointer; font-weight: 500;';
    summary.setText(`${type}  (${template.milestones.length} milestones)`);

    for (const milestone of template.milestones) {
      const row = new Setting(details)
        .addText(t => {
          t.setPlaceholder('Milestone name').setValue(milestone.name);
          t.inputEl.style.flex = '1';
          t.onChange(async v => { milestone.name = v; await this.save(); });
        })
        .addText(t => {
          t.setPlaceholder('XP').setValue(String(milestone.xp));
          t.inputEl.type = 'number';
          t.inputEl.min = '1';
          t.inputEl.max = String(MAX_MILESTONE_XP);
          t.inputEl.style.width = '60px';
          t.onChange(async v => {
            const n = Math.min(parseInt(v) || 1, MAX_MILESTONE_XP);
            milestone.xp = n; await this.save();
          });
        })
        .addExtraButton(b => b
          .setIcon('trash')
          .setTooltip('Remove milestone')
          .onClick(async () => {
            template.milestones = template.milestones.filter(m => m !== milestone);
            await this.save();
            this.display();
          }));
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd ~/repos/scholar-quest && npm run build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 3: Run all tests**

```bash
cd ~/repos/scholar-quest && npm test 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/settings.ts
git commit -m "feat: restructure settings UI with vault scan button and reading tag inputs"
```

---

---

## Task 6: Fix `onMetadataChange` — early exit, snapshot scope, and first-read baseline (B2, B3, B4)

**Files:**
- Modify: `src/vault-watcher.ts:122–204`
- Modify: `tests/vault-watcher.test.ts`

Three bugs fixed together because they're all in `onMetadataChange` and interact:
- **B2:** `vault.read()` fires for every file — move it inside a relevance check
- **B3:** Snapshot written for every file — gate the write on folder membership
- **B4:** First reading emoji change skipped — bootstrap snapshot for sourcesFolder files that have no snapshot yet

- [ ] **Step 1: Write failing tests**

Add to `tests/vault-watcher.test.ts`:

```typescript
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

    // Snapshot should now exist as baseline
    expect(snapshots['Atlas/Sources/paper.md']).toBeDefined();
    // No XP awarded on bootstrap (no transition detected)
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
    // vault.read should not be called for irrelevant files
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd ~/repos/scholar-quest && npm test -- --testPathPattern vault-watcher 2>&1 | tail -20
```

Expected: 3 new tests fail.

- [ ] **Step 3: Rewrite `onMetadataChange` in `src/vault-watcher.ts`**

Replace the `onMetadataChange` method (lines 122–204) with:

```typescript
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
    // B4: bootstrap snapshot for sources files that have no prior snapshot
    // (sets current state as baseline so the next change can diff correctly)
    const content = await this.vault.read(file);
    const wordCount = this.countWords(content);
    data.snapshots[file.path] = {
      wordCount,
      linkCount: this.countWikilinks(content),
      keywords: newKeywords,
      peakWordCount: snapshot?.peakWordCount ?? wordCount,
      lastDevelopmentAt: snapshot?.lastDevelopmentAt,
    };
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
```

- [ ] **Step 4: Run all tests**

```bash
cd ~/repos/scholar-quest && npm test 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/vault-watcher.ts tests/vault-watcher.test.ts
git commit -m "fix: early exit for irrelevant files (B2/B3), bootstrap snapshot on first source file change (B4)"
```

---

## Task 7: Fix rename and delete handlers in `main.ts` (B1, B5)

**Files:**
- Modify: `src/main.ts:68–78` (event registration block)

- [ ] **Step 1: Register rename and delete event handlers in `onload`**

In `src/main.ts`, in the `onload` method, after the existing `registerEvent` calls (after line 78), add:

```typescript
this.registerEvent(
  this.app.vault.on('rename', (file, oldPath) => {
    if (!(file instanceof TFile)) return;
    const data = this.engine.getData();
    if (data.snapshots[oldPath]) {
      data.snapshots[file.path] = data.snapshots[oldPath];
      delete data.snapshots[oldPath];
    }
  })
);

this.registerEvent(
  this.app.vault.on('delete', file => {
    if (!(file instanceof TFile)) return;
    const data = this.engine.getData();
    delete data.snapshots[file.path];
  })
);
```

Note: no `await` needed here — snapshot mutation is synchronous and `savePluginData` will persist it on the next save cycle.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd ~/repos/scholar-quest && npm run build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 3: Run all tests**

```bash
cd ~/repos/scholar-quest && npm test 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/main.ts
git commit -m "fix: migrate snapshot on file rename (B1), remove snapshot on file delete (B5)"
```

---

## Self-Review

**Spec coverage:**
- ✅ Configurable reading tags (unprocessed, skimmed, completed) — Task 1 + 2
- ✅ First-run vault scan awards historical XP — Task 3 + 4
- ✅ Subsequent scans rebuild baselines only — Task 3 + 4 (`awardXP` flag)
- ✅ Scan triggered from settings button — Task 5
- ✅ Button label and description change after first scan — Task 5
- ✅ Settings restructured into logical sections — Task 5
- ✅ `hasVaultScanned` persists across restarts — Task 4 (loaded in `loadPluginData`)
- ✅ B1: rename handler migrates snapshot — Task 7
- ✅ B2: `vault.read()` only called for relevant folders — Task 6
- ✅ B3: snapshot only written for relevant folders — Task 6
- ✅ B4: first metadata change on sources file bootstraps snapshot — Task 6
- ✅ B5: delete handler removes stale snapshot — Task 7

**Placeholder scan:** No TBDs, TODOs, or vague steps present.

**Type consistency:**
- `runVaultScan()` defined in Task 4, called in Task 5 — matches.
- `scanVault(awardXP: boolean)` defined in Task 3, called in Task 4 — matches.
- `hasVaultScanned` added to `PluginData` in Task 1, loaded in Task 4 — matches.
- `readingTagSkimmed / readingTagCompleted / readingTagUnprocessed` added in Task 1, used in Task 2 + 3 + 5 + 6 — matches.
- `onMetadataChange` rewritten in Task 6 preserves all existing snapshot fields used by Task 3 (`scanVault`) — matches.

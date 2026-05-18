import { XPEngine } from '../src/xp-engine';
import { PluginData } from '../src/types';
import { DEFAULT_SETTINGS } from '../src/constants';

const makeData = (): PluginData => ({
  totalXP: 0,
  level: 1,
  activities: [],
  snapshots: {},
  milestones: {},
  todayXP: 0,
  todayDate: new Date().toISOString().split('T')[0],
});

const makeSave = () => jest.fn().mockResolvedValue(undefined);

describe('XPEngine.getTierIndex', () => {
  it('returns 0 for levels 1–5', () => {
    const e = new XPEngine(makeData(), DEFAULT_SETTINGS, makeSave());
    expect(e.getTierIndex(1)).toBe(0);
    expect(e.getTierIndex(5)).toBe(0);
  });
  it('returns 1 for levels 6–10', () => {
    const e = new XPEngine(makeData(), DEFAULT_SETTINGS, makeSave());
    expect(e.getTierIndex(6)).toBe(1);
    expect(e.getTierIndex(10)).toBe(1);
  });
  it('returns 4 for level 25', () => {
    const e = new XPEngine(makeData(), DEFAULT_SETTINGS, makeSave());
    expect(e.getTierIndex(25)).toBe(4);
  });
});

describe('XPEngine.getTierName', () => {
  it('returns Spark for level 1', () => {
    const e = new XPEngine(makeData(), DEFAULT_SETTINGS, makeSave());
    expect(e.getTierName(1)).toBe('Spark');
  });
  it('returns Nova for level 21', () => {
    const e = new XPEngine(makeData(), DEFAULT_SETTINGS, makeSave());
    expect(e.getTierName(21)).toBe('Nova');
  });
});

describe('XPEngine.xpToNextLevel', () => {
  it('returns 300 for level 1', () => {
    const e = new XPEngine(makeData(), DEFAULT_SETTINGS, makeSave());
    expect(e.xpToNextLevel(1)).toBe(300);
  });
  it('returns 300 * N for level N', () => {
    const e = new XPEngine(makeData(), DEFAULT_SETTINGS, makeSave());
    expect(e.xpToNextLevel(7)).toBe(2100);
  });
});

describe('XPEngine.recalculateLevel', () => {
  it('stays at level 1 with 0 XP', () => {
    const data = makeData();
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    e.recalculateLevel();
    expect(data.level).toBe(1);
  });
  it('advances to level 2 with exactly 300 XP', () => {
    const data = { ...makeData(), totalXP: 300 };
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    e.recalculateLevel();
    expect(data.level).toBe(2);
  });
  it('advances to level 3 with 900 XP (300+600)', () => {
    const data = { ...makeData(), totalXP: 900 };
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    e.recalculateLevel();
    expect(data.level).toBe(3);
  });
  it('caps at level 25', () => {
    const data = { ...makeData(), totalXP: 9_999_999 };
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    e.recalculateLevel();
    expect(data.level).toBe(25);
  });
});

describe('XPEngine.awardXP', () => {
  it('adds XP to total and today', async () => {
    const data = makeData();
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    await e.awardXP(50, 'paper-completed', 'Test paper');
    expect(data.totalXP).toBe(50);
    expect(data.todayXP).toBe(50);
  });
  it('calls save callback', async () => {
    const save = makeSave();
    const e = new XPEngine(makeData(), DEFAULT_SETTINGS, save);
    await e.awardXP(10, 'atomic-note-created', 'Note');
    expect(save).toHaveBeenCalledTimes(1);
  });
  it('adds activity entry with filePath', async () => {
    const data = makeData();
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    await e.awardXP(30, 'atomic-note-created', 'My note', 'path/note.md');
    expect(data.activities).toHaveLength(1);
    expect(data.activities[0]).toMatchObject({ xp: 30, filePath: 'path/note.md', type: 'atomic-note-created' });
  });
  it('caps activity log at MAX_ACTIVITIES_LOG (500)', async () => {
    const data = makeData();
    data.activities = Array(500).fill({ timestamp: 0, type: 'manual-log', xp: 1, label: 'x' });
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    await e.awardXP(1, 'manual-log', 'extra');
    expect(data.activities).toHaveLength(500);
  });
  it('resets todayXP on a new day', async () => {
    const data = { ...makeData(), todayXP: 100, todayDate: '2000-01-01' };
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    await e.awardXP(10, 'manual-log', 'test');
    expect(data.todayXP).toBe(10); // reset to 0, then +10
  });
});

describe('XPEngine.getProgressBar', () => {
  it('returns all empty segments at level 1 with 0 XP', () => {
    const data = makeData();
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    expect(e.getProgressBar(6)).toBe('░░░░░░');
  });
  it('returns 3 filled segments at exactly 50% progress', () => {
    const data = { ...makeData(), totalXP: 150 }; // 150/300 = 50%, level stays 1
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    e.recalculateLevel();
    expect(e.getProgressBar(6)).toBe('███░░░');
  });
});

describe('XPEngine.completeMilestone', () => {
  it('awards milestone XP and marks it completed', async () => {
    const data = makeData();
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    await e.initMilestoneRecord('Efforts/proj.md', 'conference');
    const xp = await e.completeMilestone('Efforts/proj.md', 'Abstract submitted');
    expect(xp).toBe(50);
    expect(data.totalXP).toBe(50);
    expect(data.milestones['Efforts/proj.md'].milestones[0].completedAt).toBeDefined();
  });
  it('returns 0 for unknown milestone', async () => {
    const data = makeData();
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    await e.initMilestoneRecord('Efforts/proj.md', 'conference');
    const xp = await e.completeMilestone('Efforts/proj.md', 'Nonexistent milestone');
    expect(xp).toBe(0);
  });
  it('returns 0 for already completed milestone', async () => {
    const data = makeData();
    const e = new XPEngine(data, DEFAULT_SETTINGS, makeSave());
    await e.initMilestoneRecord('Efforts/proj.md', 'conference');
    await e.completeMilestone('Efforts/proj.md', 'Abstract submitted');
    const xp = await e.completeMilestone('Efforts/proj.md', 'Abstract submitted');
    expect(xp).toBe(0);
    expect(data.totalXP).toBe(50); // no double award
  });
});

export type ActivityType =
  | 'paper-skimmed'
  | 'paper-completed'
  | 'atomic-note-created'
  | 'atomic-note-developed'
  | 'writing-progress'
  | 'milestone-completed'
  | 'manual-log'
  | 'career-init'
  | 'daily-presence';

export interface ActivityEntry {
  timestamp: number;
  type: ActivityType;
  xp: number;
  label: string;
  filePath?: string;
}

export interface FileSnapshot {
  wordCount: number;
  linkCount: number;
  keywords: string[];
  peakWordCount: number;
  lastDevelopmentAt?: number;
  dailyWritingDate?: string;
  dailyWritingStart?: number;
  writingBonusAwarded?: boolean;
}

export interface MilestoneItem {
  name: string;
  xp: number;
  completedAt?: number;
}

export interface MilestoneRecord {
  projectType: string;
  filePath: string;
  milestones: MilestoneItem[];
}

export interface ManualActivity {
  name: string;
  xp: number;
}

export interface MilestoneTemplate {
  name: string;
  xp: number;
}

export interface ProjectTemplate {
  milestones: MilestoneTemplate[];
}

export interface XPSettings {
  sourcesFolder: string;
  ideasFolder: string;
  projectsFolder: string;
  atomTag: string;
  readingStatusField: string;
  readingTagUnprocessed: string;
  readingTagSkimmed: string;
  readingTagCompleted: string;
  atomNoteTagField: string;
  projectTagField: string;
  projectTags: Record<string, string>;
  xpPaperSkimmed: number;
  xpPaperCompleted: number;
  xpAtomicNoteCreated: number;
  xpAtomicNoteDeveloped: number;
  xpWritingProgressPer100Words: number;
  writingProgressWordThreshold: number;
  atomicDevelopmentWordThreshold: number;
  atomicDevelopmentCooldownMinutes: number;
  xpWritingSessionBonus: number;
  writingSessionBonusThreshold: number;
  xpDailyPresence: number;
  projectTemplates: Record<string, ProjectTemplate>;
  manualActivities: ManualActivity[];
  tierNames: string[];
  statusBarIcon: string;
}

export type AchievementCondition =
  | { type: 'totalXP'; xp: number }
  | { type: 'level'; level: number }
  | { type: 'activityCount'; activityType: ActivityType; count: number }
  | { type: 'milestoneLabel'; label: string };

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
}

export interface PluginData {
  totalXP: number;
  level: number;
  activities: ActivityEntry[];
  snapshots: Record<string, FileSnapshot>;
  milestones: Record<string, MilestoneRecord>;
  todayXP: number;
  todayDate: string;
  hasOnboarded?: boolean;
  unlockedAchievements: Record<string, number>;
  archivedProjects: string[];
  lastPresenceDate?: string;
  currentStreak?: number;
  hasVaultScanned?: boolean;
}

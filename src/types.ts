import { AvatarTheme } from './tier-avatars';

export type ActivityType =
  | 'paper-skimmed'
  | 'paper-completed'
  | 'atomic-note-created'
  | 'atomic-note-developed'
  | 'writing-progress'
  | 'milestone-completed'
  | 'manual-log'
  | 'career-init'
  | 'daily-presence'
  | 'vault-scan';

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
  completedAt?: number;
  skimmedAt?: number;
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
  builtin?: boolean;
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

export interface OnboardingData {
  // Credentials
  phd: boolean;
  masters: boolean;
  postdocs: number;
  // Publications
  authoredBooks: number;
  editedVolumes: number;
  firstAuthorPapers: number;
  coAuthorPapers: number;
  softwareDatasets: number;
  // Grants & patents
  grantsPI: number;
  grantsCoI: number;
  patents: number;
  // Recognition
  invitedTalks: number;
  conferenceTalks: number;
  majorAwards: number;
  // Supervision & service
  phdStudents: number;
  mastersStudents: number;
  peerReviews: number;
  thesesExamined: number;
  editorialRoles: number;
  // Avatar (set on first onboarding only)
  avatarTheme: AvatarTheme;
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
  avatarTheme?: string;
  careerData?: OnboardingData;
}

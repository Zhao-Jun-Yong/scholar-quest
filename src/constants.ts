import { XPSettings, MilestoneTemplate } from './types';

export const READING_EMOJIS = {
  unprocessed: '📥',
  skimmed: '👀',
  completed: '✅',
};

export const TIER_LEVEL_RANGES = [
  { min: 1,  max: 4  },  // T1  Hatchling
  { min: 5,  max: 8  },  // T2  Crack
  { min: 9,  max: 12 },  // T3  Glow
  { min: 13, max: 16 },  // T4  Hatch
  { min: 17, max: 20 },  // T5  Sprig
  { min: 21, max: 24 },  // T6  Flare
  { min: 25, max: 28 },  // T7  Blaze
  { min: 29, max: 32 },  // T8  Inferno
  { min: 33, max: 36 },  // T9  Drake
  { min: 37, max: 40 },  // T10 Wyrm
  { min: 41, max: 44 },  // T11 Dragon
  { min: 45, max: 48 },  // T12 Nova
];

export const MAX_ACTIVITIES_LOG = 500;

export const DEFAULT_MILESTONE_TEMPLATES: Record<string, MilestoneTemplate[]> = {
  manuscript: [
    { name: 'Outline drafted', xp: 50 },
    { name: 'Introduction written', xp: 80 },
    { name: 'Methods written', xp: 80 },
    { name: 'Results written', xp: 100 },
    { name: 'Discussion written', xp: 100 },
    { name: 'Full first draft complete', xp: 150 },
    { name: 'Revision round', xp: 100 },
    { name: 'Submitted', xp: 200 },
    { name: 'Accepted', xp: 300 },
  ],
  conference: [
    { name: 'Abstract submitted', xp: 50 },
    { name: 'Abstract accepted', xp: 30 },
    { name: 'Slides / poster prepared', xp: 100 },
    { name: 'Talk / poster delivered', xp: 150 },
  ],
  'invited-talk': [
    { name: 'Invitation accepted', xp: 30 },
    { name: 'Abstract / title submitted', xp: 30 },
    { name: 'Slides prepared', xp: 80 },
    { name: 'Talk delivered', xp: 150 },
  ],
  'peer-review': [
    { name: 'Review completed', xp: 100 },
    { name: 'Resubmission reviewed', xp: 60 },
  ],
  grant: [
    { name: 'Specific aims drafted', xp: 100 },
    { name: 'Background written', xp: 80 },
    { name: 'Methods written', xp: 100 },
    { name: 'Budget prepared', xp: 50 },
    { name: 'Submitted', xp: 200 },
    { name: 'Awarded', xp: 300 },
  ],
  report: [
    { name: 'Data / results compiled', xp: 50 },
    { name: 'First draft written', xp: 100 },
    { name: 'Revised draft', xp: 60 },
    { name: 'Submitted', xp: 100 },
  ],
  thesis: [
    { name: 'Chapter outline', xp: 50 },
    { name: 'First draft', xp: 150 },
    { name: 'Revised draft', xp: 100 },
    { name: 'Submitted to supervisor', xp: 80 },
    { name: 'Defended', xp: 300 },
  ],
  data: [
    { name: 'Protocol written', xp: 60 },
    { name: 'Ethics / permits approved', xp: 50 },
    { name: 'Data collection complete', xp: 100 },
    { name: "Data cleaned / QC'd", xp: 80 },
    { name: 'Dataset archived', xp: 50 },
  ],
  software: [
    { name: 'Requirements documented', xp: 50 },
    { name: 'First working prototype', xp: 100 },
    { name: 'Tests written', xp: 60 },
    { name: 'Documentation written', xp: 60 },
    { name: 'Released / published', xp: 150 },
  ],
  teaching: [
    { name: 'Course outline drafted', xp: 50 },
    { name: 'All lectures prepared', xp: 100 },
    { name: 'Course delivered', xp: 100 },
    { name: 'Student feedback reviewed', xp: 30 },
  ],
  workshop: [
    { name: 'Proposal / abstract submitted', xp: 50 },
    { name: 'Program finalised', xp: 80 },
    { name: 'Workshop delivered', xp: 150 },
  ],
  supervision: [
    { name: 'Initial meeting held', xp: 20 },
    { name: 'Research proposal reviewed', xp: 60 },
    { name: 'Progress meeting held', xp: 30 },
    { name: 'Thesis / report read', xp: 80 },
    { name: 'Defense / submission supported', xp: 100 },
  ],
  service: [
    { name: 'Role accepted', xp: 20 },
    { name: 'First contribution delivered', xp: 60 },
    { name: 'Term / cycle completed', xp: 80 },
  ],
  'research-program': [
    { name: 'Kickoff / inception report', xp: 50 },
    { name: 'Progress report 1 submitted', xp: 80 },
    { name: 'Progress report 2 submitted', xp: 80 },
    { name: 'Final report submitted', xp: 150 },
    { name: 'Program completed / renewed', xp: 200 },
  ],
  outreach: [
    { name: 'Concept / pitch prepared', xp: 40 },
    { name: 'Content created', xp: 80 },
    { name: 'Activity delivered / published', xp: 100 },
  ],
};

import { AchievementDef } from './types';

export const ACHIEVEMENTS: AchievementDef[] = [
  // First steps
  { id: 'first-xp',        name: 'First Steps',        icon: '🌱', description: 'Earn your first XP',                      condition: { type: 'totalXP', xp: 1 } },
  { id: 'first-note',      name: 'First Idea',          icon: '💡', description: 'Create your first atomic note',           condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 1 } },
  { id: 'first-paper',     name: 'First Read',          icon: '📖', description: 'Complete your first paper',               condition: { type: 'activityCount', activityType: 'paper-completed', count: 1 } },
  { id: 'first-milestone', name: 'Milestone Unlocked',  icon: '🏁', description: 'Complete your first project milestone',   condition: { type: 'activityCount', activityType: 'milestone-completed', count: 1 } },
  // Quantity
  { id: 'notes-25',        name: 'Idea Machine',        icon: '🧠', description: 'Create 25 atomic notes',                  condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 25 } },
  { id: 'notes-100',       name: 'Deep Thinker',        icon: '🔬', description: 'Create 100 atomic notes',                 condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 100 } },
  { id: 'papers-10',       name: 'Bookworm',            icon: '📚', description: 'Complete 10 papers',                      condition: { type: 'activityCount', activityType: 'paper-completed', count: 10 } },
  { id: 'milestones-10',   name: 'On a Roll',           icon: '🎯', description: 'Complete 10 project milestones',          condition: { type: 'activityCount', activityType: 'milestone-completed', count: 10 } },
  { id: 'milestones-25',   name: 'Overachiever',        icon: '🚀', description: 'Complete 25 project milestones',          condition: { type: 'activityCount', activityType: 'milestone-completed', count: 25 } },
  // Level
  { id: 'level-5',         name: 'Ember',               icon: '🔥', description: 'Reach Level 5',                          condition: { type: 'level', level: 5 } },
  { id: 'level-10',        name: 'Flame',               icon: '🌟', description: 'Reach Level 10',                         condition: { type: 'level', level: 10 } },
  { id: 'level-15',        name: 'Beacon',              icon: '💫', description: 'Reach Level 15',                         condition: { type: 'level', level: 15 } },
  { id: 'level-20',        name: 'Nova',                icon: '⭐', description: 'Reach Level 20',                         condition: { type: 'level', level: 20 } },
  { id: 'level-25',        name: 'Transcendent',        icon: '✨', description: 'Reach the maximum level',                condition: { type: 'level', level: 25 } },
  // XP
  { id: 'xp-1000',         name: 'Getting Warmed Up',   icon: '⚡', description: 'Earn 1,000 XP',                          condition: { type: 'totalXP', xp: 1000 } },
  { id: 'xp-5000',         name: 'In the Zone',         icon: '💪', description: 'Earn 5,000 XP',                          condition: { type: 'totalXP', xp: 5000 } },
  { id: 'xp-20000',        name: 'Veteran',             icon: '🏆', description: 'Earn 20,000 XP',                         condition: { type: 'totalXP', xp: 20000 } },
  // Specific academic milestones (match "Milestone: <label>")
  { id: 'submitted',       name: 'Under Review',        icon: '📬', description: 'Submit a manuscript or grant',           condition: { type: 'milestoneLabel', label: 'Submitted' } },
  { id: 'accepted',        name: 'Accepted!',           icon: '🎉', description: 'Get a manuscript accepted',              condition: { type: 'milestoneLabel', label: 'Accepted' } },
  { id: 'awarded',         name: 'Funded!',             icon: '💰', description: 'Win a grant',                            condition: { type: 'milestoneLabel', label: 'Awarded' } },
  { id: 'defended',        name: 'Doctor!',             icon: '🎓', description: 'Defend your thesis',                     condition: { type: 'milestoneLabel', label: 'Defended' } },
  { id: 'talk-delivered',  name: 'On Stage',            icon: '🎤', description: 'Deliver an invited talk',                condition: { type: 'milestoneLabel', label: 'Talk delivered' } },
];

export const TIER_ICONS: string[] = ['🥚','🥚','🥚','🥚','🐣','🐣','🐣','🐣','🐉','🐉','🐉','🐉'];

export const ONBOARDING_XP = {
  phd: 1000,
  masters: 400,
  authoredBook: 1200,
  firstAuthorPaper: 500,
  coAuthorPaper: 150,
  grantPI: 600,
  grantCoI: 200,
  invitedTalk: 200,
  conferenceTalk: 100,
  phdStudentSupervised: 300,
  mastersStudentSupervised: 150,
  peerReview: 80,
};

export const DEFAULT_SETTINGS: XPSettings = {
  sourcesFolder: 'Atlas/Sources',
  ideasFolder: 'Atlas/Ideas',
  projectsFolder: 'Efforts',
  atomTag: 'cards/atom',
  projectTags: {
    manuscript: 'project/manuscript',
    conference: 'project/conference',
    'invited-talk': 'project/invited-talk',
    'peer-review': 'project/peer-review',
    grant: 'project/grant',
    report: 'project/report',
    thesis: 'project/thesis',
    data: 'project/data',
    software: 'project/software',
    teaching: 'project/teaching',
    workshop: 'project/workshop',
    supervision: 'project/supervision',
    service: 'project/service',
    outreach: 'project/outreach',
    'research-program': 'project/research-program',
  },
  xpPaperSkimmed: 20,
  xpPaperCompleted: 50,
  xpAtomicNoteCreated: 30,
  xpAtomicNoteDeveloped: 10,
  xpWritingProgressPer100Words: 10,
  writingProgressWordThreshold: 100,
  atomicDevelopmentWordThreshold: 50,
  atomicDevelopmentCooldownMinutes: 60,
  projectTemplates: Object.fromEntries(
    Object.entries(DEFAULT_MILESTONE_TEMPLATES).map(([k, v]) => [
      k,
      { milestones: v.map(m => ({ ...m })) },
    ])
  ),
  builtinActivities: [
    { name: 'Data analysis session', xp: 40 },
    { name: 'Lab / fieldwork session', xp: 40 },
  ],
  customActivities: [],
  tierNames: ['Hatchling','Crack','Glow','Hatch','Sprig','Flare','Blaze','Inferno','Drake','Wyrm','Dragon','Nova'],
  statusBarIcon: '⚗️',
};

import { XPSettings, MilestoneTemplate } from './types';

export const READING_EMOJIS = {
  unprocessed: '📥',
  skimmed: '👀',
  completed: '✅',
};

export const TIER_LEVEL_RANGES = [
  { min: 1, max: 5 },
  { min: 6, max: 10 },
  { min: 11, max: 15 },
  { min: 16, max: 20 },
  { min: 21, max: 25 },
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
  outreach: [
    { name: 'Concept / pitch prepared', xp: 40 },
    { name: 'Content created', xp: 80 },
    { name: 'Activity delivered / published', xp: 100 },
  ],
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
  tierNames: ['Spark', 'Ember', 'Flame', 'Beacon', 'Nova'],
  statusBarIcon: '⚗️',
};

import { ManualActivity, XPSettings, MilestoneTemplate } from './types';

export const MAX_MANUAL_ACTIVITY_XP = 200;
export const MAX_MILESTONE_XP = 300;
export const MAX_USER_MILESTONE_XP = 200;

// Diminishing returns for atomic note creation XP within a single day.
// todayCount is the number of atomic-note-created entries already logged today
// *before* the current award. Returns the XP to award for the next note.
export const ATOMIC_NOTE_XP_TIERS: { threshold: number; divisor: number }[] = [
  { threshold: 10, divisor: 1 },   // notes 1–10:  full XP (÷1)
  { threshold: 30, divisor: 2 },   // notes 11–30: half XP (÷2)
  { threshold: Infinity, divisor: 6 }, // notes 31+:  trickle (÷6)
];

export interface CatalogActivity {
  name: string;
  xp: number;
  category: string;
}

export const MANUAL_ACTIVITY_CATALOG: CatalogActivity[] = [
  // Wet lab & experimental
  { category: 'Wet lab & experimental', name: 'Lab / fieldwork session', xp: 40 },
  { category: 'Wet lab & experimental', name: 'Fieldwork / sample collection session', xp: 50 },
  { category: 'Wet lab & experimental', name: 'Instrumentation / equipment run', xp: 30 },
  { category: 'Wet lab & experimental', name: 'Protocol development or optimization', xp: 35 },
  { category: 'Wet lab & experimental', name: 'Animal care / husbandry session', xp: 20 },

  // Computational & data
  { category: 'Computational & data', name: 'Data analysis / coding session', xp: 40 },
  { category: 'Computational & data', name: 'Data cleaning / QC session', xp: 35 },
  { category: 'Computational & data', name: 'Bioinformatics or pipeline setup', xp: 40 },
  { category: 'Computational & data', name: 'Database or registry curation session', xp: 30 },
  { category: 'Computational & data', name: 'Simulation setup and run', xp: 35 },
  { category: 'Computational & data', name: 'Code review / refactor session', xp: 25 },

  // Meetings & communication
  { category: 'Meetings & communication', name: 'Research or lab meeting', xp: 20 },
  { category: 'Meetings & communication', name: 'Supervision meeting', xp: 30 },
  { category: 'Meetings & communication', name: 'Collaboration / co-investigator meeting', xp: 25 },
  { category: 'Meetings & communication', name: 'Journal club session', xp: 25 },
  { category: 'Meetings & communication', name: 'Department seminar attended', xp: 20 },
  { category: 'Meetings & communication', name: 'Advisory or stakeholder meeting', xp: 30 },
  { category: 'Meetings & communication', name: 'Ethics / IRB committee meeting', xp: 25 },
  { category: 'Meetings & communication', name: 'Conference day', xp: 50 },
  { category: 'Meetings & communication', name: 'Online conference / symposium attended', xp: 35 },

  // Teaching & mentoring
  { category: 'Teaching & mentoring', name: 'Lecture or class delivered', xp: 50 },
  { category: 'Teaching & mentoring', name: 'Tutorial / lab practical facilitated', xp: 35 },
  { category: 'Teaching & mentoring', name: 'Assignment marking / grading session', xp: 30 },
  { category: 'Teaching & mentoring', name: 'Student advising session', xp: 20 },
  { category: 'Teaching & mentoring', name: 'Mentoring session (informal)', xp: 20 },
  { category: 'Teaching & mentoring', name: 'Office hours held', xp: 15 },
  { category: 'Teaching & mentoring', name: 'Exam or assessment preparation', xp: 25 },

  // Service & editorial
  { category: 'Service & editorial', name: 'Grant or fellowship panel review session', xp: 40 },
  { category: 'Service & editorial', name: 'Journal editorial work session', xp: 35 },
  { category: 'Service & editorial', name: 'Conference organising work session', xp: 25 },
  { category: 'Service & editorial', name: 'Committee meeting attended', xp: 20 },
  { category: 'Service & editorial', name: 'Administrative / compliance task session', xp: 15 },

  // Outreach & public engagement
  { category: 'Outreach & public engagement', name: 'Public talk or outreach event delivered', xp: 50 },
  { category: 'Outreach & public engagement', name: 'Science communication writing session', xp: 30 },
  { category: 'Outreach & public engagement', name: 'School or community outreach visit', xp: 40 },
  { category: 'Outreach & public engagement', name: 'Media interview or press engagement', xp: 30 },
  { category: 'Outreach & public engagement', name: 'Social media science communication', xp: 15 },

  // Professional development
  { category: 'Professional development', name: 'Workshop or short course attended', xp: 35 },
  { category: 'Professional development', name: 'Online training / webinar attended', xp: 20 },

  // Participant & clinical research
  { category: 'Participant & clinical research', name: 'Participant recruitment / screening session', xp: 25 },
  { category: 'Participant & clinical research', name: 'Clinical or assessment session', xp: 40 },
  { category: 'Participant & clinical research', name: 'Research interview conducted', xp: 35 },
  { category: 'Participant & clinical research', name: 'Focus group facilitated', xp: 40 },
  { category: 'Participant & clinical research', name: 'Survey administration session', xp: 20 },

  // Literature & library work
  { category: 'Literature & library work', name: 'Systematic literature search session', xp: 30 },
  { category: 'Literature & library work', name: 'Reference manager curation session', xp: 15 },
  { category: 'Literature & library work', name: 'Preprint / rapid reading sweep', xp: 20 },

  // Writing (outside tracked manuscript files)
  { category: 'Writing (off-vault)', name: 'Ethics or IRB application writing session', xp: 35 },
  { category: 'Writing (off-vault)', name: 'Response to reviewers drafting session', xp: 40 },
  { category: 'Writing (off-vault)', name: 'Data management plan writing session', xp: 25 },
  { category: 'Writing (off-vault)', name: 'Preregistration drafting session', xp: 35 },
  { category: 'Writing (off-vault)', name: 'Policy brief or technical report writing session', xp: 35 },
];

export const DEFAULT_MANUAL_ACTIVITIES: ManualActivity[] = [
  { name: 'Research or lab meeting',          xp: 20 },
  { name: 'Lab / fieldwork session',           xp: 40 },
  { name: 'Data analysis / coding session',    xp: 40 },
  { name: 'Systematic literature search session', xp: 30 },
  { name: 'Conference day',                    xp: 50 },
];


export const TIER_LEVEL_RANGES = [
  { min: 1,  max: 5  },  // T1  Dormant
  { min: 6,  max: 10 },  // T2  Stirring
  { min: 11, max: 15 },  // T3  Kindling
  { min: 16, max: 20 },  // T4  Breaking
  { min: 21, max: 25 },  // T5  Wisp
  { min: 26, max: 30 },  // T6  Flicker
  { min: 31, max: 35 },  // T7  Blaze
  { min: 36, max: 40 },  // T8  Inferno
  { min: 41, max: 45 },  // T9  Drake
  { min: 46, max: 50 },  // T10 Wyrm
  { min: 51, max: 55 },  // T11 Dragon
  { min: 56, max: 60 },  // T12 Nova
];

export const MAX_ACTIVITIES_LOG = 500;

const RAW_MILESTONE_TEMPLATES: Record<string, Omit<MilestoneTemplate, 'builtin'>[]> = {
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

export const DEFAULT_MILESTONE_TEMPLATES: Record<string, MilestoneTemplate[]> = Object.fromEntries(
  Object.entries(RAW_MILESTONE_TEMPLATES).map(([type, milestones]) => [
    type,
    milestones.map(m => ({ ...m, builtin: true as const })),
  ])
);

import { AchievementDef } from './types';

export const ACHIEVEMENTS: AchievementDef[] = [
  // First steps
  { id: 'first-xp',        name: 'First Steps',        icon: `<img src="data:image/png;base64,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" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Earn your first XP',                      condition: { type: 'totalXP', xp: 1 } },
  { id: 'first-note',      name: 'First Idea',          icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADiUlEQVR4nO2WX2gcVRTGfzN3Zrdks3aJKFKzqaFRgy22iP+qEIxWUaQRTGOE+NDYF22Rqm0NpiDUP5UapHnri6VI0oqCKNj1RUUsFW0FFZPWJiq63dA2axOJJcnO7My9PsxmttNkM7srPpkP5uHcc+73fXPvnXsGlvB/h1bNJCdzQClbzRs3V22tmK/sCVb6oDJ1HUnOH5szYZg2rhZFKIvZuiZ0ZbEs3l4Wd1lF1tiAMpUDQPyWrThoDO17IVCzZlcf1o9vAZBruAHDzmHGnwzlDy2QmUMKYOb8GKnDJ2lpjnPN+nigRpcOUgpsyyXx0AB/n9gPK69DkA81oZcj7kyOkzp8kvbuFfPEfaLGNiLCYfarThL3vgjpC2HvFm7AtWfRclPU3vMK7d0r5uVV/cPeI22P7MYOANIDrV5BdhInc2D+aS3HwOUTj725oTCoAsJz0Bo7i6aMGoRSXHWXd0YW+lrKMjCHZbf1cntL0gsMLSAMIERhi3UH0h+hmwKAc0daw6jDDRimXQwc5a/AguLSgMaNANQ1rcLVvJw0otUbADDEwof4WOpTptK/+/Gp4+8HzSnli1vpgyX3wSiVEMoqBo5C112kFL54a9ujgfrVLe2B2NTMUtQBhK7AQrhSfA6amQdg5lwWZS6+9KEGtIbnNaXPcGl4N6eGRr1i3UWcPQrAzm397NzWD8DmLX1oZh7318/JX5zEjBhcu+kThG6Xoi/qLJaUY3sVQM3qPcx8+VQgp6TNS2+P0rdrDVIv7GTO6xPnj/9A/I6nidVH0CIaRvLZkjqLboFe36sBTA/3UNM6iJK2f+ns2PsT+3as9cV16fWKi9//TN2tm4klJ5CJ5YuKhxq40kTsgQ/8t+95LIltudzX/QW6dFDSZmLkFxLrOog0/YVc3hxGXZ4BAJF8VdO1HELqjI9kGR/J0tF/hvzEOKk9zWRP/8afZzLkhYu4qckXj17d9e+74eXInX5O9b4+RGfXgwCsW9uAtDSmJqYRyuT6+5/h0tlDZYtXbAAglogpXFkcEDqOq1CFM2BP2xVxVnwP3H1nM4OvbeHlrjbGvhnkwrfvsn/74+iGRua7DyulK30TlsLXJ4ZpqL0ZEGzveQ+AN3ZvZPSPHCvXb/rvDQAc+exjAH/Za2OyEIuKuar6K47Ga9QTGx4hitdjIia8kzpa8f5XbQAgEosEOlw14ktYAsA/0Y9Q/1k5uBAAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Create your first atomic note',           condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 1 } },
  { id: 'first-paper',     name: 'First Read',          icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWElEQVR4nO1WPWsUQRh+dnbmLglBQVFiRAvBCDZ+VCoiKqa+xlpIoZVlrLQVQf0LcmBtkBRWKYSAwdqvQuUOFYKeUSFwurszu2NxmZ2ZnZn7iHa5B47bmX2f933eZz5YYIwxdjoiz5zcJndbPCfJ8t1LAABKeq/2zuxxMrx/18G1B6vW3OM7V3Dk8G5QZqf8tv6jzFVjMeYXV6y6xCx+//pJUBKVhBDmju/Ho8WzmDtxqlf81gVvcbORGovLWBhumQIwkeuhKCRE4bpagPcVV42p5uDS5tMqWREat58DANaaDZxbWLZiXjav9mJF7hQ/s/CkfF5rNso8Kw/nvWIdAQrP7l0GABCwsiCl2iEWMS9PxSqECiuQ0AtRSKRpDkpJWViIAkIU3njf+gMAm5i2xt0ks3khAco6BbMzJSLNNF1wifM3lhzOxZtP+7oQFKCO477ZXSBgKMDLfxMHj57uJWKRd6nUUo4swIQqahZXuznPxUB+xt3NquDsgakD0wDn+hdAPdfFieAQXB+30D7xYaADYqsIjYcya2QRTtac+690MYTVgkvnNJgXESURktReDv8xzDLvdBWx4YrIilJEUKDnZg37OkhEEd5YJnLeExYzf6+jLey/gHPkiJ1pS1b2x+3qV+u7M/f5tZ772nrluCG4hOAS659cbvI7tcaOA5vtDdQNWZ12hE57oxIVYXKGgE5q+ovVjwCAekzAULOiDx2bcoQEBXxodcvnbKszmbhHKt9MAMwCAN5+6aJGpMGx74+fb3TOuF5tRWPYT6r/hf5fPWOMsWPwF3j77NpM+dRvAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete your first paper',               condition: { type: 'activityCount', activityType: 'paper-completed', count: 1 } },
  { id: 'first-milestone', name: 'Milestone Unlocked',  icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACZ0lEQVR4nO2WS2sTURSAv/tIJpNOaGJbXyCFloq/wSpaWhBcuxDc+QPcaXeCS5fuxD+hWHEjFsGVIi6FIm1pRAVb00fSRzJz73GR1lqtzUgbgpBvNQNnzvnmnjOHgS5d/gfu3b8rthTJw0cPRPXkhVwo5EJRPXkxUUE21pakrQK2FMn41ctSq31pFtsWaGwtSrK5LBu1yh6xHTnVk28pptMIXBo9z8vpN0jisNpjrMVYC4B3MVmjfsbWF2doVGZTv1wqgYtjFzAapl4/JTw+SLw6z+bSHMHAEOHJ4T/ijVZoZTA2aJnbpjX1SnHj+m20tkgcYzMZ8A4PBH2nqcy9AyB35hw6MVSXy2QTsGHpwLypTmAHcYJLkuY1CeKaLfbGQiIoseBMM9glNFzr2UwlYLVBi9CozNJYWiDbf5Zs7whufR63Vmbt0wem375CW7/nuXx0TP0l5W7uNAI7GK1QgcYr0AKu7jE6Jsgart28AzG4tTJJLAQDQ5ioIK5WPVAilcBW4vFKYfuG0SLUK2WSxBCcGEQLbH6bAWcQl+zOB6BM6/TpTiD+pd8ZCz4mayyY5hCG/cOsLrzHJ5rg1AgSK9aXy6i6JYwKRyCQ+S3MWxoIxNu3xuLqDmU0TjwoA/UjXI62FDU33D5MvXgmJirIytcZ+V7+KKqYF1UoyGatKrXllaPZhJOTt1Bm/1nKqhzPnzzGB0VssZ+V8mekWlVhVFBRqXi0X8F+XJmYaFnkIP5pEbWD1AJamc4JqEx7iqcWSMTgxXVOADrcAgB/qFk/pIAVg27TX19LAdtbEoDR8bH2GHTp0ml+AK6U92lzf2pCAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete your first project milestone',   condition: { type: 'activityCount', activityType: 'milestone-completed', count: 1 } },
  { id: 'writing-first',   name: 'First Draft',         icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAAAAAAAAPlDu38AAAAHdElNRQfqBRMFKApKBGAaAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTA1LTE5VDA0OjIyOjQ2KzAwOjAwYYBM/wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0wNS0xOVQwNDoyMjo0NiswMDowMBDd9EMAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjYtMDUtMTlUMDU6NDA6MTArMDA6MDBdLi05AAAE2klEQVRYw+2Wa2xTZRzGn/fc2p5WOmZ36aDsCnRMbsqUzAhME5MpghhQUUOM4RswAcUPXjA6TQwCCoKiBAdKlLHFGyiGAGNcQqIQBAYBd2nXjdKut/Wybu055339oBBNZO1G+cbz6Xw45//8/s//vRzgjjIoQS9B0EujBL10Rmc0vA4AZ06f5of8JpMA9du//OeJaaPvtiyxWq33QlP1AOZmHICIPJiigdeJqHunDvOemAeDQUZJcWHC6/WpoXB4YjQaMfDAvtuSAFM0ANBrCWWKoipGAJ0dXS5PIBSaxRjLAgCO409u3rRheUYBrneeY81DIpHI1ev1u4yy0U5A1ltzc34eGBzcTQjJ5TgOyUTCcPhoSy6A3ownsGnDRpQUF4PjeFljDDzPvZg9yvxkj8eTQylFviUXJ463VHu8nmYAFbcMcPDIIQDAqVOn8PYbby3csbN+7i8/7TeIopjd1tEBwohFr9dbCvLzQFWKbLMZFeWT2gVeqFeRzNgIpNmzZ9e8vGrla9a8/Epfrx8gBN3dbvAcD6NBhjnLDFEQcPzECbRebHUM9se3DlUwLQBOJnB1u1A952Ghrb1tUe2yFSZZJzs7nc6ieHwA13p9MJmMiEajuMtkQoJS7DuwP7Tpo487wYEDBb1ZbZIuAI0zrqS8WP/5lu3migmTVH8wsCAUDn926XI7d/+M6SgrLQYBAWWU9XR1a86urjfnznt8IwROgXpT/2GNwB4MBjfwjMiqoiZ5js+32yeQceNsGJ2dBaNRRjweh8ftjSeU5KtFYwsbFz39jNL0fRPYrYyAk2+EpANQzcB0wVAfOhwOFMRimDK5HNFYP8J9feh0OLBz1y7B5XL9VjWzKrC6dhUa9zYMWT+tBAghNnDsUUVVNBBA0klQVAXuq25MKCsBYxoikQhcLlf/3sa9Bwai/dHmQ4fx/nt1qcebhj00jT4lmcQPbGNssqZR5ORYUDljOuz28aBgULUEVG0gYRs35tCnW7csTaqDbUTkU5dOR6JJAIBV0yqnspbDR1hjQxPb/kU9O3jwCPP5fOzsH+fYoucWsvH3lO5we90WxhhZ++5apAuQMgHKKADwgiCgqLAI06dNQ1lpCQw6CdFIFKqShMfjQVtrR+yVNav9R483s+o5c67fFSmVcg0wxgCgZeyYsTs1TVtskA26goJ8nL9wDvt+/TFcPat6jyRJUQDHGpoa8O1Xe4aVcOoE4gwAOiaW2k9qjKq+gB9JNYl2RzvWbfwwUlPzWJ2jy7EGKa7dEQFwMoE5ywzCkcUtx1q2uT3XDBpFGITzE0IigsgHIIBzdjn/DTsspRxB7bMvoKTAJnZ6eviVa2pj91XOXLZ5/Sen8fe5kATgHUnnaQFIgg5127a+NP+RqiWFuXm4eOmidPb381c0Vb0ysWz8rfimB8AYXTpzRsVykadTvQFXQK/TfZdU4oHd33wNJabceI+qw4/+uobcrLyOPzP/oQfz7TYrQn3B1qryoucLLFm9f171gSZpuh4jT0DgOVx2tiMWMiERiw94+uOcOPJm/1dD7oKaBybD7Q+i+fyVH0RCVlCN9jNK/xP/bQXo6Q3Rvli8weHyr+sJxy4QQjRC0vqFyIyIgVOJgVvAyTxEk3hbPIZcA4QwABABBiWW3tl+R8PVX5+nFea3nryZAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Make your first writing progress',                              condition: { type: 'activityCount', activityType: 'writing-progress', count: 1 } },
  // Quantity — notes
  { id: 'notes-25',        name: 'Prolific',            icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEkklEQVR4nO2WS2yUVRTHf+d+0yJFpIRaCm2KYCuPWh9xoyEqK1cmrkzU+GqMGo2AISaaGIMKhkcQQUg0cYEbNya4EBN8g0QUV0ofM7UtUat0Z6DyCDrfOcfFnX6d6UwruIWbTGbud+85///5/8/c78KVcbkPuYS9Xj5JEBSXWmuXkvtiNjnA4cdei8AhhqzZtxEALWH3Pr03C/hbitz+7oaJ9Rkx/ouAH+3ZAkVj1ZI21A0LAYDvC3nu278NgL6e3Xh9QkfbQsxiyoHffkE9cOe+F2YkEaZbSBA/2rOFrrY2upa2x2rMmNvUhIpxx83d7LhnLQDtSxexrK0lAzdgeWs7K5cs5sjDm6G2RdMTCJL4kSe20t26hOAJbkZDcxPXtLSgpsyedw2pOaqxF7K4UIljHljVsYzvet6clkQtAm6u5DxgoqgXaWhuIrewkfqWRmYvXoCrkwuC6iT4R99+gWhKQ2czV3c2I3VxTXEkmcx9UQoce3Q7Kxe34mbMmd9IbmEjAGIas2ia7d20Zi3XbnyI+1ffVZFjbkcL85cvIkHoXNTCoZ6dtaAqCSSI//D4Lla1t2GSMOuqBpK2pth8piigbijGk/s+wAi8cngPp159H4BZN7RWJFdXRCNEV+sCPntkZ5UKVQrkTLCSZrmOFtStYt0szt976kGSEHAJmCnmlepq6XvOimZcwanDp+SqIuASp1rDGHVHSyCppajGf8XEmN3ZXgVeYb5H20LZswoCQRJ/6cZnONA7FEFIGe8brah6Ysy7/rpqgkTJtfyhK6cHxrJp/9ifbLt7A5TZUFFrfeKs7uzmeP4MrrGA8b5RQqiUxHUiPhJTC+WLUakycBXl5xMXuGVhW6ZiTQJYlEeY7HILwl/5URKpPMw8jXOp4WuCcXpgDBXFQ0oQJy0Bm1bur3I7iGFi9A+fQV1IJAaOF36v3FjSeqJvvIzgqcIoHtJS9Ub/SLGKZE0CYpMNYmJs//AQJJJ9zg7+wXjhJGcHT8b9KogbKYHz+V8ZHxwrk93woGzafxx3pUj09B+byQLgUH6Iohqf5/Pc23UbhYEL07LPkiQpaSnVROUAI0PKA90r+HS4AMCREyNMcWCSgLihU3xOcgmOkh84F1Wpc5JcbKqRoXPZvp8GiphPAqsYI4OOiWUWAaSmTDUjlwXh8kbfW/7iynV8MzhU9aIuFM7HHxZwNFJPo5yJCIVhoNS8wRwTR1QoBsNd+Wp4CAnG9mNvQ1n2HDWGuTPxCvckJvLMO4VQeieU/RNcAE8JLpFgmbvxHDGCV59wFU8Ul62DpZtNcA7m+2LyxJEgSJAM/OuhAmkaz4oDJwagZIGJ4xIQN4rB+LjQl+Xf8eOeiuqrCExUkzEX42B/PpIgxUsSf1kogJZ1cxE+GenLyBEUl5CBqws6zaWo5tME8ee7nmVWENwCiQRCWTMhEej13t0kCBu610NdXPJSmxfdSMRRF8yUPf3v1MSb6U7oJTK8fNO6WBiOIZgJm/t3ZfH1kvP1tz6HBMNKyhTV2d27tzxfTayLujoniGv1ZWZq7P++ml8Zl/f4FxnJNqk5c0BkAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Create 25 atomic notes',                                        condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 25 } },
  { id: 'notes-100',       name: 'Zettelkasten',        icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACk0lEQVR4nO2X30uTURjHP+9c+t7EBkGiZOKvIck7pqITRIMKwSjJHxgpXVR/QVQk3kV/hkQQRBdpFpWkpEtfV7ihObWWlW06yvLKBebAbaeLaE6seH+gEfTAe3E453me7znf53ue88J/+1dNttnFuG9IjPuGhGyzC6NxrGZA1OZ7zLibs+iz08JRrQilxinEu07DJ2DR6/DzuK2ZCbIsEvKeDOLf4kbz6wcwoY5sGSulDsPJwUQN7Gt8Ss+FbGCavfVfdg/AkxEvgZkp4Vc9jAZeAXCtS6HEkSdaWtukHQcQCUe40n2dRDKO16sC4HavYFV15wbAkFfDiWZRUXYIt7uWT8sR5oLzLIRDDD3q1x1PdxGeajsjxtRN/efm5AEwpno4evykbjnqBnC/944EsLGR2DY3PPBw508AIBZdlWbfzgNQkLOfhXCIWHTVEJ2GAKRbaHnFlL/he2BM9bC2HqNcUUiviV0DANB0rMGMu3kALyZ9pgGYroG/BiAp4hQcyKXoYD4Ag4MDhlqyZukEZqaEu+4ISRHHIllJiq0t2CJtsqlHkpoXyja7iEVXJdlmF7Xlldvmv66tA+D3P9d1H2imIH1XTpeLj8ufU5/35ST1dfW6k4NBFRSXOAjfvJGiwSJZKSwqMBJKfxGeO3segI72zlTy1qYWMrKMtWNDKpgLzlPpcvIhGOH96xB1h2vwTQQMAdANW7bZRUd7J3337pKT/aMVWzMzqK6qwuf3Mzft0xVTlwq6Ll9kaenPzafS5eRS91XNUtREgWyzi5FhDw2NTSwsLv523eybIKVlxTx+0IfWvyXNKui5dZvSwnziie0PkXQbHB3XGhLQSEH6bhRnBW2tzb9c19vXz+zMVGqshYbvC/blvMD3S8EAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Create 100 atomic notes',                                       condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 100 } },
  // Quantity — papers
  { id: 'papers-10',       name: 'Bookworm',            icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC0ElEQVR4nO2W3UuTYRTAf+/mXlxZ5sdmKqTNrNSJBpYSUhfVTSJ0ZUZ3XUQIBUWEf0Bh4EWXgRAIXtlNENJNEiFlVBd+5fzc3MxXnQ6/3dzevb5drL0ydHOz7ty5Oud5znnOj+ec5/BAUpKSlMMuwkEDe69fU8O6Qdw55uKH7oTOTInX8XRunnrpYRuD37/S9KOTEZsDUdUjGnQAGHUpiCm6RHIDEDXi8c0WtcH6SH3V9FotyC9SM288IaAonK+qoVXdpCQ7gwv5JsrMWbtA/wuAND0HwLeeEY6oRm29r/czankjI55l3k666JMWCcjb2v5TOaH80QF8/oCm36m8j1uaYHpiAiW4TZ7lHC6vH4AJn5ci03HNt+hEFqdO5sRNERVg0PtR039NT6If7WZh7jcAs44x2lMVbd+ztgVAIBi6ibY0U7z5owO4JLswtPRJsx/UNKOzdQFQWlZBSWNL3EkOBADgFXya3jc2RH6KBQDb8AAA7akKAZQ9Y+MtQ0wAl2QXpE0JgwFSDQbqqxq0Pb8KR6vv4VcjX3K4DK1iejz5YwMAzAT6WVz3ADDiGNXKAJBTWBwC9Yd6wJK9kzRdFOO6hX0BXJJdcAcXNPuq+VYExLvLDUi+TQAcntWI2BfCsf2O3x8AYEWewrPhiYBwjg8BUHi2nE6jHt92cFdceEr+M4BLsguSLO1aD0PIpfUMr23sGfvcHHsyJjS859dD01FBRh18j/K34c5YqyP8CkwZQKgPKrPTY/ZC3AADzm7BHVxAQQag1lyHztaF3RZ6kh1GGPSuUJybtSs21otI6AaCBCLsWnOdpquVtwHoco7T5RwnKCoERYUvs0s0y3uXJ2GAYWeP0L/cD4DFmobFmgaEeqGgooI3+pBfSUYmAM9WPbxccQtTc7NR/wgJf0jKCq+oqfqdMM/WDIKlUrPvOn8C0CH7mZ53H/jDk5SkHB75AzakByR0ilP5AAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 10 papers',                                            condition: { type: 'activityCount', activityType: 'paper-completed', count: 10 } },
  { id: 'papers-25',       name: 'Voracious Reader',    icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACzUlEQVR4nO2WXUhTYRjHf87SiTP6oIykD8UVaguljbawQrZEA9NEg8pi9HFRdFFBF33cdFFdSOmNVhIUBiqmUFOLdGtlH0zHdDdlaW3RiIIooZUbrTxdDGZjZ2dZQRftDwfO+z7/533+530+OBBHHHH8YyTEIpypLhC2bzbQYjKze8dabl43U15tgK9fsfY4Afgc+B7ht69liMPGzQDUXTVFjSMpIEUuE2IJBPD5J3/2icYRjSUpYLxjqwBw8VxfaG//sSxR7oWzrikRKl2Y7VDTrahxxOWKYNuBvb9KBSB7uTL0SGGGlHHg3svQe2vjZQBsvZC3yC/KX61TU95o4awKXoyO/ZLQqFeTIpcJ7uY9ADj7h8JssqS5kfzkqcssruujLGdZaN018ipqDUS9gXp9Jul582ir7aFokxaSknCabeQbtFiu9EXwl+Rmoq5SBQV0ONEbCklVyAFoH26K+qHSKejsBcB6ywaA3fGWca8Mh+tjGG911lxeP3WjRsVT8ygAypV5UkeHIJkC6/F83K4AdsdbyUO+TAQAqNqjwXF7jFN2D/MVct5/nqqVaafA559McLsCQqWxEstgI7MSBXJUSyJ4SxfOI7diFT2XunE98XDK7mF3SbANZ8sTATh/42FU8ZJzoNWoEiyD70LrNfmLRXkDTg+agmBhPvLMpFi/ltmpKcxPXxD023niz+bAyWNGACYTvogGB7APfySjoAS/d4KRkWeh4LHwV0bxz/D5J0XH8bRrAIKtuH79BuqbOml+42XLIgVblNmiXE2Nnu4GE0edYxypKAyznW7r/702HP/0DWVOMO+7MtLwCgIvJz6gCMgjuN0Npoi9UoOOjQdrpULEroG79x7jFQRqtmpjUcMClxp0sYnEqIFyZbqQ+t1HkTYbq+0FZetW0PXgOasy5qBTa7h2576o36fktLB1+7Ar5n9HHHHE8f/iBw365W4Me0QQAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 25 papers',                                            condition: { type: 'activityCount', activityType: 'paper-completed', count: 25 } },
  { id: 'papers-50',       name: 'Scholar',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADqUlEQVR4nO2WS6hVZRTHf2vt6+BGEeIskSLpZZwr2r0iaXpBolFGIU5qEJRce3An2igssceoMKRBIj0mEgkJ1qRRgzLRKIogrj0HlU689DAo6J5v/Rt8+3nOMe8kGnQXbPbe56zHf631X+vbsCRL8h+LLUJHi7RdrN5l/+w4On3kvvyQ8s9mgSLY+Mi7bXt99NpOPDWmZkEK2DTz9iA0u9SLZnf02HnXdbgcL63chMIbLc8mhTuTDx/n4ONrmZq4EbfA244dLEQIMGPMRCixYdeJCpABHRsmrr+yAzUsCBkygZd3wEykCPbvWMnkxOo6eCgIQBYoILCMV1UJCo4+vakTowNgWWFAgCXCogYBIEVTKuUq9D1n2jflwHIU+Y5UB3aDEMiNFHTEGSHRapqXjybDysBmTjFmPHvsHJsfOo4FhJwoK9TCSqgJDgPRLwWgTZooWVKVH7Kz8dtma72FhXEieakvzKKTRAYShGou1zLWeTMfOUxhgcvr7MenZrm1t5WfL5zn02P7COWWmTneSj8QXvLcwpCLiG7OXQAwcjCrNsiEWyAz3n/9CT556wBmBe7B9MybAJw6cg/mXrehDWKUdOCYGUL1CDYVyK7chCR++fw9imUFKAFQFEWtqwBFYKi+RGAj+j9cgbLhIQOrgHgDVeAhtj7wPB8cfZJ+f4He9DSr1j3Ix2/cS/yVShdp2DUZ2GUrUKVhFiXxIl+lrQhe3buFLfc/x58LfeZ/uIAbTG1by8aZd0pPBaao8+8AGeDYcAsMcM+zPFCcIJEcejddzeE9mzn9xRxnznzIy3u3Y6v2k849xe27TqCApGbspNy6UUM3egzJuxxK4gHe6mEfse6WFYxh9K411q8uODR7N8U1B/jj/D7u2H0CmTIRKwILkoZHrNMotRRMzeqtQlsYILwwgkThIixTbXLNGAcfu5MrVj7DycPbs37Jm3bcQRp0KlABqHhbAQk1Y2RmNaL2tIQZUxNX8dKj03z25UWQyrWcV7dk5YT8QwXqIK3gXawD52pFTAelPMDre8tzmiYUg/Nv2MAq7ALoU1cAIErKzn39a/4jNQ57a1bkoGVbzn4736ABbr5heR208goMHUYdABHi+7nfa+SSSEpU2zNazfzxp99I9Pnqm/l674eMapLPfneRCMNDrb4LK7pV6ZLQvQ5kISICBDOHTg2dES/s3kAK5bEVzLx4kkF5Zc82ojqLEaEYWsqdL6IhD/+uLOZ7dEmW5H8gfwPT6dv1oX5BTAAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 50 papers',                                            condition: { type: 'activityCount', activityType: 'paper-completed', count: 50 } },
  // Quantity — milestones
  { id: 'milestones-10',   name: 'On a Roll',           icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFl0lEQVR4nO2Xa0xURxTHf9zLS67aoIkfjK51VdaS2MWARgRiMFIVQRCDWHUVY02xPlB5aao2Vhs1vlJFQtoaYqi1FkRX0WCoG2nVWJVUvhAUS8TGtvGFli6Cy+70A70DlwXET/3iP7nJzJlz5/+fM2fOnQtv8T/D502cFU0VAFHp75E58n1pd3o8fNH0J/cKrgDgcbr7PW+/HBVNFTFZEbL/8/5bPfpNXjNdtm/kO/olpE8HRVNF8YblBLnamZ9fzKPaMjk2L2E9AaoCgKP+Ps+qTwIwJDwNgDM5NpL3FgN9R0R5HbntYBEHLlQRZTahuVxy/GrDA9l21pwkwBf81ECab9uxmszstF/lTI6NU2tscuv6HQFFU8XYjCTuFdqJMpsMpI9qyxjo6yYoJFXan1V3CPCIQGIXbJB2TfGjLX4MANd2nOuRy8uokwPcXLeK4NBZXiKWLogEIGXUWACKHj0CwH7sIhEhZul79sQeAvEQf/wYANcPXPDaDi8BIVkpQifXoYv4JCGRwf4BJO47QNNNO8m2XJweF1Ulu9CsaRRuWgvAN2XnOXtij2HelONFBD5uwVF4ycDp213Adv8RLD50BLoI0Fd+9dARIkLMNN20A+D0uAw+GbsPd59O4vqBC5zJseHoZjckoZ4s08ZbSE7JlKuP2B5teCl4UlKvRH9UlwDwaUEBAMPDU0lNzZLb2FdCcj53vVA0VcSGh4rY8FChaKo4vuUjoWiqaH1YJloflglFU8XkiePEi9py8fJeqXwUTRV/1ZWJJ4128aTRLhRNFYqmiuljLCJmwmgRM2G0UDRVnM5LNwgwHsMBflhNZqrq7hjM08ZbSJiTA0DL3Y4Vxi3uzPbQ+I1y5cNCU4hPziYixEzZylRcQa8A47HtCpkDiqaKba4qKiv20fSsFUv0IhIiLNLRrQYwe+4WAH4q30NQSCqaNc0Q9tnz8rCazF3nl8SN1ZUALPluM4qmCv00eCWhn1Nl+ECN5tt2Mg99i+1gEc7ffjT4xEdlAHDnVRDQsc9Wk5nKin0GvyVbdhnIAV4ODuw5AtLg193SCW3MDKYOHdnjWM2DBoaFpvQopC8YcsDP/Q4udyvtLhgUlkTb3x6KVixkTlQGc6IymDp0JNee/s75inwALP4tWPxbAOTRBIiblU18cjbLRkxm2ngLo8LjehUgI+Bxun02tQ0VsfM2A2A1mTleeooZKxZK54uX8ml3dR5DnVTvN9/u6EfP7UxQwCDi3Oq1zHFWyWJkiEDK1yXUPGjwUvkkajinz+2X5F2LkU6cbMul/b+6dPnUQXwTxncUtC4iABKPGIuV19eweMNy2XbWnGT50e/lKoMnJWE1mbl1twGhtEqby90qfXSRnletNNVWUFV3Rx7rH7ameS3OC6fz0oWiqbLAOOvLhaKpIjI9RhaX53Wl4nldqYiMDhOR0WGyrxev2HVJQtFU4awvFy8aK8WLxkqhaKoo3b3Iqwp6RWB+fjFTNsbjEYF4ROeR+aXkGpWrZgOdl46uGBKexofJH1C4aS1VR8tpvm2n3T9Ajlt2TGLBjpNe7/X4OZ6yMR6AyqUfMygsiSiziQBVwVF/n6RlM6Xv4uAO/QVPXwJwufgygKz75eVfARBXspNmpY07W2++/nOsY0penLiR72D6uHcBaHN7uNrwAGdNxyr0KgjQVFsh293vD23LOto3sqt6vvz0JuBGvoOylak46u8DGMi7bo0OFy1etrz0RLb5WLn12ZXeaF5/KT21xoY6AJL3FhsEDApLktFx1N/3isLZz1cDkJB1qG+OvgY9TrfP/Pxi2Z925jCaNQ3Fp1WSA7IdHDqLmWc7i9DcbZ11oDf0+wdCv0hMzAxHHTKA3KZBhvHD6mP+aRf8+mW1FN+fed/oz6gnQTre5G/oLbriX4l9UhXrMV8tAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 10 project milestones',                                condition: { type: 'activityCount', activityType: 'milestone-completed', count: 10 } },
  { id: 'milestones-50',   name: 'Relentless',          icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAIEUExURQAAAAQJAAUJAQUKAQAGAP/c/wYKAAUJAQAHAAAFACEUJzAeMwACAAAGACQSLyUXKysaMgYJAmIlhn5FnQUJAkkhYKtw1l0/coVcpQYKAl0qdFssfzseSgUJAZZOql48XVwwVVErS5KDAOWrNc6BO7d2NwYLAbyaSLSMTgQJABIVChASCwEBAAQJAAAAAAAAAAAAAEo5CQUKAAUJAU4nYWM0cEUgW4I8qJdKt1MsYnQvnII7qoE7qX9BoXs1ooU7rZtcxT0fUlspeXs1oYg7sIc8sKhm1WMtiWcui28xknY0mHc0mYlLrVc3a2AshGEsgmItfWUyfD4jR18rg2szkX09p34+qKFyv21aeAUKAWIshXA1mIRBsYRCsq6Aznhng2Qth3I1mYNAsINCsGMth3E1mYNBsKR0wm5ceHVBi0AqQ3I1moVCs2o2fzYfN2UtiXY2nohDuIZCtG43hjggPGkvjHY2nYA+rYA+rG00iToeQmkyjGgyiF0rel0reWAsejseR14remozimYxhlYncFkocmAsdjsfRVQoeEwgZ1AialIlal47XmA6YF40WeazUua/gNiZVv/bdP/diP/bjP/OfAYKAaGLVv/kkP/Ziv/WkP/imaKKW4l3R/HLef7Sef7QfvHIgYl1THRaHPezLfezLnRaHldBCP6zHZlvEwUKAAAAAKmxjp4AAAAzdFJOUwAAAAAAAABeAV7Hx14BoaMCJKud3fKeA9uiotvbogKengICnp4Cotvb/v7+/l7HXlvHXqdPcIkAAAABYktHRACIBR1IAAAAB3RJTUUH6gUTBSgKSgRgGgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wNS0xOVQwNDoyMjo0NiswMDowMGGATP8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDUtMTlUMDQ6MjI6NDYrMDA6MDAQ3fRDAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA1LTE5VDA1OjQwOjEwKzAwOjAwXS4tOQAAARlJREFUOMtjYKAqYGRiNzZmZ2bEqYCDk8vElJuHF6cCFj4zcwtLfgGcCgSFrKxtbIVZcSoQEbWzt3YQE8epwNHJ2cXVTUISpwJ3D08vbx9fY5wK/Pz8AwICg/AoCA4JDQuPiMStICo6JjYuHo+ChMSkZLwKUlLT0tIz8ClITEvLzMLjyJTsnLTcPDwK8gsKi4pL8CgoLSuvqKzCo6C6prauvgG3gsam5pbWtnbcCqSkOzq7umVkcSqQk+/p7e1TUMSpQEm5f8KEiSqqOBWoqU+aPGWqhhpOBdOmz5g5a/acaTgVRM6dN3/BwkW4faGptXjJ0mXaOjgV6OotX7FiuZ4+TgWMBoYrVxoaMOBWwGa0apURG+6sRxYAAHsuSIxNyQ13AAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 50 project milestones',                                condition: { type: 'activityCount', activityType: 'milestone-completed', count: 50 } },
  // Quantity — writing
  { id: 'writing-100',     name: 'Wordsmith',           icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABxklEQVR4nO2TPWgUQRiGn9nZ2QXB1DYSJeQsREghFtYWKSSGEFKF/GAEQbC3FkGUs7KTgKUhRSzyUxxCQggaQggxP0TBSvIDSUDUmNvbnf0s7jgDV9wsSRFkH5hmhvned95vPsjJycn5nwjCUEzgSxRbiWIrLnf8MxPXWn79/gOA9hU2cdLHOwvxg6Oy7B8dAyBpwtynFe52dzndPXUCgdbyeXMLAO0ZkkqZl8+fUpqaUqetXReYLvbJdLGvIdMgDGV2bV3mljekHEVSjiLpvNftln2Npgm8e9ZFa/sVvEQIwlAqUVR/WWlhgY72ArFNARge6ufDzCQm8CWuJE4JNDVgVPVBylTrmcAXAGWFJFYsr21y63qBlgsXwfeZf9PLzs4hPU9KLvrZ/kDxcYFrl9u42nqJ9Nhjzwh3bt/k/asevs08ZHv3MEu5bAasgLH/Ur0xOIoxb/ky8QCAOE7rZ2LdDTiPoVeba4PG1GxvjA2cKJTp77kbMKSNm1bzdXykLnxSfPt7tjY4tWDp43xNzDQYAUBXM9/b/YnS2VrQ1MD+j4OqBopHr1eB1aZFXUcQHFpw/8UiGoVFiCuJclmu4jk5OTnngr/sjrymDlSwFgAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: '100 writing progress events (~10,000 words above previous peak)', condition: { type: 'activityCount', activityType: 'writing-progress', count: 100 } },
  // Level — tied to phase transitions (5 levels per tier, max level 60)
  { id: 'level-5',         name: 'Kindled',             icon: `<img src="data:image/png;base64,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" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach Level 5 — your first tier complete',                      condition: { type: 'level', level: 5 } },
  { id: 'level-20',        name: 'Hatched',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADLklEQVR4nO2WXWgUVxTHfzN3Zna8k2oqEY0K1hgVpI2iqR/vfpForO3LRiutltqKLVKD0Ida1AcNioj4GVvE+AH6oFKCtoh5EHwTofqioDFt3CTEJFCNSZPM7F4fll2ymXV2Ngr6kD8MzJw55/x/3Mu5XBjVqN6xtJEU2Y5UP5X8CoBhmniuy6Ene+jv7cu7X14FtiPV2rK1lA7Mp6z004x/9x/foaXnEfWPTubVM3Sy7Ui1vbyWaXIWBVYBViThyxkJhB7W/Jfyg0hMIkaEdUf72XBtJYYNy3Y+ZdNfFVi6S/mseUwrmstXM79XYQFCad+qA8qSlvrv9/3KkpayHamOfFmvbEeqDWWb1bGq5Psf0UZlSUv9vf+wsh35diAsaanhz+ez16sPxhao89U31KX1jepYVb0v59S3a0IB5NyC6IStfFNSTfu53eiaga4ZmAmbE5VXMHWRteZgZQVN91YSZhUCAVINJjvLATCFzsP6KKcvzONWcwMAXT0xahq30H01ym/Lr3J73w46YysAqJ5ak8sfI+inKXSmT5yLp1wazizmwdnvuHmqEoBdNQPM+Ho1CeXx5/YfuHx0NQAR1Z/Rw5KWGuwbfO1UBI7LogVLVQUbSQgXQzMBKB4/BUNLjuAX285Qt3cORWMXpWuaO/5Fif/T37X3thEEEGoMn3Q9xFMuxeOnAOApHU/p1O1eSKFcDHH/VmvxMQzEc/d+LYDtSFXycgkApR9+gh43fTmF4z6ms+tuEsjT8DwtbZ7SZ8U/jgwAIDLMtPVZqy9nQtGCQINcyrkFzc+bckKk9LT7H18sbviP7LwAwiqbeXP345x1gWOYbvS8ienjZqS/s66CID0pHX0dYdoCASvQ39unXWyvzYAIUsp8uK7F6kYGkE1DIXQj80mprSdzdRLKC+wZaguGQwih8VFhSUa8racVIQyESLaMvWhB2FrgIQQhLiS2I1W0+OeMmBDJMktEfPlCGMRetABwvfP4mwNkg8gG0N7bllETxjw0wFAITbh4rsuA5gIw6PnP27DmeQGkIACqJm1Jx4YCXO88noyFNM8bICVLWlkvGvkYj+q90StoOTBX6KtEOgAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach Level 20 — your dragon has emerged from the egg',          condition: { type: 'level', level: 20 } },
  { id: 'level-40',        name: 'Risen',               icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACkUlEQVR4nO2WO0wUURSGv7uPYRg2hI2oAR1egRggkRh2I0YJsIkGDYWFj2hhLEzs6GwssbY0ItYWmlC5hRUqJBaKRtAYo1ELEwoT3EXWcZh9XIthZxeEnSFTYLF/Msk99547/z//PedmoIoqqvCBid5mOdHbLHeNfGlU2x1yVVPk0qgmVU3xLSDglbB8nOypr5i7E2GeBGwW0dNo0DRkMXNIeN3uX8D3WAGAZE89TUMWAH0tkhdHanwdhasAVVPkDV3Zck0bKNDXIlk+udGhzbEvATfbGxnfb6LP26ljH345a/L4CbSBgkMKYBqWMPdB+qIXehcBqqbIa3qaaH/QmTMNS8zMRzaIqE3UOvmqpsifKcWJfQkwDUt0zObIpSWZ68IhyK/mkdkaePbKTlzJOXumYnW061lCDYKrB+vc+N2PwDQs0fDQHm9nqwivoQ0UmIrVcbnfAODNxzCTn1KubVIxoWihaVji5emIjI0GmX+SJ3bMdlYmRkovmnmKZYQIrZmsZCR77lueetRzGwKIVt0hZzj+z3p4bJCVjOTAAzu+E4/6q4G7bSpgOxFdP05xuB2G48iAXYii5Sxgu5FNzgG2Y6qmyFOtWddCDG23oGqKvHTU5EIX1HQIIAtAvq3NJs6UyItQtBy/l3FEgM8ugCI5BIe6HHIAGQH2nref4lxihKge5vO5iHM7vjujVHTBUw2Ukwe6pxGZ4m7VfsogEyPonUHS47XonUHc4ElA+ZcDiPg0ge7pDbGIl+Lw2KAznvwm1o9jhwJMwxKPvtiVF3g+V5pffutFMwCLC3luv16t2I4VHbgymxKRe5LU+z+OCOXHra1FFExnmE3OsbiQ5/FXd5Gul4Xfv55K9ldRxX+BvyB85D/W/r65AAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach Level 40 — your dragon is fully grown',                   condition: { type: 'level', level: 40 } },
  { id: 'level-55',        name: 'Luminary',            icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC1ElEQVR4nO2WTUhUURzFf/fNc96MXzOKCSGikIWIJK0sEwrKsIQyKTcRQmG1aFWLkFZGErgKpJA2EtRGkiibPoyK1EVDYIZYi+gLFUTSnGHUGWfeuy3EaaZx3rzRRRvP7t7/feece7j3fx9sYhP/GWK9H97taJARRY2Oz7Y9WheXmnpJcly8MYShG4QW5te9EcWsGAqG5HqJV7Ho85lymBrQHJqQRmRNAk1IvvQe5GvfIVPxTJfLNB1TAwBCURNM3Gk/ICsrNcIKSBHm+0Bzgkkr4mkh1sRI3wnpzM2X+rc2OfHiuHTm5ktPV2O0nir2WKRMYBVrJQGgqjqGbgDg6WqUQf90WjtP6xYIRRVGMCA/DZwmMHoeAIeIMN1fg2IIsqpv0nurKR1K633g5e0jEqCsLJuQobJ9RwkA/h8fAXBVdzA1fA0hMxgcnUQKJ6euvErJn3RBT3uTBGioXgKgpNkLwIfe+qg4QGByBEVo2EQEXaoUNgwDMOOpxTMUASAkBS1XPWtqrTnZ094kL3S+BmCibw8AGXZBbmlVwtrA5AhAnIlVTE3MUtU6TlhKui/Vce76gwS9pAloWW4ZayAWGfa/n42O/Yyrbd3ijhtXtY4DJO2Wls7AzPPDsqTZi6EbTPfXxNVWDVSUFwBQenIMAG9XJTtbBlPyW7qGhfXPxJJ/ToQW5kV4WZJTfAZF1VFUHZvNTkV5AYV1PSzbZlnyz4kl/5ywIm7ZQCzy93bj9b5NmB9/cpmi2nfp0qXXBxZ9PqnmrDQZZ26+nH26G1iJ/f29fSiObGEEA1JxZFu+3pYT+Le3P+7cH619vr+LyqMPBYDiyBbpvKKWDJg9LEXFbnTDiJvTHJoILuuWTKQ0YCYeNnQAth17k1B32G2WTJiegflfv5OKL4cN8urND53DbhM+X0S6XGrSM2GagLsgb8PvuZn4hqFluaWS6drwb9smNvFf8QcBfxjkW/FucQAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach Level 55 — a distinguished scholar',                      condition: { type: 'level', level: 55 } },
  { id: 'level-60',        name: 'Nova',                icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADkElEQVR4nO2WP48bVRTFf/e+N7Petb3eZRM6aioKeio+AD1CICEq+Di0dPkStEQgISpqhPgAScg6s2N7x55591A4GynaP17iSFDktDPv3PPOu//gHfaAH5rcXHtx7HW4aD+C/y1SSnvZehNue6obHcxmAByObhdSZ9eqXWjdLlTn2/OgrrMAQmH3FrAeBjscJT1/8oyjnNXMm2sBLAKASEb26zQHydW+ONezp08YVW/o6KpdaH25VL/udFBVr5Gsuk6bbqP+stNBzq99q6qs5nx+r6A32nKFg6pS07Y4jjlMjmrWA3ZQJ81fLKgNwhKlBFhBRRhQwjAvjKfHd/LDjjJc973NxkcoAhS0y4EYNjJB9oQwPIwqGZPxBCUDd8wcT+le1u9UeLFcqs6ZZIHbVm/IkInSD1TmoExvBUkQIMTZ6ZSn53OOd7iws484MJ0cIk+IwGVkD8ajQ/y3b7Ffv2Z8fIgk3LYHzMSz+QXuaRf9bgHJoG0apqMaCSLgx0ef0T7+Es9CObH66XNOjscUBSaBOWa8cuxfC8g5qaqyaneFBhxj0XZkEtPJEZ9++AFKItxRyoQ5i5+/4MHJlEGCUjAZcnFQJ9V1vlYpVzCAUV2r22yuvdWqXSgn2PaljKsw/P4dmIMHhOMmQoZHT0mifPQDbts8METB8BIcHU9f4x/lWt2wsQzQbTb2SqGCddl2rXBDHkSAMxAG7oayUNkSlZe3KOaUPuHmuAUxAAkm4/GrwKNRJQ1CEt2wvfCdGbpcLXUym2JhNM0cN+f4wYyLx98QpSPjRAiTY0lMPnlE0yyYPZyiXiBjU8qdMXaWIUDXLhUaMDfCxOx4RvvLVxiOoidFYvj4exQ1OTsPZ1Mu+v5e3Pf6qU5JzWIOZZvZEeBWODl7nzIMNM0clW0+e3IGwWR69HYE5DrpxfOWlLaWOkG8TEALI8xBBcmRQeVBweCGxLsJOwt1/ndDSkICRTB5OGM2ew8hMEOhbb07zE5n9CEo20lZVTeX3r0FZHMlxLYDCbOgXxWTgoggTMi2VTmeHFkZejs7PaVQgKB5PqdKe+yM7flK69VKI67fpOsaXS5X2iyW10b1FVbNQu2ivVPAnQ6oGvjzj7/oGK695XR6StAjE37DQgJwenaCKe4KcTtqu3uU1u66XC7UrVrtGrujUaWc67e+Z/4rVP72F93/Hmnk2neFz/sctoirUfkOb4x/AB2m2FuBpy8jAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach the maximum level — peak form, exceptional career',        condition: { type: 'level', level: 60 } },
  // XP
  { id: 'xp-1000',         name: 'Getting Warmed Up',   icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAAAAAAAAPlDu38AAAAHdElNRQfqBRMFKApKBGAaAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI2LTA1LTE5VDA0OjIyOjQ2KzAwOjAwYYBM/wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNi0wNS0xOVQwNDoyMjo0NiswMDowMBDd9EMAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjYtMDUtMTlUMDU6NDA6MTArMDA6MDBdLi05AAAET0lEQVRYw+2Uf2jVVRjGP+ec7/ful/duurvp0myZYqZZIYlBWSkoCGIQSLQyUirBCiWIQBCCfqhpGWVUWJQY/shY2UINMswsDWJbzpScmnPOdN7rdrd7t3u/3+95+0O3UtLdu1Z/+cD553B4nud93+c9cA05QkQwWhW4jtnjOkYuPbr3GK0E+BYIXY3PydWAUqrUdc3aNctmTxxXWYafsaAABFwfpUA6m9hU8ysf1px1++LL2QCgPC+YNmFsWWTq5CjEYqDUBRNGg9F8WtPN2XhmP7Aa8AfSQLQ8WvjQzHsrndLCFN4fx+hqj6OU6n1QlG/YtuskNT+01QLVA92Bm41Rb65YereOenG62hIobf42Hmj4PUnGs+eAE9kQ6myVRTagtYoMjoQC8ZJYG1xSuQjE2j0WrzmY3rLr9LKqGcOXZ8Orsnl0EXPvmjT0jXXL76kYEcoo7XuIKJTSGC20tHbx+Mt1fn1jYkEi6W8FUgPaAaAk8OW6cSPDytgAsT2VW4zWaAWHT3Q6iaR/NFtxyD4D0++fUjGnavZoAt8Cmp7uG6M41pJi/famDmPUWuC3HIrK2sDcUSPCsxY8Nh5JpEFpUAKA62gaTyV5dX1jGqgD7gAu3/+v+mtAAdHSkrzw0NICSHrYtE9v/wErEC50GHP9oKgfyMYLnVGAJdXtcyaeUSJXzlpfIXSBzSufnzxn8bzx2vgeqVgcsYJSGpRCARnf0p70cZwQKFAoPD/J1/ua7NOrj2Y8XwquJNBXCH1gSJ6jtRvOQwTEWkAQsYgNsGIJuZqhg/OIRiBSIJSVwPf153l7a0sDMLPfGXAd/d6zD48eM/XWMNIaI/B8jKMBwdUKPxD8wGItWAREUAo+qjnJhp3New8cTb2UF9LfgfTPgLXyREfS55t9LWzf3dTbclC4RjH19iGMv3EQgf0rEwUhw+7aGHvq4geAHemMvZrE1Q0EVn58/7Njl1/LxTNh1ZKJxZMmlJLsSF+Yp4KfDreRSgengSNkgb62YNo/3GljVHlRobu5eFjJZF0cho40VuDs+TQvvHMouacuvqy0OLQu1p7p00AuX3EPykOurt7w1vQ7Z9xW7Drd3SgRWlpTPPJirXfweMe8zq6gGkhnQ5bLV9w7goxnbyqPFrjFkRAGaDjeyTOvN8TqGxPzO7uCL7MVz2YEl2PksPLCJU9VjSusHBzCT3oYCTjd3MaO/a0C7ACSuRDmamCU0WrxokdvoUxbvHiChsNx9ta2drhGfe4FYnPky9mAL1a8dCLjUgjNJ9rYtLM59doXLdXAQiDI1UDWGRh7QwSgqCjfwSZ92prO8conR1i17dTHwJP9Ec8VD06ZWHb85w2z7Jkt06XqvmFSFnZWANF/Q5rLFlS42Mrh+Z5a+sEhdtXHV7Z2+G8D5/7rynuwsLI8X557YIRXlGfeBSr+L+EeLAK6gI1AZKBIc9kCF/gFmH/RyDUMCP4ExUXF09hwTeYAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Earn 1,000 XP',                                                 condition: { type: 'totalXP', xp: 1000 } },
  { id: 'xp-5000',         name: 'In the Zone',         icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADWElEQVR4nM1XX0hTURj/TYPqoZdNFAQpCILcDCeBD6H5ZzQ0IQLFoayHTMVLPuylJrSFaFY+TMQe4mrB3IP4NMIcRDHBDR8NwlgwpCsEQWaiKYoRp4d1zr57d69Myz+/p+/c+53vfuf3/TsXOG4YuVPFrGYLAwBFlljc28D09F71dYrnH4J+xteKLIn9YcnBFFliAJD0O5mv1ib28Oe64AZWRt2GStQBKu8GqscdMAHA0lATA4D6vihCrcUAgLKRmEnrQOX9CD7+WDFl87FskUMX00+ad1XurT4PIMVQLOBRhSAYCAiqk34nA4DesgLWW1bAACDubVCFU3W4+e4KBgDDdSXCEEePu4X1uFsyKP702K1ygMucTa7D9axmC6Mf3S28hw+akfRkiiwxo2ylGU1PrcgSC0sOxp9ze1QG0gzkAMAZ00+VcV4FFBNdLkbfX666It6NvU4I+cXkrO4ht7ZPqdaW9tB/TeZ/A00I2khoCIKBANNSzWUaDk4/kKKd77GaLYwnO18Df0Mw+/6rcObXl0VdJwf7H6nWn9/MCbnVYReyLS8Xw3UlGSEMtRbj7KVzAFIlOeBp1P3O0UAv6TgWolMZtGUrZ7M/BwA6ygsFbVazRVUuHHFvA4v4asRm2jX7XXZhcMDTqDsbFFkSe2IBD3v+4JbRmY2xHwaOLWbi0XQIpl4OCq9vXy0Vs91Xa2O8z9OS0nZIRZYYD6G29LgeDW1YcjD72kyarWxpo3paB7hM80drl0/JvXzzcBALeET3S/qdgio6z+mcB9QnDUsOMYBWRt2C9uk2G5tus+mGhts6wY3Qm07u1jcAwN2uawCAh+2hDKe/r60K2V56Ade9kwCAxOIqOuUIAOBeON1hFxYSsNkuirW5KD97hg4c2oSil1JKG+3xdIAtDTWxxLsxESq+X0s7HWaq+4AW/a7UcNnY2FY9v3GzQsh0ntf3RTEejAIAfp/OR0d5IQBgZ3UdO6vre6DiqEBDoK11o3o32qP9+TDSUw0jIP3TEPHVpH8aNpdh2lwGkIonlxVZYusn88QBnlUXCYNtzZW6fz1Jv1MMo6WhJjHYjh/205azhWEVTHS5GL/1Rnw14iUto/nuCtUVe/ZpvUpPr/S0nfTt+Ny+nT8w/AFnl0l2Ds5NiQAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Earn 5,000 XP',                                                 condition: { type: 'totalXP', xp: 5000 } },
  { id: 'xp-20000',        name: 'Veteran',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABp0lEQVR4nO2UzS4DURTHf6edaakS8R3Sh2BpJ0LErguRiPAAxIIX8ABixcKCrcQCsUR4AUsbiRX10WikEgntTOdY1KBkzLRdWJhfMovJPfd//vecew+EhISEhPwxUkWs5g7StPU0ImJ6Bt1mbuhLHwfWjgRJ/Hq2qHvLA6jzAoDtWKj+/HI3WeLxCJsL/eRPZlUMUT9xX5f503ltHVoD4GF/jPbeNkrfZKPvKtm7Jxyn4FaA7N4c3en1X3P4ViCZBDEETOG1UKKojmes4xQq/ot2yU/e34AxuM7h6hJYKqnp8slKVJpwK2I7Sl/6GH2+5257htTURv0GRGFkYUUwRX/r6Ne2SLKHpNGI/w0IYEBtFdeIClxcPJYT4tEKs9zy5okNcffWZaDCiKUSbzDJXD//WL/NZInYEbBUqOJ5VzMHPojFDb3cHv0UsSxSk0c169XM1e64Xu2OB+i0N0Y9m82oQNR7KgYh8B3woqMz8WcGNBZrcKdgzW2o/tKYouc7kzSJTXurYr1AoqUL7CKJ4S2CPL36DIBiClhaHtFfF2ytVTMk5B/zBqSvnrw5NRicAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Earn 20,000 XP',                                                condition: { type: 'totalXP', xp: 20000 } },
  // Specific academic milestones (match "Milestone: <label>")
  { id: 'submitted',       name: 'Under Review',        icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB3UlEQVR4nO2VTUsbURSGnwwD0oIggiu1xWIQPxAjRCmxjZIIrlzFpQsX/hL/huLCIl0IirhoMcGIEZsPEapWQY1IdKXiQkGjw6SLxGgwc+fORARhXpjF3HvueV7O/TjgyNE7V67w2ZZSCfz6OMb1cezRiC25ZEDlBtPxuZL/L70hW/mlDNxdZiTCwKXm02XOTmhu80kxKtkCoQ7/rUvFqa8JzWk5XKqLxvrP0mvMDJTd/8dSy/pCsA2iTLnM7iKHiT3DgBtFN6X3f/9GdVOfIUtYgcb2YW5PE6YQkYZGxoXzwkOYjs/xoaHHNtwbGOXH5IR9AwC3pwnq3P5CtPb0ScCTK9OmcebXUNE4P4rg8YVAV0vGjVTn9kvBpQxoWR0tq5OMzuINjOYHdeOj4/GFOD+KSMHB4juw8WsK78AYAMnIzAswQDI6ayWlNQPbqc1iaT1fS9/+rY2fAOzs/aWjtfP1DKhVClpWZzu1icfnzZdf0dhaL21GFJ6EjpZuwssRgoN+KQNSvaAIh/zhK5gwuhHBQIDw8ioANR9rKzPw5/faE7y4qswNeG5I0QgO+plfWDJLL96C3f0Dunraubi6MIx5uLk3nHO3fGI/vSM0IOwFwpXWZamDOXLk6M30HyxLkfFZOZ3rAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Submit a manuscript or grant',           condition: { type: 'milestoneLabel', label: 'Submitted' } },
  { id: 'accepted',        name: 'Accepted!',           icon: `<img src="data:image/png;base64,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" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Get a manuscript accepted',              condition: { type: 'milestoneLabel', label: 'Accepted' } },
  { id: 'awarded',         name: 'Funded!',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADK0lEQVR4nOWX30tTYRjHP3ObQ0smGhqVzhyL0UTNSSIjJQhNCuZFaYFEdyGBXgRFf0JCFwUSQXTTRdmVXUTWjS2jH5JSkKTUDO0nZIL9ULfXs9PF9Li5zjnvlt3UAwd2nvM9z/ez93nf95wD/3tY0tCqCfeoOhrLGt26AahHqkoBuPFimt72GrZv3pQkeDHxjrMDrwj6SsmxxXUy9WUA1N72GgBC4TkiC4IT+7y8/TyTJNpa4OTGozAAe7xxuJN9o6YeWRIAPJz+DkCj20mODc184tO8pvkwOwdAnbsAgKHxGWRCBsBy/fHrOIQjxp6qAkLhOe1iVMSIihih8FySuWwLbFKYcQhVEW4ad+aRJQQ4YswvLjH2/gcAkQUBwP2JWW6NyZlLixJCb/ZnXDetZXi6dXdKsqd/mKCvlKMBD1cfvKHaW0xP/3C6teUhfnecOVCtNnldiTnpkJ0DAOrRek9KUhExzt1+Tnezh3vjEPSVcmtsWkVyBGQB1I5AGXtLnAy+iy+vgz43VksUgGyHwoW7r7lzqpGW86G0IGSW4bL56s4XrCjRzFfOAQZefgTAVZjL8s5p2g4zALUjUEb9tgItcahyu654f8UW7XeRM5egzxzCtAX+4nyK8jcAYM+yIWJL2LNstF4aTNL1Hqum5XyI7mYPu4pyGZ2aZ0u+w6y8IYDaEShjk3O1iIgtAdB6aZDISHuS2OHvo6vBy66iXC1nt1ppq3Vz81lYdz5IPQsS4/DloRRzgMhIOxcfjKfkCx3GFoZXm3cUA7AYjbIYjeqaJ0IcvzYKQI0rPhJ2qzUjALUzkLrmMw2jyZh2CwCEpG5lFIwiI4B0IP4IILJkvJGJNce6A6yF6Ax4cPj7dLUOfx+Jc2d0ah6hKIb1DTeikcmv1JXnAXYA/OWFdFmtbNSB6Ax4qCvPQxHx/2VmbggghIrdbuHp5HfNHKDSlU9XgzdVryjUljhRBFjtMe0+gAVFv5VGTVbbat0pG8kKiF48mUh+GZ3+Jrg3PqXrZfa4VJu8LgDchdlAfGRk48vPqOn7odR3AUAiiAzEleE3Uh6ZfJrJxl95J/z34hePnx4co8uj4AAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Win a grant',                            condition: { type: 'milestoneLabel', label: 'Awarded' } },
  { id: 'defended',        name: 'Graduate!',           icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABtElEQVR4nO2US0vDQBDH/zubaKF4Ey2KKCoV9K5Hrz4q6BfwI/kh/AqKV18H8eTFg+ADQaTSgxep1Dad8RCbZpNtkwZfh/wgkOzszH92MrNATk7OH6My+sl3xaQ+Av2epOSMp3m119NPRRwBABOlKQh7gaFaq2KhvATXLYA0wR1yrMrM5uFrry94fnzwbZe7oJX9mLY1krAH1+maJkpTaLzX0UDdKgwASpuhRGs45Abfba9h9Qt7KXxVoVqr9hTKBGlopxBeCUoVrUC0gWS+vJhJU7QGKcLtzTXA7c7hYg1q/5nRTdrvVSLCzPR04v77uwewMvtbCq51b68piIkXiyOmuLK7Cgvm5mcTk0ydQIfxsVHr+tHRgTWJmJAkN6EVIgIzxw3CgbhNEABYGOB23/iJCYijQR66JRf238VPan2tAkVmbwmLLx5eazWt8dNcm8bxNja2zGSCSGRUJarxcVqR4dXDrFd/CNIDX9OkXPHOtq32VGNo4M/0YC7SwsnFk9WWegoyQ1rq5zvQBLwdb3YqGDB4BTLgcAvLy5P2/H4jAa8jQzpxLH+GIUdCzZuTk/O/+ATFl5q3F/dq7gAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Defend your thesis (Masters or PhD)',                     condition: { type: 'milestoneLabel', label: 'Defended' } },
  { id: 'talk-delivered',  name: 'On Stage',            icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAKpUExURQAAAAAIAXB0aAEMBHh6fXd5fIiKhwMJBQQJBgAHAAQNCQgQDQkQDQYOCgALBBccGisqKywqLC0rLQQMCC8vMCYnJwAPBAEIAgAIAaustwgPCQoRC///7gIJAwIKA2BkZ3d4f5mWm29zZxIcE4J9i2RhbJCRlAALAwALAwgOCo+Rl1peXtva5GtucAYOCJygoQ0VDo+Sk////wUMCCkvLl5kZ3R2eXR2eQAJAAAJAmRoawMJBQMJBUVNTIiKhwAJAQAGAAEHAwALAgEIBAILBwcOCwcPDAgPDAALAgQNCRMaFAAKAgIMBwAHARUaGCopKispKwIMCCwqLAILBi4uLwEIAycpKiUmJgEMBAEKAwEIAQAEAAADAAUNBwcOCAgPCXN0e5COmKyns3p5goWDjYWFj66st87J1sC7x4uKk4OCi4OBi6yps9TN2c/J1q6stkRIS3J1eICAiIGAiYF/iaCdqKups5CPlYqLkGhqcoqLk5ybpp+dqp+dqaims6amsJaZnZeanX6BgwUNBjE1NmtudHh6g3h5g3d4gnZ4gX2BhpOYmgIIBDxAQ0dLT0VJTkZKT0RITVFWWnZ9f0BERkVJS0NFSUJFSkFGSklOUj9FRFtfX25ucW1tdF9jamFla3N3dra1ubSzu4+Olo6Oki4xLWViZldVWUE+PjMyLzEyMExKSSElIR8gGzc1MDExMU1KSiUpJCIjHjc0MDEzMFhYVlNRUEpFRTQ0MTI0MVlZV1dVVE5ISFhZV01ISE5ISTU1MjEyMllYV1lXVTY1MzExMllXWVhVVykrKjEyMVpWWldTVzIyMi8wMVlVWlVSVjk3OS0vMVdUWlNRVjg2OVhVWlJRVjc2OllWW1JRVzY3PEdHSkJERywvMQoUCwkTCkJBNTc4LQAAAPE7wvMAAABddFJOUwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkGtLQECL7h9fquAwfb+bMIxPbcBPOz63vfAaHw64YGAt3FB6X0x8bHx8fHx8fHx8zHyzrHrrGxscexyrGj9rKx+ZqxnedTowsAAAABYktHRACIBR1IAAAAB3RJTUUH6gUTBSgKSgRgGgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wNS0xOVQwNDoyMjo0NiswMDowMGGATP8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDUtMTlUMDQ6MjI6NDYrMDA6MDAQ3fRDAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA1LTE5VDA1OjQwOjEwKzAwOjAwXS4tOQAAAUhJREFUOMtjYKAiYJSQlIqNi5eWYcKhQFZOXiEhMUlRSZkZuwIV1eSU1LT0DDV1DewKNLUys7JzcvPytXWwKygoLCouKS0rr9DVw66gsqq6prauvqGxqRm7gpbWtvb2js6ubn0D7Ap6evv6J0yYOGmyoRF2BcYmU6ZOmz5jpqmZOXYFFpazZs+ZO2++FQsrdgXWNrYLFi5avMSODUdIsnPYL122fMVKB05ckcHuuGr1mrXrnJhxKnBev2Hjps24FXC5bNm6bfsO3Aq4XXfu2r0HjwIet517d+/Dp8AdqGD/AQ+cCng9Dx46fMTLG7cjfY4eO37Clw+PgpOnTp/x42fAreDsufMX/AXwKLh46fKVAEHcCgIvXr12PUgIpwLh4Is3bt4KEcGpgD007Padu+GiuBWIRdy7HxkljlMBA2P0g4cxzIwM1AUAk6htgwG2bicAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Deliver an invited talk',                condition: { type: 'milestoneLabel', label: 'Talk delivered' } },
  // XP career milestones
  { id: 'xp-50000',        name: 'Established',         icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACQElEQVR4nMWXMW/TQBiGH1cJQ5SBMsAQiYShE2oZEFOUtQMKrPwAxJKhElslJDZmJA9Z+AEVK646tGszVkKtkJCQmkQoUkIFZIgsKBVmcM7xnc93sROad7LvfPc+9/m7zz4Hx2GVWlup+4IAQcr1tQEsRXkBgsuvzyFceXB5VhLX1wYgye+Vc491cuwCsXr8jx4ApdoEgBubfjhnBi0UAWG8SASyAgRXQze8Gu9JEABvn21CxlzIFYG14gNt+/bWj+xzZXg2GHoNAP5e7EodIgobT3+yv1OBDFEwJWFiEhF+FUDVNBmTXhYAyTB614ps5jr5vTI3n3zTAhXiLUOvwfrGr8wGNpVqE8be7eg+DpOIwKc3FSB8n8vUlw/rdEfQdAczb+QkdADuvxrQHYUD/re5ChB1NN3FIURxMpmHN/pdEADs71S4dwcqW3+kgjOPhDGkm5sAEhDdEWy/0OdFvBSXahMO380iZzK3AUQQ4uMjyq/OOA4gFKsHqSa2Sqgd6PfKqR8gTbtxhTaA4PfnRzaDVM1Tluf/Foz3EubHR0WOj4pSW9ZkLdgfCRU3V03FfVqSmmRNwun/XgSgmqtSIWx/SaYIBK16FbjA75UTxrHtRate5fHDK4BoCwqQVr1Ku9MP0iCMOfB69y4gr/rgpKDubafd6dN0BxyczNYjQARYmoyFaOg1+H56TncUGrc7/bixdgxE2R9pCqwdY03Cw9NbvHx/ZjOW+pvuQAuiHzDfH1HeE6x1jjzngqVq5WfDf45r3F2wsC5cAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Accumulate 50,000 XP',                        condition: { type: 'totalXP', xp: 50000 } },
  { id: 'xp-100000',       name: 'Well-Cited',          icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADNklEQVR4nO2XW0hUURSGv7ESu/cgBkolUVhQVhQhCEYSdEEKrMCiejCiG2VKUSEYPXRDKwqqhxrLtJoXIVNESDOt6ILSxSBNozBGzMYaLWzKy+6hZncu+3hmxode/GFgr73/vf5/L9Y5Zw8M4z/DEerG/u4a4R+PmLAk5DxBb+zzOqWwI2yGkhOMobBQxQHEQIuSp62OHQJ22t9dI6wEhe/jv4QRU+R45KSttvkHJRhPMtBTgCMiUSeoS6YRD9SE5aJK3Iyphrj1r5HEgE0E1AMF2ZspPFapWGk1/P7g8bV89q47LGNj79ga0J7+xpF9bM5OZ96CeDI2ldmafeJqIiEtjg0pM225SgPG0j9pcAMQv2oR37/5bBPmFTYDkJAWR/ryTDlvVQWTAW2n70ldz8m8VBlvXB1JlfO+pfjaZBfFjxplPG58hG5dZcK2B8bMOi7HSSsiuXnHY8n92qPvtXNFKbpeUDWjbiJ/z1Sxcs0CGUctzgJgoKdat+ld1V0KXG9lHDkxHICMKw0ACO9+HT9nW6kuPlH6WerKwa5lUeJkXipjp28wncxoAKDXXS7HO3Y1cvVuKSJ8rkncD+Frp6/TI/nXn3Y7dAbq81OE8+YzzhWlKLb/e961wv5kzpJ1StFe92vTnFYcND2wML3MAXDr1HNFqlZ63eVKcRWErx3ha9fN/fD8NInrDABcrOxwFNe6eVfVZHuS+gej5Nj4ZPR1emS5/cjMea80a3oKSuo7HAfPNA8qDlBe9RZnSRbOkizuVH+35QOm0ysNaDFYMi0mjhZB8W0NJM0epYtb6rpoqetSJnhVXmcSr63wUFth/b7QwlSS05tixM7MGBlfOuvm9kMvANnbJpO0IlKuvXkZxdG8e7gK5+jEt+S2AXD9QLTkt9R1Eb+9yaQ30sqZNlHbhwsI30eSE3I5dvmTyQiA61o7V0s7JR8gOnY35LZReWoaMbH617JlBQCiJkUIbSIjls7fS5O3H3fjIQCSE3IBqH5xXsmPjt0NQIfXN/ir2AjVxyOY25AfIV9IlB8PhVCo4hDktdyqIlYGhnwp1Yn7vgjHr4aAuMH8LwiqAlb3/aH8MxrGb1rKYfGRn8uCAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`,   description: 'Accumulate 100,000 XP',                       condition: { type: 'totalXP', xp: 100000 } },
  { id: 'xp-175000',       name: 'Distinguished',       icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACVklEQVR4nOWWz2sTQRTHP9umtAhGK0JbaxEbRaEXKYIKIthelRw06MWD+QNEEDz1IvQqlB4F00O9SDwY1GMTFaWliJeiFTWptdi0hDYBQdq0OB6yO81uZpL9kXrQ72nnzZv3/c7Me28W/ncYDebFbvPoJiTx4uPz0th74aqW4cfrJ7bx3GwOgEv3l+vyqQSIbComB5Fokol4p5ZYh8K64O7TEtlUjO8LawBcvJ2u4XQKENlUjFdTC8TH30ljKXUcgL2DVwDY+vxQSfrtvem/2QHA2ZElOZe4dZqj/eEaES2qQCa5oRDoBwZgVG+oGkoBfxM1AkIbea3zZuHj7gvY7uhpOomF/p5yQwFGJJrErAJZip/mNqSDCHX74RaZsSGOXHsDjrxykwNGdTa7hbmmYRKrBDhPQZ5EeWmecj6tDGSVoAMCc/eqHgAQ0ggzItGkyIwNATD5bBWo3F9LcVqzpAKrBwDEhwe4cblLS641OnawE9xsSK3hA7T9ztkcq5uQ4so8vwVaMTOjfQCcOreTmBb59Pw2NxNFT7G9NCIDUO3ON7knRwfEzGgf+9srp/B1pc169TzHC9LrxfM7hwB8k4O+ClzhxMmw+bVc168eAj1G3cf2BVkeXEAz4FeA+Jk5Iwdmafr6f/QiwGrLNnKFCFv7bgRPjej64MEaY294S34XWw8DkJj64Dq2pyrY09nFr+Iqj16MSFs5n6bwZR2Aew+KuqXNEWBhcfZt1ag9UC27vQIBYF3BSsl+xS9za77juxYQHx5w6VqB2zzwdAI+0Izf+n8cfwBb4bzp+JdUYgAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Accumulate 175,000 XP',                     condition: { type: 'totalXP', xp: 175000 } },
  { id: 'xp-260000',       name: 'Eminent',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADNUlEQVR4nO2WW0hUURSGvxOiPZRQ9hBEGVGDdHkoI9Aos6xeLKzIgRmw6GITBQUJaT1EQk43IumqRWQ0UWb0YpGlSTfFmmlIrGCI1MyuTN7SmDJ2D805nNPZc+yKEP6wYe/1r73Wvy9n7aOAQn9iUL9mHxAwIGBAwP8gQITbPxUQKYEoyh5PUfZ4S58/FSAu5kz8qUCyuWU75vQ5N+o3AqtQ1hU/U4NLHxTR/a7PIOoO/M5ZigLXPApc89T5vzRXN0cBFFG9a5oARYTHgCKKsieIizmThNs+RuW0prfJ+KLsCVr7MW6g1K7ZLI9gXfEzANz20bjtow3cZf8XegObAIiyFZr4Dx0h7jV8pPxxmyluTO8bra8egZK63U+gNBNAZKUnCoBQkzuiuNVzhmh935EUqU/54zY+vy5ThwIQwYoM4h23IXxvLL+CmLF5hJrc5F1oMXHq7gAkbrhl4vMutPD5dRn7dx4DICs9UZrDJCDU5OZMuY+VyXEAdL36YKXREl31Z9l2vIqs9ETOlPsIVmRw80bA4KO/A4ots1SEmqaaAvUGNhFlKzTZrPhgRYZU1PL9T0D32Zp2oOHKNXxHUjhdE6Snzkmz/76eVrD+iTTw9d5mghUZEVcvFdDZ3gl8v1hPvS8BaPX61RULQOhXr0LP99Q5DVyk3QBJJaxtGU7jgQZc+QkGu06EhvVJ5wEovJoGQE+dk+hhI+hobDYlynXUMn3ZUJPdtAM1dx7iyk9gx9F6zTZr32AAOhqbteDrk85z2LeZJXFTyFx1lU/t3Xxq79b45D2jgO/HkOuoZfOJjXgvdfUtYNHMOA55GtjiGAvAkpMxOFc4NREAX6NHAlC1oMoUUE2+dPEMUrf7+Rprw5WfwMG1h6W+0jqQNHkYJVde4H3UyuU1ITwlHpwrnDJXKfZuXYinxEPlITsP7tZw/fZzxqVFm44VQJFcahF+4wEYHhut9efOtxkccx21AOw+l2SwF5/yGcYLZo8DtIJlSCgTAOGXKlyaNVRXPpT5mpCaNo2u92+1sa5SmpJFEmAQokIVFD/DWKx+rJYjkvdJ8sjRlwBLQRb46aC/KuCvo99/y78BnXVE4Xl7VmsAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`,     description: 'Accumulate 260,000 XP',                       condition: { type: 'totalXP', xp: 260000 } },
  // Hidden achievements — revealed only on unlock
  { id: 'deep-thinker',    name: 'Deep Thinker',        icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADWklEQVR4nO2XS2hUVxzGf+ea5GbqYxhISJBkBJ3gA6G0hoIJNYIt1IVKzEJBKSgYKKWgdRPjA0qymE1qaejKkk2RuqiK2BrFhUQJgvjGCjHBRR5D0tGM40xmcpOZc7q4ycxcJ7kPrd20/83c8z/n/33fOd85d86F/+O/HsJrQetWv2r5bI0llzISADR3DHrGLPHIrwA213/wRtpsXzwJzR2D6sS+IJ1nh10JcS2gdatfHT6wkrrGDxfsTw+Nsq2xiqlbQS5ceQUMK1yshiuVX9b71fenQvg31KEFe0DGAZCjRxAlOipjWMbHnw7S2x+l7+EKfr72xJZDc0P+Q3gzK1avMskBachc/5vkAP4Ndew91EDTxzrM2bZYOFmgzpxpQJT6WLJyVz6bugR6M1R2oenmHOTokaLiTetSDvAuViBr+Oaelpo/yR/R9Neg+U1iQyINmVudwghtWs/XzRW2+Hb+qOfnG6hZW11cVNuNpmuo8TazXR0GzY8cPlgMMj1D2cYLi3LZWrA0XeyvKC9DxNqRBd4rQwIxO6hFw9UxFLXd+Ub0qHXjVXah+QKoyFfmbqvsAkDzBcg+2++I7bgH1GzaJBj5xiwo8FoL9qD5AsjIt6bQEh0Ra0fE2s3+mrZ3EzDl04tyMh2zPss4gvSC9Zl0HDW7cN98OL2IlPFguzmw1GdaET1qBSixihTVYZN8qI1sMkEkMkto9+VFeRwtyCmZt2J6Jl9ccxpRHSabzI+ThiQzlF/60O7LtrhOAoT+UW+ukfmzBVHbnRMx/0bUyg1UxkBUHEeOtCNIIEjw6y8DjhNz81+gfvvuU3bsXIYo9eWSorzMCjRnRTYJggSxgRhVLTccOdxYIAD6+5K2G0plzFXQyg3X5K4GFHKc2Bfk1LH6otkXxuSjCdfk4GETAqLz7DCjA+O25Kd7Hrsm9yoAgLGRKctJKIzXr6YI//HSE55XAeJc35jtKngNr3dCfrr4gmRcJznjbab/mACA4Cd7CK0JUVO7Kpe7c+82x453/jsCJidjRJZHiPwVseSbtjSSSE1z/+699ytgfCLK+ETUkksZBn03+9n+xeeesDyfAoDzl34nZRRfVgB6r1739GHi+cuoIFTTlkYqAoGcqLfBexcBYL1yvxXW312bMPdDBv0WAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Refine atomic notes 200 times',              condition: { type: 'activityCount', activityType: 'atomic-note-developed', count: 200 } },
  { id: 'marathon-writer', name: 'Marathon Writer',     icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB0klEQVR4nO2WvUsCYRzHv0XgILkE9i/U0KCQgikRXRhpEFK29kJDSy4KOjTUkENOLg2SjTcIjUFD1FpDDtFgHAYuYWHD+Qc8DXbXPd7bY/eoQ33h4Hju4fl8n9/L8xzwryFrpM/rEzvmKG9ivnCqQEldqqH76TY1xtuAEAnhM5cl+7vb1Ph99dFwPk8D6s5Y4QC/GiBtWcbH+5sKDPr86rvX7QIALK4kdEweNUDBX1+eEY/GcHZ+YQs3HHAKD4QFHOdPsBwJqJPM4ICzCJjCk2urAADPxKQl3PKDHfy7pQB08hyPxig4AMwG52wZv4kABb+7vTaET03PMC3WqwHSlmUKvrG5pYMDwLjHAzBEmPkcECsiCfr8VKsZwdOHR8orU3p7qQECAHWpZppzudVEICwgNC/gqfrAtDZrBNS8a+HaVpMaDXjdLubQ92pAB1ckt5oAAK/bZdtyRmIpQqrqFWl3D1gfNk4NAPjZfSqT5gZnNqBcLqlMGkvCAjc4swEzOYWzitSlGllPJohYEcnN1SVBpyWNfrf4w/OFU5LJZbXQgYBVeLlU7CvULH+kXCoCAHb2DqzmOZZREVIXTr9l2QX93r2ZiFgRB1psOgPDhP89fQFcCOY7/ZChpAAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`,    description: 'Log 250 writing sessions',                    condition: { type: 'activityCount', activityType: 'writing-progress', count: 250 } },
  { id: 'milestone-chaser', name: 'Milestone Chaser',  icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABeUlEQVR4nO2Xv0rEMBzHvxU57jj0BJcbHMSncHDxDRzuxdTXyFAcFM8DndzENyiF86SL4AkS6VIXG36NyS9JTa2DXwikTcnv09+/pgmSDfSpfq0D2GTWKjJPugKweaBKhUCRZzg/O9VhosrqgeXzCsuLVVd23QCXi0XnxgEgYapAzwFXGFrlCVsFqRDfYNbFkxqaKvCQxvVoZajBmoZRXBm2VpFnaj7dP2Cf9QYo8gyj4QCT6Z66J9cvan59cxvCqOQVAvpGNp3MZuw6haViPbCzPXYaprqbXwFout1m2AugFt2QZv9oshsEaFK0KqjfXlcpJUoprbDRquD17V3lAXW7y0veAPWmdEMaDlodIfIKgSuRTCqlbFwbOieAyI0oFQLHR4cNL9UlLD/KnwGYYhni9tFwYLzvFYIv4wkzAPDNyAbr6wHXp7Zer3RDpIcY94j9MQo+E/R+Kv4HYAHuHx77BfgN/W2ArXHYgaSNQv4LOhHXiDozSvUJUGdxoeBh+EUAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`,      description: 'Complete 25 project milestones',              condition: { type: 'activityCount', activityType: 'milestone-completed', count: 25 } },
  // Stretch achievements — late-career
  { id: 'grand-zettelkasten', name: 'Grand Zettelkasten', icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEXElEQVR4nO2XbUxbVRjHf7wmSMZLx0tx43WlpLCNN8c26TQzkoZmWyR+MDZuzg8sBpdoQogxG4ZE1ClZYkhcTCYmWzRL/KBmwy6GJbgIupXJkMHEDi0CidBCgRrCgsD1Q3dPe7n3ls2Xb/snTc557nOe//+5fc5zzoWH+J9grqyU/rNgdqtFCtydkwJ35yIGtRYbJfm3ka+MqI2Ikw0xABw7WAjA/vovVWusxUYFWZIhFQB5LcCFi0OaXJrG6cFz0msn2yJpU6DKZMI1OirmC/5VBTnAxOgMPbenVHwqQ3jWMj5obRLjvu8H+MzZpRKxZytkZRp5su6wsK1PQkuEYmK3WqSaqqJgVrvLsFSU0/VrPGfGE4VPe24/AKc+/FghMMF8iJMt7yoITzhKFPOXGk4B4Oz5WfCKgd1qkQAeL8iioflV6rpTVVmGoz23X4gYMtrJq3WIZwFfQOFb+lsnJxwlvP1eB6O/+xQiYmVyU266WPDWt4uAUkBF1KQYr3o/pcMXJAYwPHZAkB7fe5WRFTdX5uqF/08FBwAPAO4JL7tKs7AWG6We21NRseszS0xLYhbw3+hki+km1flGAPzztQq/vjgHMAjA06lnhX1kBIWt1zPFUkozcQkp66kAiNa03stKMU+5zLW5tTDyEHzuWc0YvZ4pvfBiq+oK0MNoWjFphdsBME7ewjh5S9e3Ot/IAi9GjKcpYE+2ugCdHpsgBkjm3IZinR4b8Sk5Dy5ARlxhG72eKVyxjQrycFiqIzbTDbHhXxBX2MbMnSGqVk4zc2dI0yfdvBmfexZXbCNOjw1XbCOfd2Upsp9O2PnPBAAie3v+N1StnCbgC7CU0szU1h3CRy7M8Dflv9EJwPL8uG7saEDVt7WgV+l6kBvT8b1XI/o98C5wemyadq0a2Z87xHcXfwAgc2lQc52qEUWCzz1LfLq6qq/M1ZOUrvZf3y/CoWjF4VicCbbU5flxSA9l5Sl+554KZZ/vi3MQfx/i9RDxDchV/4mjWthedgY0feWz4NKRUGHadHZNRAHe1RUati1Ts22TsLW8HupmTfsqeeLomxw8H+qAH9mzyVwa5K+ledqPtTC2Gjw/vm55TpN0wb8qxlEQvFJVlJuFMSMmqOtRUw4L8/MUmvOVIr1zFBXl4bo+gONoXZDsq+6ImVbuLqPj/Bc4e4YxZ2eoa6D/ppuKcjNlRQVi0YVr08GBfMSFoaUoT0EsfNfBsnMHZY94+fH6ANWH38DZ84LiuXgDsiHJkIp8N3D2DGNMjFMF9SZsYW1mjFee3UeX6xfcE17yS6rwDLs0RewqzRLjBf+q9o3IWmyUsk1ppG8yCGffn36ySFAFzLM5aH+/VZckEnQFyCIgdFbLSDbEqIT8wdJ9EULoSl5jr5W6nJf1L6UAptzNUnRaHmszYwCYszMAiF9cjEiynJjImZY6DNYm7BUWzSv4v8Yz5TlS65GndL94nj+0Xeo+Wyet/1B5iEj4G3Q/gSO30XEYAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Refine atomic notes 500 times',   condition: { type: 'activityCount', activityType: 'atomic-note-developed', count: 500 } },
  { id: 'endless-writer',    name: 'Endless Writer',    icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACwElEQVR4nO2XS0gUcRzHP7vZag0+iMgCzfBQiL0OBYISEUKXPCgd8oFBadLjIlSIkIsdTDQQQQ+maITlIURMDyVCi1ihFUVQSh6ikHKDXcXd1X2Q02GdYWZndnfSRYP6wsJv/o/v7zP/1/7HBCY2U+ZNzf4fIAyAuPqLtXR9QwHEib56Ju/XoNd4PcltHdU8a72s8VUCiL3WcgCyju/E1lEdKwjR1lFN1pGDpOzazUDTJZVvnBEDRWyKEZSsiABnc7IpLcqVnwtv3hOfdlt12yYEFnXLex8/Z3t8vPzs8XiNA0jal5cNwLuXrRFa7dCU/Hw9HdV7Q7dhktmrKYsKEDpk0VTQOBy2bnEl4c8BAASXn/NjHwFo9s+qkikTSnEkiDUBGNVQzRkA3tae061f0xRIairJwZ6WyA1LGhB8y662YjlWQnxfcQOw5Pul8ljzFABkTjnInHJoEupBCC4/gsuv8VjXCCglDbVSo3VX5diTaMGTaDHkZegcUBorVXGtT47zb7fLEGbHjGFPDUCS2cuCIxkAYcWj20kabmkktlky5LrCBisDtfUaiOT0OJxfDQBEUkHjMBb7N4ZarqjKl/1B55K73aRWHqOwwcpgVZkhT0NrYN65xKn2EQD8qXvD7vNH1y9g73zDYFVZcB0YOMRUAIKQwJYU7ZkO0F+cJ8d6i1AJYXQBQsgUKIl9Xi29tOWYdRlOALDk8/FlPPjHJAjqs0CzBpqaH7LgDlBZfAKPWVDVZbyawbUsEgjps3X/nqgQt1qe4HW7uVh+WlWumgLbiw8AlBbl0tk3pjFxLevfRQKff2CfdmKfdtJe1wOgOojaesb/7V8TJ+LEQnXjTBBSBqiA3mYVLkOBQCdX5SN2UdxEp6MRlMJVVFTRzpCJwkBR+ZAzR5F96F/GDGRxmD9dJXAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Log 500 writing sessions',          condition: { type: 'activityCount', activityType: 'writing-progress', count: 500 } },
  { id: 'project-veteran',   name: 'Project Veteran',   icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACb0lEQVR4nO2WQWgTQRSG/66KmIYgraWIglDraQk9KEU0KR6E0kOwYESJtBZJvQQkh1wMNIcKOXuwlxJBjQ1EDRREQYig2RokeGirBTVRKlQkxBYSQ2pq7HiIu2SbnclkU1wEf1g2+97M/z7evrDTBkGAkTK2ukEA5M9lCAAZjTkwGnPIIH8VgIyFRwAAQmmvEmxjDCGhJZS97H21eeKJO/E9XwYA3D37SMnvpJm4Qglm9Yh7gGhAEHvwBABA8iflPPHEnVheXgXZ7MKTK/dVcDQAfHj7iQngCiVkiDrZ7CIQrEJck8ax+D4DAHXFmQA82tqliHsAADAnLcFmF2GTRMxJSwAAyZ+sK14NaM8AOea9rQvq9Y0xyK9BluRP4tDgJXx+eqcOgtoBi9mE4MgpzVynsEEFKIxncFTsRc0s4EEsDt90WHO9VgcaTT8mbz3DwfYic83lC2cAAOn0CuYX38E3HebvwNWHr5jmAedxfPyyporlihV0ChsQTCYAUPKbpRJ2dJupXtRX4LL2oMusTueKFTz+msfE8zQOH+hgQvKK+S/IFSsAoIDI9/y3VaVLWdLOXSx6zsoH4LL2wDszz2lb4AbQkiYAT/HKy5Da6KR7+wB4ikcD+1Sx85MhXRBNAxRmp5Ca6cXu7n5VPBp4gSHvdXQ4Jprya+lzXM6mUM6mWrH4B49klmEP+i9mlOefuR8AgCHvm6bbrwtAhug7HVGexcGbuooDLX6Offf2V01+rej2MHwGNDuwnl7AniN9zI2WYQ8Ss1PK70ZaTy/wA7A21GqXaONeSxP1RKTbsVG9LaJ1gHbk3nYZPoT/AX4DeV/GOMK8JbIAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 100 project milestones', condition: { type: 'activityCount', activityType: 'milestone-completed', count: 100 } },

];

export const TIER_ICONS: string[] = ['🥚','🥚','🥚','🥚','🐣','🐣','🐣','🐣','🐉','🐉','🐉','🐉'];

export const ONBOARDING_XP = {
  // Credentials
  phd: 1200,
  masters: 400,
  postdoc: 400,
  // Publications
  authoredBook: 2000,
  editedVolume: 700,
  firstAuthorPaper: 500,
  coAuthorPaper: 150,
  softwareDataset: 350,
  // Grants & patents
  grantPI: 900,
  grantCoI: 200,
  patent: 450,
  // Recognition
  invitedTalk: 200,
  conferenceTalk: 100,
  majorAward: 400,
  // Supervision & service
  phdStudentSupervised: 300,
  mastersStudentSupervised: 150,
  peerReview: 80,
  thesisExamined: 150,
  editorialRole: 300,
};

export const DEFAULT_SETTINGS: XPSettings = {
  sourcesFolder: 'Atlas/Sources',
  ideasFolder: 'Atlas/Ideas',
  projectsFolder: 'Efforts',
  atomTag: 'cards/atom',
  readingStatusField: 'keywords',
  readingTagSkimmed: '👀',
  readingTagCompleted: '✅',
  atomNoteTagField: 'tags',
  projectTagField: 'tags',
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
  xpWritingProgressPer100Words: 20,
  writingProgressWordThreshold: 100,
  atomicDevelopmentWordThreshold: 50,
  atomicDevelopmentCooldownMinutes: 60,
  xpWritingSessionBonus: 50,
  writingSessionBonusThreshold: 500,
  xpDailyPresence: 5,
  projectTemplates: Object.fromEntries(
    Object.entries(DEFAULT_MILESTONE_TEMPLATES).map(([k, v]) => [
      k,
      { milestones: v.map(m => ({ ...m })) },
    ])
  ),
  manualActivities: DEFAULT_MANUAL_ACTIVITIES.map(a => ({ ...a })),
  tierNames: ['Dormant','Stirring','Kindling','Breaking','Wisp','Flicker','Blaze','Inferno','Drake','Wyrm','Dragon','Nova'],
  statusBarIcon: '⚗️',
};

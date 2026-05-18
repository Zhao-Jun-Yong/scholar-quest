import { AchievementDef, PluginData } from './types';

export function checkAchievement(def: AchievementDef, data: PluginData): boolean {
  const { condition } = def;
  switch (condition.type) {
    case 'totalXP':
      return data.totalXP >= condition.xp;
    case 'level':
      return data.level >= condition.level;
    case 'activityCount':
      return data.activities.filter(a => a.type === condition.activityType).length >= condition.count;
    case 'milestoneLabel':
      return data.activities.some(
        a => a.type === 'milestone-completed' && a.label === `Milestone: ${condition.label}`
      );
  }
}

export function checkNewAchievements(data: PluginData, defs: AchievementDef[]): AchievementDef[] {
  const unlocked: AchievementDef[] = [];
  for (const def of defs) {
    if (def.id in data.unlockedAchievements) continue;
    if (checkAchievement(def, data)) {
      data.unlockedAchievements[def.id] = Date.now();
      unlocked.push(def);
    }
  }
  return unlocked;
}

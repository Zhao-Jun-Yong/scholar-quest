import { ItemView, WorkspaceLeaf } from 'obsidian';
import { TIER_ICONS, TIER_LEVEL_RANGES } from './constants';
import type ScholarQuestPlugin from './main';

export const SIDEBAR_VIEW_TYPE = 'scholar-quest-sidebar';

const ACTIVITY_ICONS: Record<string, string> = {
  'paper-skimmed': '📄',
  'paper-completed': '✅',
  'atomic-note-created': '💡',
  'atomic-note-developed': '✏️',
  'writing-progress': '✍️',
  'milestone-completed': '🏆',
  'manual-log': '⚗️',
  'career-init': '🎓',
};

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const d = Math.floor(s / 86400);
  return d === 1 ? 'yesterday' : `${d}d ago`;
}

export class SidebarView extends ItemView {
  private plugin: ScholarQuestPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: ScholarQuestPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string { return SIDEBAR_VIEW_TYPE; }
  getDisplayText(): string { return 'Scholar Quest'; }
  getIcon(): string { return 'graduation-cap'; }

  async onOpen(): Promise<void> { this.render(); }
  async onClose(): Promise<void> {}

  render(): void {
    const el = this.containerEl.children[1] as HTMLElement;
    el.empty();
    el.style.cssText = 'padding: 12px; overflow-y: auto;';

    const engine = this.plugin.engine;
    const data = engine.getData();
    const settings = engine.getSettings();
    const { level, totalXP, todayXP } = data;

    const tierIdx = Math.max(0, TIER_LEVEL_RANGES.findIndex(r => level >= r.min && level <= r.max));
    const tierName = settings.tierNames[tierIdx];
    const tierIcon = TIER_ICONS[tierIdx];

    // Profile header
    const header = el.createDiv();
    header.style.cssText = 'text-align: center; margin-bottom: 12px;';
    header.createDiv({ text: tierIcon }).style.cssText = 'font-size: 3em; line-height: 1.2;';
    header.createDiv({ text: `Level ${level} · ${tierName}` }).style.cssText = 'font-weight: 600; font-size: 1.05em; margin-top: 4px;';
    header.createDiv({ text: `${totalXP.toLocaleString()} XP total · +${todayXP} today` }).style.cssText = 'color: var(--text-muted); font-size: 0.82em; margin-top: 2px;';

    // XP progress bar
    const xpNeeded = engine.xpToNextLevel(level);
    const xpEarned = xpNeeded - engine.getXPNeededForNextLevel();
    const pct = Math.round((xpEarned / xpNeeded) * 100);

    const barWrap = el.createDiv();
    barWrap.style.cssText = 'margin: 10px 0 4px; background: var(--background-secondary); border-radius: 4px; height: 8px; overflow: hidden;';
    const barFill = barWrap.createDiv();
    barFill.style.cssText = `width: ${pct}%; height: 100%; background: var(--interactive-accent); border-radius: 4px;`;

    el.createDiv({ text: `${xpEarned} / ${xpNeeded} XP to next level` })
      .style.cssText = 'color: var(--text-faint); font-size: 0.78em; text-align: center; margin-bottom: 16px;';

    // Recent activity
    this.sectionHeading(el, 'Recent Activity');
    const recent = data.activities.slice(0, 10);
    if (recent.length === 0) {
      el.createDiv({ text: 'No activity yet.' }).style.color = 'var(--text-faint)';
    } else {
      for (const act of recent) {
        const icon = ACTIVITY_ICONS[act.type] ?? '⚙️';
        const row = el.createDiv();
        row.style.cssText = 'display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; font-size: 0.83em;';

        const label = row.createDiv();
        label.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;';
        label.createSpan({ text: icon + ' ' });
        label.createSpan({ text: act.label.length > 36 ? act.label.slice(0, 34) + '…' : act.label });

        const meta = row.createDiv();
        meta.style.cssText = 'color: var(--text-muted); white-space: nowrap; margin-left: 8px; flex-shrink: 0;';
        meta.createSpan({ text: `+${act.xp}` }).style.color = 'var(--color-green)';
        meta.createSpan({ text: ' · ' + timeAgo(act.timestamp) });
      }
    }

    // Active projects
    const projects = engine.getAllProjectsWithPendingMilestones();
    if (projects.length === 0) return;

    this.sectionHeading(el, 'Active Projects');
    for (const proj of projects) {
      const name = proj.filePath.split('/').pop()?.replace(/\.md$/, '') ?? proj.filePath;
      const projEl = el.createDiv();
      projEl.style.cssText = 'margin-bottom: 10px;';

      const titleEl = projEl.createDiv();
      titleEl.style.cssText = 'font-weight: 600; font-size: 0.88em; margin-bottom: 3px;';
      titleEl.createSpan({ text: '📁 ' + name + ' ' });
      titleEl.createSpan({ text: `[${proj.projectType}]` }).style.cssText = 'color: var(--text-muted); font-weight: normal; font-size: 0.9em;';

      for (const m of proj.pending.slice(0, 5)) {
        const mEl = projEl.createDiv();
        mEl.style.cssText = 'font-size: 0.8em; color: var(--text-muted); padding-left: 10px; margin-bottom: 2px;';
        mEl.setText(`□ ${m.name} (+${m.xp} XP)`);
      }
      if (proj.pending.length > 5) {
        projEl.createDiv({ text: `  +${proj.pending.length - 5} more…` })
          .style.cssText = 'font-size: 0.78em; color: var(--text-faint); padding-left: 10px;';
      }
    }
  }

  private sectionHeading(el: HTMLElement, text: string): void {
    el.createEl('h4', { text }).style.cssText =
      'margin: 0 0 8px; color: var(--text-muted); font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--background-modifier-border); padding-bottom: 4px;';
  }
}

import { App, Modal, Notice } from 'obsidian';
import { XPEngine } from './xp-engine';
import { MilestoneItem, XPSettings } from './types';
import { detectProjectType } from './project-type';

export class MilestoneModal extends Modal {
  private engine: XPEngine;
  private settings: XPSettings;

  constructor(app: App, engine: XPEngine, settings: XPSettings) {
    super(app);
    this.engine = engine;
    this.settings = settings;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: 'Complete milestone' });

    const activeFile = this.app.workspace.getActiveFile();
    const inProjects = activeFile &&
      activeFile.path.startsWith(this.settings.projectsFolder + '/');

    if (inProjects) {
      this.renderForFile(activeFile!.path);
    } else {
      this.renderAllProjects();
    }
  }

  private renderForFile(filePath: string): void {
    const { contentEl } = this;
    let record = this.engine.getMilestoneRecord(filePath);

    if (!record) {
      const cache = this.app.metadataCache.getCache(filePath);
      const rawTags = cache?.frontmatter?.tags;
      const tags: string[] = Array.isArray(rawTags) ? rawTags : [];
      const projectType = detectProjectType(tags, this.settings.projectTags);

      if (!projectType) {
        contentEl.createEl('p', { text: 'No recognised project type tag on this file.' });
        return;
      }

      this.engine.initMilestoneRecord(filePath, projectType).then(() => this.onOpen());
      contentEl.createEl('p', { text: 'Initialising milestones...' });
      return;
    }

    const pending = record.milestones.filter(m => !m.completedAt);
    if (pending.length === 0) {
      contentEl.createEl('p', { text: 'All milestones completed for this project!' });
      return;
    }

    const name = filePath.split('/').pop()?.replace('.md', '') ?? filePath;
    contentEl.createEl('p', { text: `Project: ${name}`, cls: 'scholar-quest-subtitle' });
    this.renderMilestoneButtons(filePath, pending);
  }

  private renderAllProjects(): void {
    const { contentEl } = this;
    const projects = this.engine.getAllProjectsWithPendingMilestones();

    if (projects.length === 0) {
      contentEl.createEl('p', { text: 'No projects with pending milestones.' });
      return;
    }

    for (const project of projects) {
      const name = project.filePath.split('/').pop()?.replace('.md', '') ?? project.filePath;
      contentEl.createEl('h3', { text: `${project.projectType}: ${name}` });
      this.renderMilestoneButtons(project.filePath, project.pending);
    }
  }

  private renderMilestoneButtons(filePath: string, milestones: MilestoneItem[]): void {
    const { contentEl } = this;
    for (const m of milestones) {
      const btn = contentEl.createEl('button', { text: `${m.name}  (+${m.xp} XP)` });
      Object.assign(btn.style, {
        display: 'block',
        width: '100%',
        marginBottom: '6px',
        padding: '10px',
        cursor: 'pointer',
        textAlign: 'left',
      });
      btn.onclick = async () => {
        const xp = await this.engine.completeMilestone(filePath, m.name);
        new Notice(`+${xp} XP — ${m.name}`);
        this.close();
      };
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

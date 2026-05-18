// Placeholder — replaced in Task 11
// Minimal stub for settings.ts type import
import { Plugin } from 'obsidian';
import { XPSettings } from './types';
import { PluginData } from './types';

export default class ScholarQuestPlugin extends Plugin {
  settings!: XPSettings;
  pluginData!: PluginData;
  async savePluginData(): Promise<void> {}
}

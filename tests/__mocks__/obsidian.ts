export class Plugin {}
export class Modal {
  app: any;
  contentEl: { empty: () => void; createEl: (...a: any[]) => any } = {
    empty: () => {},
    createEl: () => ({ createEl: () => ({}), style: {}, onclick: null, onchange: null }),
  };
  constructor(app: any) { this.app = app; }
  open() {}
  close() {}
}
export class PluginSettingTab {}
export class Setting {
  constructor(_el: any) {}
  setName(_s: string) { return this; }
  setDesc(_s: string) { return this; }
  addText(_cb: any) { return this; }
  addButton(_cb: any) { return this; }
}
export class Notice { constructor(_msg: string) {} }
export class TFile {
  path = '';
  name = '';
  basename = '';
}
// Type stubs — used only as TypeScript types in vault-watcher.ts, never instantiated in tests
export class Vault {}
export class MetadataCache {}

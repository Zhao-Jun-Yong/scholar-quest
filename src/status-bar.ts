import { XPEngine } from './xp-engine';

export class StatusBar {
  private el: HTMLElement;
  private engine: XPEngine;

  constructor(el: HTMLElement, engine: XPEngine) {
    this.el = el;
    this.engine = engine;
  }

  update(): void {
    (this.el as any).setText(this.engine.getStatusBarText());
  }
}

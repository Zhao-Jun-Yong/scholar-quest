import { XPEngine } from './xp-engine';

export class StatusBar {
  private el: HTMLElement;
  private engine: XPEngine;
  private imgSrc: string;

  constructor(el: HTMLElement, engine: XPEngine, imgSrc: string) {
    this.el = el;
    this.engine = engine;
    this.imgSrc = imgSrc;
  }

  update(): void {
    const text = this.engine.getStatusBarText();
    this.el.empty();
    const img = this.el.createEl('img', { attr: { src: this.imgSrc, alt: '' } });
    img.style.cssText = 'height:14px;vertical-align:middle;margin-right:3px;image-rendering:pixelated';
    this.el.createSpan({ text });
  }
}

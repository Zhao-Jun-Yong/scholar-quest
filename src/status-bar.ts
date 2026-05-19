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
    const wrapper = this.el.createEl('span');
    wrapper.style.cssText = 'display:inline-flex;align-items:center;gap:3px';
    const img = wrapper.createEl('img', { attr: { src: this.imgSrc, alt: '' } });
    img.style.cssText = 'height:32px;width:32px;image-rendering:pixelated';
    wrapper.createSpan({ text });
  }
}

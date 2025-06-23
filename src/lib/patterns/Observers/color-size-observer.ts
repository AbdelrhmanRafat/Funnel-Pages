// observers/color-size-observer.ts

import { GenericSubject } from './base-observer';
import type { State } from './base-observer';

export interface ColorSizeOption {
  panelIndex: number;
  color: string | null;
  size: string | null;
  sku_id : number | null;
}

export interface ColorSizeState extends State {
  options: ColorSizeOption[];
}

export class ColorSizeOptionsSubject extends GenericSubject<ColorSizeState> {
  private static instance: ColorSizeOptionsSubject;

  private constructor() {
    super({ options: [] });
  }

  public static getInstance(): ColorSizeOptionsSubject {
    if (!ColorSizeOptionsSubject.instance) {
      ColorSizeOptionsSubject.instance = new ColorSizeOptionsSubject();
    }
    return ColorSizeOptionsSubject.instance;
  }

  public initializePanels(quantity: number): void {
    const options: ColorSizeOption[] = [];
    for (let i = 1; i <= quantity; i++) {
      options.push({ panelIndex: i, color: null, size: null, sku_id : null });
    }
    this.setState({ options });
  }

  public updatePanelOption(panelIndex: number, updates: Partial<ColorSizeOption>): void {
    const opts = this.getState().options.map(opt =>
      opt.panelIndex === panelIndex ? { ...opt, ...updates } : opt
    );
    this.setState({ options: opts });
  }

  public getPanelOption(panelIndex: number): ColorSizeOption | undefined {
    return this.getState().options.find(opt => opt.panelIndex === panelIndex);
  }

  public getAllOptions(): ColorSizeOption[] {
    return this.getState().options;
  }
}
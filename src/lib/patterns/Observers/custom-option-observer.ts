// observers/custom-option-observer.ts

import { GenericSubject } from './base-observer';
import type { State } from './base-observer';

export interface CustomOption {
  panelIndex: number;
  firstOption: string | null;
  secondOption: string | null;
  sku_id: number | null;
  image: string | null;
}

export interface CustomOptionState extends State {
  options: CustomOption[];
}

export class CustomOptionSubject extends GenericSubject<CustomOptionState> {
  private static instance: CustomOptionSubject;

  private constructor() {
    super({ options: [] });
  }

  public static getInstance(): CustomOptionSubject {
    if (!CustomOptionSubject.instance) {
      CustomOptionSubject.instance = new CustomOptionSubject();
    }
    return CustomOptionSubject.instance;
  }

  public initializePanels(quantity: number): void {
    const options: CustomOption[] = [];
    for (let i = 1; i <= quantity; i++) {
      options.push({
        panelIndex: i,
        firstOption: null,
        secondOption: null,
        sku_id: null,
        image: null
      });
    }
    this.setState({ options });
  }

  public updatePanelOption(panelIndex: number, updates: Partial<CustomOption>): void {
    const updated = this.getState().options.map(opt =>
      opt.panelIndex === panelIndex ? { ...opt, ...updates } : opt
    );
    this.setState({ options: updated });
  }

  public getPanelOption(panelIndex: number): CustomOption | undefined {
    return this.getState().options.find(opt => opt.panelIndex === panelIndex);
  }

  public getAllOptions(): CustomOption[] {
    return this.getState().options;
  }
}
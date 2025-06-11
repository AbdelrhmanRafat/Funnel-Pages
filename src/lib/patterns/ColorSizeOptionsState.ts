import type { Observer, Subject, State } from './Observer';

export interface ColorSizeOption {
  panelIndex: number;
  color: string | null;
  size: string | null;
}

export interface ColorSizeState extends State {
  options: ColorSizeOption[];
}

export class ColorSizeOptionsSubject implements Subject<ColorSizeState> {
  private static instance: ColorSizeOptionsSubject;
  private observers: Observer<ColorSizeState>[] = [];
  private state: ColorSizeState;

  private constructor() {
    this.state = {
      options: []
    };
  }

  public static getInstance(): ColorSizeOptionsSubject {
    if (!ColorSizeOptionsSubject.instance) {
      ColorSizeOptionsSubject.instance = new ColorSizeOptionsSubject();
    }
    return ColorSizeOptionsSubject.instance;
  }

  public getState(): ColorSizeState {
    return this.state;
  }

  public setState(newState: Partial<ColorSizeState>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  public initializePanels(quantity: number): void {
    const options: ColorSizeOption[] = [];
    for (let i = 1; i <= quantity; i++) {
      options.push({
        panelIndex: i,
        color: null,
        size: null
      });
    }
    this.setState({ options });
  }

  public updatePanelOption(panelIndex: number, updates: Partial<ColorSizeOption>): void {
    const options = [...this.state.options];
    const index = options.findIndex(opt => opt.panelIndex === panelIndex);
    
    if (index !== -1) {
      options[index] = { ...options[index], ...updates };
      this.setState({ options });
    }
  }

  public getPanelOption(panelIndex: number): ColorSizeOption | undefined {
    return this.state.options.find(opt => opt.panelIndex === panelIndex);
  }

  public getAllOptions(): ColorSizeOption[] {
    return this.state.options;
  }

  public attach(observer: Observer<ColorSizeState>): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }
    this.observers.push(observer);
    observer.update(this);
  }

  public detach(observer: Observer<ColorSizeState>): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }
    this.observers.splice(observerIndex, 1);
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
} 
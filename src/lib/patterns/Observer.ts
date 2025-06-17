export type State = Record<string, any>;

export interface Subject<T extends State> {
  attach(observer: Observer<T>): void;
  detach(observer: Observer<T>): void;
  notify(): void;
  getState(): T;
  setState(newState: Partial<T>): void;
}

export interface Observer<T extends State> {
  update(subject: Subject<T>): void;
}

export class GenericSubject<T extends State> implements Subject<T> {
  private observers: Observer<T>[] = [];
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  public getState(): T {
    return this.state;
  }

  public setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  public attach(observer: Observer<T>): void {
    if (this.observers.includes(observer)) {
      console.log('Subject: Observer has been attached already.');
      return;
    }
    this.observers.push(observer);
    observer.update(this);
  }

  public detach(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log('Subject: Nonexistent observer.');
      return;
    }
    this.observers.splice(index, 1);
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

// Quantity Observer Example
export interface QuantityState extends State {
  quantity: number;
  selectedItem: any | null;
}

export class QuantityOptionsSubject extends GenericSubject<QuantityState> {
  private static instance: QuantityOptionsSubject;

  private constructor() {
    super({ quantity: 1, selectedItem: null });
  }

  public static getInstance(): QuantityOptionsSubject {
    if (!QuantityOptionsSubject.instance) {
      QuantityOptionsSubject.instance = new QuantityOptionsSubject();
    }
    return QuantityOptionsSubject.instance;
  }
}

// Color & Size Observer Example
export interface ColorSizeOption {
  panelIndex: number;
  color: string | null;
  size: string | null;
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
      options.push({ panelIndex: i, color: null, size: null });
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
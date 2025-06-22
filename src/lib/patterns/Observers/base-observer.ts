// observers/base-observer.ts

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
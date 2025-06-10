import type { Observer, Subject, State } from '../patterns/Observer';

export class ProductFunnelObserver implements Observer<State> {
  private static instance: ProductFunnelObserver;
  private observers: Observer<State>[] = [];

  private constructor() {}

  public static getInstance(): ProductFunnelObserver {
    if (!ProductFunnelObserver.instance) {
      ProductFunnelObserver.instance = new ProductFunnelObserver();
    }
    return ProductFunnelObserver.instance;
  }

  public attach(observer: Observer<State>): void {
    this.observers.push(observer);
  }

  public detach(observer: Observer<State>): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  public update(subject: Subject<State>): void {
    const state = subject.getState();
    this.observers.forEach((observer) => {
      observer.update(subject);
    });
  }
} 
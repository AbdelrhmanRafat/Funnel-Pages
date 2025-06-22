// observers/quantity-observer.ts

import { GenericSubject } from './base-observer';
import type { State } from './base-observer';

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
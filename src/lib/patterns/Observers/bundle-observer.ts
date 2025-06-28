// observers/quantity-observer.ts

import { GenericSubject } from './base-observer';
import type { State } from './base-observer';

export interface BundleState extends State {
  quantity: number;
  selectedOffer: any | null;
}

export class BundleOptionsSubject extends GenericSubject<BundleState> {
  private static instance: BundleOptionsSubject;

  private constructor() {
    super({ quantity: 1, selectedOffer: null });
  }

  public static getInstance(): BundleOptionsSubject {
    if (!BundleOptionsSubject.instance) {
      BundleOptionsSubject.instance = new BundleOptionsSubject();
    }
    return BundleOptionsSubject.instance;
  }
}
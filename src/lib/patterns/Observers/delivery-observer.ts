// observers/delivery-observer.ts

import { GenericSubject } from './base-observer';
import type { State } from './base-observer';

export interface DeliveryOptionState extends State {
  selectedDeliveryOptionId: string | null;
  selectedDeliveryOptionValue: string | null;
}

export class DeliveryOptionsSubject extends GenericSubject<DeliveryOptionState> {
  private static instance: DeliveryOptionsSubject;

  private constructor() {
    super({ selectedDeliveryOptionId: null, selectedDeliveryOptionValue: null });
  }

  public static getInstance(): DeliveryOptionsSubject {
    if (!DeliveryOptionsSubject.instance) {
      DeliveryOptionsSubject.instance = new DeliveryOptionsSubject();
    }
    return DeliveryOptionsSubject.instance;
  }

  public setDeliveryOption(optionId: string, optionValue: string): void {
    this.setState({ selectedDeliveryOptionId: optionId, selectedDeliveryOptionValue: optionValue });
  }

  public getDeliveryOptionId(): string | null {
    return this.getState().selectedDeliveryOptionId;
  }

  public getDeliveryOptionValue(): string | null {
    return this.getState().selectedDeliveryOptionValue;
  }
}
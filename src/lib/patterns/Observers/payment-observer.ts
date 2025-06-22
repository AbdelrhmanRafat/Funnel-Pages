// observers/payment-observer.ts

import { GenericSubject } from './base-observer';
import type { State } from './base-observer';

export interface PaymentOptionState extends State {
  selectedPaymentOptionId: string | null;
  selectedPaymentOptionValue: string | null;
}

export class PaymentOptionsSubject extends GenericSubject<PaymentOptionState> {
  private static instance: PaymentOptionsSubject;

  private constructor() {
    super({ selectedPaymentOptionId: null, selectedPaymentOptionValue: null });
  }

  public static getInstance(): PaymentOptionsSubject {
    if (!PaymentOptionsSubject.instance) {
      PaymentOptionsSubject.instance = new PaymentOptionsSubject();
    }
    return PaymentOptionsSubject.instance;
  }

  public setPaymentOption(optionId: string, optionValue: string): void {
    this.setState({ selectedPaymentOptionId: optionId, selectedPaymentOptionValue: optionValue });
  }

  public getPaymentOptionId(): string | null {
    return this.getState().selectedPaymentOptionId;
  }

  public getPaymentOptionValue(): string | null {
    return this.getState().selectedPaymentOptionValue;
  }
}
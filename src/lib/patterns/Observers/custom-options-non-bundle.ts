// observers/custom-options-non-bundle-observer.ts
import { GenericSubject } from './base-observer';
import type { State } from './base-observer';

export interface CustomOptionsNonBundle {
  firstOption: string | null;
  secondOption: string | null;
  sku_id: number | null;
  hex: string | null;
  price: number | null;
  price_after_discount: number | null;
  qty: number | null;
  image: string | null;
}

export interface CustomOptionsNonBundleState extends State {
  option: CustomOptionsNonBundle;
}

export class CustomOptionsNonBundleSubject extends GenericSubject<CustomOptionsNonBundleState> {
  private static instance: CustomOptionsNonBundleSubject;

  private constructor() {
    super({ 
      option: {
        firstOption: null,
        secondOption: null,
        sku_id: null,
        hex: null,
        price: null,
        price_after_discount: null,
        qty: null,
        image: null,
      }
    });
  }

  public static getInstance(): CustomOptionsNonBundleSubject {
    if (!CustomOptionsNonBundleSubject.instance) {
      CustomOptionsNonBundleSubject.instance = new CustomOptionsNonBundleSubject();
    }
    return CustomOptionsNonBundleSubject.instance;
  }

  public initialize(): void {
    this.setState({ 
      option: {
        firstOption: null,
        secondOption: null,
        sku_id: null,
        hex: null,
        price: null,
        price_after_discount: null,
        qty: null,
        image: null,
      }
    });
    console.log('🆕 CustomOptionsNonBundle initialized');
  }

  public updateOption(updates: Partial<CustomOptionsNonBundle>): void {
    const currentOption = this.getState().option;
    const updatedOption = { ...currentOption, ...updates };
    this.setState({ option: updatedOption });
    console.log('🔄 CustomOptionsNonBundle updated:', updates);
  }

  public getOption(): CustomOptionsNonBundle {
    return this.getState().option;
  }

  public clearOption(): void {
    this.setState({ 
      option: {
        firstOption: null,
        secondOption: null,
        sku_id: null,
        hex: null,
        price: null,
        price_after_discount: null,
        qty: null,
        image: null,
      }
    });
    console.log('🧹 CustomOptionsNonBundle cleared');
  }

  public updateQuantity(qty: number): void {
    const currentOption = this.getState().option;
    const updatedOption = { ...currentOption, qty };
    this.setState({ option: updatedOption });
    console.log('📊 Quantity updated:', qty);
  }

  public updateSelection(firstOption: string | null, secondOption: string | null): void {
    const currentOption = this.getState().option;
    const updatedOption = { ...currentOption, firstOption, secondOption };
    this.setState({ option: updatedOption });
    console.log('🎯 Selection updated:', { firstOption, secondOption });
  }
}
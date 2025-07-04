// observers/custom-options-non-bundle-observer.ts - Clean Version
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

export interface AvailableOption {
  value: string;
  hex: string | null;
  disabled?: boolean;
  qty?: number;
  price?: number;
  price_after_discount?: number;
}

export interface CustomOptionsNonBundleState extends State {
  option: CustomOptionsNonBundle;
  availableFirstOptions: AvailableOption[];
  availableSecondOptions: AvailableOption[];
  maxQuantity: number;
  isSelectionComplete: boolean;
}

// Adapted interfaces for your existing data structure
export interface YourOptionData {
  firstOption?: {
    key: string;
    title: string;
    values: any[];
    hasColors: boolean;
  };
  secondOption?: {
    key: string;
    title: string;
    values: any[];
    hasColors: boolean;
  };
  associations: { 
    [firstValue: string]: Array<{
      value: string;
      sku_id: number;
      hex?: string;
      image?: string;
      price?: number;
      price_after_discount?: number;
      qty?: number;
    }>
  };
  firstOptionMetadata: { 
    [value: string]: {
      hex?: string;
      price?: number;
      price_after_discount?: number;
      image?: string;
      qty?: number;
    }
  };
  secondOptionMetadata: { 
    [value: string]: {
      hex?: string;
      price?: number;
      price_after_discount?: number;
      image?: string;
      qty?: number;
    }
  };
  basePrice?: number;
  basePriceAfterDiscount?: number;
  baseImage?: string;
}

export class CustomOptionsNonBundleSubject extends GenericSubject<CustomOptionsNonBundleState> {
  private static instance: CustomOptionsNonBundleSubject;
  private optionData: YourOptionData | null = null;
  private baseQuantityNonVariant: number = 1;
  private hasSecondOption: boolean = false;

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
      },
      availableFirstOptions: [],
      availableSecondOptions: [],
      maxQuantity: 1,
      isSelectionComplete: false,
    });
  }

  public static getInstance(): CustomOptionsNonBundleSubject {
    if (!CustomOptionsNonBundleSubject.instance) {
      CustomOptionsNonBundleSubject.instance = new CustomOptionsNonBundleSubject();
    }
    return CustomOptionsNonBundleSubject.instance;
  }

  public initialize(
    optionData: YourOptionData | null = null, 
    isVariant: boolean = false,
    baseQtyNonVariant: number = 1,
    skuNoVariant?: string,
    priceNoVariant?: number,
    priceAfterDiscountNoVariant?: number
  ): void {
    this.optionData = optionData;
    this.baseQuantityNonVariant = baseQtyNonVariant;
    
    // Determine if we have a second option
    this.hasSecondOption = !!(optionData?.secondOption && optionData.secondOption.values && optionData.secondOption.values.length > 0);

    if (!isVariant) {
      // Non-variant initialization - use dedicated non-variant values
      this.setState({
        option: {
          firstOption: null,
          secondOption: null,
          sku_id: skuNoVariant ? parseInt(skuNoVariant) : null,
          hex: null,
          price: priceNoVariant || null,
          price_after_discount: priceAfterDiscountNoVariant || null,
          qty: 1,
          image: optionData?.baseImage || null,
        },
        availableFirstOptions: [],
        availableSecondOptions: [],
        maxQuantity: baseQtyNonVariant,
        isSelectionComplete: true,
      });
    } else {
      // Variant initialization
      const availableFirstOptions = this.getAllFirstOptions();
      const availableSecondOptions = this.hasSecondOption ? this.getAllSecondOptions() : [];

      this.setState({
        option: {
          firstOption: null,
          secondOption: null,
          sku_id: null,
          hex: null,
          price: optionData?.basePrice || null,
          price_after_discount: optionData?.basePriceAfterDiscount || null,
          qty: null,
          image: optionData?.baseImage || null,
        },
        availableFirstOptions,
        availableSecondOptions,
        maxQuantity: this.calculateMaxQuantityFromAllOptions(),
        isSelectionComplete: false,
      });
    }
  }

  private getAllFirstOptions(): AvailableOption[] {
    if (!this.optionData?.firstOption) return [];

    return this.optionData.firstOption.values.map(option => ({
      value: option.value,
      hex: option.hex || null,
      disabled: false,
      qty: this.optionData?.firstOptionMetadata?.[option.value]?.qty,
      price: this.optionData?.firstOptionMetadata?.[option.value]?.price,
      price_after_discount: this.optionData?.firstOptionMetadata?.[option.value]?.price_after_discount,
    }));
  }

  private getAllSecondOptions(): AvailableOption[] {
    if (!this.hasSecondOption || !this.optionData?.secondOption) return [];

    return this.optionData.secondOption.values.map(option => ({
      value: option.value,
      hex: option.hex || null,
      disabled: false,
      qty: this.optionData?.secondOptionMetadata?.[option.value]?.qty,
      price: this.optionData?.secondOptionMetadata?.[option.value]?.price,
      price_after_discount: this.optionData?.secondOptionMetadata?.[option.value]?.price_after_discount,
    }));
  }

  private getAvailableSecondOptions(firstOptionValue: string): AvailableOption[] {
    if (!this.hasSecondOption || !this.optionData?.associations || !firstOptionValue) {
      return this.getAllSecondOptions();
    }

    const availableSecondValues = this.optionData.associations[firstOptionValue] || [];
    
    return availableSecondValues.map(option => ({
      value: option.value,
      hex: option.hex || null,
      disabled: false,
      qty: option.qty,
      price: option.price,
      price_after_discount: option.price_after_discount,
    }));
  }

  private calculateMaxQuantityFromAllOptions(): number {
    if (!this.optionData) return this.baseQuantityNonVariant;

    let maxQty = 0;

    // Check all combinations in associations
    Object.values(this.optionData.associations || {}).forEach(secondOptions => {
      secondOptions.forEach(option => {
        if (option.qty !== undefined) {
          maxQty = Math.max(maxQty, option.qty);
        }
      });
    });

    // Check individual option metadata
    Object.values(this.optionData.firstOptionMetadata || {}).forEach(metadata => {
      if (metadata.qty !== undefined) {
        maxQty = Math.max(maxQty, metadata.qty);
      }
    });

    // Only check second option metadata if we have second options
    if (this.hasSecondOption) {
      Object.values(this.optionData.secondOptionMetadata || {}).forEach(metadata => {
        if (metadata.qty !== undefined) {
          maxQty = Math.max(maxQty, metadata.qty);
        }
      });
    }

    return maxQty || this.baseQuantityNonVariant;
  }

  private calculateMaxQuantityFromSelection(): number {
    const state = this.getState();
    const { firstOption, secondOption } = state.option;
    return this.calculateMaxQuantityForValues(firstOption, secondOption);
  }

  public updateFirstOption(value: string | null): void {
    const currentState = this.getState();
    const { secondOption } = currentState.option;

    // Calculate available second options based on first selection
    let availableSecondOptions: AvailableOption[] = [];
    let newSecondOption = secondOption;

    if (this.hasSecondOption) {
      if (value) {
        availableSecondOptions = this.getAvailableSecondOptions(value);
        
        // Check if current second option is still available
        const isSecondStillValid = availableSecondOptions.some(opt => opt.value === secondOption);
        if (secondOption && !isSecondStillValid) {
          newSecondOption = null;
        }
      } else {
        availableSecondOptions = this.getAllSecondOptions();
      }
    }

    // Build complete option data
    const completeOptionData = this.buildCompleteOptionData(value, newSecondOption);
    
    // Calculate max quantity using the NEW values, not current state
    const maxQuantity = this.calculateMaxQuantityForValues(value, newSecondOption);
    
    // Always start with quantity 1, don't use the quantity from data
    const currentQuantity = 1;
    
    // Check if selection is complete
    const isComplete = this.checkSelectionComplete(value, newSecondOption);

    this.setState({
      option: {
        ...completeOptionData,
        qty: currentQuantity, // Always 1
      },
      availableSecondOptions,
      maxQuantity,
      isSelectionComplete: isComplete,
    });
  }

  public updateSecondOption(value: string | null): void {
    if (!this.hasSecondOption) {
      return;
    }

    const currentState = this.getState();
    const { firstOption } = currentState.option;

    // Build complete option data
    const completeOptionData = this.buildCompleteOptionData(firstOption, value);
    
    // Calculate max quantity using the NEW values, not current state
    const maxQuantity = this.calculateMaxQuantityForValues(firstOption, value);
    
    // Always start with quantity 1, don't use the quantity from data
    const currentQuantity = 1;
    
    // Check if selection is complete
    const isComplete = this.checkSelectionComplete(firstOption, value);

    this.setState({
      option: {
        ...completeOptionData,
        qty: currentQuantity, // Always 1
      },
      maxQuantity,
      isSelectionComplete: isComplete,
    });
  }

  private calculateMaxQuantityForValues(firstOption: string | null, secondOption: string | null): number {
    if (!this.optionData) return this.baseQuantityNonVariant;

    // Priority 1: If both options provided and we have second options, get from combination
    if (firstOption && secondOption && this.hasSecondOption && this.optionData.associations) {
      const combination = this.optionData.associations[firstOption]?.find(
        opt => opt.value === secondOption
      );
      if (combination && combination.qty !== undefined) {
        return combination.qty;
      }
    }

    // Priority 2: If only first option provided and NO second options exist, get from associations
    if (firstOption && !this.hasSecondOption && this.optionData.associations) {
      const firstOptionAssociations = this.optionData.associations[firstOption];
      if (firstOptionAssociations && firstOptionAssociations.length > 0) {
        // For single options, the association should contain the correct qty
        const association = firstOptionAssociations[0];
        if (association && association.qty !== undefined) {
          return association.qty;
        }
      }
    }

    // Priority 3: If only first option provided, get from first option metadata
    if (firstOption && this.optionData.firstOptionMetadata?.[firstOption]) {
      const metadata = this.optionData.firstOptionMetadata[firstOption];
      if (metadata.qty !== undefined) {
        return metadata.qty;
      }
    }

    // Priority 4: If only second option provided and we have second options, get from second option metadata
    if (secondOption && this.hasSecondOption && this.optionData.secondOptionMetadata?.[secondOption]) {
      const metadata = this.optionData.secondOptionMetadata[secondOption];
      if (metadata.qty !== undefined) {
        return metadata.qty;
      }
    }

    // Fallback: Get max from all options
    return this.calculateMaxQuantityFromAllOptions();
  }

  private buildCompleteOptionData(firstOption: string | null, secondOption: string | null): CustomOptionsNonBundle {
    const baseData: CustomOptionsNonBundle = {
      firstOption,
      secondOption,
      sku_id: null,
      hex: null,
      price: this.optionData?.basePrice || null,
      price_after_discount: this.optionData?.basePriceAfterDiscount || null,
      qty: 1, // Always start with quantity 1
      image: this.optionData?.baseImage || null,
    };

    if (!this.optionData) return baseData;

    // If both options selected and we have second options, get data from combination
    if (firstOption && secondOption && this.hasSecondOption && this.optionData.associations) {
      const combination = this.optionData.associations[firstOption]?.find(
        opt => opt.value === secondOption
      );
      
      if (combination) {
        return {
          firstOption,
          secondOption,
          sku_id: combination.sku_id,
          hex: combination.hex || null,
          price: combination.price || this.optionData.basePrice || null,
          price_after_discount: combination.price_after_discount || this.optionData.basePriceAfterDiscount || null,
          qty: 1, // Always start with quantity 1, not from data
          image: combination.image || this.optionData.baseImage || null,
        };
      }
    }

    // If only first option selected and no second options exist, try to get from associations
    if (firstOption && !this.hasSecondOption && this.optionData.associations) {
      const firstOptionAssociations = this.optionData.associations[firstOption];
      if (firstOptionAssociations && firstOptionAssociations.length > 0) {
        const association = firstOptionAssociations[0]; // Take the first (and likely only) association
        return {
          firstOption,
          secondOption: null,
          sku_id: association.sku_id,
          hex: association.hex || null,
          price: association.price || this.optionData.basePrice || null,
          price_after_discount: association.price_after_discount || this.optionData.basePriceAfterDiscount || null,
          qty: 1, // Always start with quantity 1, not from data
          image: association.image || this.optionData.baseImage || null,
        };
      }
    }

    // If only second option selected and we have second options, get data from second option metadata
    if (secondOption && this.hasSecondOption && this.optionData.secondOptionMetadata?.[secondOption]) {
      const metadata = this.optionData.secondOptionMetadata[secondOption];
      return {
        ...baseData,
        hex: metadata.hex || baseData.hex,
        price: metadata.price || baseData.price,
        price_after_discount: metadata.price_after_discount || baseData.price_after_discount,
        qty: 1, // Always start with quantity 1, not from metadata
        image: metadata.image || baseData.image,
      };
    }

    // If only first option selected, get data from first option metadata
    if (firstOption && this.optionData.firstOptionMetadata?.[firstOption]) {
      const metadata = this.optionData.firstOptionMetadata[firstOption];
      return {
        ...baseData,
        hex: metadata.hex || baseData.hex,
        price: metadata.price || baseData.price,
        price_after_discount: metadata.price_after_discount || baseData.price_after_discount,
        qty: 1, // Always start with quantity 1, not from metadata
        image: metadata.image || baseData.image,
      };
    }

    return baseData;
  }

  private checkSelectionComplete(firstOption: string | null, secondOption: string | null): boolean {
    if (!this.optionData) return true; // Non-variant is always complete

    const needsFirst = !!this.optionData.firstOption;
    const needsSecond = this.hasSecondOption && !!this.optionData.secondOption;

    const hasFirst = !needsFirst || !!firstOption;
    const hasSecond = !needsSecond || !!secondOption;

    return hasFirst && hasSecond;
  }

  public updateQuantity(qty: number): void {
    const currentState = this.getState();
    const maxQuantity = currentState.maxQuantity;
    
    // Ensure quantity is within valid range
    const validQty = Math.max(1, Math.min(qty, maxQuantity));
    
    this.setState({
      option: {
        ...currentState.option,
        qty: validQty,
      }
    });
  }

  public clearOptions(): void {
    if (!this.optionData) {
      // Non-variant clear - preserve non-variant pricing
      const currentState = this.getState();
      this.setState({
        option: {
          firstOption: null,
          secondOption: null,
          sku_id: currentState.option.sku_id, // Keep non-variant SKU
          hex: null,
          price: currentState.option.price, // Keep non-variant price
          price_after_discount: currentState.option.price_after_discount, // Keep non-variant discount price
          qty: 1,
          image: currentState.option.image, // Keep non-variant image
        },
        availableFirstOptions: [],
        availableSecondOptions: [],
        maxQuantity: this.baseQuantityNonVariant,
        isSelectionComplete: true,
      });
    } else {
      // Variant clear
      const availableFirstOptions = this.getAllFirstOptions();
      const availableSecondOptions = this.hasSecondOption ? this.getAllSecondOptions() : [];

      this.setState({
        option: {
          firstOption: null,
          secondOption: null,
          sku_id: null,
          hex: null,
          price: this.optionData.basePrice || null,
          price_after_discount: this.optionData.basePriceAfterDiscount || null,
          qty: 1, // Always start with 1, not null
          image: this.optionData.baseImage || null,
        },
        availableFirstOptions,
        availableSecondOptions,
        maxQuantity: this.calculateMaxQuantityFromAllOptions(),
        isSelectionComplete: false,
      });
    }
  }

  // Convenience getters
  public getOption(): CustomOptionsNonBundle {
    return this.getState().option;
  }

  public getAvailableOptions(): {
    firstOptions: AvailableOption[];
    secondOptions: AvailableOption[];
  } {
    const state = this.getState();
    return {
      firstOptions: state.availableFirstOptions,
      secondOptions: state.availableSecondOptions,
    };
  }

  public getMaxQuantity(): number {
    return this.getState().maxQuantity;
  }

  public isSelectionComplete(): boolean {
    return this.getState().isSelectionComplete;
  }

  public getOptionKeys(): { first: string; second: string } {
    return {
      first: this.optionData?.firstOption?.key || '',
      second: this.optionData?.secondOption?.key || '',
    };
  }

  public hasSecondOptions(): boolean {
    return this.hasSecondOption;
  }

  // New method to get all available option values for UI components
  public getOptionValuesForUI(): {
    firstOptions: Array<{ value: string; hex?: string; disabled: boolean }>;
    secondOptions: Array<{ value: string; hex?: string; disabled: boolean }>;
  } {
    const state = this.getState();
    
    return {
      firstOptions: state.availableFirstOptions.map(opt => ({
        value: opt.value,
        hex: opt.hex || undefined,
        disabled: opt.disabled || false,
      })),
      secondOptions: state.availableSecondOptions.map(opt => ({
        value: opt.value,
        hex: opt.hex || undefined,
        disabled: opt.disabled || false,
      })),
    };
  }
}
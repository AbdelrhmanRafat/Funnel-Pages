// stores/customOptionsStore.ts
import { create } from 'zustand';
import type { CustomOptionsNonBundle, AvailableOption, YourOptionData } from '../Types/customOptions';

interface State {
  // Main data
  option: CustomOptionsNonBundle;
  availableFirstOptions: AvailableOption[];
  availableSecondOptions: AvailableOption[];
  maxQuantity: number;
  isSelectionComplete: boolean;
  
  // Config
  optionData: YourOptionData | null;
  hasSecondOption: boolean;
}

interface Actions {
  // Simple actions
  initialize: (optionData?: YourOptionData | null, isVariant?: boolean) => void;
  updateFirstOption: (value: string | null) => void;
  updateSecondOption: (value: string | null) => void;
  updateQuantity: (qty: number) => void;
  clear: () => void;
}

export const useCustomOptionsStore = create<State & Actions>((set, get) => ({
  // Initial state
  option: {
    firstOption: null,
    secondOption: null,
    sku_id: null,
    hex: null,
    price: null,
    price_after_discount: null,
    qty: 1,
    image: null,
  },
  availableFirstOptions: [],
  availableSecondOptions: [],
  maxQuantity: 1,
  isSelectionComplete: false,
  optionData: null,
  hasSecondOption: false,

  // Simple actions
  initialize: (optionData = null, isVariant = false) => {
    const hasSecondOption = !!(optionData?.secondOption?.values?.length);
    
    if (!isVariant || !optionData) {
      // Simple non-variant
      set({
        option: {
          firstOption: null,
          secondOption: null,
          sku_id: null,
          hex: null,
          price: null,
          price_after_discount: null,
          qty: 1,
          image: null,
        },
        availableFirstOptions: [],
        availableSecondOptions: [],
        maxQuantity: 1,
        isSelectionComplete: true,
        optionData,
        hasSecondOption: false,
      });
      return;
    }

    // Get first options
    const firstOptions = optionData.firstOption?.values?.map(opt => ({
      value: opt.value,
      hex: opt.hex || null,
      disabled: false,
    })) || [];

    // Get second options
    const secondOptions = hasSecondOption 
      ? optionData.secondOption?.values?.map(opt => ({
          value: opt.value,
          hex: opt.hex || null,
          disabled: false,
        })) || []
      : [];

    set({
      option: {
        firstOption: null,
        secondOption: null,
        sku_id: null,
        hex: null,
        price: optionData.basePrice || null,
        price_after_discount: optionData.basePriceAfterDiscount || null,
        qty: 1,
        image: optionData.baseImage || null,
      },
      availableFirstOptions: firstOptions,
      availableSecondOptions: secondOptions,
      maxQuantity: 10, // Simple default
      isSelectionComplete: false,
      optionData,
      hasSecondOption,
    });
  },

  updateFirstOption: (value) => {
    const state = get();
    const { optionData, hasSecondOption } = state;
    
    if (!optionData) return;

    // Find the data for this option
    let optionInfo = null;
    let newSecondOptions = state.availableSecondOptions;
    
    if (value && optionData.associations[value]) {
      optionInfo = optionData.associations[value][0]; // Take first match
      
      // Update second options if needed
      if (hasSecondOption) {
        newSecondOptions = optionData.associations[value].map(opt => ({
          value: opt.value,
          hex: opt.hex || null,
          disabled: false,
        }));
      }
    }

    const isComplete = hasSecondOption ? false : !!value;

    set({
      option: {
        ...state.option,
        firstOption: value,
        secondOption: hasSecondOption ? null : state.option.secondOption,
        sku_id: optionInfo?.sku_id || null,
        hex: optionInfo?.hex || null,
        price: optionInfo?.price || optionData.basePrice || null,
        price_after_discount: optionInfo?.price_after_discount || optionData.basePriceAfterDiscount || null,
        image: optionInfo?.image || optionData.baseImage || null,
      },
      availableSecondOptions: newSecondOptions,
      isSelectionComplete: isComplete,
    });
  },

  updateSecondOption: (value) => {
    const state = get();
    const { optionData, option } = state;
    
    if (!optionData || !state.hasSecondOption) return;

    // Find the combination
    let optionInfo = null;
    if (option.firstOption && value) {
      optionInfo = optionData.associations[option.firstOption]?.find(
        opt => opt.value === value
      );
    }

    set({
      option: {
        ...option,
        secondOption: value,
        sku_id: optionInfo?.sku_id || null,
        hex: optionInfo?.hex || null,
        price: optionInfo?.price || optionData.basePrice || null,
        price_after_discount: optionInfo?.price_after_discount || optionData.basePriceAfterDiscount || null,
        image: optionInfo?.image || optionData.baseImage || null,
      },
      isSelectionComplete: !!(option.firstOption && value),
    });
  },

  updateQuantity: (qty) => {
    const state = get();
    const validQty = Math.max(1, Math.min(qty, state.maxQuantity));
    
    set({
      option: {
        ...state.option,
        qty: validQty,
      }
    });
  },

  clear: () => {
    const state = get();
    const { optionData } = state;
    
    set({
      option: {
        firstOption: null,
        secondOption: null,
        sku_id: null,
        hex: null,
        price: optionData?.basePrice || null,
        price_after_discount: optionData?.basePriceAfterDiscount || null,
        qty: 1,
        image: optionData?.baseImage || null,
      },
      isSelectionComplete: false,
    });
  },
}));

// Simple hooks
export const useOption = () => useCustomOptionsStore((state) => state.option);
export const useFirstOptions = () => useCustomOptionsStore((state) => state.availableFirstOptions);
export const useSecondOptions = () => useCustomOptionsStore((state) => state.availableSecondOptions);
export const useIsComplete = () => useCustomOptionsStore((state) => state.isSelectionComplete);
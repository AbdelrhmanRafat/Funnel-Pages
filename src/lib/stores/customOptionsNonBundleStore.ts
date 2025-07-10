import { create } from 'zustand';
import type { UserOptionData, AvailableOption } from '../Types/customOptions';

interface State {
  // Current selected option and its details
  option: CustomOption;

  // Full data for the product options (variant structure)
  optionData: UserOptionData | null;

  // Available selections for the first and second options
  availableFirstOptions: AvailableOption[];
  availableSecondOptions: AvailableOption[];

  // Flags for state logic
  hasSecondOption: boolean;
  isSelectionComplete: boolean;
}

// Structure representing the selected option
interface CustomOption {
  firstOption: string | null;
  secondOption: string | null;
  sku_id: number | null;
  hex: string | null;
  price: number | null;
  price_after_discount: number | null;
  qty: number;
  image: string | null;
}

interface Actions {
  initialize: (data: UserOptionData | null, isVariant: boolean) => void;
  updateFirstOption: (value: string | null) => void;
  updateSecondOption: (value: string | null) => void;
  updateQuantity: (qty: number) => void;
  clear: () => void;
}

// Helper to create a base CustomOption with default values
const getBaseOption = (data: UserOptionData | null): CustomOption => ({
  firstOption: null,
  secondOption: null,
  sku_id: null,
  hex: null,
  price: data?.basePrice ?? null,
  price_after_discount: data?.basePriceAfterDiscount ?? null,
  qty: 1,
  image: data?.baseImage ?? null,
});

// Helper to map option values into AvailableOption objects
const mapOptions = (values: any[] | undefined): AvailableOption[] =>
  values?.map((opt) => ({
    value: opt.value,
    hex: opt.hex ?? null,
    disabled: false,
  })) ?? [];

// Zustand store setup
export const useCustomOptionsStore = create<State & Actions>((set, get) => ({
  // Initial state setup
  option: getBaseOption(null),
  optionData: null,
  availableFirstOptions: [],
  availableSecondOptions: [],
  hasSecondOption: false,
  isSelectionComplete: false,

  // Initializes the store based on the variant data structure
  initialize: (data, isVariant) => {
    if (!isVariant || !data) {
      // Static product: no options needed
      set({
        option: getBaseOption(data),
        availableFirstOptions: [],
        availableSecondOptions: [],
        hasSecondOption: false,
        optionData: data,
        isSelectionComplete: true,
      });
      return;
    }

    // Product has one or more variant options
    const hasSecond = !!data.secondOption?.values?.length;

    set({
      option: {
        ...getBaseOption(data),
        firstOption: null,
        secondOption: null,
      },
      availableFirstOptions: mapOptions(data.firstOption?.values),
      availableSecondOptions: hasSecond ? mapOptions(data.secondOption?.values) : [],
      hasSecondOption: hasSecond,
      optionData: data,
      isSelectionComplete: false,
    });
  },

  // Updates the selected first option and optionally resets the second
  updateFirstOption: (value) => {
    const { optionData, hasSecondOption, option } = get();
    if (!optionData) return;

    const firstMatch = optionData.associations[value ?? '']?.[0] ?? null;
    const updatedSecondOptions = hasSecondOption
      ? mapOptions(optionData.associations[value ?? ''] || [])
      : [];

    set({
      option: {
        ...option,
        firstOption: value,
        secondOption: hasSecondOption ? null : option.secondOption,
        sku_id: firstMatch?.sku_id ?? null,
        hex: firstMatch?.hex ?? null,
        price: firstMatch?.price ?? optionData.basePrice ?? null,
        price_after_discount: firstMatch?.price_after_discount ?? optionData.basePriceAfterDiscount ?? null,
        image: firstMatch?.image ?? optionData.baseImage ?? null,
      },
      availableSecondOptions: updatedSecondOptions,
      isSelectionComplete: hasSecondOption ? false : !!value,
    });
  },

  // Updates the selected second option and applies full data from matched variant
  updateSecondOption: (value) => {
    const { optionData, option, hasSecondOption } = get();
    if (!optionData || !hasSecondOption || !option.firstOption || !value) return;

    const match = optionData.associations[option.firstOption]?.find(opt => opt.value === value) ?? null;

    set({
      option: {
        ...option,
        secondOption: value,
        sku_id: match?.sku_id ?? null,
        hex: match?.hex ?? null,
        price: match?.price ?? optionData.basePrice ?? null,
        price_after_discount: match?.price_after_discount ?? optionData.basePriceAfterDiscount ?? null,
        image: match?.image ?? optionData.baseImage ?? null,
      },
      isSelectionComplete: true,
    });
  },

  // Updates selected quantity (min = 1)
  updateQuantity: (qty) => {
    const { option } = get();
    set({
      option: {
        ...option,
        qty: Math.max(1, qty),
      },
    });
  },

  // Clears all user selections but keeps base data
  clear: () => {
    const { optionData } = get();
    set({
      option: getBaseOption(optionData),
      isSelectionComplete: false,
    });
  },
}));

// === Hooks (Selectors) ===

// Get the full selected option data
export const useOption = () => useCustomOptionsStore((state) => state.option);

// Get available first option list
export const useFirstOptions = () => useCustomOptionsStore((state) => state.availableFirstOptions);

// Get available second option list (if exists)
export const useSecondOptions = () => useCustomOptionsStore((state) => state.availableSecondOptions);

// Check if all necessary selections are completed
export const useIsComplete = () => useCustomOptionsStore((state) => state.isSelectionComplete);
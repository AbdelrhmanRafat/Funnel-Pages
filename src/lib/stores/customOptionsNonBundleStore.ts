import { create } from 'zustand';

interface CustomOption {
  firstOption: string | null;
  secondOption: string | null;
  sku_id: number | null;
  price: number | null;
  price_after_discount: number | null;
  qty: number;
  image: string | null;
}

interface ProductStore {
  isHaveVariant: boolean;
  hasSecondOption: boolean;
  selectedOption: CustomOption;

  // 🔹 Set config manually from API or logic
  setVariantConfig: (config: { isHaveVariant: boolean; hasSecondOption: boolean }) => void;

  // 🔹 Set options manually
  setFirstOptionLabel: (label: string) => void;
  setSecondOptionLabel: (label: string) => void;

  // 🔹 Set final SKU when complete (e.g. for 1 or 2 options)
  setFullSkuData: (sku_id: number, price: number, price_after_discount: number, image: string, qty?: number) => void;

  // 🔹 Set for no-variant products
  setNoVariantProduct: (payload: Omit<CustomOption, 'firstOption' | 'secondOption' | 'qty'> & { qty?: number }) => void;

  // 🔹 Adjust qty only
  setQty: (qty: number) => void;

  // 🔹 Full reset with optional config override
  reset: (config?: { isHaveVariant?: boolean; hasSecondOption?: boolean }) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  isHaveVariant: false,
  hasSecondOption: false,
  selectedOption: {
    firstOption: null,
    secondOption: null,
    sku_id: null,
    price: null,
    price_after_discount: null,
    qty: 1,
    image: null,
  },

  setVariantConfig: ({ isHaveVariant, hasSecondOption }) =>
    set(() => ({
      isHaveVariant,
      hasSecondOption,
    })),

  setFirstOptionLabel: (label) =>
    set((state) => ({
      selectedOption: {
        ...state.selectedOption,
        firstOption: label,
        secondOption: null, // reset second option
        sku_id: null,
        price: null,
        price_after_discount: null,
        qty: 1,
        image: null,
      },
    })),

  setSecondOptionLabel: (label) =>
    set((state) => ({
      selectedOption: {
        ...state.selectedOption,
        secondOption: label
      },
    })),

  setFullSkuData: (sku_id, price, price_after_discount, image, qty = 1) =>
    set((state) => ({
      selectedOption: {
        ...state.selectedOption,
        sku_id,
        price,
        price_after_discount,
        image,
        qty,
      },
    })),

  setNoVariantProduct: ({ sku_id, price, price_after_discount, image, qty = 1 }) =>
    set(() => ({
      isHaveVariant: false,
      hasSecondOption: false,
      selectedOption: {
        firstOption: null,
        secondOption: null,
        sku_id,
        price,
        price_after_discount,
        qty,
        image,
      },
    })),

  setQty: (qty) =>
    set((state) => ({
      selectedOption: {
        ...state.selectedOption,
        qty,
      },
    })),

  reset: (config) =>
    set(() => ({
      isHaveVariant: config?.isHaveVariant ?? false,
      hasSecondOption: config?.hasSecondOption ?? false,
      selectedOption: {
        firstOption: null,
        secondOption: null,
        sku_id: null,
        price: null,
        price_after_discount: null,
        qty: 1,
        image: null,
      },
    })),
}));
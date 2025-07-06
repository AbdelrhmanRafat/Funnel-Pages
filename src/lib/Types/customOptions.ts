// types/customOptions.ts
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
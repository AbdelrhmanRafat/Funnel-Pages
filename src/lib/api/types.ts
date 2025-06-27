// This file defines the TypeScript interfaces for the API response.

// Represents the overall funnel response from the API.
export interface FunnelRes {
    code: number;
    status: number;
    errors: string | null;
    message: string;
    data: Data;
}

// Represents the main data object within the API response.
export interface Data {
    product: Product;
    theme: string;
    accept_online_payment: boolean;
    blocks: Block[];
}

// Represents a single block within the funnel page.
export interface Block {
    name: string;
    data: BlockData;
}

// Represents the data associated with a block.
export interface BlockData {
  [x: string]: any;
  map?: (arg0: (data: BlockData, index: number) => any) => unknown;
  title?: string;
  icon?: string;
  subtitle?: string;
  logo?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  hours?: number;
  minutes?: number;
  seconds?: number;
  count?: number;
  rate?: number;
  image?: Image;
  product?: string;
  items? : Item[];
  buttonLabel? : string;
  FormInputs : FormInputs;
  purchase_options?: PurchaseOption[];
  cities?: string[];
  PaymentOptions?: PaymentOption[];
  DeliveryOptions?: DeliveryOption[];
  productPreview?: ProductPreview;
  productUsage?: VideoInfoItem[];
  confirmationNotices?: Features[];
  faqs?: Faqs[];
  features?: Features[];
  logos? : Image[];
  videoInfo? : VideoInfoItem[];
  visitors : Visitor[];
  counters? : Counter[];
  buttonLink? : "string";
  coupon? : string;
  whatsappLink? : string;
  description? : string;
  company_name?: string;
  year?: string;
  galleryimages?: Image[];
}

export interface FormInputs {
  full_name? : string;
  phone?: string;
  address?: string;
  cities?: string[];
  PaymentOptions?: PaymentOption[];
  DeliveryOptions?: DeliveryOption[];
}


export interface Item {
  name? : string;
  label? : string;
  content? : string;
  link? : string;
  icon? : string;
  image? : string;
  videoLink? : string;
}

export interface PaymentOption {
  id: string;
  label: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  images?: string[]; // Optional: could be empty or undefined
}
export interface DeliveryOption {
  id: string;
  label: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}

export interface Image {
    src : string;
    alt : string;
}

 export interface ColorSizeOptions{
   items : number;
   colors : string[];
   sizes : string[];
 }

 export interface DeliveryFeatures {
    icon? : string;
    title?: string;
    subtitle?: string;
 }

export interface ProductPreview {
    headerBadgetext: string;
    headerBadgeIcon: string;
    viewsText: string;
    viewsIcon: string;
    featuresSectionTitle: string;
    features: Features[];
};
export interface VideoInfoItem {
  viewsText?: string;
  viewsIcon?: string;
  videoTitle?: string;
  videoLink?: string;
  title? : string;
  subtitle? : string;
}
export interface Features {
    title: string;
    icon?: string;
    subtitle?: string;
}

// Represents a purchase option for a product.
export interface PurchaseOption {
    title: string;
    items: number;
    price_per_item: number;
    original_price_per_item: number;
    original_total: number;
    total_price: number;
    discount: number;
    discount_percent: string;
    shipping_price: number;
    final_total: number;
}
export interface Faqs {
    question: string;
    answer: string;
}

// Represents a product in the API response.
export interface Product {
    id: number;
    category_id: number;
    ware_house_id: number;
    image: string;
    name: string;
    name_ar: string;
    name_en: string;
    slug: string;
    slug_ar: string;
    slug_en: string;
    description: string;
    description_ar: string;
    description_en: string;
    beforeImage : Image;
    afterImage : Image;
    beforetitle : string;
    aftertitle : string;
    beforedescription : string;
    afterdescription : string;
    is_active: number;
    qty: number;
    sku_code: string;
    price: number;
    price_after_discount: number;
    weight: null;
    weight_type: null;
    options: ProductOption[];
    custom_options : CustomOptions;
    category: Category;
    skus: Sku[];
    reviews : Review[];
    policies : string[];
    social_icons : string[];
    meta: Meta;
    attachment: Attachment[];
    is_have_variant: string;
}
export interface Counter {
  label : string;
  count : number;
}

export interface Sku {
  id: number;
  category_id: number;
  product_id: number;
  store_id: number;
  ware_house_id: number;
  SKU_code: string;
  quantity: number;
  price: number;
  price_after_discount: number;
  options: Option[];
  weight: number;
  weight_type: string;
  image: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  qty: number;
  ware_house: Warehouse;
}

export interface Option {
  name: string;
  value: string;
  hex: string | null;
}

export interface Warehouse {
  id: number;
  store_id: number;
  name: string;
  contact_person: string;
  phone: string;
  place_number: string;
  area: string;
  zip_code: string;
  city: string;
  region: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomOptions {
  variantOption: VariantOption[];
}

export interface VariantOption {
  value: string;
  hex: string | null;
  available_options: Available_options[]
}



export interface Available_options {
  sku_id: number;
  value: string;
  hex: string;
  price: number;
  price_after_discount: number;
  qty: number;
  image: string;
}

export interface Review {
   description? : string;
   name? : string;
   city? : string;
   image? : string;
}

export interface Visitor {
   description? : string;
   image? : string;
}

// Represents an attachment for a product.
export interface Attachment {
    id: number;
    path: string;
    attachmentable_type: string;
    attachmentable_id: number;
    order: number;
    created_at: Date;
    updated_at: Date;
}

// Represents a product category.
export interface Category {
    id: number;
    parent_id: number;
    name_ar: string;
    name_en: string;
    is_active: number;
}

// Represents meta information for a product.
export interface Meta {
    id: number;
    title: string;
    description: string;
    image: string;
    metaable_type: string;
    metaable_id: number;
    created_at: Date;
    updated_at: Date;
}

// Represents product options.
export interface ProductOption {
    options: OptionOption[];
}

// Represents an option for a product.
export interface OptionOption {
    name: string;
    value: Value[];
}

// Represents the value of a product option.
export interface Value {
    name?: string;
    hex?: string;
    display?: string;
    value?: string;
}
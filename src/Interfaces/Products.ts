export interface FunnelRes {
    code: number;
    status: number;
    errors: string | null;
    message: string;
    data: Data;
}

export interface Data {
    product: Product;
    theme: string;
    accept_online_payment: boolean;
    blocks: Block[];
}

export interface Block {
    name: string;
    data: BlockData;
}

export interface BlockData {
    title?: string;
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
    product?: string;
    purchase_options?: PurchaseOption[];
    company_name?: string;
    year?: string;
}

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
    is_active: number;
    qty: number;
    sku_code: string;
    price: number;
    price_after_discount: number;
    weight: null;
    weight_type: null;
    options: ProductOption[];
    category: Category;
    skus: null;
    meta: Meta;
    attachment: Attachment[];
    is_have_variant: string;
}

export interface Attachment {
    id: number;
    path: string;
    attachmentable_type: string;
    attachmentable_id: number;
    order: number;
    created_at: Date;
    updated_at: Date;
}

export interface Category {
    id: number;
    parent_id: number;
    name_ar: string;
    name_en: string;
    is_active: number;
}

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

export interface ProductOption {
    options: OptionOption[];
}

export interface OptionOption {
    name: string;
    value: Value[];
}

export interface Value {
    name?: string;
    hex?: string;
    display?: string;
    value?: string;
}
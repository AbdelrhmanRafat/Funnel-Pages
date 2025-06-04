import { z } from "zod";

// Define schema for API response
export const PurchaseOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  price_per_item: z.number(),
  original_price_per_item: z.number(),
  discount: z.number(),
  discount_percent: z.number(),
  shipping_price: z.number(),
  final_total: z.number(),
  is_popular: z.boolean().optional().default(false),
  estimated_delivery: z.string().optional()
});

export const FormFieldOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  label_ar: z.string()
});

export const FormFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
  label_ar: z.string(),
  inputType: z.string(),
  placeholder: z.string().optional(),
  placeholder_ar: z.string().optional(),
  required: z.boolean(),
  options: z.array(FormFieldOptionSchema).optional()
});

// Based on the actual API response structure
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  name_ar: z.string(),
  name_en: z.string(),
  description: z.string(),
  description_ar: z.string(),
  description_en: z.string(),
  image: z.string(),  // Main product image
  category: z.any(),  // We'll handle this as any for now
  price: z.number(),
  price_after_discount: z.number(),
  // Add any other fields you need, but mark them as optional
  category_id: z.number().optional(),
  ware_house_id: z.number().optional(),
  slug: z.string().optional(),
  slug_ar: z.string().optional(),
  slug_en: z.string().optional(),
  is_active: z.number().optional(),
  qty: z.number().optional(),
  sku_code: z.string().optional(),
  weight: z.any().optional(),
  weight_type: z.any().optional(),
  options: z.any().optional(),
  skus: z.any().optional(),
  meta: z.any().optional(),
  attachment: z.any().optional(),
  is_have_variant: z.string().optional(),
  // Add these fields to match our app's expectations
  features: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  variants: z.array(z.object({
    id: z.number(),
    name: z.string()
  })).optional().default([])
});

export const FunnelDataSchema = z.object({
  product: ProductSchema,
  theme: z.string(),
  accept_online_payment: z.boolean(),
  // These fields may not be in the API response, so make them optional with defaults
  purchase_options: z.array(PurchaseOptionSchema).optional().default([]),
  form_fields: z.array(FormFieldSchema).optional().default([]),
  // The blocks API response appears to be an array of objects, not strings
  blocks: z.array(z.any())
});

export const ApiResponseSchema = z.object({
  code: z.number(),
  status: z.number(),
  errors: z.null().or(z.record(z.string(), z.any())),
  message: z.string(),
  data: FunnelDataSchema
});

export type PurchaseOption = z.infer<typeof PurchaseOptionSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type FormFieldOption = z.infer<typeof FormFieldOptionSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type FunnelData = z.infer<typeof FunnelDataSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

export const validateApiResponse = (data: unknown): ApiResponse | null => {
  try {
    return ApiResponseSchema.parse(data);
  } catch (error) {
    console.error("API response validation error:", error);
    return null;
  }
};

// Customer form validation schema
export const CustomerFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Please enter a valid phone number"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address is required"),
  zip: z.string().optional(),
  payment_method: z.enum(["cod", "online"])
});

export type CustomerFormData = z.infer<typeof CustomerFormSchema>;

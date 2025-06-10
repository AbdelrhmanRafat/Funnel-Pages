export const translations = {
  en: {
    countdown: {
      offerEndsIn: "Offer ends in :",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
    form: {
      completeOrder: "Complete Order",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      email: "Email Address",
      enterEmail: "Enter your email",
      shippingInfo: "Shipping Information",
      selectedPackage: "Selected Package",
      threeItemsOffer: "Three Items Offer",
      deliveryTime: "Delivered within 3 to 5 business days",
      country: "Country",
      selectCountry: "Select a country",
      city: "City",
      enterCity: "Enter your city",
      submit: "Submit Order",
      validation: {
        valid: "Valid",
        invalidFullName: "Please enter a valid full name",
        invalidPhone: "Please enter a valid phone number",
        invalidEmail: "Please enter a valid email address",
        invalidCity: "Please enter a valid city name",
        invalidCountry: "Please select a country",
        invalidInput: "Invalid input",
        required: "This field is required"
      }
    },
    ratings: {
      count: "ratings"
    },
    product: {
      available: "Available",
      notAvailable: "Not Available",
      productCode: "Product Code",
      description: "Product Description",
    },
    productFunnel: {
      product: "Product:",
      unitPrice: "Unit Price:",
      subtotal: "Subtotal:",
      shippingCost: "Shipping Cost:",
      discount: "Discount:",
      quantity : "Quantity",
      total: "Total:",
      addToCart: "🛒 Add to Cart",
      addToFavorites: "❤️ Add to Favorites",
      piece: "piece",
      pieces: "pieces",
      currency: "EGP"
    },
    quantityOptions: {
      chooseQuantity: "Choose the right quantity",
      popular: "Most Popular",
      bestValue: "Best Value",
      itemUnit: {
        singular: "piece",
        plural: "pieces"
      },
      pricePerItem: "{price} per piece",
      saveDiscount: "Save {discountAmount} ({discountPercent})",
      totalProducts: "Total Products:",
      shippingLabel: "Shipping:"
    },
    dynamicPanel: {
      selectOptionsForProduct: "Select options for product",
      ordinals: {
        first: "First",
        second: "Second",
        third: "Third"
      },
      color: "Color:",
      size: "Size:",
      notSelected: "Not selected"
    },
    countries: {
      saudi: "Saudi Arabia",
      uae: "United Arab Emirates",
      egypt: "Egypt"
    }
  },
  ar: {
    countdown: {
      offerEndsIn: "ينتهي العرض خلال :",
      hours: "ساعة",
      minutes: "دقيقة",
      seconds: "ثانية",
    },
    form: {
      completeOrder: "إتمام الطلب",
      personalInfo: "المعلومات الشخصية",
      fullName: "الاسم الكامل",
      phoneNumber: "رقم الهاتف",
      email: "البريد الإلكتروني",
      enterEmail: "أدخل بريدك الإلكتروني",
      shippingInfo: "معلومات الشحن",
      selectedPackage: "الباقة المختارة",
      threeItemsOffer: "عرض الثلاث قطع",
      deliveryTime: "يصل إليك خلال 3 إلى 5 أيام عمل",
      country: "الدولة",
      selectCountry: "اختر الدولة",
      city: "المدينة",
      enterCity: "أدخل اسم المدينة",
      submit: "تأكيد الطلب",
      validation: {
        valid: "صالح",
        invalidFullName: "الرجاء إدخال اسم كامل صحيح",
        invalidPhone: "الرجاء إدخال رقم هاتف صحيح",
        invalidEmail: "الرجاء إدخال بريد إلكتروني صحيح",
        invalidCity: "الرجاء إدخال اسم مدينة صحيح",
        invalidCountry: "الرجاء اختيار دولة",
        invalidInput: "إدخال غير صالح",
        required: "هذا الحقل مطلوب"
      }
    },
    ratings: {
      count: "مستخدم"
    },
    product: {
      available: "متوفر",
      notAvailable: "غير متوفر",
      productCode: "رمز المنتج",
      description: "وصف المنتج",
    },
    productFunnel: {
      product: "المنتج:",
      unitPrice: "سعر القطعة:",
      subtotal: "المجموع:",
      shippingCost: "تكلفة الشحن:",
      discount: "الخصم:",
      quantity : "الكمية",
      total: "الإجمالي:",
      addToCart: "🛒 أضف إلى السلة",
      addToFavorites: "❤️ أضف إلى المفضلة",
      piece: "قطعة",
      pieces: "قطع",
      currency: "ج.م"
    },
    quantityOptions: {
      chooseQuantity: "اختر الكمية المناسبة",
      popular: "الأكثر شعبية",
      bestValue: "أفضل قيمة",
      itemUnit: {
        singular: "قطعة",
        plural: "قطع"
      },
      pricePerItem: "{price} لكل قطعة",
      saveDiscount: "وفّر {discountAmount} ({discountPercent})",
      totalProducts: "إجمالي المنتجات:",
      shippingLabel: "الشحن:"
    },
    dynamicPanel: {
      selectOptionsForProduct: "اختر الخيارات للمنتج",
      ordinals: {
        first: "الأول",
        second: "الثاني",
        third: "الثالث"
      },
      color: "اللون:",
      size: "المقاس:",
      notSelected: "لم يتم التحديد"
    },
    countries: {
      saudi: "السعودية",
      uae: "الإمارات",
      egypt: "مصر"
    }
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
export type NestedTranslationKey = {
  [K in keyof typeof translations.en]: keyof typeof translations.en[K];
};

export function getTranslation(key: string, lang: Language = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return value;
} 
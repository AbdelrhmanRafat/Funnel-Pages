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
      enterCity: "Enter your city"
    },
      product: {
      available: "Available",
      notAvailable: "Not Available",
      productCode: "Product Code",
      description: "Product Description",
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
      enterCity: "أدخل اسم المدينة"
    },
      product: {
      available: "متوفر",
      notAvailable: "غير متوفر",
      productCode: "رمز المنتج",
      description: "وصف المنتج",
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
const translations = {
  en: {
    loading: 'Loading...',
    error: 'Error Occurred',
    errorDetail: 'Unable to load product data. Please try again.',
    tryAgain: 'Try Again',
    orderNow: 'Order Now',
    aboutUs: 'About Us',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    faq: 'FAQ',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    shippingPolicy: 'Shipping Policy',
    allRights: '© 2023 Baseet. All Rights Reserved.',
    keyFeatures: 'Key Features',
    availableOptions: 'Available Options',
    choosePackage: 'Choose Your Package',
    mostPopular: 'Most Popular',
    pcs: 'pcs',
    freeShipping: 'Free Shipping',
    total: 'Total:',
    completeOrder: 'Complete Your Order',
    personalInfo: 'Personal Information',
    shippingInfo: 'Shipping Information',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    onlinePayment: 'Online Payment',
    orderSummary: 'Order Summary',
    product: 'Product:',
    package: 'Package:',
    quantity: 'Quantity:',
    unitPrice: 'Unit Price:',
    discount: 'Discount:',
    shipping: 'Shipping:',
    free: 'Free',
    placeOrder: 'Place Order',
    processing: 'Processing...',
    select: 'Select...',
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
    enhancement: 'All day enhancement.',
    qualityGuarantee: 'Exceptional quality. Satisfaction guaranteed. Limited time offers.',
    aboutUsText: 'We are committed to providing high-quality products and excellent customer service.',
    address: '123 Riyadh Street, Saudi Arabia',
    phone: '+966 123456789',
    orderSuccess: 'Your order has been submitted successfully!',
    limitedTimeOffer: 'Limited Time Offer',
    offerEnding: 'Get additional discount before offer expires',
    estimatedDelivery: 'Delivery in 3-5 days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    color: 'Color:',
    size: 'Size:',
    selected: 'SELECTED',
    select_options_for_item: 'Select options for item {index}'
  },
  ar: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    errorDetail: 'لا يمكن تحميل بيانات المنتج. يرجى المحاولة مرة أخرى.',
    tryAgain: 'إعادة المحاولة',
    orderNow: 'اطلب الآن',
    aboutUs: 'عن الشركة',
    quickLinks: 'روابط سريعة',
    contactUs: 'تواصل معنا',
    faq: 'الأسئلة الشائعة',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الاستخدام',
    shippingPolicy: 'سياسة الشحن',
    allRights: '© ٢٠٢٣ بسيط. جميع الحقوق محفوظة.',
    limitedTimeOffer: 'عرض محدود الوقت',
    offerEnding: 'احصل على خصم إضافي قبل انتهاء العرض',
    estimatedDelivery: 'توصيل في 3-5 أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني',
    color: 'اللون:',
    size: 'المقاس:',
    selected: 'مختار',
    keyFeatures: 'المميزات الرئيسية',
    availableOptions: 'الخيارات المتاحة',
    choosePackage: 'اختر العرض المناسب لك',
    mostPopular: 'الأكثر شعبية',
    pcs: 'قطعة',
    freeShipping: 'شحن مجاني',
    total: 'الإجمالي:',
    completeOrder: 'أكمل طلبك',
    personalInfo: 'المعلومات الشخصية',
    shippingInfo: 'معلومات الشحن',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند الاستلام',
    onlinePayment: 'الدفع الإلكتروني',
    orderSummary: 'ملخص الطلب',
    product: 'المنتج:',
    package: 'الباقة:',
    quantity: 'الكمية:',
    unitPrice: 'سعر القطعة:',
    discount: 'الخصم:',
    shipping: 'الشحن:',
    free: 'مجاني',
    placeOrder: 'تأكيد الطلب',
    processing: 'جاري المعالجة...',
    select: 'اختر...',
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
    invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
    enhancement: 'تحسين طوال اليوم.',
    qualityGuarantee: 'جودة استثنائية. ضمان الرضا التام. عروض لفترة محدودة.',
    aboutUsText: 'نحن ملتزمون بتقديم منتجات عالية الجودة وخدمة عملاء ممتازة.',
    address: 'شارع الرياض، المملكة العربية السعودية',
    phone: '+٩٦٦ ١٢٣٤٥٦٧٨٩',
    orderSuccess: 'تم تقديم طلبك بنجاح!',
    select_options_for_item: 'اختر الخيارات للمنتج {index}'
  }
};

type Language = 'en' | 'ar';
type TranslationKey = keyof (typeof translations)['en'];

export const getTranslation = (key: TranslationKey, lang: Language): string => {
  return translations[lang][key] || translations.en[key] || key;
};

// Default currency that can be easily changed
const DEFAULT_CURRENCY = 'EGP';

export const formatCurrency = (amount: number | undefined, lang: Language, currency: string = DEFAULT_CURRENCY): string => {
  if (amount === undefined || amount === null) return '';
  
  const formatter = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  });
  
  return formatter.format(amount);
};

// Function to format currency without the currency symbol
export const formatNumberOnly = (amount: number | undefined, lang: Language): string => {
  if (amount === undefined || amount === null) return '';
  
  const formatter = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
};

// Helper function to get just the currency symbol
export const getCurrencySymbol = (currency: string = DEFAULT_CURRENCY, lang: Language): string => {
  try {
    return (0).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace(/\d/g, '').trim();
  } catch (e) {
    return currency;
  }
};

export const detectLanguage = (): Language => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  
  if (langParam === 'ar') return 'ar';
  if (langParam === 'en') return 'en';
  
  // Check browser language
  const browserLang = navigator.language;
  if (browserLang.startsWith('en')) return 'en';
  
  // Default to Arabic
  return 'ar';
};

export const setDocumentLanguage = (lang: Language): void => {
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
  
  // Set meta for proper rendering
  const metaCharset = document.querySelector('meta[charset]');
  if (!metaCharset) {
    const meta = document.createElement('meta');
    meta.setAttribute('charset', 'UTF-8');
    document.head.appendChild(meta);
  }
};

export default {
  getTranslation,
  formatCurrency,
  detectLanguage,
  setDocumentLanguage
};

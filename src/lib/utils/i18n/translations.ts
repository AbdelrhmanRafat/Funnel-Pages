export const translations = {
  en: {
    countdown: {
      offerEndsIn: ": Offer ends in",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
  },
  ar: {
    countdown: {
      offerEndsIn: "ينتهي العرض خلال :",
      hours: "ساعة",
      minutes: "دقيقة",
      seconds: "ثانية",
    },
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
import { translations } from "./translations";

export function initTranslations() {
  const savedLang = localStorage.getItem('lang') || 'en';
  
  // Update all text elements with translations
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (key) {
      element.textContent = getTranslation(key, savedLang as 'en' | 'ar');
    }
  });

  // Update document direction for RTL languages
  if (savedLang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }
}

export function updateTranslations(lang: 'en' | 'ar') {
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (!key) return;

    const translation = getTranslation(key, lang);
    if (translation) {
      element.textContent = translation;
    }
  });
}

function getTranslation(key: string, lang: 'en' | 'ar'): string {
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
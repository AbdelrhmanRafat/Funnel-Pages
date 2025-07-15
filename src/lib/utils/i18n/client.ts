import { translations, type Language } from "./translations";

function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || 'en';
  return 'en';
}

export function initTranslations() {
  const savedLang = getCookie('lang');
  
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

export function detectLanguage(): Language {
  // Check if running on the server (SSR)
  if (typeof document === 'undefined') {
    // Fallback language when document is not available (SSR mode)
    return 'en';
  }

  // Try to read the 'lang' cookie from the browser
  const langCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('lang='))
    ?.split('=')[1];

  // Return the found language or fallback to 'en'
  return (langCookie || 'en') as Language;
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
// LanguageSwitcher.ts - Web Component for Language Switching

interface LanguageSwitcherElements {
  toggleBtn: HTMLButtonElement | null;
  langText: HTMLElement | null;
}

class LanguageSwitcher extends HTMLElement {
  private elements: LanguageSwitcherElements = {
    toggleBtn: null,
    langText: null
  };
  private currentLang: string = 'en';
  private redirectDelay: number = 150;
  private cookieMaxAge: number = 31536000;
  private showTransition: boolean = true;

  constructor() {
    super();
  }

  connectedCallback() {
    this.initializeSettings();
    this.initializeElements();
    this.setupInitialState();
    this.setupEventListeners();
  }

  private initializeSettings(): void {
    this.currentLang = this.getAttribute('data-lang-current') || 'en';
    this.redirectDelay = parseInt(this.getAttribute('data-lang-redirect-delay') || '150');
    this.cookieMaxAge = parseInt(this.getAttribute('data-lang-cookie-max-age') || '31536000');
    this.showTransition = this.getAttribute('data-lang-show-transition') !== 'false';
  }

  private initializeElements(): void {
    this.elements = {
      toggleBtn: this.querySelector('[data-lang-toggle-btn]') as HTMLButtonElement,
      langText: this.querySelector('[data-lang-text]') as HTMLElement
    };

    if (!this.elements.toggleBtn || !this.elements.langText) {
      console.warn('Language Switcher: Required elements not found');
      return;
    }
  }

  private setupInitialState(): void {
    // Get current language from cookie (in case it changed after SSR)
    const cookieLang = this.getCookie('lang') || 'en';
    this.currentLang = cookieLang;
    
    const isArabic = this.currentLang === 'ar';

    // Set initial button state
    if (this.elements.langText) {
      this.elements.langText.textContent = isArabic ? "EN" : "عربي";
    }

    if (this.elements.toggleBtn) {
      this.elements.toggleBtn.setAttribute(
        "aria-label",
        isArabic ? "Switch to English" : "التبديل إلى العربية"
      );
    }
  }

  private setupEventListeners(): void {
    if (!this.elements.toggleBtn) return;

    this.elements.toggleBtn.addEventListener('click', (e) => {
      this.handleLanguageSwitch(e);
    });
  }

  private handleLanguageSwitch(e: Event): void {
    e.preventDefault();

    const newLang = this.currentLang === "en" ? "ar" : "en";

    // Dispatch custom event before switch
    this.dispatchEvent(new CustomEvent('language-switch-start', {
      detail: { fromLang: this.currentLang, toLang: newLang }
    }));

    // Save to cookie
    this.setCookie('lang', newLang, this.cookieMaxAge);

    // Update URL query param
    const url = new URL(window.location.href);
    url.searchParams.set("lang", newLang);

    // Visual feedback
    if (this.showTransition && this.elements.toggleBtn) {
      this.elements.toggleBtn.classList.add("opacity-60", "scale-95");
    }

    // Dispatch custom event after cookie set
    this.dispatchEvent(new CustomEvent('language-switch-ready', {
      detail: { fromLang: this.currentLang, toLang: newLang, url: url.toString() }
    }));

    // Redirect with new lang
    setTimeout(() => {
      window.location.href = url.toString();
    }, this.redirectDelay);
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  }

  private setCookie(name: string, value: string, maxAge: number): void {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
  }

  // Public API methods
  public getCurrentLanguage(): string {
    return this.currentLang;
  }

  public switchLanguage(targetLang?: string): void {
    if (targetLang) {
      // Switch to specific language
      if (targetLang !== this.currentLang) {
        this.currentLang = targetLang === 'ar' ? 'en' : 'ar'; // Set opposite so switch works
        this.handleLanguageSwitch(new Event('programmatic'));
      }
    } else {
      // Toggle between languages
      this.handleLanguageSwitch(new Event('programmatic'));
    }
  }

  public setRedirectDelay(delay: number): void {
    this.redirectDelay = delay;
    this.setAttribute('data-lang-redirect-delay', delay.toString());
  }

  public enableTransition(enable: boolean): void {
    this.showTransition = enable;
    this.setAttribute('data-lang-show-transition', enable.toString());
  }
}

// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
  if (!customElements.get('language-switcher')) {
    customElements.define('language-switcher', LanguageSwitcher);
  }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  const languageSwitchers = document.querySelectorAll('language-switcher:not(:defined)');
  languageSwitchers.forEach(switcher => {
    if (switcher instanceof LanguageSwitcher) {
      switcher.connectedCallback();
    }
  });
});

export { LanguageSwitcher };
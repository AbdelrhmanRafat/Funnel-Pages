// NeonLanguageSwitcher.ts - Enhanced Web Component for Language Switching

interface LanguageSwitcherElements {
  toggleBtn: HTMLButtonElement | null;
  langText: HTMLElement | null;
}

/**
 * Language Switcher Web Component
 * Handles language switching with smooth transitions and proper state management
 */
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

  /**
   * Initialize when component is connected to DOM
   */
  connectedCallback(): void {
    this.initializeSettings();
    this.initializeElements();
    this.setupInitialState();
    this.setupEventListeners();
  }

  /**
   * Initialize settings from data attributes
   */
  private initializeSettings(): void {
    this.currentLang = this.getAttribute('data-lang-current') || 'en';
    this.redirectDelay = parseInt(this.getAttribute('data-lang-redirect-delay') || '150');
    this.cookieMaxAge = parseInt(this.getAttribute('data-lang-cookie-max-age') || '31536000');
    this.showTransition = this.getAttribute('data-lang-show-transition') !== 'false';
  }

  /**
   * Initialize DOM elements
   */
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

  /**
   * Set up initial component state
   */
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

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    if (!this.elements.toggleBtn) return;

    this.elements.toggleBtn.addEventListener('click', (e) => {
      this.handleLanguageSwitch(e);
    });
  }

  /**
   * Handle language switch with visual feedback and smooth transition
   */
  private handleLanguageSwitch(event: Event): void {
    event.preventDefault();

    const newLang = this.currentLang === "en" ? "ar" : "en";

    // Dispatch custom event before switch
    this.dispatchEvent(new CustomEvent('language-switch-start', {
      detail: { fromLang: this.currentLang, toLang: newLang },
      bubbles: true
    }));

    // Save to cookie
    this.setCookie('lang', newLang, this.cookieMaxAge);

    // Update URL query param
    const url = new URL(window.location.href);
    url.searchParams.set("lang", newLang);

    // Visual feedback with loading state
    if (this.showTransition && this.elements.toggleBtn) {
      this.elements.toggleBtn.classList.add("switching");
      this.elements.toggleBtn.setAttribute('disabled', 'true');
    }

    // Dispatch custom event after cookie set
    this.dispatchEvent(new CustomEvent('language-switch-ready', {
      detail: { 
        fromLang: this.currentLang, 
        toLang: newLang, 
        url: url.toString() 
      },
      bubbles: true
    }));

    // Redirect with new language
    setTimeout(() => {
      window.location.href = url.toString();
    }, this.redirectDelay);
  }

  /**
   * Get cookie value by name
   */
  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  }

  /**
   * Set cookie with specified name, value, and max age
   */
  private setCookie(name: string, value: string, maxAge: number): void {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
  }

  /**
   * Update button text and aria-label for new language
   */
  private updateButtonState(newLang: string): void {
    const isArabic = newLang === 'ar';
    
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

  // === Public API Methods ===

  /**
   * Get current language
   */
  public getCurrentLanguage(): string {
    return this.currentLang;
  }

  /**
   * Switch to specific language or toggle between languages
   */
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

  /**
   * Set redirect delay for language switching
   */
  public setRedirectDelay(delay: number): void {
    this.redirectDelay = delay;
    this.setAttribute('data-lang-redirect-delay', delay.toString());
  }

  /**
   * Enable or disable transition effects
   */
  public enableTransition(enable: boolean): void {
    this.showTransition = enable;
    this.setAttribute('data-lang-show-transition', enable.toString());
  }

  /**
   * Check if component is currently switching languages
   */
  public isSwitching(): boolean {
    return this.elements.toggleBtn?.classList.contains('switching') || false;
  }
}

/**
 * Register the language switcher web component
 */
function registerLanguageSwitcher(): void {
  if (!customElements.get('language-switcher')) {
    customElements.define('language-switcher', LanguageSwitcher);
  }
}

// Auto-register when DOM is ready
document.addEventListener('DOMContentLoaded', registerLanguageSwitcher);

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
  registerLanguageSwitcher();
  
  // Re-initialize any language switchers that may have been added
  const languageSwitchers = document.querySelectorAll('language-switcher:not(:defined)');
  languageSwitchers.forEach(switcher => {
    if (switcher instanceof LanguageSwitcher) {
      switcher.connectedCallback();
    }
  });
});

// Export for external use
export { LanguageSwitcher };
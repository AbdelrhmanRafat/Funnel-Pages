export class BotDetector {
  private static readonly BOT_USER_AGENTS = [
    'bot', 'crawler', 'spider', 'scraper', 'facebookexternalhit',
    'whatsapp', 'telegram', 'discord', 'slack', 'linkedinbot',
    'twitterbot', 'pinterestbot', 'googlebot', 'bingbot',
    'yandexbot', 'duckduckbot', 'baiduspider', 'ahrefsbot'
  ];

  private static readonly HEADLESS_INDICATORS = [
    'HeadlessChrome',
    'PhantomJS',
    'Nightmare',
    'Selenium'
  ];

  static isBot(): boolean {
    try {
      // Check user agent
      const userAgent = navigator.userAgent.toLowerCase();
      const isBotUserAgent = this.BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
      const isHeadless = this.HEADLESS_INDICATORS.some(indicator => userAgent.includes(indicator.toLowerCase()));

      if (isBotUserAgent || isHeadless) return true;

      // Check for automated browsers
      if (navigator.webdriver) return true;

      // Check for missing browser features
      const hasPlugins = navigator.plugins && navigator.plugins.length > 0;
      const hasLanguages = navigator.languages && navigator.languages.length > 0;
      const hasValidConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency > 0;
      const hasDeviceMemory = 'deviceMemory' in navigator && navigator.deviceMemory > 0;

      if (!hasPlugins || !hasLanguages || !hasValidConcurrency) return true;

      // Check for inconsistent browser features
      const isChrome = /chrome/i.test(userAgent);
      const hasChromium = !!window.chrome;
      if (isChrome && !hasChromium) return true;

      // Check for touch support consistency
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobile = /mobile|tablet|android|ios/i.test(userAgent);
      if (isMobile && !hasTouchSupport) return true;

      // Check for missing performance API
      if (!window.performance || !window.performance.timing) return true;

      // Check for suspicious window properties
      const suspiciousProps = ['__nightmare', '__selenium_unwrapped', '__webdriver_evaluate'];
      if (suspiciousProps.some(prop => prop in window)) return true;

      // Advanced bot detection using behavior patterns
      return this.detectBehaviorPatterns();
    } catch (e) {
      console.error('Bot detection error:', e);
      return true; // Assume bot on error
    }
  }

  private static detectBehaviorPatterns(): boolean {
    try {
      // Check for instant page load (bots often have 0 load time)
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime < 100 && loadTime >= 0) return true;

      // Check for missing mouse/keyboard events capability
      const hasPointerEvents = 'PointerEvent' in window;
      const hasTouch = 'TouchEvent' in window;
      if (!hasPointerEvents && !hasTouch) return true;

      return false;
    } catch (e) {
      return false;
    }
  }
}
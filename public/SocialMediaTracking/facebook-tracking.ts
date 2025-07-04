// src/lib/Tracking/facebook-tracking.ts

import { BotDetector } from "../utils/ bot-detector";

// Optional config interface
interface FacebookPixelConfig {
  debug?: boolean;
  autoPageView?: boolean;
  consent?: boolean;
  deferLoad?: boolean;
  retryAttempts?: number;
}

export function initFacebookPixel(
  pixelId: string,
  config: FacebookPixelConfig = {}
): void {
  const {
    debug = false,
    autoPageView = true,
    consent = true,
    deferLoad = false,
    retryAttempts = 3,
  } = config;

  // 🛡️ Anti-bot + consent check
  if (BotDetector.isBot() || !consent) {
    return;
  }

  const initialize = () => {
    if (!window.fbq) {
      (function (f: any, b: Document, e: string, v: string, n: any, t: HTMLScriptElement, s: HTMLScriptElement) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e) as HTMLScriptElement;
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0] as HTMLScriptElement;
        s.parentNode?.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    }

    // ✅ Init with config
    window.fbq('init', pixelId, {}, { autoConfig: false , advancedMatching : false });

    if (autoPageView) {
      sendFacebookPageView();
    }
  };

  if (deferLoad) {
    window.addEventListener('load', initialize);
  } else {
    initialize();
  }
}

// ✅ Call this manually after SPA route/language changes
export function sendFacebookPageView(): void {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}
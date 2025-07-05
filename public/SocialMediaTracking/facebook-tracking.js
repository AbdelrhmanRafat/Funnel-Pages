import { BotDetector } from "./bot-detector.js";

export function initFacebookPixel(pixelId, config = {}) {
  const {
    debug = false,
    autoPageView = true,
    consent = true,
    deferLoad = false,
    retryAttempts = 3,
  } = config;

  if (BotDetector.isBot() || !consent) {
    return;
  }

  const initialize = () => {
    if (!window.fbq) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode && s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    }

    window.fbq('init', pixelId, {}, { autoConfig: false, advancedMatching: false });

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

export function sendFacebookPageView() {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}
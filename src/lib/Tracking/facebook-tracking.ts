// src/lib/Tracking/facebook-tracking.js

export function initFacebookPixel(pixelId : string) {

  const isBot = () => {
    try {
      if (navigator.webdriver) return true;
      if (navigator.plugins.length === 0) return true;
      if (!navigator.languages) return true;
      if (navigator.hardwareConcurrency === 0) return true;
      if (!window.chrome && navigator.userAgent.includes('Chrome')) return true;
    } catch (e) {
      return true;
    }
    return false;
  };

  if (isBot()) return;

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
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script');
  }

  window.fbq('init', pixelId, {}, { autoConfig: false });
  window.fbq('track', 'PageView');
}
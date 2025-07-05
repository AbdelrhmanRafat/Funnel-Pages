import { BotDetector } from './bot-detector.js';

export function initSnapchatPixel(pixelId) {
  if (typeof window === 'undefined' || !pixelId) return;

  // 🛡️ Anti-bot check
  if (BotDetector.isBot()) {
    return;
  }

  (function (e, t, n) {
    if (e.snaptr) return;
    var a = e.snaptr = function () {
      a.handleRequest
        ? a.handleRequest.apply(a, arguments)
        : a.queue.push(arguments);
    };
    a.queue = [];
    var s = 'script', r = t.createElement(s);
    r.async = true;
    r.src = n;
    var u = t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r, u);
  })(window, document, 'https://sc-static.net/scevent.min.js');

  snaptr('init', pixelId);
  snaptr('track', 'PAGE_VIEW');
}
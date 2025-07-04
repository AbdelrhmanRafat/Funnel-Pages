import { BotDetector } from "../utils/ bot-detector";

export function initSnapchatPixel(pixelId: string): void {
  if (typeof window === 'undefined' || !pixelId) return;

  // 🛡️ Anti-bot + consent check
  if (BotDetector.isBot()) {
    return;
  }


  if (typeof window === 'undefined' || !pixelId) return;

  (function (e, t, n) {
    if (e.snaptr) return; var a = e.snaptr = function () { a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments) };
    a.queue = []; var s = 'script'; r = t.createElement(s); r.async = !0;
    r.src = n; var u = t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r, u);
  })(window, document,
    'https://sc-static.net/scevent.min.js');

  snaptr('init', pixelId);

  snaptr('track', 'PAGE_VIEW');
}  
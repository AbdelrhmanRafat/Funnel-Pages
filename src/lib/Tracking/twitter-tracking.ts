import { BotDetector } from "../utils/ bot-detector";

export function initTwitterPixel(pixelId: string): void {
    if (typeof window === 'undefined' || !pixelId) return;
    // 🛡️ Anti-bot + consent check
    if (BotDetector.isBot()) {
      return;
    }
    
    (function (e, t, n, s, u, a) {
      if (e.twq) return;
  
      s = e.twq = function () {
        s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
      };
      s.version = "1.1";
      s.queue = [];
  
      u = t.createElement(n);
      u.async = true;
      u.src = "//static.ads-twitter.com/uwt.js";
  
      a = t.getElementsByTagName(n)[0];
      a.parentNode.insertBefore(u, a);
    })(window, document, "script");
  
    twq("init", pixelId);
    twq("track", "PageView");
  }  
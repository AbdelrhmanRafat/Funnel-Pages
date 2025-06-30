export function initSnapchatPixel(pixelId: string): void {
    if (typeof window === 'undefined' || !pixelId) return;
  
    (function (e: any, t: Document, n: string) {
      if (e.snaptr) return;
  
      const a = (e.snaptr = function (...args: any[]) {
        if (a.handleRequest) {
          a.handleRequest.apply(a, args);
        } else {
          a.queue.push(args);
        }
      });
  
      a.queue = [];
  
      const s = "script";
      const r = t.createElement(s);
      r.async = true;
      r.src = n;
  
      const u = t.getElementsByTagName(s)[0];
      u.parentNode.insertBefore(r, u);
    })(window, document, "https://sc-static.net/scevent.min.js");
  
    snaptr("init", pixelId);
    snaptr("track", "PAGE_VIEW");
  }  
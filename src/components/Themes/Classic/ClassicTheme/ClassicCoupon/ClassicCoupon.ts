// ClassicCoupon.ts - Simple web component for coupon copying

class ClassicCoupon extends HTMLElement {
    connectedCallback() {
        this.querySelector('[data-coupon-copy-btn]')?.addEventListener('click', this.copy.bind(this));
    }

    private async copy() {
        const code = this.dataset.couponValue || this.querySelector('[data-coupon-display]')?.textContent?.trim();
        const btn = this.querySelector('[data-coupon-copy-btn]') as HTMLButtonElement;
        const icon = this.querySelector('[data-copy-icon]') as HTMLElement;
        const text = this.querySelector('[data-copy-text]') as HTMLElement;
        const isArabic = document.cookie.includes('lang=ar');
        
        if (!code || !btn) return;

        try {
            await navigator.clipboard.writeText(code);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        // Show success
        btn.disabled = true;
        icon.className = 'fa-solid fa-check text-sm';
        text.textContent = isArabic ? 'تم النسخ!' : 'Copied!';

        // Reset after 2s
        setTimeout(() => {
            btn.disabled = false;
            icon.className = 'fa-solid fa-copy text-sm';
            text.textContent = isArabic ? 'نسخ' : 'Copy';
        }, 2000);
    }
}

customElements.define('classic-coupon', ClassicCoupon);
// FreshCoupon.ts - Simple web component for coupon copying

class FreshCoupon extends HTMLElement {
    connectedCallback() {
        this.querySelector('[data-coupon-copy-btn]')?.addEventListener('click', this.copy.bind(this));
    }

    private async copy() {
        const code = this.dataset.couponValue || this.querySelector('[data-coupon-display]')?.textContent?.trim();
        const btn = this.querySelector('[data-coupon-copy-btn]') as HTMLButtonElement;
        const iconContainer = this.querySelector('[data-copy-icon]') as HTMLElement;
        const copyIcon = iconContainer?.querySelector('.copy-icon') as HTMLElement;
        const checkIcon = iconContainer?.querySelector('.check-icon') as HTMLElement;
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
        
        // Switch to check icon
        if (copyIcon && checkIcon) {
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'block';
        }
        
        text.textContent = isArabic ? 'تم النسخ!' : 'Copied!';

        // Reset after 2s
        setTimeout(() => {
            btn.disabled = false;
            
            // Switch back to copy icon
            if (copyIcon && checkIcon) {
                copyIcon.style.display = 'block';
                checkIcon.style.display = 'none';
            }
            
            text.textContent = isArabic ? 'نسخ' : 'Copy';
        }, 2000);
    }
}

customElements.define('fresh-coupon', FreshCoupon);
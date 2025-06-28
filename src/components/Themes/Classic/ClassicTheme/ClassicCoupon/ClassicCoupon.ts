// ClassicCoupon.ts - Simple copy functionality with language support

function detectLanguage(): string {
    const langCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('lang='))
        ?.split('=')[1];
    return langCookie || 'en';
}

function copyCoupon(): void {
    const couponCodeElement = document.querySelector('[data-coupon-code]') as HTMLElement;
    const copyButton = document.querySelector('[data-coupon-copy]') as HTMLButtonElement;
    const copyIcon = copyButton?.querySelector('[data-copy-icon]') as HTMLElement;
    const copyText = copyButton?.querySelector('[data-copy-text]') as HTMLElement;
    
    if (!couponCodeElement || !copyButton || !copyIcon || !copyText) {
        console.warn('Coupon elements not found');
        return;
    }

    const couponCode = couponCodeElement.textContent?.trim();
    if (!couponCode) return;

    const currentLang = detectLanguage();
    
    // Copy to clipboard
    navigator.clipboard.writeText(couponCode).then(() => {
        // Update button state
        copyButton.classList.add('copied');
        copyIcon.className = 'fa-solid fa-check text-sm';
        
        // Show language-specific message
        if (currentLang === 'ar') {
            copyText.textContent = 'تم النسخ!';
        } else {
            copyText.textContent = 'Copied!';
        }
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyIcon.className = 'fa-solid fa-copy text-sm';
            
            if (currentLang === 'ar') {
                copyText.textContent = 'نسخ';
            } else {
                copyText.textContent = 'Copy';
            }
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = couponCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show success message (same as above)
        copyButton.classList.add('copied');
        copyIcon.className = 'fa-solid fa-check text-sm';
        copyText.textContent = currentLang === 'ar' ? 'تم النسخ!' : 'Copied!';
        
        setTimeout(() => {
            copyButton.classList.remove('copied');
            copyIcon.className = 'fa-solid fa-copy text-sm';
            copyText.textContent = currentLang === 'ar' ? 'نسخ' : 'Copy';
        }, 2000);
    });
}

// Make function globally available
(window as any).copyCoupon = copyCoupon;

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Function is ready to use
});

// Support for Astro page transitions
document.addEventListener('astro:page-load', () => {
    // Function is ready to use
});
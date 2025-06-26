  function copyCoupon() {
    const couponCode = document.querySelector('.classic-coupon-code').textContent;
    const copyBtn = document.getElementById('copyBtn');
    
    navigator.clipboard.writeText(couponCode).then(() => {
      const span = copyBtn.querySelector('span');
      const icon = copyBtn.querySelector('i');
      
      span.textContent = 'تم النسخ!';
      icon.className = 'fa-solid fa-check text-xs';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        span.textContent = 'نسخ';
        icon.className = 'fa-solid fa-copy text-xs';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  }
  
  window.copyCoupon = copyCoupon;
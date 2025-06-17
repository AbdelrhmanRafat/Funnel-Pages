// Troy FAQ JavaScript - Toggle Functionality

document.addEventListener('DOMContentLoaded', function() {
  // Get all FAQ question buttons
  const faqButtons = document.querySelectorAll('[data-faq-index]');
  
  faqButtons.forEach(button => {
    button.addEventListener('click', function() {
      const index = this.getAttribute('data-faq-index');
      const faqItem = this.closest('.troy-faq-item');
      const answerElement = document.querySelector(`[data-answer-index="${index}"]`);
      
      // Close all other FAQ items
      document.querySelectorAll('.troy-faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const otherAnswer = item.querySelector('.troy-faq-answer');
          if (otherAnswer) {
            otherAnswer.classList.remove('active');
          }
        }
      });
      
      // Toggle current FAQ item
      const isActive = faqItem.classList.contains('active');
      
      if (isActive) {
        // Close current item
        faqItem.classList.remove('active');
        answerElement.classList.remove('active');
      } else {
        // Open current item
        faqItem.classList.add('active');
        answerElement.classList.add('active');
      }
    });
  });
});
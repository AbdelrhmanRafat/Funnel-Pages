// Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ question buttons
    const faqQuestions: NodeListOf<Element> = document.querySelectorAll('[data-faq-index]');
    
    // Add click event listener to each FAQ question
    faqQuestions.forEach(function(question: Element) {
      question.addEventListener('click', function(this: Element) {
        const index = this.getAttribute('data-faq-index');
        const answer = document.querySelector(`[data-answer-index="${index}"]`);
        const icon = this.querySelector('.plus-icon');
        
        // Close all other FAQs
        const allAnswers: NodeListOf<Element> = document.querySelectorAll('[data-answer-index]');
        const allIcons: NodeListOf<Element> = document.querySelectorAll('.plus-icon');
        
        allAnswers.forEach(function(item: Element) {
          if (item !== answer) {
            (item as HTMLElement).style.maxHeight = '0';
            item.classList.remove('open');
          }
        });
        
        allIcons.forEach(function(item: Element) {
          if (item !== icon) {
            (item as HTMLElement).style.transform = 'rotate(0deg)';
            item.classList.remove('rotate');
          }
        });
        
        // Toggle current FAQ
        if (answer && answer.classList.contains('open')) {
          (answer as HTMLElement).style.maxHeight = '0';
          answer.classList.remove('open');
          if (icon) {
            (icon as HTMLElement).style.transform = 'rotate(0deg)';
            icon.classList.remove('rotate');
          }
        } else if (answer) {
          (answer as HTMLElement).style.maxHeight = (answer as HTMLElement).scrollHeight + 'px';
          answer.classList.add('open');
          if (icon) {
            (icon as HTMLElement).style.transform = 'rotate(45deg)';
            icon.classList.add('rotate');
          }
        }
      });
    });

    // Optional: Close FAQ when clicking outside
    document.addEventListener('click', function(event: MouseEvent) {
      const faqSection = document.getElementById('troyFaqSection');
      if (faqSection && !faqSection.contains(event.target as Node)) {
        const allAnswers: NodeListOf<Element> = document.querySelectorAll('[data-answer-index]');
        const allIcons: NodeListOf<Element> = document.querySelectorAll('.plus-icon');
        
        allAnswers.forEach(function(answer: Element) {
          (answer as HTMLElement).style.maxHeight = '0';
          answer.classList.remove('open');
        });
        
        allIcons.forEach(function(icon: Element) {
          (icon as HTMLElement).style.transform = 'rotate(0deg)';
          icon.classList.remove('rotate');
        });
      }
    });
  });
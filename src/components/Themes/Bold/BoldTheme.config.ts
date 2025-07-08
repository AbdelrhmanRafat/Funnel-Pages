document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("scrollToTopBtn");
  
  if (button) {
    // Handle scroll to top click
    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth" // for a smooth scrolling effect
      });
    });
    
    // Handle show/hide button based on scroll position
    const toggleButtonVisibility = () => {
      if (window.pageYOffset > 300) {
        button.classList.add("show");
      } else {
        button.classList.remove("show");
      }
    };
    
    // Check scroll position on page load
    toggleButtonVisibility();
    
    // Listen for scroll events
    window.addEventListener("scroll", toggleButtonVisibility);
  }
});
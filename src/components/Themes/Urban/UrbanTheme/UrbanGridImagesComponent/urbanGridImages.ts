class UrbanFadeInGallery extends HTMLElement {
  private observer: IntersectionObserver | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    this.initializeObserver();
    this.setupInitialState();
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupInitialState() {
    // Find all image containers and set initial opacity to 0
    const imageContainers = this.querySelectorAll('.group');
    imageContainers.forEach((container, index) => {
      const element = container as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
    });
  }

  private initializeObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateImages();
          } else {
            this.resetImages();
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: '0px 0px -50px 0px' // Start animation a bit before section is fully visible
      }
    );

    // Observe the entire section
    this.observer.observe(this);
  }

  private animateImages() {
    const imageContainers = this.querySelectorAll('.group');
    
    imageContainers.forEach((container) => {
      const element = container as HTMLElement;
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  private resetImages() {
    const imageContainers = this.querySelectorAll('.group');
    
    imageContainers.forEach((container, index) => {
      const element = container as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      // Reset transition with staggered delay for next animation
      element.style.transition = `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`;
    });
  }
}

// Register the custom element
customElements.define('urban-fade-in-gallery', UrbanFadeInGallery);

// Export for TypeScript modules
export default UrbanFadeInGallery;
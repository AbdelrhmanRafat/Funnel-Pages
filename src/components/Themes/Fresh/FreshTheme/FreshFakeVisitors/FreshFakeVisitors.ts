// FreshVisitorsFlashAnimation.ts

interface FreshVisitor {
    image: string;
    label: string;
  }
  
  interface FreshVisitorsConfig {
    displayTime: number;
    flashDuration: number;
  }
  
  class FreshVisitorsFlashAnimation extends HTMLElement {
    private visitorsData: FreshVisitor[] = [];
    private config: FreshVisitorsConfig;
    private currentVisitorIndex: number = 0;
    private imageElement: HTMLImageElement | null = null;
    private descriptionElement: HTMLElement | null = null;
    private animationTimeout: number | null = null;
    private isAnimating: boolean = false;
  
    constructor() {
      super();
      
      // Default configuration
      this.config = {
        displayTime: 3000,
        flashDuration: 800
      };
    }
  
    connectedCallback() {
      this.initializeElements();
      this.loadConfiguration();
      this.loadVisitorsData();
      
      if (this.visitorsData.length > 0 && this.imageElement && this.descriptionElement) {
        this.startAnimation();
      }
    }
  
    private initializeElements(): void {
      this.imageElement = this.querySelector('#fresh-visitor-img') as HTMLImageElement;
      this.descriptionElement = this.querySelector('#fresh-visitor-desc') as HTMLElement;
      
      if (!this.imageElement || !this.descriptionElement) {
        console.error('FreshVisitorsFlashAnimation: Required elements not found');
      }
    }
  
    private loadConfiguration(): void {
      const displayTime = this.dataset.freshDisplayTime;
      const flashDuration = this.dataset.freshFlashDuration;
      
      if (displayTime) {
        this.config.displayTime = parseInt(displayTime, 10) || this.config.displayTime;
      }
      
      if (flashDuration) {
        this.config.flashDuration = parseInt(flashDuration, 10) || this.config.flashDuration;
      }
    }
  
    private loadVisitorsData(): void {
      const visitorsDataAttribute = this.dataset.freshVisitors;
      
      if (visitorsDataAttribute) {
        try {
          this.visitorsData = JSON.parse(visitorsDataAttribute);
        } catch (error) {
          console.error('FreshVisitorsFlashAnimation: Failed to parse visitors data:', error);
          this.visitorsData = [];
        }
      }
    }
  
    private startAnimation(): void {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.showCurrentVisitor();
    }
  
    private showCurrentVisitor(): void {
      if (this.visitorsData.length === 0 || !this.imageElement || !this.descriptionElement) {
        return;
      }
  
      const currentVisitor = this.visitorsData[this.currentVisitorIndex];
      
      // Hide current content first
      this.hideVisitor(() => {
        if (this.imageElement && this.descriptionElement) {
          // Update content
          this.imageElement.src = currentVisitor.image;
          this.imageElement.alt = `Visitor ${this.currentVisitorIndex + 1}`;
          this.descriptionElement.textContent = currentVisitor.label;
          
          // Show with flash effect
          this.flashVisitor();
          
          // Move to next visitor (loop back to start when at end)
          this.currentVisitorIndex = (this.currentVisitorIndex + 1) % this.visitorsData.length;
          
          // Schedule next visitor
          this.animationTimeout = window.setTimeout(() => {
            this.showCurrentVisitor();
          }, this.config.displayTime);
        }
      });
    }
  
    private hideVisitor(callback: () => void): void {
      const imageContainer = this.querySelector('.fresh-visitor-image') as HTMLElement;
      const description = this.querySelector('.fresh-visitor-description') as HTMLElement;
      
      if (imageContainer && description) {
        imageContainer.classList.add('fresh-visitor-hidden');
        description.classList.add('fresh-visitor-hidden');
      }
      
      // Wait for fade out transition
      setTimeout(callback, 300);
    }
  
    private flashVisitor(): void {
      const imageContainer = this.querySelector('.fresh-visitor-image') as HTMLElement;
      const description = this.querySelector('.fresh-visitor-description') as HTMLElement;
      
      if (!imageContainer || !description) return;
      
      // Remove hidden class and add flash effect
      imageContainer.classList.remove('fresh-visitor-hidden');
      description.classList.remove('fresh-visitor-hidden');
      
      imageContainer.classList.add('fresh-visitor-flash', 'fresh-visitor-visible');
      description.classList.add('fresh-visitor-flash', 'fresh-visitor-visible');
      
      // Remove flash class after animation completes
      setTimeout(() => {
        imageContainer.classList.remove('fresh-visitor-flash');
        description.classList.remove('fresh-visitor-flash');
      }, this.config.flashDuration);
    }
  
    // Public methods for external control
    public pauseAnimation(): void {
      this.isAnimating = false;
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
        this.animationTimeout = null;
      }
    }
  
    public resumeAnimation(): void {
      if (!this.isAnimating && this.visitorsData.length > 0) {
        this.startAnimation();
      }
    }
  
    public updateVisitors(newVisitors: FreshVisitor[]): void {
      this.visitorsData = newVisitors;
      this.currentVisitorIndex = 0;
      
      // Restart animation with new data
      this.pauseAnimation();
      if (this.visitorsData.length > 0) {
        this.startAnimation();
      }
    }
  
    public updateConfiguration(newConfig: Partial<FreshVisitorsConfig>): void {
      this.config = { ...this.config, ...newConfig };
    }
  
    public getCurrentVisitorIndex(): number {
      return this.currentVisitorIndex;
    }
  
    public getVisitorsData(): FreshVisitor[] {
      return [...this.visitorsData];
    }
  
    public jumpToVisitor(index: number): void {
      if (index >= 0 && index < this.visitorsData.length) {
        this.currentVisitorIndex = index;
        this.pauseAnimation();
        this.showCurrentVisitor();
      }
    }
  
    disconnectedCallback(): void {
      this.pauseAnimation();
    }
  }
  
  // Register the custom element
  customElements.define('fresh-visitors-animation', FreshVisitorsFlashAnimation);
  
  // Export for potential external use
  export { FreshVisitorsFlashAnimation, type FreshVisitor, type FreshVisitorsConfig };
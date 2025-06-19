// nasaCarousel.ts

interface CarouselElements {
  carousel: HTMLElement;
  paginationContainer: HTMLElement;
}

interface CarouselConfig {
  cardWidth: number;
  autoPlayInterval: number;
  animationDuration: number;
}

class NasaCarousel {
  private elements: CarouselElements;
  private config: CarouselConfig;
  private currentIndex: number = 0;
  private totalCards: number = 0;
  private visibleCards: number = 1;
  private maxIndex: number = 0;
  private autoPlayTimer: number | null = null;
  private dots: HTMLElement[] = [];

  constructor() {
    this.config = {
      cardWidth: 320, // w-80 (320px) + gap
      autoPlayInterval: 5000,
      animationDuration: 300
    };

    this.init();
  }

  private init(): void {
    this.elements = this.getElements();
    if (!this.elements.carousel) {
      console.warn('NASA Carousel: Required elements not found');
      return;
    }

    this.calculateDimensions();
    this.createPaginationDots();
    this.attachEventListeners();
    this.updateCarousel();
    this.startAutoPlay();
  }

  private getElements(): CarouselElements {
    return {
      carousel: document.getElementById('carousel') as HTMLElement,
      paginationContainer: document.getElementById('pagination-dots') as HTMLElement
    };
  }

  private calculateDimensions(): void {
    this.totalCards = this.elements.carousel.children.length;
    this.visibleCards = Math.floor(this.elements.carousel.offsetWidth / this.config.cardWidth) || 1;
    this.maxIndex = Math.max(0, this.totalCards - this.visibleCards);
  }

  private createPaginationDots(): void {
    if (!this.elements.paginationContainer) return;

    this.elements.paginationContainer.innerHTML = '';
    this.dots = [];

    const totalDots = Math.ceil(this.totalCards / this.visibleCards);

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.className = 'nasa-pagination-dot w-3 h-3 rounded-full cursor-pointer transition-all duration-300';
      dot.setAttribute('data-index', i.toString());
      dot.addEventListener('click', () => this.goToSlide(i * this.visibleCards));
      
      this.elements.paginationContainer.appendChild(dot);
      this.dots.push(dot);
    }
  }

  private attachEventListeners(): void {
    // Keyboard navigation
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.goToNext();
      }
    });

    // Touch/swipe support
    this.addTouchSupport();

    // Pause auto-play on hover
    this.elements.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.elements.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());

    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
    });
  }

  private addTouchSupport(): void {
    let startX: number = 0;
    let startY: number = 0;
    let isDragging: boolean = false;

    this.elements.carousel.addEventListener('touchstart', (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      this.stopAutoPlay();
    });

    this.elements.carousel.addEventListener('touchmove', (e: TouchEvent) => {
      if (!isDragging) return;

      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;

      // Prevent vertical scrolling if horizontal swipe is detected
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    });

    this.elements.carousel.addEventListener('touchend', (e: TouchEvent) => {
      if (!isDragging) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.goToPrevious();
        } else {
          this.goToNext();
        }
      }

      isDragging = false;
      this.startAutoPlay();
    });
  }

  private goToPrevious(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  private goToNext(): void {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    } else {
      // Loop back to beginning
      this.currentIndex = 0;
      this.updateCarousel();
    }
  }

  private goToSlide(index: number): void {
    this.currentIndex = Math.min(Math.max(0, index), this.maxIndex);
    this.updateCarousel();
  }

  private updateCarousel(): void {
    // Smooth scroll to position
    const scrollPosition = this.currentIndex * this.config.cardWidth;
    this.elements.carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    this.updatePaginationDots();
    this.updateNavigationButtons();
    this.updateAriaAttributes();
  }

  private updatePaginationDots(): void {
    this.dots.forEach((dot, index) => {
      const isActive = index === Math.floor(this.currentIndex / this.visibleCards);
      dot.classList.toggle('nasa-pagination-dot-active', isActive);
      dot.classList.toggle('nasa-pagination-dot-inactive', !isActive);
    });
  }

  private updateNavigationButtons(): void {
    // No navigation buttons to update
  }

  private updateAriaAttributes(): void {
    this.elements.carousel.setAttribute('aria-label', `Review ${this.currentIndex + 1} of ${this.totalCards}`);
  }

  private startAutoPlay(): void {
    this.stopAutoPlay(); // Clear any existing timer
    
    this.autoPlayTimer = window.setInterval(() => {
      this.goToNext();
    }, this.config.autoPlayInterval);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  private handleResize(): void {
    this.calculateDimensions();
    
    // Adjust current index if needed
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
    
    this.createPaginationDots();
    this.updateCarousel();
  }

  // Public methods for external control
  public pause(): void {
    this.stopAutoPlay();
  }

  public resume(): void {
    this.startAutoPlay();
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getTotalCards(): number {
    return this.totalCards;
  }

  public destroy(): void {
    this.stopAutoPlay();
    // Remove event listeners would go here if needed
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NasaCarousel();
});

// Export for potential external use
export default NasaCarousel;
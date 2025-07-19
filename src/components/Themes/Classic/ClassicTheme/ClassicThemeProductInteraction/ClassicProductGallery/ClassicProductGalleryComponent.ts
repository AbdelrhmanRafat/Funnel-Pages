// ClassicGalleryComponent.ts - Web Component for Gallery

interface GalleryElements {
    mainImage: HTMLImageElement | null;
    thumbnails: NodeListOf<HTMLImageElement> | null;
    prevBtn: HTMLButtonElement | null;
    nextBtn: HTMLButtonElement | null;
    currentIndexElement: HTMLElement | null;
    totalImagesElement: HTMLElement | null;
}

class ClassicGallery extends HTMLElement {
    private currentIndex: number = 0;
    private elements: GalleryElements = {
        mainImage: null,
        thumbnails: null,
        prevBtn: null,
        nextBtn: null,
        currentIndexElement: null,
        totalImagesElement: null
    };
    private images: Array<{ src: string; alt: string }> = [];
    private autoPlayInterval: number | null = null;
    private autoPlayEnabled: boolean = false;
    private autoPlayDelay: number = 5000;
    private enableTouch: boolean = true;

    constructor() {
        super();
    }

    connectedCallback() {
        this.initializeSettings();
        this.initializeElements();
        this.extractImagesData();
        this.setupEventListeners();
        this.updateDisplay();
        
       
        
        if (this.enableTouch) {
            this.setupTouchNavigation();
        }
        
        if (this.autoPlayEnabled) {
            this.startAutoPlay();
        }
    }

    disconnectedCallback() {
        this.stopAutoPlay();
    }

    private initializeSettings(): void {
        this.autoPlayEnabled = this.getAttribute('data-gallery-auto-play') === 'true';
        this.autoPlayDelay = parseInt(this.getAttribute('data-gallery-auto-play-delay') || '5000');
        this.enableTouch = this.getAttribute('data-gallery-enable-touch') !== 'false';
    }

    private initializeElements(): void {
        this.elements = {
            mainImage: this.querySelector('[data-gallery-main-image]') as HTMLImageElement,
            thumbnails: this.querySelectorAll('[data-gallery-thumbnail]') as NodeListOf<HTMLImageElement>,
            prevBtn: this.querySelector('[data-gallery-prev-btn]') as HTMLButtonElement,
            nextBtn: this.querySelector('[data-gallery-next-btn]') as HTMLButtonElement,
            currentIndexElement: this.querySelector('[data-gallery-current-index]') as HTMLElement,
            totalImagesElement: this.querySelector('[data-gallery-total-images]') as HTMLElement
        };

        if (!this.elements.mainImage || !this.elements.thumbnails?.length) {
            console.warn('Gallery: Required elements not found');
            return;
        }
    }

    private extractImagesData(): void {
        if (!this.elements.thumbnails) return;
        
        this.images = Array.from(this.elements.thumbnails).map((thumbnail, index) => ({
            src: thumbnail.src,
            alt: thumbnail.alt || `Image ${index + 1}`
        }));
    }

    private setupEventListeners(): void {
        // Navigation buttons
        this.elements.prevBtn?.addEventListener('click', () => this.previousImage());
        this.elements.nextBtn?.addEventListener('click', () => this.nextImage());

        // Thumbnail clicks
        this.elements.thumbnails?.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => this.goToImage(index));
        });

        // Main image click for next image
        this.elements.mainImage?.addEventListener('click', () => this.nextImage());

        // Pause autoplay on hover
        this.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.addEventListener('mouseleave', () => this.resumeAutoPlay());
    }

    private setupKeyboardNavigation(): void {
        document.addEventListener('keydown', (event) => {
            if (!this.isGalleryVisible()) return;

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.nextImage();
                    break;
                case 'Home':
                    event.preventDefault();
                    this.goToImage(0);
                    break;
                case 'End':
                    event.preventDefault();
                    this.goToImage(this.images.length - 1);
                    break;
                case ' ': // Spacebar
                    event.preventDefault();
                    this.toggleAutoPlay();
                    break;
                case 'Escape':
                    event.preventDefault();
                    this.stopAutoPlay();
                    break;
            }
        });
    }

    private setupTouchNavigation(): void {
        if (!this.elements.mainImage) return;

        let startX: number = 0;
        let startY: number = 0;
        const threshold: number = 50;

        this.elements.mainImage.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }, { passive: true });

        this.elements.mainImage.addEventListener('touchend', (event) => {
            if (!event.changedTouches.length) return;

            const endX = event.changedTouches[0].clientX;
            const endY = event.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Check if it's a horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    this.previousImage();
                } else {
                    this.nextImage();
                }
            }
        }, { passive: true });
    }

    private isGalleryVisible(): boolean {
        const rect = this.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    public nextImage(): void {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateDisplay();
        this.resetAutoPlay();
    }

    public previousImage(): void {
        this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.updateDisplay();
        this.resetAutoPlay();
    }

    public goToImage(index: number): void {
        if (index >= 0 && index < this.images.length) {
            this.currentIndex = index;
            this.updateDisplay();
            this.resetAutoPlay();
        }
    }

    private updateDisplay(): void {
        if (!this.elements.mainImage || !this.images.length) return;

        const currentImage = this.images[this.currentIndex];

        // Update main image with fade effect
        this.fadeImage(() => {
            this.elements.mainImage!.src = currentImage.src;
            this.elements.mainImage!.alt = currentImage.alt;
        });

        // Update thumbnails
        this.updateThumbnails();

        // Update counter
        this.updateCounter();
    }

    private fadeImage(callback: () => void): void {
        if (!this.elements.mainImage) return;

        this.elements.mainImage.style.opacity = '0.5';
        this.elements.mainImage.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            callback();
            this.elements.mainImage!.style.opacity = '1';
        }, 150);
    }

    private updateThumbnails(): void {
        this.elements.thumbnails?.forEach((thumbnail, index) => {
            thumbnail.classList.remove('classic-thumbnail-active');
            if (index === this.currentIndex) {
                thumbnail.classList.add('classic-thumbnail-active');
            }
        });
    }

    private updateCounter(): void {
        if (this.elements.currentIndexElement) {
            this.elements.currentIndexElement.textContent = (this.currentIndex + 1).toString();
        }
        if (this.elements.totalImagesElement) {
            this.elements.totalImagesElement.textContent = this.images.length.toString();
        }
    }

    // Auto-play functionality
    public startAutoPlay(): void {
        this.autoPlayEnabled = true;
        this.autoPlayInterval = window.setInterval(() => {
            this.nextImage();
        }, this.autoPlayDelay);
    }

    public stopAutoPlay(): void {
        this.autoPlayEnabled = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    public toggleAutoPlay(): void {
        if (this.autoPlayEnabled) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    private pauseAutoPlay(): void {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    private resumeAutoPlay(): void {
        if (this.autoPlayEnabled && !this.autoPlayInterval) {
            this.autoPlayInterval = window.setInterval(() => {
                this.nextImage();
            }, this.autoPlayDelay);
        }
    }

    private resetAutoPlay(): void {
        if (this.autoPlayEnabled) {
            this.pauseAutoPlay();
            this.resumeAutoPlay();
        }
    }

    // Public API methods
    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    public getTotalImages(): number {
        return this.images.length;
    }

    public getCurrentImage(): { src: string; alt: string } | null {
        return this.images[this.currentIndex] || null;
    }
}

// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
    if (!customElements.get('classic-gallery')) {
        customElements.define('classic-gallery', ClassicGallery);
    }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
    const galleries = document.querySelectorAll('classic-gallery:not(:defined)');
    galleries.forEach(gallery => {
        if (gallery instanceof ClassicGallery) {
            gallery.connectedCallback();
        }
    });
});

export { ClassicGallery };
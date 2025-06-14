// ClassicGalleryController.ts
export class ClassicGalleryController {
    private currentIndex: number = 0;
    private gallery: HTMLElement | null = null;
    private mainImage: HTMLImageElement | null = null;
    private thumbnails: NodeListOf<HTMLImageElement> | null = null;
    private prevBtn: HTMLButtonElement | null = null;
    private nextBtn: HTMLButtonElement | null = null;
    private currentImageIndexElement: HTMLElement | null = null;
    private totalImagesElement: HTMLElement | null = null;
    private images: Array<{ src: string; alt: string }> = [];
    private autoPlayInterval: number | null = null;
    private autoPlayEnabled: boolean = false;
    private autoPlayDelay: number = 5000; // 5 seconds

    constructor(galleryId: string = 'classic-gallery') {
        this.init(galleryId);
    }

    private init(galleryId: string): void {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupGallery(galleryId));
        } else {
            this.setupGallery(galleryId);
        }
    }

    private setupGallery(galleryId: string): void {
        // Get gallery elements
        this.gallery = document.getElementById(galleryId);
        if (!this.gallery) {
            console.warn(`Gallery with ID "${galleryId}" not found`);
            return;
        }

        this.mainImage = this.gallery.querySelector('#mainImage');
        this.thumbnails = this.gallery.querySelectorAll('.classic-thumbnail');
        this.prevBtn = this.gallery.querySelector('#prevBtn');
        this.nextBtn = this.gallery.querySelector('#nextBtn');
        this.currentImageIndexElement = this.gallery.querySelector('#currentImageIndex');
        this.totalImagesElement = this.gallery.querySelector('#totalImages');

        if (!this.mainImage || !this.thumbnails.length) {
            console.warn('Required gallery elements not found');
            return;
        }

        // Extract images data from thumbnails
        this.extractImagesData();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize display
        this.updateDisplay();

        // Setup keyboard navigation
        this.setupKeyboardNavigation();

        // Setup touch/swipe navigation
        this.setupTouchNavigation();
    }

    private extractImagesData(): void {
        this.images = Array.from(this.thumbnails!).map((thumbnail, index) => ({
            src: thumbnail.src,
            alt: thumbnail.alt || `Image ${index + 1}`
        }));
    }

    private setupEventListeners(): void {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.previousImage());
        this.nextBtn?.addEventListener('click', () => this.nextImage());

        // Thumbnail clicks
        this.thumbnails?.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => this.goToImage(index));
        });

        // Main image click for next image
        this.mainImage?.addEventListener('click', () => this.nextImage());

        // Pause autoplay on hover
        this.gallery?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.gallery?.addEventListener('mouseleave', () => this.resumeAutoPlay());
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
        if (!this.mainImage) return;

        let startX: number = 0;
        let startY: number = 0;
        let threshold: number = 50;

        this.mainImage.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }, { passive: true });

        this.mainImage.addEventListener('touchend', (event) => {
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
        if (!this.gallery) return false;
        const rect = this.gallery.getBoundingClientRect();
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
        if (!this.mainImage || !this.images.length) return;

        const currentImage = this.images[this.currentIndex];

        // Update main image with fade effect
        this.fadeImage(() => {
            this.mainImage!.src = currentImage.src;
            this.mainImage!.alt = currentImage.alt;
        });

        // Update thumbnails
        this.updateThumbnails();

        // Update counter
        this.updateCounter();

        // Scroll thumbnail into view
        this.scrollThumbnailIntoView();
    }

    private fadeImage(callback: () => void): void {
        if (!this.mainImage) return;

        this.mainImage.style.opacity = '0.5';
        this.mainImage.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            callback();
            this.mainImage!.style.opacity = '1';
        }, 150);
    }

    private updateThumbnails(): void {
        this.thumbnails?.forEach((thumbnail, index) => {
            thumbnail.classList.remove('classic-thumbnail-active');
            if (index === this.currentIndex) {
                thumbnail.classList.add('classic-thumbnail-active');
            }
        });
    }

    private updateCounter(): void {
        if (this.currentImageIndexElement) {
            this.currentImageIndexElement.textContent = (this.currentIndex + 1).toString();
        }
        if (this.totalImagesElement) {
            this.totalImagesElement.textContent = this.images.length.toString();
        }
    }

    private scrollThumbnailIntoView(): void {
        const activeThumbnail = this.thumbnails?.[this.currentIndex];
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    // Auto-play functionality
    public startAutoPlay(delay: number = 5000): void {
        this.autoPlayDelay = delay;
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

    // Preload images for better performance
    public preloadImages(): void {
        this.images.forEach((image) => {
            const img = new Image();
            img.src = image.src;
        });
    }

    // Public getters
    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    public getTotalImages(): number {
        return this.images.length;
    }

    public getCurrentImage(): { src: string; alt: string } | null {
        return this.images[this.currentIndex] || null;
    }

    // Cleanup method
    public destroy(): void {
        this.stopAutoPlay();
        // Remove event listeners would go here if needed
    }
}

// Initialize gallery when script loads
let galleryController: ClassicGalleryController;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    galleryController = new ClassicGalleryController();
    
    // Optional: Start autoplay after 3 seconds of inactivity
    setTimeout(() => {
        if (galleryController) {
            galleryController.startAutoPlay();
        }
    }, 3000);
});

// Export for manual initialization if needed
export { galleryController };
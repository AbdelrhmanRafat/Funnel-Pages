// Enhanced NeonGalleryComponent.ts - Streamlined for Tailwind

interface GalleryElements {
    mainImage: HTMLImageElement | null;
    thumbnails: NodeListOf<HTMLImageElement> | null;
    prevBtn: HTMLButtonElement | null;
    nextBtn: HTMLButtonElement | null;
    currentIndexElement: HTMLElement | null;
    totalImagesElement: HTMLElement | null;
    progressFill: HTMLElement | null;
    thumbnailsContainer: HTMLElement | null;
    imageLoader: HTMLElement | null;
    zoomTrigger: HTMLElement | null;
    modal: HTMLElement | null;
    modalImage: HTMLImageElement | null;
    modalClose: HTMLButtonElement | null;
}

interface GalleryImage {
    src: string;
    alt: string;
    loaded: boolean;
}

class NeonGallery extends HTMLElement {
    private currentIndex: number = 0;
    private elements: GalleryElements = {
        mainImage: null,
        thumbnails: null,
        prevBtn: null,
        nextBtn: null,
        currentIndexElement: null,
        totalImagesElement: null,
        progressFill: null,
        thumbnailsContainer: null,
        imageLoader: null,
        zoomTrigger: null,
        modal: null,
        modalImage: null,
        modalClose: null
    };
    private images: GalleryImage[] = [];
    private autoPlayInterval: number | null = null;
    private autoPlayEnabled: boolean = false;
    private autoPlayDelay: number = 5000;
    private enableTouch: boolean = true;
    private isImageLoading: boolean = false;

    constructor() {
        super();
    }

    connectedCallback() {
        this.initializeSettings();
        this.initializeElements();
        this.extractImagesData();
        this.setupEventListeners();
        this.updateDisplay();
        this.preloadImages();
        
        if (this.enableTouch) {
            this.setupTouchNavigation();
        }
        
        if (this.autoPlayEnabled) {
            this.startAutoPlay();
        }
    }

    private openImageModal(): void {
        if (!this.elements.modal || !this.elements.modalImage) return;

        const currentImage = this.images[this.currentIndex];
        this.elements.modalImage.src = currentImage.src;
        this.elements.modalImage.alt = currentImage.alt;
        
        this.elements.modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    private closeImageModal(): void {
        if (!this.elements.modal) return;

        this.elements.modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
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
            totalImagesElement: this.querySelector('[data-gallery-total-images]') as HTMLElement,
            progressFill: this.querySelector('.neon-progress-fill') as HTMLElement,
            thumbnailsContainer: this.querySelector('[data-thumbnails-container]') as HTMLElement,
            imageLoader: this.querySelector('.neon-loader') as HTMLElement,
            zoomTrigger: this.querySelector('[data-zoom-trigger]') as HTMLElement,
            modal: this.querySelector('[data-image-modal]') as HTMLElement,
            modalImage: this.querySelector('[data-modal-image]') as HTMLImageElement,
            modalClose: this.querySelector('[data-modal-close]') as HTMLButtonElement
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
            alt: thumbnail.alt || `Image ${index + 1}`,
            loaded: false
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

        // Zoom functionality
        this.elements.zoomTrigger?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openImageModal();
        });

        this.elements.modalClose?.addEventListener('click', () => this.closeImageModal());
        this.elements.modal?.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeImageModal();
            }
        });

        // Auto-play controls
        this.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.addEventListener('mouseleave', () => this.resumeAutoPlay());

        // Image loading events
        this.elements.mainImage?.addEventListener('load', () => this.onImageLoaded());
        this.elements.mainImage?.addEventListener('error', () => this.onImageError());
    }

    private setupTouchNavigation(): void {
        if (!this.elements.mainImage) return;

        let startX: number = 0;
        let startY: number = 0;
        let startTime: number = 0;
        const threshold: number = 50;
        const maxTime: number = 300;

        const touchStartHandler = (event: TouchEvent) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        };

        const touchEndHandler = (event: TouchEvent) => {
            if (!event.changedTouches.length) return;

            const touch = event.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // Check if it's a valid swipe
            if (deltaTime > maxTime) return;
            if (Math.abs(deltaX) < threshold) return;
            if (Math.abs(deltaY) > Math.abs(deltaX)) return;

            if (deltaX > 0) {
                this.previousImage();
            } else {
                this.nextImage();
            }
        };

        this.elements.mainImage.addEventListener('touchstart', touchStartHandler, { passive: true });
        this.elements.mainImage.addEventListener('touchend', touchEndHandler, { passive: true });
    }

    private isGalleryVisible(): boolean {
        const rect = this.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    private preloadImages(): void {
        // Preload the next few images for better performance
        const preloadCount = Math.min(3, this.images.length);
        for (let i = 0; i < preloadCount; i++) {
            const img = new Image();
            img.src = this.images[i].src;
            img.onload = () => {
                this.images[i].loaded = true;
            };
        }
    }

    private showImageLoader(): void {
        if (this.elements.imageLoader) {
            this.elements.imageLoader.classList.add('loading');
        }
        this.isImageLoading = true;
    }

    private hideImageLoader(): void {
        if (this.elements.imageLoader) {
            this.elements.imageLoader.classList.remove('loading');
        }
        this.isImageLoading = false;
    }

    private onImageLoaded(): void {
        this.hideImageLoader();
        this.images[this.currentIndex].loaded = true;
    }

    private onImageError(): void {
        this.hideImageLoader();
        console.error(`Failed to load image: ${this.images[this.currentIndex].src}`);
    }

    public nextImage(): void {
        if (this.isImageLoading) return;
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateDisplay();
        this.resetAutoPlay();
    }

    public previousImage(): void {
        if (this.isImageLoading) return;
        this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.updateDisplay();
        this.resetAutoPlay();
    }

    public goToImage(index: number): void {
        if (index >= 0 && index < this.images.length && !this.isImageLoading) {
            this.currentIndex = index;
            this.updateDisplay();
            this.resetAutoPlay();
        }
    }

    private updateDisplay(): void {
        if (!this.elements.mainImage || !this.images.length) return;

        const currentImage = this.images[this.currentIndex];

        // Show loader for new image
        this.showImageLoader();

        // Update main image with fade effect
        this.fadeImage(() => {
            this.elements.mainImage!.src = currentImage.src;
            this.elements.mainImage!.alt = currentImage.alt;
        });

        // Update thumbnails
        this.updateThumbnails();
        
        // Update counter and progress
        this.updateCounter();
        this.updateProgress();
    }

    private fadeImage(callback: () => void): void {
        if (!this.elements.mainImage) return;

        this.elements.mainImage.style.opacity = '0.7';
        this.elements.mainImage.style.transition = 'opacity 0.2s ease';

        setTimeout(() => {
            callback();
            this.elements.mainImage!.style.opacity = '1';
        }, 100);
    }

    private updateThumbnails(): void {
        this.elements.thumbnails?.forEach((thumbnail, index) => {
            thumbnail.classList.remove('neon-thumbnail-active');
            if (index === this.currentIndex) {
                thumbnail.classList.add('neon-thumbnail-active');
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

    private updateProgress(): void {
        if (this.elements.progressFill) {
            const progressPercentage = ((this.currentIndex + 1) / this.images.length) * 100;
            this.elements.progressFill.style.width = `${progressPercentage}%`;
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

    public getCurrentImage(): GalleryImage | null {
        return this.images[this.currentIndex] || null;
    }
}

// Register the custom element
document.addEventListener('DOMContentLoaded', () => {
    if (!customElements.get('neon-gallery')) {
        customElements.define('neon-gallery', NeonGallery);
    }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
    const galleries = document.querySelectorAll('neon-gallery:not(:defined)');
    galleries.forEach(gallery => {
        if (gallery instanceof NeonGallery) {
            gallery.connectedCallback();
        }
    });
});

export { NeonGallery };
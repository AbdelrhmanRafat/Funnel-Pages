// ClassicSoulGallery.ts - Complete Mobile-First Touch Gallery Component

interface GalleryElements {
    mainImage: HTMLImageElement | null;
    thumbnails: NodeListOf<HTMLImageElement> | null;
    prevBtn: HTMLButtonElement | null;
    nextBtn: HTMLButtonElement | null;
    currentIndexElement: HTMLElement | null;
    totalImagesElement: HTMLElement | null;
    // Fullscreen elements
    fullscreenModal: HTMLElement | null;
    fullscreenImage: HTMLImageElement | null;
    fullscreenPrevBtn: HTMLButtonElement | null;
    fullscreenNextBtn: HTMLButtonElement | null;
    fullscreenCloseBtn: HTMLButtonElement | null;
    fullscreenCurrentElement: HTMLElement | null;
    fullscreenTotalElement: HTMLElement | null;
    openFullscreenTrigger: HTMLElement | null;
}

class ClassicGallery extends HTMLElement {
    private currentIndex: number = 0;
    private elements: GalleryElements = {
        mainImage: null,
        thumbnails: null,
        prevBtn: null,
        nextBtn: null,
        currentIndexElement: null,
        totalImagesElement: null,
        // Fullscreen elements
        fullscreenModal: null,
        fullscreenImage: null,
        fullscreenPrevBtn: null,
        fullscreenNextBtn: null,
        fullscreenCloseBtn: null,
        fullscreenCurrentElement: null,
        fullscreenTotalElement: null,
        openFullscreenTrigger: null
    };
    private images: Array<{ src: string; alt: string }> = [];
    private autoPlayInterval: number | null = null;
    private autoPlayEnabled: boolean = false;
    private autoPlayDelay: number = 5000;
    private enableTouch: boolean = true;
    private isFullscreen: boolean = false;
    private originalStickyState: string = '';
    private galleryContainer: HTMLElement | null = null;
    private lastTouchTime: number = 0;

    constructor() {
        super();
    }

    connectedCallback() {
        this.initializeSettings();
        this.initializeElements();
        this.extractImagesData();
        this.setupEventListeners();
        this.updateDisplay();
        this.trackTouchActivity();
        
        if (this.enableTouch) {
            this.setupTouchNavigation();
        }
        
        if (this.autoPlayEnabled) {
            this.startAutoPlay();
        }
    }

    disconnectedCallback() {
        this.stopAutoPlay();
        
        // Clean up fullscreen if still open
        if (this.isFullscreen) {
            this.closeFullscreen();
        }
        
        // Remove any global event listeners
        document.body.style.overflow = '';
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
            // Fullscreen elements
            fullscreenModal: this.querySelector('[data-gallery-fullscreen-modal]') as HTMLElement,
            fullscreenImage: this.querySelector('[data-gallery-fullscreen-image]') as HTMLImageElement,
            fullscreenPrevBtn: this.querySelector('[data-gallery-fullscreen-prev]') as HTMLButtonElement,
            fullscreenNextBtn: this.querySelector('[data-gallery-fullscreen-next]') as HTMLButtonElement,
            fullscreenCloseBtn: this.querySelector('[data-gallery-close-fullscreen]') as HTMLButtonElement,
            fullscreenCurrentElement: this.querySelector('[data-gallery-fullscreen-current]') as HTMLElement,
            fullscreenTotalElement: this.querySelector('[data-gallery-fullscreen-total]') as HTMLElement,
            openFullscreenTrigger: this.querySelector('[data-gallery-open-fullscreen]') as HTMLElement
        };

        // Find the gallery container (the element with sticky positioning)
        this.galleryContainer = this.closest('.lg\\:sticky') as HTMLElement;
        if (this.galleryContainer) {
            this.originalStickyState = this.galleryContainer.className;
        }

        if (!this.elements.mainImage || !this.elements.thumbnails?.length) {
            console.warn('Classic Soul Gallery: Required elements not found');
            return;
        }
    }

    private extractImagesData(): void {
        if (!this.elements.thumbnails) return;
        
        this.images = Array.from(this.elements.thumbnails).map((thumbnail, index) => ({
            src: thumbnail.src,
            alt: thumbnail.alt || `${this.getProductName()} - View ${index + 1}`
        }));
    }

    private getProductName(): string {
        return this.elements.mainImage?.alt?.split(' - ')[0] || 'Product';
    }

    private setupEventListeners(): void {
        // Navigation buttons - Touch optimized with better event handling
        this.elements.prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousImage();
        });
        
        this.elements.nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextImage();
        });

        // Prevent button double-tap zoom on mobile
        this.elements.prevBtn?.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
        
        this.elements.nextBtn?.addEventListener('touchend', (e) => {
            e.preventDefault();
        });

        // Thumbnail clicks - Enhanced for mobile
        this.elements.thumbnails?.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToImage(index);
            });
            
            // Add touch feedback
            thumbnail.addEventListener('touchstart', () => {
                thumbnail.style.transform = 'scale(0.95)';
            }, { passive: true });
            
            thumbnail.addEventListener('touchend', () => {
                thumbnail.style.transform = '';
            }, { passive: true });
        });

        // Main image click for fullscreen
        this.elements.openFullscreenTrigger?.addEventListener('click', (e) => {
            // Only open fullscreen if not clicking on navigation buttons
            if (!(e.target as Element).closest('[data-gallery-prev-btn], [data-gallery-next-btn]')) {
                this.openFullscreen();
            }
        });

        // Fullscreen event listeners
        this.setupFullscreenListeners();

        // Pause autoplay on interaction
        this.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.addEventListener('mouseleave', () => this.resumeAutoPlay());
        this.addEventListener('touchstart', () => this.pauseAutoPlay(), { passive: true });
        this.addEventListener('touchend', () => this.resumeAutoPlay(), { passive: true });
    }

    private setupFullscreenListeners(): void {
        // Fullscreen navigation
        this.elements.fullscreenPrevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousImage();
        });
        
        this.elements.fullscreenNextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextImage();
        });

        // Close fullscreen
        this.elements.fullscreenCloseBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeFullscreen();
        });

        // Close on modal background click
        this.elements.fullscreenModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.fullscreenModal) {
                this.closeFullscreen();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.closeFullscreen();
            }
        });
    }

    private openFullscreen(): void {
        if (!this.elements.fullscreenModal || !this.elements.fullscreenImage) return;

        this.isFullscreen = true;
        
        // Remove sticky positioning to prevent layout issues
        if (this.galleryContainer) {
            this.galleryContainer.className = this.galleryContainer.className.replace(/lg:sticky|lg:top-0|lg:self-start/g, '');
        }

        // Set fullscreen image
        const currentImage = this.images[this.currentIndex];
        this.elements.fullscreenImage.src = currentImage.src;
        this.elements.fullscreenImage.alt = currentImage.alt;

        // Update fullscreen counter
        this.updateFullscreenCounter();

        // Show modal
        this.elements.fullscreenModal.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        this.elements.fullscreenModal.classList.add('opacity-100', 'visible', 'pointer-events-auto');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        this.elements.fullscreenCloseBtn?.focus();
    }

    private closeFullscreen(): void {
        if (!this.elements.fullscreenModal) return;

        this.isFullscreen = false;

        // Restore sticky positioning
        if (this.galleryContainer && this.originalStickyState) {
            this.galleryContainer.className = this.originalStickyState;
        }

        // Hide modal
        this.elements.fullscreenModal.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        this.elements.fullscreenModal.classList.remove('opacity-100', 'visible', 'pointer-events-auto');

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to main image
        this.elements.openFullscreenTrigger?.focus();
    }

    private updateFullscreenCounter(): void {
        if (this.elements.fullscreenCurrentElement) {
            this.elements.fullscreenCurrentElement.textContent = (this.currentIndex + 1).toString();
        }
        if (this.elements.fullscreenTotalElement) {
            this.elements.fullscreenTotalElement.textContent = this.images.length.toString();
        }
    }

    private setupTouchNavigation(): void {
        if (!this.elements.mainImage) return;

        let startX: number = 0;
        let startY: number = 0;
        let startTime: number = 0;
        const threshold: number = 50;
        const maxTime: number = 300;

        // Touch events for main image
        this.elements.mainImage.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        }, { passive: true });

        this.elements.mainImage.addEventListener('touchmove', (event) => {
            // Prevent default to avoid scrolling issues during swipe
            if (Math.abs(event.touches[0].clientX - startX) > 20) {
                event.preventDefault();
            }
        }, { passive: false });

        this.elements.mainImage.addEventListener('touchend', (event) => {
            if (!event.changedTouches.length) return;

            const touch = event.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // Check for valid swipe gesture
            if (deltaTime < maxTime && 
                Math.abs(deltaX) > threshold && 
                Math.abs(deltaX) > Math.abs(deltaY)) {
                
                if (deltaX > 0) {
                    this.previousImage();
                } else {
                    this.nextImage();
                }
            }
        }, { passive: true });

        // Touch events for fullscreen
        if (this.elements.fullscreenImage) {
            this.elements.fullscreenImage.addEventListener('touchstart', (event) => {
                const touch = event.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                startTime = Date.now();
            }, { passive: true });

            this.elements.fullscreenImage.addEventListener('touchmove', (event) => {
                if (Math.abs(event.touches[0].clientX - startX) > 20) {
                    event.preventDefault();
                }
            }, { passive: false });

            this.elements.fullscreenImage.addEventListener('touchend', (event) => {
                if (!event.changedTouches.length) return;

                const touch = event.changedTouches[0];
                const endX = touch.clientX;
                const endY = touch.clientY;
                const endTime = Date.now();
                
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                const deltaTime = endTime - startTime;

                if (deltaTime < maxTime && 
                    Math.abs(deltaX) > threshold && 
                    Math.abs(deltaX) > Math.abs(deltaY)) {
                    
                    if (deltaX > 0) {
                        this.previousImage();
                    } else {
                        this.nextImage();
                    }
                }
            }, { passive: true });
        }
    }

    public nextImage(): void {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateDisplay();
        this.resetAutoPlay();
        this.announceImageChange();
    }

    public previousImage(): void {
        this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.updateDisplay();
        this.resetAutoPlay();
        this.announceImageChange();
    }

    public goToImage(index: number): void {
        if (index >= 0 && index < this.images.length && index !== this.currentIndex) {
            this.currentIndex = index;
            this.updateDisplay();
            this.resetAutoPlay();
            this.announceImageChange();
        }
    }

    private updateDisplay(): void {
        if (!this.elements.mainImage || !this.images.length) return;

        const currentImage = this.images[this.currentIndex];

        // Enhanced image transition with warm fade
        this.fadeImageWithWarmth(() => {
            this.elements.mainImage!.src = currentImage.src;
            this.elements.mainImage!.alt = currentImage.alt;
        });

        // Update thumbnails with enhanced active state
        this.updateThumbnails();

        // Update counter with smooth transition
        this.updateCounter();

        // Update fullscreen if open
        if (this.isFullscreen) {
            this.updateFullscreenDisplay();
        }
    }

    private updateFullscreenDisplay(): void {
        if (!this.elements.fullscreenImage || !this.isFullscreen) return;

        const currentImage = this.images[this.currentIndex];
        this.elements.fullscreenImage.src = currentImage.src;
        this.elements.fullscreenImage.alt = currentImage.alt;
        this.updateFullscreenCounter();
    }

    private fadeImageWithWarmth(callback: () => void): void {
        if (!this.elements.mainImage) return;

        // Add warm sepia filter during transition
        this.elements.mainImage.style.opacity = '0.6';
        this.elements.mainImage.style.filter = 'sepia(20%) contrast(90%)';
        this.elements.mainImage.style.transition = 'opacity 0.3s ease, filter 0.3s ease';

        setTimeout(() => {
            callback();
            this.elements.mainImage!.style.opacity = '1';
            this.elements.mainImage!.style.filter = 'sepia(0%) contrast(100%)';
        }, 150);
    }

    private updateThumbnails(): void {
        this.elements.thumbnails?.forEach((thumbnail, index) => {
            thumbnail.classList.remove('classic-thumbnail-active');
            if (index === this.currentIndex) {
                thumbnail.classList.add('classic-thumbnail-active');
                
                // Smooth scroll to active thumbnail on mobile
                if (window.innerWidth < 768) {
                    thumbnail.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
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

    private announceImageChange(): void {
        // Accessibility: Announce image change to screen readers
        const announcement = `Image ${this.currentIndex + 1} of ${this.images.length}`;
        
        // Create temporary live region for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        
        document.body.appendChild(liveRegion);
        liveRegion.textContent = announcement;
        
        setTimeout(() => {
            document.body.removeChild(liveRegion);
        }, 1000);
    }

    // Auto-play functionality with mobile considerations
    public startAutoPlay(): void {
        this.autoPlayEnabled = true;
        this.autoPlayInterval = window.setInterval(() => {
            // Only auto-advance if not actively interacting
            if (!this.hasRecentTouchActivity()) {
                this.nextImage();
            }
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
                if (!this.hasRecentTouchActivity()) {
                    this.nextImage();
                }
            }, this.autoPlayDelay);
        }
    }

    private resetAutoPlay(): void {
        if (this.autoPlayEnabled) {
            this.pauseAutoPlay();
            setTimeout(() => {
                this.resumeAutoPlay();
            }, 1000); // Brief pause after manual interaction
        }
    }

    private hasRecentTouchActivity(): boolean {
        // Simple check for recent touch activity
        return Date.now() - (this.lastTouchTime || 0) < 2000;
    }

    // Enhanced touch tracking
    private trackTouchActivity(): void {
        this.addEventListener('touchstart', () => {
            this.lastTouchTime = Date.now();
        }, { passive: true });
        
        this.addEventListener('touchmove', () => {
            this.lastTouchTime = Date.now();
        }, { passive: true });
        
        this.addEventListener('touchend', () => {
            this.lastTouchTime = Date.now();
        }, { passive: true });
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

    public getImageAtIndex(index: number): { src: string; alt: string } | null {
        return this.images[index] || null;
    }

    public isAutoPlaying(): boolean {
        return this.autoPlayEnabled && this.autoPlayInterval !== null;
    }

    public getIsFullscreen(): boolean {
        return this.isFullscreen;
    }

    public openFullscreenView(): void {
        this.openFullscreen();
    }

    public closeFullscreenView(): void {
        this.closeFullscreen();
    }
}

// Register the custom element with enhanced error handling
document.addEventListener('DOMContentLoaded', () => {
    if (!customElements.get('classic-gallery')) {
        try {
            customElements.define('classic-gallery', ClassicGallery);
        } catch (error) {
            console.error('Failed to register classic-gallery component:', error);
        }
    }
});

// Handle Astro page transitions
document.addEventListener('astro:page-load', () => {
    const galleries = document.querySelectorAll('classic-gallery');
    galleries.forEach(gallery => {
        if (gallery instanceof ClassicGallery) {
            // Re-initialize if needed
            gallery.connectedCallback();
        }
    });
});

// Handle page visibility changes (pause autoplay when page hidden)
document.addEventListener('visibilitychange', () => {
    const galleries = document.querySelectorAll('classic-gallery');
    galleries.forEach(gallery => {
        if (gallery instanceof ClassicGallery) {
            if (document.hidden) {
                gallery.stopAutoPlay();
            } else if (gallery.getAttribute('data-gallery-auto-play') === 'true') {
                gallery.startAutoPlay();
            }
        }
    });
});

export { ClassicGallery };
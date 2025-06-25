// Classic Logos Carousel Web Component
class ClassicLogosCarousel extends HTMLElement {
    private classicLogosGrid: HTMLElement | null = null;
    private classicLeftBtn: HTMLElement | null = null;
    private classicRightBtn: HTMLElement | null = null;
    private classicPageIndicators: NodeListOf<HTMLElement> | null = null;
    private classicCurrentIndex: number = 0;
    private classicLogosPerView: number = 5;
    private classicTotalLogos: number = 0;

    connectedCallback() {
        this.classicInitializeCarousel();
        this.classicSetupEventListeners();
        this.classicCalculateLayout();
        this.classicUpdateView();
    }

    disconnectedCallback() {
        this.classicRemoveEventListeners();
    }

    private classicInitializeCarousel(): void {
        this.classicLogosGrid = this.querySelector('.classic-logos-grid');
        this.classicLeftBtn = this.querySelector('.classic-carousel-left');
        this.classicRightBtn = this.querySelector('.classic-carousel-right');
        this.classicPageIndicators = this.querySelectorAll('.classic-page-indicator');
        
        const logoCards = this.querySelectorAll('.classic-logo-card');
        this.classicTotalLogos = logoCards.length;
    }

    private classicSetupEventListeners(): void {
        if (this.classicLeftBtn) {
            this.classicLeftBtn.addEventListener('click', () => this.classicPrevSlide());
        }

        if (this.classicRightBtn) {
            this.classicRightBtn.addEventListener('click', () => this.classicNextSlide());
        }

        window.addEventListener('resize', () => this.classicHandleResize());
    }

    private classicRemoveEventListeners(): void {
        window.removeEventListener('resize', () => this.classicHandleResize());
    }

    private classicCalculateLayout(): void {
        const width = window.innerWidth;
        
        if (width < 640) {
            this.classicLogosPerView = 2;
        } else if (width < 768) {
            this.classicLogosPerView = 3;
        } else if (width < 1024) {
            this.classicLogosPerView = 4;
        } else {
            this.classicLogosPerView = 5;
        }
    }

    private classicHandleResize(): void {
        this.classicCalculateLayout();
        this.classicUpdateView();
    }

    private classicPrevSlide(): void {
        if (this.classicCurrentIndex > 0) {
            this.classicCurrentIndex--;
            this.classicUpdateView();
        }
    }

    private classicNextSlide(): void {
        const maxIndex = Math.max(0, this.classicTotalLogos - this.classicLogosPerView);
        if (this.classicCurrentIndex < maxIndex) {
            this.classicCurrentIndex++;
            this.classicUpdateView();
        }
    }

    private classicUpdateView(): void {
        if (!this.classicLogosGrid) return;

        const logoWidth = 160;
        const translateX = -(this.classicCurrentIndex * logoWidth);
        this.classicLogosGrid.style.transform = `translateX(${translateX}px)`;

        this.classicUpdateNavigationButtons();
        this.classicUpdatePageIndicators();
    }

    private classicUpdateNavigationButtons(): void {
        if (this.classicLeftBtn) {
            if (this.classicCurrentIndex === 0) {
                this.classicLeftBtn.style.opacity = '0.3';
                this.classicLeftBtn.style.pointerEvents = 'none';
            } else {
                this.classicLeftBtn.style.opacity = '1';
                this.classicLeftBtn.style.pointerEvents = 'auto';
            }
        }

        if (this.classicRightBtn) {
            const maxIndex = Math.max(0, this.classicTotalLogos - this.classicLogosPerView);
            if (this.classicCurrentIndex >= maxIndex) {
                this.classicRightBtn.style.opacity = '0.3';
                this.classicRightBtn.style.pointerEvents = 'none';
            } else {
                this.classicRightBtn.style.opacity = '1';
                this.classicRightBtn.style.pointerEvents = 'auto';
            }
        }
    }

    private classicUpdatePageIndicators(): void {
        if (!this.classicPageIndicators) return;

        const totalPages = Math.ceil(this.classicTotalLogos / this.classicLogosPerView);
        const currentPage = Math.floor(this.classicCurrentIndex / this.classicLogosPerView);

        this.classicPageIndicators.forEach((indicator, index) => {
            if (index < totalPages) {
                indicator.style.display = 'block';
                if (index === currentPage) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            } else {
                indicator.style.display = 'none';
            }
        });
    }

    public classicGetCurrentIndex(): number {
        return this.classicCurrentIndex;
    }

    public classicGoToStart(): void {
        this.classicCurrentIndex = 0;
        this.classicUpdateView();
    }

    public classicGoToEnd(): void {
        this.classicCurrentIndex = Math.max(0, this.classicTotalLogos - this.classicLogosPerView);
        this.classicUpdateView();
    }
}

if (!customElements.get('classic-logos-carousel')) {
    customElements.define('classic-logos-carousel', ClassicLogosCarousel);
}

document.addEventListener('DOMContentLoaded', () => {
    const legacyGrids = document.querySelectorAll('.classic-logos-grid:not(classic-logos-carousel .classic-logos-grid)');
    
    legacyGrids.forEach(grid => {
        const container = grid.closest('section');
        if (!container) return;

        const leftBtn = container.querySelector('.classic-carousel-left');
        const rightBtn = container.querySelector('.classic-carousel-right');
        
        let currentIndex = 0;
        const logoCards = grid.querySelectorAll('.classic-logo-card');
        const totalLogos = logoCards.length;
        
        if (leftBtn && rightBtn) {
            leftBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    const translateX = -(currentIndex * 160);
                    (grid as HTMLElement).style.transform = `translateX(${translateX}px)`;
                }
            });
            
            rightBtn.addEventListener('click', () => {
                const maxIndex = Math.max(0, totalLogos - 5);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    const translateX = -(currentIndex * 160);
                    (grid as HTMLElement).style.transform = `translateX(${translateX}px)`;
                }
            });
        }
    });
});
// BoldThemeHeader.ts - Simplified Header with Mobile Navigation

interface HeaderElements {
  header: HTMLElement | null;
  menuButton: HTMLElement | null;
  menuOverlay: HTMLElement | null;
  menuBackdrop: HTMLElement | null;
  menuClose: HTMLElement | null;
  menuLinks: NodeListOf<HTMLAnchorElement>;
}

class BoldThemeHeader {
  private elements: HeaderElements;
  private isMenuOpen: boolean = false;
  private lastScrollY: number = 0;

  constructor() {
    this.elements = this.initializeElements();
    this.init();
  }

  /**
   * Initialize all required DOM elements with updated class names
   */
  private initializeElements(): HeaderElements {
    return {
      header: document.querySelector('.bold-header') as HTMLElement | null,
      menuButton: document.getElementById('header-menu-button') as HTMLElement | null,
      menuOverlay: document.getElementById('header-menu-overlay') as HTMLElement | null,
      menuBackdrop: document.getElementById('header-menu-backdrop') as HTMLElement | null,
      menuClose: document.getElementById('header-menu-close') as HTMLElement | null,
      menuLinks: document.querySelectorAll('.bold-menu-link')
    };
  }

  /**
   * Initialize all header functionality
   */
  private init(): void {
    this.initializeScrollBehavior();
    this.initializeMobileMenu();
    this.initializeKeyboardHandling();
    this.initializeResizeHandling();
  }

  /**
   * Handle header show/hide on scroll
   * Shows header when scrolling up, hides when scrolling down
   */
  private initializeScrollBehavior(): void {
    const { header } = this.elements;
    if (!header) return;

    this.lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      // Always show header at top
      if (currentScrollY <= 0) {
        header.style.transform = 'translateY(0)';
      }
      // Hide header when scrolling down, show when scrolling up
      else if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        header.style.transform = 'translateY(-100%)';
      } else if (currentScrollY < this.lastScrollY) {
        header.style.transform = 'translateY(0)';
      }

      this.lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /**
   * Initialize mobile menu functionality with updated class names
   */
  private initializeMobileMenu(): void {
    const { menuButton, menuClose, menuBackdrop, menuLinks } = this.elements;

    // Menu toggle events
    menuButton?.addEventListener('click', () => this.openMenu());
    menuClose?.addEventListener('click', () => this.closeMenu());
    menuBackdrop?.addEventListener('click', () => this.closeMenu());

    // Menu link navigation
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleMenuLinkClick(e, link));
    });
  }

  /**
   * Open the mobile menu with updated class names
   */
  private openMenu(): void {
    const { menuButton, menuOverlay } = this.elements;
    if (!menuButton || !menuOverlay) return;

    this.isMenuOpen = true;
    menuButton.classList.add('active');
    menuOverlay.classList.add('show');
    document.body.classList.add('menu-open');
  }

  /**
   * Close the mobile menu with updated class names
   */
  private closeMenu(): void {
    const { menuButton, menuOverlay } = this.elements;
    if (!menuButton || !menuOverlay) return;

    this.isMenuOpen = false;
    menuButton.classList.remove('active');
    menuOverlay.classList.remove('show');
    document.body.classList.remove('menu-open');
  }

  /**
   * Handle menu link clicks with smooth scrolling
   */
  private handleMenuLinkClick(e: Event, link: HTMLAnchorElement): void {
    e.preventDefault();
    this.closeMenu();

    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetElement = document.getElementById(href.substring(1));
      if (targetElement) {
        // Simple smooth scroll with offset for fixed header
        setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 300);
      }
    }
  }

  /**
   * Handle keyboard interactions (ESC to close menu)
   */
  private initializeKeyboardHandling(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  /**
   * Handle window resize events
   */
  private initializeResizeHandling(): void {
    window.addEventListener('resize', () => {
      // Close menu on resize to handle mobile/desktop transitions
      if (this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  /**
   * Public API: Toggle menu state
   */
  public toggleMenu(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Public API: Check if menu is open
   */
  public isMenuCurrentlyOpen(): boolean {
    return this.isMenuOpen;
  }
}

/**
 * Initialize header functionality
 */
export function initHeader(): void {
  new BoldThemeHeader();
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', initHeader);

// Handle Astro page transitions
document.addEventListener('astro:page-load', initHeader);
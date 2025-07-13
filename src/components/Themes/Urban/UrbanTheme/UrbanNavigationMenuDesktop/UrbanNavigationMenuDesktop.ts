// UrbanNavigationMenuDesktop.ts - Optimized Web Component with Overflow

interface NavigationItem {
  id: string;
  title: string;
}

/**
 * Enhanced Desktop Navigation Web Component with Overflow Management
 * Handles responsive navigation with smart overflow detection
 */
class DesktopNavigation extends HTMLElement {
  private navigationItems: NavigationItem[] = [];
  private maxVisibleItems: number = 6;
  private overflowThreshold: number = 800;
  
  // DOM Elements
  private navContainer: HTMLElement | null = null;
  private navList: HTMLElement | null = null;
  private navDots: HTMLElement | null = null;
  private navOverflow: HTMLElement | null = null;
  private overflowToggle: HTMLElement | null = null;
  private overflowDropdown: HTMLElement | null = null;
  private overflowItems: HTMLElement | null = null;
  private dropdownArrow: HTMLElement | null = null;
  private navLinks: NodeListOf<HTMLAnchorElement> | null = null;
  
  // State
  private isDropdownOpen: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
  }

  /**
   * Initialize when component is connected to DOM
   */
  connectedCallback(): void {
    this.initializeConfiguration();
    this.initializeElements();
    this.setupEventListeners();
    this.setupResizeObserver();
    
    // Initial overflow check
    setTimeout(() => this.checkOverflow(), 100);
  }

  /**
   * Cleanup when component is disconnected
   */
  disconnectedCallback(): void {
    this.cleanup();
  }

  /**
   * Initialize configuration from data attributes
   */
  private initializeConfiguration(): void {
    const dataItems = this.getAttribute('data-navigation-items');
    const maxVisible = this.getAttribute('data-max-visible-items');
    const threshold = this.getAttribute('data-overflow-threshold');
    
    if (dataItems) {
      try {
        this.navigationItems = JSON.parse(dataItems);
      } catch (error) {
        console.warn('Invalid navigation items data:', error);
        this.navigationItems = [];
      }
    }

    if (maxVisible) {
      this.maxVisibleItems = parseInt(maxVisible, 10) || 6;
    }

    if (threshold) {
      this.overflowThreshold = parseInt(threshold, 10) || 800;
    }
  }

  /**
   * Initialize DOM elements
   */
  private initializeElements(): void {
    this.navContainer = this.querySelector('[data-nav-container]');
    this.navList = this.querySelector('[data-nav-list]');
    this.navDots = this.querySelector('[data-nav-dots]');
    this.navOverflow = this.querySelector('[data-nav-overflow]');
    this.overflowToggle = this.querySelector('[data-overflow-toggle]');
    this.overflowDropdown = this.querySelector('[data-overflow-dropdown]');
    this.overflowItems = this.querySelector('[data-overflow-items]');
    this.dropdownArrow = this.querySelector('[data-dropdown-arrow]');
    this.navLinks = this.querySelectorAll('.urban-desktop-nav-link');
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Navigation link clicks
    if (this.navLinks) {
      this.navLinks.forEach(link => {
        link.addEventListener('click', this.handleLinkClick.bind(this));
      });
    }

    // Overflow toggle
    if (this.overflowToggle) {
      this.overflowToggle.addEventListener('click', this.toggleDropdown.bind(this));
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleDocumentClick.bind(this));

    // Handle dropdown item clicks
    if (this.overflowItems) {
      this.overflowItems.addEventListener('click', this.handleOverflowItemClick.bind(this));
    }
  }

  /**
   * Set up ResizeObserver for efficient overflow detection
   */
  private setupResizeObserver(): void {
    if (!this.navContainer) return;

    this.resizeObserver = new ResizeObserver((entries) => {
      // Debounce resize events
      setTimeout(() => this.checkOverflow(), 50);
    });

    this.resizeObserver.observe(this.navContainer);
  }

  /**
   * Optimized overflow detection and management
   */
  private checkOverflow(): void {
    if (!this.navContainer || !this.navList || !this.navDots || !this.navOverflow) {
      return;
    }

    const navItems = this.navList.querySelectorAll<HTMLElement>('[data-nav-item]');
    if (navItems.length === 0) return;

    // Reset all items to visible
    navItems.forEach(item => {
      item.style.display = '';
      item.classList.remove('hidden');
    });

    // Hide overflow UI initially
    this.hideOverflowUI();

    // Simple threshold-based overflow detection
    const containerWidth = this.navContainer.offsetWidth;
    
    if (containerWidth < this.overflowThreshold || navItems.length > this.maxVisibleItems) {
      this.handleOverflowState(navItems);
    }
  }

  /**
   * Handle overflow state - show dropdown for excess items
   */
  private handleOverflowState(navItems: NodeListOf<HTMLElement>): void {
    const visibleCount = Math.min(this.maxVisibleItems, navItems.length - 1);
    
    if (visibleCount < navItems.length) {
      // Hide overflow items
      for (let i = visibleCount; i < navItems.length; i++) {
        navItems[i].style.display = 'none';
      }

      // Show overflow UI
      this.showOverflowUI();
      this.populateOverflowDropdown(navItems, visibleCount);
    }
  }

  /**
   * Show overflow UI elements
   */
  private showOverflowUI(): void {
    if (this.navDots) {
      this.navDots.classList.remove('hidden');
      this.navDots.classList.add('flex');
    }
    
    if (this.navOverflow) {
      this.navOverflow.classList.remove('hidden');
    }
  }

  /**
   * Hide overflow UI elements
   */
  private hideOverflowUI(): void {
    if (this.navDots) {
      this.navDots.classList.add('hidden');
      this.navDots.classList.remove('flex');
    }
    
    if (this.navOverflow) {
      this.navOverflow.classList.add('hidden');
    }
    
    this.closeDropdown();
  }

  /**
   * Populate overflow dropdown with hidden items
   */
  private populateOverflowDropdown(navItems: NodeListOf<HTMLElement>, startIndex: number): void {
    if (!this.overflowItems) return;

    this.overflowItems.innerHTML = '';

    for (let i = startIndex; i < navItems.length; i++) {
      const item = navItems[i];
      const link = item.querySelector<HTMLAnchorElement>('a');
      
      if (link) {
        const li = document.createElement('li');
        const href = link.getAttribute('href') || '#';
        const scrollTarget = link.getAttribute('data-scroll-target') || '';
        const anchorTarget = link.getAttribute('data-anchor-target') || '';
        const linkText = link.textContent || '';
        
        li.innerHTML = `
          <a 
            href="${href}"
            class="urban-overflow-dropdown-link block px-4 py-2 text-sm rounded transition-colors duration-200 hover:bg-gray-100"
            data-scroll-target="${scrollTarget}"
            data-anchor-target="${anchorTarget}"
          >
            ${linkText}
          </a>
        `;
        
        this.overflowItems.appendChild(li);
      }
    }
  }

  /**
   * Handle navigation link clicks
   */
  private handleLinkClick(event: Event): void {
    event.preventDefault();
    
    const link = event.currentTarget as HTMLAnchorElement;
    const targetId = link.getAttribute('data-scroll-target');
    
    if (targetId) {
      this.smoothScrollToSection(targetId);
    }
  }

  /**
   * Handle overflow dropdown item clicks
   */
  private handleOverflowItemClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'A') {
      event.preventDefault();
      this.closeDropdown();
      
      const targetId = target.getAttribute('data-scroll-target');
      if (targetId) {
        this.smoothScrollToSection(targetId);
      }
    }
  }

  /**
   * Toggle dropdown visibility
   */
  private toggleDropdown(): void {
    if (this.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Open dropdown
   */
  private openDropdown(): void {
    if (!this.overflowDropdown || !this.dropdownArrow) return;

    this.isDropdownOpen = true;
    this.overflowDropdown.classList.remove('hidden');
    this.dropdownArrow.style.transform = 'rotate(180deg)';
  }

  /**
   * Close dropdown
   */
  private closeDropdown(): void {
    if (!this.overflowDropdown || !this.dropdownArrow) return;

    this.isDropdownOpen = false;
    this.overflowDropdown.classList.add('hidden');
    this.dropdownArrow.style.transform = 'rotate(0deg)';
  }

  /**
   * Handle document clicks to close dropdown
   */
  private handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (this.isDropdownOpen && !this.navOverflow?.contains(target)) {
      this.closeDropdown();
    }
  }

  /**
   * Smooth scroll to target section with header offset
   */
  private smoothScrollToSection(targetId: string): void {
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const header = document.querySelector('.urban-header') as HTMLElement;
      const headerHeight = header?.offsetHeight || 0;
      const additionalOffset = 20;
      
      const targetPosition = targetElement.offsetTop - headerHeight - additionalOffset;
      
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  /**
   * Public API: Scroll to specific section
   */
  public scrollToSection(sectionId: string): void {
    this.smoothScrollToSection(sectionId);
  }

  /**
   * Public API: Force overflow check
   */
  public refreshOverflow(): void {
    this.checkOverflow();
  }
}

/**
 * Register the web component
 */
function registerDesktopNavigation(): void {
  if (!customElements.get('desktop-navigation')) {
    customElements.define('desktop-navigation', DesktopNavigation);
  }
}

/**
 * Initialize desktop navigation
 */
export function initEnhancedNavigation(): void {
  registerDesktopNavigation();
}

// Auto-register when DOM is ready
document.addEventListener('DOMContentLoaded', registerDesktopNavigation);

// Handle Astro page transitions
document.addEventListener('astro:page-load', registerDesktopNavigation);

// Export for external use
export { DesktopNavigation };
export function initHeader() {
  // Original header functionality
  const headerLogo = document.getElementById('headerLogo') as HTMLImageElement | null;
  const header = document.querySelector('.classic-header') as HTMLElement | null;

  if (headerLogo) {
    const originalSrc = headerLogo.src;
    const defaultLogo = 'assets/default-logo.svg';

    headerLogo.onerror = function () {
      console.log('Logo image failed to load, using default logo');
      this.onerror = null;
      this.src = defaultLogo + '?fallback=' + Date.now();
    };

    if (headerLogo.complete && headerLogo.naturalWidth === 0) {
      headerLogo.src = defaultLogo + '?fallback=' + Date.now();
    }
  }

  if (header) {
    header.classList.add('transition-all', 'duration-300', 'ease-in-out');

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY <= 0) {
            header.style.transform = 'translateY(0)';
            lastScrollY = currentScrollY;
            ticking = false;
            return;
          }

          if (currentScrollY > lastScrollY) {
            header.style.transform = 'translateY(-100%)';
          }
          else if (currentScrollY < lastScrollY) {
            header.style.transform = 'translateY(0)';
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Enhanced menu functionality
  const menuButton = document.getElementById('header-menu-button');
  const menuOverlay = document.getElementById('header-menu-overlay');
  const menuBackdrop = document.getElementById('header-menu-backdrop');
  const menuClose = document.getElementById('header-menu-close');
  const menuLinks = document.querySelectorAll('.classic-menu-link');

  // Function to open menu
  function openMenu() {
    if (menuButton && menuOverlay) {
      menuButton.classList.add('active');
      menuOverlay.classList.add('show');
      document.body.classList.add('menu-open');
    }
  }

  // Function to close menu
  function closeMenu() {
    if (menuButton && menuOverlay) {
      menuButton.classList.remove('active');
      menuOverlay.classList.remove('show');
      document.body.classList.remove('menu-open');
    }
  }

  // Menu event listeners
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      openMenu();
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', () => {
      closeMenu();
    });
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', () => {
      closeMenu();
    });
  }

  // Close menu when clicking on a link and handle smooth scrolling
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Close menu
      closeMenu();

      // Smooth scroll to target
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Calculate offset for fixed header
          const headerHeight = document.querySelector('.classic-header')?.clientHeight || 0;
          const offset = 10; // Additional offset
          const targetPosition = targetElement.offsetTop - headerHeight - offset;

          setTimeout(() => {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }, 300); // Wait for menu close animation
        }
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Handle window resize - close menu if switching between mobile/desktop
  window.addEventListener('resize', () => {
    closeMenu();
  });

  console.log('Classic Header with enhanced navigation initialized');
}

// Enhanced navigation functionality
export function initEnhancedNavigation() {
  const navContainer = document.getElementById('nav-container');
  const navList = document.getElementById('nav-list');
  const navDots = document.getElementById('nav-dots');
  const navOverflow = document.getElementById('nav-overflow');
  const overflowToggle = document.getElementById('overflow-toggle');
  const overflowDropdown = document.getElementById('overflow-dropdown');
  const overflowItems = document.getElementById('overflow-items');
  const dropdownArrow = document.getElementById('dropdown-arrow');
  
  if (!navContainer || !navList || !navDots || !navOverflow || !overflowToggle || !overflowDropdown || !overflowItems) {
    return;
  }

  let resizeTimeout;
  let isDropdownOpen = false;

  // Handle navigation overflow
  function handleNavOverflow() {
    // Check if we're on mobile/tablet (where desktop nav should be hidden)
    const desktopNav = document.getElementById('desktop-nav');
    if (!desktopNav || window.getComputedStyle(desktopNav).display === 'none') {
      return; // Don't run overflow logic on mobile
    }

    const navItems = navList.querySelectorAll('.nav-item');
    
    if (navItems.length === 0) return;
    
    // Reset all items to visible first and clear any inline styles
    navItems.forEach(item => {
      item.style.display = '';
      item.classList.remove('hidden');
    });
    
    // Reset overflow UI
    navDots.classList.add('hidden');
    navDots.classList.remove('flex');
    navOverflow.classList.add('hidden');
    closeDropdown();
    
    // Wait for layout to settle
    setTimeout(() => {
      const containerWidth = navContainer.offsetWidth;
      let totalWidth = 0;
      let visibleCount = 0;
      const maxWidth = containerWidth - 120; // Reserve space for potential overflow button
      
      // Calculate which items can fit
      for (let i = 0; i < navItems.length; i++) {
        const item = navItems[i];
        const itemWidth = item.offsetWidth + 8; // gap
        
        if (totalWidth + itemWidth <= maxWidth) {
          totalWidth += itemWidth;
          visibleCount++;
        } else {
          break; // Stop when we exceed available space
        }
      }

      const hiddenCount = navItems.length - visibleCount;
      
      // If some items need to be hidden
      if (hiddenCount > 0 && visibleCount > 0) {
        // Hide overflow items
        for (let i = visibleCount; i < navItems.length; i++) {
          navItems[i].style.display = 'none';
        }
        
        // Show overflow indicators
        navDots.classList.remove('hidden');
        navDots.classList.add('flex');
        navOverflow.classList.remove('hidden');
        
        // Populate overflow dropdown
        overflowItems.innerHTML = '';
        for (let i = visibleCount; i < navItems.length; i++) {
          const item = navItems[i];
          const link = item.querySelector('a');
          if (link) {
            const li = document.createElement('li');
            li.innerHTML = `
              <a 
                href="${link.getAttribute('href')}"
                class="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                data-anchor-target="${link.getAttribute('data-anchor-target')}"
              >
                ${link.textContent}
              </a>
            `;
            overflowItems.appendChild(li);
          }
        }
      }
      // If all items fit, everything stays visible (already reset above)
    }, 50);
  }

  // Dropdown functionality
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
    if (isDropdownOpen) {
      overflowDropdown.classList.remove('hidden');
      dropdownArrow.style.transform = 'rotate(180deg)';
    } else {
      overflowDropdown.classList.add('hidden');
      dropdownArrow.style.transform = 'rotate(0deg)';
    }
  }

  function closeDropdown() {
    isDropdownOpen = false;
    overflowDropdown.classList.add('hidden');
    dropdownArrow.style.transform = 'rotate(0deg)';
  }

  // Event listeners
  overflowToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (isDropdownOpen) {
      closeDropdown();
    }
  });

  // Handle dropdown link clicks
  overflowItems.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      closeDropdown();
    }
  });

  // Debounced resize handler
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Force a reflow to ensure proper measurements
      navContainer.style.visibility = 'hidden';
      navContainer.offsetHeight; // Trigger reflow
      navContainer.style.visibility = 'visible';
      
      handleNavOverflow();
    }, 100);
  }

  // Initialize
  window.addEventListener('resize', handleResize);
  window.addEventListener('load', handleNavOverflow);
  
  // Also listen for orientation changes on mobile devices
  window.addEventListener('orientationchange', () => {
    setTimeout(handleNavOverflow, 200);
  });
  
  // Run immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleNavOverflow);
  } else {
    // Use multiple timeouts to ensure proper initialization
    setTimeout(handleNavOverflow, 100);
    setTimeout(handleNavOverflow, 300);
    setTimeout(handleNavOverflow, 500);
  }
}

document.addEventListener('DOMContentLoaded', initHeader);
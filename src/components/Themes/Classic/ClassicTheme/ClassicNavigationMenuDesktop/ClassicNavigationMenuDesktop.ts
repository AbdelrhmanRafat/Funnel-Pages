// Enhanced navigation functionality
export function initEnhancedNavigation(): void {
  const navContainer = document.getElementById('nav-container');
  const navList = document.getElementById('nav-list');
  const navDots = document.getElementById('nav-dots');
  const navOverflow = document.getElementById('nav-overflow');
  const overflowToggle = document.getElementById('overflow-toggle');
  const overflowDropdown = document.getElementById('overflow-dropdown');
  const overflowItems = document.getElementById('overflow-items');
  const dropdownArrow = document.getElementById('dropdown-arrow');
  
  if (!navContainer || !navList || !navDots || !navOverflow || 
      !overflowToggle || !overflowDropdown || !overflowItems || !dropdownArrow) {
    return;
  }

  let resizeTimeout: number;
  let isDropdownOpen = false;

  // Handle navigation overflow
  function handleNavOverflow(): void {
    // Check if we're on mobile/tablet (where desktop nav should be hidden)
    const desktopNav = document.getElementById('desktop-nav');
    if (!desktopNav || window.getComputedStyle(desktopNav).display === 'none') {
      return; // Don't run overflow logic on mobile
    }

    // Re-validate elements since they might have been removed from DOM
    if (!navList || !navDots || !navOverflow || !overflowItems) {
      return;
    }

    const navItems = navList.querySelectorAll<HTMLElement>('.classic-nav-item');
    
    if (navItems.length === 0) return;
    
    // Reset all items to visible first and clear any inline styles
    navItems.forEach((item: HTMLElement) => {
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
      // Re-validate elements again
      if (!navContainer || !navList || !navDots || !navOverflow || !overflowItems) {
        return;
      }

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
          const link = item.querySelector<HTMLAnchorElement>('a');
          if (link) {
            const li = document.createElement('li');
            const href = link.getAttribute('href') || '#';
            const anchorTarget = link.getAttribute('data-anchor-target') || '';
            const linkText = link.textContent || '';
            
            li.innerHTML = `
              <a 
                href="${href}"
                class="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                data-anchor-target="${anchorTarget}"
              >
                ${linkText}
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
  function toggleDropdown(): void {
    // Re-validate elements
    if (!overflowDropdown || !dropdownArrow) {
      return;
    }

    isDropdownOpen = !isDropdownOpen;
    if (isDropdownOpen) {
      overflowDropdown.classList.remove('hidden');
      dropdownArrow.style.transform = 'rotate(180deg)';
    } else {
      overflowDropdown.classList.add('hidden');
      dropdownArrow.style.transform = 'rotate(0deg)';
    }
  }

  function closeDropdown(): void {
    // Re-validate elements
    if (!overflowDropdown || !dropdownArrow) {
      return;
    }

    isDropdownOpen = false;
    overflowDropdown.classList.add('hidden');
    dropdownArrow.style.transform = 'rotate(0deg)';
  }

  // Event listeners
  overflowToggle.addEventListener('click', (e: Event) => {
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
  overflowItems.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      closeDropdown();
    }
  });

  // Debounced resize handler
  function handleResize(): void {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      // Re-validate elements
      if (!navContainer) {
        return;
      }

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
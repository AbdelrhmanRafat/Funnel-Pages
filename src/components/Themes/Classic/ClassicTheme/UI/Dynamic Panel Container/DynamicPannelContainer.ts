  // Listen for quantity changes
  document.addEventListener('quantity-change', (e: Event) => {
    const customEvent = e as CustomEvent;
    const newQuantity = customEvent.detail.items;
    
    // Get all panels
    const panels = document.querySelectorAll('.option-panel');
    
    // Show/hide panels based on the new quantity
    panels.forEach((panel, index) => {
      if (index < newQuantity) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });
  });
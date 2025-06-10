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

// Handle size selection
function handleSizeSelection(panel: Element, sizeOption: Element) {
  // Remove selected class from all size options in this panel
  panel.querySelectorAll('.size-option').forEach(option => {
    option.classList.remove('bg-blue-50', 'text-blue-700', 'border-blue-500');
    option.classList.add('text-gray-600', 'border-gray-300');
  });

  // Add selected class to clicked option
  sizeOption.classList.remove('text-gray-600', 'border-gray-300');
  sizeOption.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-500');

  // Update the selected size display
  const selectedSizeElement = panel.querySelector('.selected-size');
  if (selectedSizeElement) {
    selectedSizeElement.textContent = sizeOption.textContent || 'لم يتم التحديد';
  }
}

// Handle color selection
function handleColorSelection(panel: Element, colorOption: Element) {
  // Remove selected class from all color options in this panel
  panel.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
  });

  // Add selected class to clicked option
  colorOption.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');

  // Update the selected color display
  const selectedColorElement = panel.querySelector('.selected-color');
  if (selectedColorElement) {
    const colorName = colorOption.getAttribute('data-name');
    selectedColorElement.textContent = colorName || 'لم يتم التحديد';
  }
}

// Initialize event listeners for each panel
document.querySelectorAll('.option-panel').forEach(panel => {
  // Size selection
  panel.querySelectorAll('.size-option').forEach(sizeOption => {
    sizeOption.addEventListener('click', () => {
      handleSizeSelection(panel, sizeOption);
    });
  });

  // Color selection
  panel.querySelectorAll('.color-option').forEach(colorOption => {
    colorOption.addEventListener('click', () => {
      handleColorSelection(panel, colorOption);
    });
  });
});
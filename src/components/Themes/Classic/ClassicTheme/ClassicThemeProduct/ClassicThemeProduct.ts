  // Image gallery functionality
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('mainImage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const currentImageIndex = document.getElementById('currentImageIndex');
  const totalImages = document.getElementById('totalImages');
  
  let currentIndex = 0;
  const images = [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop'
  ];
  
  totalImages.textContent = images.length;
  
  function updateMainImage(index) {
      mainImage.src = images[index];
      mainImage.classList.add('fade-in');
      setTimeout(() => mainImage.classList.remove('fade-in'), 500);
      
      // Update thumbnails
      thumbnails.forEach((thumb, i) => {
          thumb.classList.toggle('thumbnail-active', i === index);
      });
      
      currentImageIndex.textContent = index + 1;
      currentIndex = index;
  }
  
  // Thumbnail clicks
  thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
          updateMainImage(index);
      });
  });
  
  // Navigation buttons
  prevBtn.addEventListener('click', () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      updateMainImage(newIndex);
  });
  
  nextBtn.addEventListener('click', () => {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      updateMainImage(newIndex);
  });
  
  // Quantity selection functionality
  const quantityLabels = document.querySelectorAll('label[for^="qty"]');
  const quantityInputs = document.querySelectorAll('input[name="qty"]');
  const productPrice = document.getElementById('productPrice');
  const totalPrice = document.getElementById('totalPrice');
  const panelsContainer = document.getElementById('panels-container');
  
  const prices = {
      'qty1': { product: 329.00, total: 369.00 },
      'qty2': { product: 275.00, total: 315.00 },
      'qty3': { product: 214.90, total: 254.90 }
  };
  
  // Function to create a new panel
  function createPanel(index) {
      return `
          <div class="option-panel bg-white p-8 rounded-3xl shadow-xl space-y-8 border border-blue-100 fade-in">
              <!-- Header -->
              <div class="flex justify-between items-center">
                  <p class="text-blue-700 font-bold text-xl">اختر الخيارات للمنتج ${index === 0 ? 'الأول' : index === 1 ? 'الثاني' : 'الثالث'}</p>
                  <div class="flex items-center gap-3">
                      <div class="flex items-center gap-2 bg-blue-100 px-4 py-1.5 rounded-full shadow-sm">
                          <span class="text-sm text-gray-700 font-medium">أحمر</span>
                          <div class="w-3.5 h-3.5 rounded-full bg-red-500 border border-white shadow-inner"></div>
                      </div>
                      <div class="flex items-center gap-2 bg-blue-100 px-4 py-1.5 rounded-full shadow-sm">
                          <span class="text-sm text-gray-700 font-medium">XXL</span>
                      </div>
                  </div>
              </div>
              <!-- Size Selection -->
              <div class="space-y-3">
                  <p class="text-lg font-semibold text-gray-700">المقاس:</p>
                  <div class="flex gap-4">
                      <div class="size-option px-5 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm text-sm font-medium text-gray-600">
                          XL
                      </div>
                      <div class="size-option px-5 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm text-sm font-medium text-gray-600">
                          L
                      </div>
                      <div class="size-option px-5 py-2.5 border border-gray-300 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-all shadow-sm text-sm font-medium text-gray-600">
                          M
                      </div>
                  </div>
              </div>
              <!-- Color Selection -->
              <div class="space-y-3">
                  <p class="text-lg font-semibold text-gray-700">اللون:</p>
                  <div class="flex gap-6 flex-wrap">
                      <div class="color-option flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                          <div class="w-9 h-9 rounded-full bg-red-500 border-2 border-white shadow-md"></div>
                          <span class="text-sm text-gray-600">أحمر</span>
                      </div>
                      <div class="color-option flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                          <div class="w-9 h-9 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                          <span class="text-sm text-gray-600">أزرق</span>
                      </div>
                      <div class="color-option flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                          <div class="w-9 h-9 rounded-full bg-green-500 border-2 border-white shadow-md"></div>
                          <span class="text-sm text-gray-600">أخضر</span>
                      </div>
                      <div class="color-option flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform">
                          <div class="w-9 h-9 rounded-full bg-yellow-500 border-2 border-white shadow-md"></div>
                          <span class="text-sm text-gray-600">أصفر</span>
                      </div>
                  </div>
              </div>
          </div>
      `;
  }
  
  // Function to update panels based on quantity
  function updatePanels(quantity) {
      // Clear existing panels
      panelsContainer.innerHTML = '';
      
      // Create panels based on quantity
      for (let i = 0; i < quantity; i++) {
          panelsContainer.innerHTML += createPanel(i);
      }
      
      // Add event listeners to new panels
      addPanelEventListeners();
  }
  
  // Function to add event listeners to panel elements
  function addPanelEventListeners() {
      // Size selection
      const sizeOptions = document.querySelectorAll('.size-option');
      sizeOptions.forEach(option => {
          option.addEventListener('click', function() {
              // Remove active class from siblings
              const siblings = this.parentElement.querySelectorAll('.size-option');
              siblings.forEach(sibling => {
                  sibling.classList.remove('bg-blue-100', 'text-blue-700', 'border-blue-300');
                  sibling.classList.add('text-gray-600', 'border-gray-300');
              });
              
              // Add active class to clicked option
              this.classList.add('bg-blue-100', 'text-blue-700', 'border-blue-300');
              this.classList.remove('text-gray-600', 'border-gray-300');
              
              // Update header display
              const panel = this.closest('.option-panel');
              const sizeDisplay = panel.querySelector('.bg-blue-100:last-child span');
              sizeDisplay.textContent = this.textContent.trim();
          });
      });
      
      // Color selection
      const colorOptions = document.querySelectorAll('.color-option');
      colorOptions.forEach(option => {
          option.addEventListener('click', function() {
              // Remove active class from siblings
              const siblings = this.parentElement.querySelectorAll('.color-option');
              siblings.forEach(sibling => {
                  const colorDiv = sibling.querySelector('div');
                  colorDiv.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
              });
              
              // Add active class to clicked option
              const colorDiv = this.querySelector('div');
              colorDiv.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
              
              // Update header display
              const panel = this.closest('.option-panel');
              const colorDisplay = panel.querySelector('.bg-blue-100:first-child span');
              const colorName = this.querySelector('span').textContent;
              colorDisplay.textContent = colorName;
              
              // Update color indicator
              const colorIndicator = panel.querySelector('.bg-blue-100:first-child div');
              const selectedColor = colorDiv.className.match(/bg-(\w+)-500/);
              if (selectedColor) {
                  colorIndicator.className = `w-3.5 h-3.5 rounded-full bg-${selectedColor[1]}-500 border border-white shadow-inner`;
              }
          });
      });
  }
  
  quantityInputs.forEach(input => {
      input.addEventListener('change', function() {
          // Update visual selection
          quantityLabels.forEach(label => {
              label.classList.remove('selected');
          });
          this.parentElement.classList.add('selected');
          
          // Update prices
          const selectedPrices = prices[this.id];
          productPrice.textContent = `${selectedPrices.product.toFixed(2)} ج.م`;
          totalPrice.textContent = `${selectedPrices.total.toFixed(2)} ج.م`;
          
          // Update panels based on quantity
          const quantity = parseInt(this.id.replace('qty', ''));
          updatePanels(quantity);
      });
  });
  
  // Initialize panels for default selection (qty1)
  updatePanels(1);
  addPanelEventListeners();
  
  // Add keyboard navigation for gallery
  document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
          nextBtn.click();
      } else if (e.key === 'ArrowRight') {
          prevBtn.click();
      }
  });
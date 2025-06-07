// Image gallery functionality
export function initGallery(): void {
    const thumbnails: NodeListOf<HTMLElement> = document.querySelectorAll('.thumbnail');
    const mainImage: HTMLImageElement | null = document.getElementById('mainImage') as HTMLImageElement;
    const prevBtn: HTMLElement | null = document.getElementById('prevBtn');
    const nextBtn: HTMLElement | null = document.getElementById('nextBtn');
    const currentImageIndex: HTMLElement | null = document.getElementById('currentImageIndex');
    const totalImages: HTMLElement | null = document.getElementById('totalImages');
    
    // Guard clause to prevent errors if elements don't exist
    if (!mainImage || !prevBtn || !nextBtn || !currentImageIndex || !totalImages) {
      console.error('Required DOM elements not found');
      return;
    }
    
    let currentIndex: number = 0;
    const images: string[] = [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop'
    ];
    
    totalImages.textContent = images.length.toString();
    
    function updateMainImage(index: number): void {
      mainImage.src = images[index];
      mainImage.classList.add('fade-in');
      setTimeout(() => mainImage.classList.remove('fade-in'), 500);
      
      // Update thumbnails
      thumbnails.forEach((thumb: HTMLElement, i: number) => {
        thumb.classList.toggle('thumbnail-active', i === index);
      });
      
      if (currentImageIndex) {
        currentImageIndex.textContent = (index + 1).toString();
      }
      currentIndex = index;
    }
    
    // Thumbnail clicks
    thumbnails.forEach((thumbnail: HTMLElement, index: number) => {
      thumbnail.addEventListener('click', () => {
        updateMainImage(index);
      });
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
      const newIndex: number = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      updateMainImage(newIndex);
    });
    
    nextBtn.addEventListener('click', () => {
      const newIndex: number = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      updateMainImage(newIndex);
    });
    
    // Initialize with first image
    updateMainImage(0);
}

// Automatically initialize the gallery when the script is loaded
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});
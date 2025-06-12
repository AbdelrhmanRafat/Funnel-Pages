export function initGallery(): void {
  document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll<HTMLImageElement>('.thumbnail');
    const mainImage = document.getElementById('mainImage') as HTMLImageElement | null;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentImageIndex = document.getElementById('currentImageIndex');
    const totalImages = document.getElementById('totalImages');

    if (!mainImage || !prevBtn || !nextBtn || !currentImageIndex || !totalImages || thumbnails.length === 0) {
      console.warn('Gallery: Required DOM elements not found or thumbnails missing.');
      return;
    }

    const images: string[] = Array.from(thumbnails).map((thumb) => thumb.src);
    let currentIndex = 0;

    totalImages.textContent = images.length.toString();

    function updateMainImage(index: number): void {
      if (!mainImage) return;

      mainImage.src = images[index];
      mainImage.classList.add('fade-in');
      setTimeout(() => mainImage.classList.remove('fade-in'), 300);

      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('thumbnail-active', i === index);
      });

      if (currentImageIndex) currentImageIndex.textContent = (index + 1).toString();
      currentIndex = index;
    }

    // Thumbnail click events
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        updateMainImage(index);
      });
    });

    // Prev/Next buttons
    prevBtn.addEventListener('click', () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      updateMainImage(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      updateMainImage(newIndex);
    });

    // Initialize with the first image
    updateMainImage(0);
  });
}

// Initialize automatically when imported
initGallery();
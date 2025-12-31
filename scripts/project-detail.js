// Dynamic Project Detail Loader
document.addEventListener('DOMContentLoaded', () => {
    // Determine which project to load based on the current filename or URL parameter
    // For this static site structure, we can infer it from the body ID or a data attribute, 
    // or simply check the filename.
    
    const path = window.location.pathname;
    const page = path.split("/").pop();
    let projectId = null;

    if (page === 'project-sten.html') projectId = 'sten';
    else if (page === 'project-m1911.html') projectId = 'm1911';
    else if (page === 'project-caitlyn.html') projectId = 'caitlyn';
    else if (page === 'project-2077manufacture.html') projectId = '2077';
    else if (page === 'project-mech.html') projectId = 'mech';
    else if (page === 'project-stylizedmech.html') projectId = 'stylized';
    else if (page === 'project-junkratlauncher.html') projectId = 'junkrat';

    if (!projectId) return;

    fetch('data/project_details.json')
        .then(response => response.json())
        .then(data => {
            const project = data[projectId];
            if (!project) return;

            // Update Gallery
            const mainImage = document.getElementById('main-gallery-image');
            const thumbnailsContainer = document.querySelector('.gallery-thumbnails');
            
            if (project.images && project.images.length > 0) {
                // Set Main Image
                mainImage.src = project.images[0].src;
                mainImage.alt = project.images[0].alt;

                // Generate Thumbnails
                thumbnailsContainer.innerHTML = project.images.map((img, index) => `
                    <div class="thumbnail-item ${index === 0 ? 'active' : ''}" data-src="${img.src}" data-alt="${img.alt}">
                        <img src="${img.src}" alt="${img.alt}">
                    </div>
                `).join('');

                // Re-initialize gallery functionality
                if (typeof initGallery === 'function') {
                    initGallery();
                }
            }
        })
        .catch(error => console.error('Error loading project details:', error));

    function initGallery() {
        const mainImage = document.getElementById('main-gallery-image');
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const currentImageSpan = document.getElementById('current-image');
        const totalImagesSpan = document.getElementById('total-images');
        
        let currentImageIndex = 0;
        const galleryImages = Array.from(thumbnails).map(thumb => ({
            src: thumb.dataset.src,
            alt: thumb.dataset.alt
        }));
        
        totalImagesSpan.textContent = galleryImages.length;
        
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.dataset.src;
                mainImage.alt = thumb.dataset.alt;
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                currentImageIndex = index;
            });
        });

        // Main Gallery Navigation
        const prevBtn = document.querySelector('.gallery-nav.prev');
        const nextBtn = document.querySelector('.gallery-nav.next');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                changeLightboxImage(-1);
            });
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                changeLightboxImage(1);
            });
        }
        
        mainImage.onclick = () => openLightbox(currentImageIndex);
        
        window.openLightbox = function(index) {
            currentImageIndex = index;
            updateLightbox();
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('lightbox-open');
        }
        
        window.changeLightboxImage = function(direction) {
            currentImageIndex += direction;
            if (currentImageIndex < 0) currentImageIndex = galleryImages.length - 1;
            if (currentImageIndex >= galleryImages.length) currentImageIndex = 0;
            updateLightbox();
        };

        function updateLightbox() {
            lightboxImage.src = galleryImages[currentImageIndex].src;
            lightboxImage.alt = galleryImages[currentImageIndex].alt;
            currentImageSpan.textContent = currentImageIndex + 1;
            
            // Sync main gallery
            mainImage.src = galleryImages[currentImageIndex].src;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnails[currentImageIndex].classList.add('active');
        }
    }
});

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

            // Apply translations to static elements if data exists
            if (project.title) {
                const titleEl = document.querySelector('.project-title-main');
                if (titleEl) {
                    titleEl.textContent = project.title;
                    // Store for language switching
                    titleEl.setAttribute('data-en', project.title);
                    if (project.title_zh) titleEl.setAttribute('data-zh', project.title_zh); // If exists in JSON
                }
            }

            if (project.subtitle) {
                const subtitleEl = document.querySelector('.project-subtitle');
                if (subtitleEl) {
                    subtitleEl.textContent = project.subtitle[currentLanguage] || project.subtitle.en;
                    subtitleEl.setAttribute('data-en', project.subtitle.en);
                    subtitleEl.setAttribute('data-zh', project.subtitle.zh);
                }
            }

            // Update Overview
            if (project.description && project.description.overview) {
                const overviewSection = document.querySelector('.detail-section:first-of-type');
                if (overviewSection) {
                    const overviewP = overviewSection.querySelector('p:nth-of-type(1)');
                    if (overviewP) {
                        overviewP.textContent = project.description.overview[currentLanguage] || project.description.overview.en;
                        overviewP.setAttribute('data-en', project.description.overview.en);
                        overviewP.setAttribute('data-zh', project.description.overview.zh);
                    }
                    // Handle second paragraph if process exists
                    const processP = overviewSection.querySelector('p:nth-of-type(2)');
                    if (processP && project.description.process) {
                        processP.textContent = project.description.process[currentLanguage] || project.description.process.en;
                        processP.setAttribute('data-en', project.description.process.en);
                        processP.setAttribute('data-zh', project.description.process.zh);
                    }
                }
            }
            
            // Update Specs List
            if (project.specs) {
                const techList = document.querySelector('.tech-list');
                if (techList) {
                    techList.innerHTML = project.specs.map(spec => {
                        return `<li>
                            <span data-zh="${spec.zh}" data-en="${spec.en}">${spec[currentLanguage] || spec.en}</span>
                        </li>`;
                    }).join('');
                }
            }

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
        
        // Lightbox Navigation Buttons
        const lbPrevBtn = document.querySelector('.lightbox-prev');
        const lbNextBtn = document.querySelector('.lightbox-next');

        if (lbPrevBtn) {
            lbPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                changeLightboxImage(-1);
            });
        }

        if (lbNextBtn) {
            lbNextBtn.addEventListener('click', (e) => {
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

        function changeLightboxImage(direction) {
            currentImageIndex += direction;
            if (currentImageIndex >= galleryImages.length) currentImageIndex = 0;
            if (currentImageIndex < 0) currentImageIndex = galleryImages.length - 1;
            updateLightbox();
        }

        function updateLightbox() {
            const img = galleryImages[currentImageIndex];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            currentImageSpan.textContent = currentImageIndex + 1;
        }

        // Close functions
        const closeBtn = document.querySelector('.lightbox-close');
        
        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
            document.body.classList.remove('lightbox-open');
        }

        if (closeBtn) {
            closeBtn.onclick = closeLightbox;
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
            // Add arrow key navigation
            if (lightbox.style.display === 'block') {
                if (e.key === 'ArrowLeft') changeLightboxImage(-1);
                if (e.key === 'ArrowRight') changeLightboxImage(1);
            }
        });

        // Trigger initial translation update just in case language was switched before fetch completed
        if (window.switchLanguage && typeof currentLanguage !== 'undefined') {
             // We need to wait slightly for the DOM updates above to settle? 
             // Actually, since we set content directly based on currentLanguage, it should be fine.
             // But we might need to refresh the "Language" UI state or re-run switchLanguage to be sure.
        }
    }
});

// Dynamic Project Loader
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');
    const dotsContainer = document.getElementById('dots');
    
    // Only run if we're on a page with the slider track
    if (!track) return;

    // Fetch project data
    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            // Clear existing static content (optional, but good for clean slate)
            track.innerHTML = '';
            dotsContainer.innerHTML = '';

            // Generate cards
            projects.forEach((project, index) => {
                // Create Card
                const card = document.createElement('article');
                card.className = 'slider-card';
                card.setAttribute('data-title', project.title);
                
                card.innerHTML = `
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-content">
                        <div class="project-badge">${project.badge}</div>
                        <h3>${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <a href="${project.link}" class="project-link">View Project →</a>
                    </div>
                `;
                track.appendChild(card);
            });

            // Re-initialize slider after content is loaded
            // We need to dispatch a custom event or call a function from slider.js
            // Assuming slider.js listens for load or we can trigger it manually.
            // Since slider.js might have already run, we might need to reload it or expose an init function.
            
            // Dispatch event that projects are loaded
            const event = new CustomEvent('projectsLoaded');
            document.dispatchEvent(event);
        })
        .catch(error => console.error('Error loading projects:', error));
});

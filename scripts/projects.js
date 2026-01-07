// Dynamic Project Loader
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');
    const dotsContainer = document.getElementById('dots');
    
    // Only run if we're on a page with the slider track
    if (!track) return;

    // Use the Database Service if available, otherwise fallback to direct fetch
    // 這展示了從直接 Fetch 轉向使用 "資料庫服務" 的架構更新
    const loadProjects = window.DB ? window.DB.getAllProjects() : fetch('data/projects.json').then(r => r.json());

    loadProjects
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
                        <div class="project-badge" data-zh="${project.badge_zh}" data-en="${project.badge}">${project.badge}</div>
                        <h3 data-zh="${project.title_zh}" data-en="${project.title}">${project.title}</h3>
                        <p class="project-description" data-zh="${project.description_zh}" data-en="${project.description}">${project.description}</p>
                        <a href="${project.link}" class="project-link" data-zh="查看專案 →" data-en="View Project →">View Project →</a>
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

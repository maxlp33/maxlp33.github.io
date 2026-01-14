const { createApp } = Vue;

if (!createApp) {
    console.error("Vue not loaded!");
}

const app = createApp({
    data() {
        return {
            projects: [] // Start with empty array
        };
    },
    mounted() {
        fetch('/index')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    this.projects = data;

                    // Wait for DOM update then trigger slider init
                    this.$nextTick(() => {
                        
                        // Force visibility if needed
                        const projectsSection = document.querySelector('.projects');
                        if (projectsSection) {
                            projectsSection.style.opacity = '1';
                            projectsSection.style.transform = 'translateY(0)';
                        }

                        const event = new CustomEvent('projectsLoaded');
                        document.dispatchEvent(event);
                    });
                } else {
                    console.warn("No projects found");
                }
            })
            .catch(err => {
                console.error("Failed to load projects:", err);
            });
    }
});

app.mount('#track');

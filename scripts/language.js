// Language switching functionality
let currentLanguage = 'en';

const translations = {
    zh: {
        name: 'Max Liu',
        currentLang: '中文'
    },
    en: {
        name: 'Max Liu',
        currentLang: 'English'
    }
};

function switchLanguage(lang) {
    currentLanguage = lang;
    document.getElementById('current-lang').textContent = translations[lang].currentLang;
    // 更新 hero 標題為 translations 中的 name
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && translations[lang] && translations[lang].name) {
        heroTitle.textContent = translations[lang].name;
    }
    
    // Update all elements with data attributes
    const elementsToTranslate = document.querySelectorAll('[data-zh][data-en]');
    elementsToTranslate.forEach(element => {
        if (lang === 'zh') {
            element.textContent = element.getAttribute('data-zh');
            if (element.innerHTML.includes('&copy;')) {
                element.innerHTML = element.getAttribute('data-zh');
            }
        } else {
            element.textContent = element.getAttribute('data-en');
            if (element.innerHTML.includes('&copy;')) {
                element.innerHTML = element.getAttribute('data-en');
            }
        }
    });
    
    // Close dropdown
    document.getElementById('language-dropdown').classList.remove('show');
}

// Language switcher event listeners
document.addEventListener('DOMContentLoaded', function() {
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });

        // Add event listener to new items if projects are loaded dynamically
        document.addEventListener('projectsLoaded', function() {
            // Re-apply current language to newly added project cards
            switchLanguage(currentLanguage);
        });

        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', function() {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

// Apply English on page load
switchLanguage('en');

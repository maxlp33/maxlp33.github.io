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
    document.getElementById('language-dropdown').classList.remove('active');
}

// Language selector event listeners
document.getElementById('language-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('language-dropdown').classList.toggle('active');
});

document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        switchLanguage(lang);
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function() {
    document.getElementById('language-dropdown').classList.remove('active');
});

// Apply English on page load
switchLanguage('en');

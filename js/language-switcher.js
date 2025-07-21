// language-switcher.js - Handles US/UK English switching with IP detection

class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en-us';
        this.translations = {};
        this.init();
    }

    async init() {
        // Load translations
        await this.loadTranslations();
        
        // Detect user location and set initial language
        await this.detectLocationAndSetLanguage();
        
        // Set up language toggle button
        this.setupLanguageToggle();
        
        // Apply initial translations
        this.applyTranslations();
    }

    async loadTranslations() {
        try {
            // Load both language files
            const [usResponse, gbResponse] = await Promise.all([
                fetch('./data/content-en-us.json'),
                fetch('./data/content-en-gb.json')
            ]);

            this.translations['en-us'] = await usResponse.json();
            this.translations['en-gb'] = await gbResponse.json();
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback translations
            this.translations = this.getDefaultTranslations();
        }
    }

    async detectLocationAndSetLanguage() {
        try {
            // Try to get user's location from IP
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            // Check if user is in UK, Ireland, Australia, etc.
            const ukCountries = ['GB', 'UK', 'IE', 'AU', 'NZ'];
            if (ukCountries.includes(data.country_code)) {
                this.currentLang = 'en-gb';
            } else {
                this.currentLang = 'en-us';
            }
            
            // Check if user has a saved preference
            const savedLang = localStorage.getItem('preferred-language');
            if (savedLang) {
                this.currentLang = savedLang;
            }
            
        } catch (error) {
            console.log('Could not detect location, defaulting to US English');
            this.currentLang = 'en-us';
        }

        // Update HTML lang attribute
        document.documentElement.setAttribute('data-lang', this.currentLang);
        this.updateLanguageToggle();
    }

    setupLanguageToggle() {
        const toggleBtn = document.getElementById('lang-toggle');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            // Toggle between languages
            this.currentLang = this.currentLang === 'en-us' ? 'en-gb' : 'en-us';
            
            // Save preference
            localStorage.setItem('preferred-language', this.currentLang);
            
            // Update UI
            document.documentElement.setAttribute('data-lang', this.currentLang);
            this.updateLanguageToggle();
            this.applyTranslations();
        });
    }

    updateLanguageToggle() {
        const toggleBtn = document.getElementById('lang-toggle');
        if (!toggleBtn) return;

        const flags = toggleBtn.querySelectorAll('.lang-flag');
        flags.forEach(flag => {
            if (this.currentLang === 'en-us' && flag.dataset.lang === 'us') {
                flag.classList.add('active');
            } else if (this.currentLang === 'en-gb' && flag.dataset.lang === 'gb') {
                flag.classList.add('active');
            } else {
                flag.classList.remove('active');
            }
        });
    }

    applyTranslations() {
        const translations = this.translations[this.currentLang];
        if (!translations) return;

        // Apply translations to elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedProperty(translations, key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update specific content based on language
        this.updateLanguageSpecificContent();
    }

    updateLanguageSpecificContent() {
        // Update spelling variations
        const spellingMap = {
            'en-us': {
                'optimize': 'optimize',
                'optimization': 'optimization',
                'personalized': 'personalized',
                'analyze': 'analyze',
                'color': 'color',
                'center': 'center',
                'program': 'program'
            },
            'en-gb': {
                'optimize': 'optimise',
                'optimization': 'optimisation',
                'personalized': 'personalised',
                'analyze': 'analyse',
                'color': 'colour',
                'center': 'centre',
                'program': 'programme'
            }
        };

        const currentSpellings = spellingMap[this.currentLang];
        
        // Replace text in specific elements
        document.querySelectorAll('.auto-translate').forEach(element => {
            let text = element.textContent;
            Object.keys(currentSpellings).forEach(key => {
                const regex = new RegExp(key, 'gi');
                text = text.replace(regex, currentSpellings[key]);
            });
            element.textContent = text;
        });

        // Update meta descriptions
        this.updateMetaTags();
    }

    updateMetaTags() {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const descriptions = {
                'en-us': 'Johan Cilliers - Head of Web Development specializing in AI-powered SEO, voice search optimization, and digital growth strategies. 180% organic traffic growth achieved.',
                'en-gb': 'Johan Cilliers - Head of Web Development specialising in AI-powered SEO, voice search optimisation, and digital growth strategies. 180% organic traffic growth achieved.'
            };
            metaDescription.content = descriptions[this.currentLang];
        }
    }

    getNestedProperty(obj, path) {
        return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
    }

    getDefaultTranslations() {
        // Fallback translations if JSON files can't be loaded
        return {
            'en-us': {
                'hero': {
                    'subtitle': 'Transforming businesses through AI-powered SEO, achieving 180% organic growth',
                    'cta': "Let's Talk Growth"
                },
                'about': {
                    'specialization': 'Specialized in 2025\'s Key Trends'
                }
            },
            'en-gb': {
                'hero': {
                    'subtitle': 'Transforming businesses through AI-powered SEO, achieving 180% organic growth',
                    'cta': "Let's Talk Growth"
                },
                'about': {
                    'specialization': 'Specialised in 2025\'s Key Trends'
                }
            }
        };
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});

// Export for use in other modules
export default LanguageSwitcher;
// js/language-manager.js - Gestionnaire multilingue
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.translations = window.translations;
        this.observers = [];
        console.log('LanguageManager initialisé, langue:', this.currentLang);
        this.init();
    }
    
    init() {
        this.createLanguageSelector();
        this.loadLanguage(this.currentLang);
        this.watchDOMChanges();
        this.attachEvents();
    }
    
    createLanguageSelector() {
        // Chercher le sélecteur existant
        let selector = document.getElementById('languageSelector');
        
        // Si le sélecteur n'existe pas, le créer
        if (!selector) {
            const selectorHTML = `
                <div id="languageSelector" class="language-selector">
                    <button class="lang-btn ${this.currentLang === 'fr' ? 'active' : ''}" data-lang="fr">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Cpath fill='%23ED2939' d='M0 0h3v2H0z'/%3E%3Cpath fill='%23fff' d='M0 0h2v2H0z'/%3E%3Cpath fill='%23000' d='M0 0h1v2H0z'/%3E%3C/svg%3E" alt="FR">
                        <span>FR</span>
                    </button>
                    <button class="lang-btn ${this.currentLang === 'ar' ? 'active' : ''}" data-lang="ar">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Cpath fill='%23E70013' d='M0 0h3v2H0z'/%3E%3Cpath fill='%23fff' d='M0 0h3v1H0z'/%3E%3C/svg%3E" alt="AR">
                        <span>عربي</span>
                    </button>
                    <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3E%3Cpath fill='%23002687' d='M0 0h3v2H0z'/%3E%3Cpath fill='%23FFF' d='M0 0h3v1H0z'/%3E%3Cpath fill='%23C8102E' d='M0 1h3v1H0z'/%3E%3C/svg%3E" alt="EN">
                        <span>EN</span>
                    </button>
                </div>
            `;
            
            // Insérer dans le nav
            const nav = document.querySelector('header nav');
            if (nav) {
                // Insérer avant le menu-toggle
                const menuToggle = nav.querySelector('.menu-toggle');
                if (menuToggle) {
                    nav.insertAdjacentHTML('beforeend', selectorHTML);
                } else {
                    nav.insertAdjacentHTML('beforeend', selectorHTML);
                }
                console.log('Sélecteur de langue créé');
            } else {
                console.error('Nav non trouvé');
            }
        }
        
        selector = document.getElementById('languageSelector');
        if (selector) {
            // Ajouter les styles si nécessaire
            this.addStyles();
        }
    }
    
    addStyles() {
        if (!document.getElementById('langSelectorStyles')) {
            const styles = `
                <style id="langSelectorStyles">
                    #languageSelector {
                        display: flex;
                        gap: 0.5rem;
                        margin-left: 1rem;
                    }
                    
                    #languageSelector .lang-btn {
                        display: flex;
                        align-items: center;
                        gap: 0.3rem;
                        padding: 0.4rem 0.8rem;
                        background: rgba(255,255,255,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s;
                        color: white;
                        font-size: 0.85rem;
                        font-weight: 500;
                    }
                    
                    #languageSelector .lang-btn img {
                        width: 20px;
                        height: 15px;
                        object-fit: cover;
                        border-radius: 2px;
                    }
                    
                    #languageSelector .lang-btn:hover {
                        background: rgba(255,255,255,0.2);
                        transform: translateY(-2px);
                    }
                    
                    #languageSelector .lang-btn.active {
                        background: linear-gradient(135deg, #e67e22, #f39c12);
                        border-color: transparent;
                    }
                    
                    @media (max-width: 768px) {
                        #languageSelector {
                            margin-left: 0;
                            margin-top: 1rem;
                        }
                        
                        #languageSelector .lang-btn span {
                            display: none;
                        }
                        
                        #languageSelector .lang-btn {
                            padding: 0.5rem;
                        }
                    }
                    
                    html[dir="rtl"] #languageSelector {
                        margin-left: 0;
                        margin-right: 1rem;
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }
    
    attachEvents() {
        // Attacher les événements aux boutons
        const buttons = document.querySelectorAll('#languageSelector .lang-btn');
        console.log('Boutons de langue trouvés:', buttons.length);
        
        buttons.forEach(btn => {
            // Supprimer les anciens événements
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = newBtn.dataset.lang;
                console.log('Changement de langue demandé:', lang);
                this.setLanguage(lang);
            });
        });
    }
    
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error('Langue non supportée:', lang);
            return;
        }
        
        console.log('Changement de langue vers:', lang);
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        window.currentLanguage = lang;
        
        // Mettre à jour la direction pour l'arabe
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', lang);
        }
        
        // Mettre à jour les boutons actifs
        document.querySelectorAll('#languageSelector .lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        
        // Traduire la page
        this.translatePage();
        
        // Notifier les observateurs
        this.notifyObservers();
        
        console.log('Langue changée avec succès vers:', lang);
    }
    
    loadLanguage(lang) {
        this.setLanguage(lang);
    }
    
    translatePage() {
        const t = this.translations[this.currentLang];
        if (!t) {
            console.error('Traductions non trouvées pour:', this.currentLang);
            return;
        }
        
        console.log('Traduction de la page en:', this.currentLang);
        
        // Traduire tous les éléments avec data-translate
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.dataset.translate;
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else if (el.tagName === 'SELECT') {
                    // Pour les selects, garder la valeur
                    const currentValue = el.value;
                    const options = el.querySelectorAll('option');
                    options.forEach(opt => {
                        const optKey = opt.getAttribute('data-translate');
                        if (optKey && t[optKey]) {
                            opt.textContent = t[optKey];
                        }
                    });
                    el.value = currentValue;
                } else {
                    el.innerHTML = t[key];
                }
            }
        });
        
        // Traduire les placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.dataset.translatePlaceholder;
            if (t[key]) {
                el.placeholder = t[key];
            }
        });
        
        // Mettre à jour les titres spéciaux
        this.updateSpecialTitles(t);
        
        // Mettre à jour les statistiques
        this.updateStats(t);
        
        // Mettre à jour les filtres
        this.updateFilters(t);
        
        // Re-rendre les produits si la fonction existe
        if (typeof renderProducts === 'function') {
            renderProducts();
        }
    }
    
    updateSpecialTitles(t) {
        // Hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const firstSpan = heroTitle.querySelector('span:first-child');
            const gradientSpan = heroTitle.querySelector('.gradient-text');
            if (firstSpan && t.hero_title) firstSpan.textContent = t.hero_title;
            if (gradientSpan && t.hero_title_gradient) gradientSpan.textContent = t.hero_title_gradient;
        }
        
        // Section title
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
            const firstSpan = sectionTitle.querySelector('span:first-child');
            const highlightSpan = sectionTitle.querySelector('.highlight');
            if (firstSpan && t.products_title) firstSpan.textContent = t.products_title;
            if (highlightSpan && t.products_title_highlight) highlightSpan.textContent = t.products_title_highlight;
        }
        
        // Contact title
        const contactTitle = document.querySelector('.contact-section .section-title');
        if (contactTitle) {
            const firstSpan = contactTitle.querySelector('span:first-child');
            const highlightSpan = contactTitle.querySelector('.highlight');
            if (firstSpan && t.contact_title) firstSpan.textContent = t.contact_title;
            if (highlightSpan && t.contact_title_highlight) highlightSpan.textContent = t.contact_title_highlight;
        }
    }
    
    updateStats(t) {
        const statLabels = document.querySelectorAll('.stat-label');
        const labels = ['stats_clients', 'stats_projects', 'stats_years', 'stats_partners'];
        statLabels.forEach((el, index) => {
            if (labels[index] && t[labels[index]]) {
                el.textContent = t[labels[index]];
            }
        });
    }
    
    updateFilters(t) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const filterKeys = ['filter_all', 'filter_stationery', 'filter_advertising', 'filter_luxury', 'filter_art'];
        
        filterBtns.forEach((btn, index) => {
            if (filterKeys[index] && t[filterKeys[index]]) {
                const icon = btn.querySelector('i');
                const countSpan = btn.querySelector('.count');
                if (icon) {
                    const newText = t[filterKeys[index]];
                    if (countSpan) {
                        btn.innerHTML = '';
                        btn.appendChild(icon.cloneNode(true));
                        btn.appendChild(document.createTextNode(' ' + newText + ' '));
                        btn.appendChild(countSpan.cloneNode(true));
                    } else {
                        const span = btn.querySelector('span');
                        if (span) {
                            span.textContent = newText;
                        } else {
                            btn.childNodes.forEach(node => {
                                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                    node.textContent = newText;
                                }
                            });
                        }
                    }
                }
            }
        });
    }
    
    translate(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }
    
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    notifyObservers() {
        this.observers.forEach(observer => {
            if (typeof observer === 'function') {
                observer(this.currentLang);
            }
        });
    }
    
    watchDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.hasAttribute && node.hasAttribute('data-translate')) {
                            this.translateElement(node);
                        }
                        if (node.querySelectorAll) {
                            node.querySelectorAll('[data-translate]').forEach(el => {
                                this.translateElement(el);
                            });
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    translateElement(el) {
        const key = el.dataset.translate;
        const t = this.translations[this.currentLang];
        if (t && t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
    }
}

// Initialiser le gestionnaire de langue quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});
// theme-manager.js - Version corrigée
(function() {
    'use strict';
    
    // Attendre que les traductions soient chargées
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        
        class ThemeManager {
            // ... reste du code inchangé ...
        }
        
        window.themeManager = new ThemeManager();
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
// theme-manager.js - Version corrigée
(function() {
    'use strict';
    
    // Initialisation immédiate pour éviter le flash blanc
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    class ThemeManager {
        constructor() {
            this.theme = localStorage.getItem('theme') || 'light';
            this.init();
        }
        
        init() {
            this.injectStyles();
            this.setupToggleButton();
            this.applyTheme(this.theme);
            this.detectSystemPreference();
            console.log('ThemeManager initialisé - Thème:', this.theme);
        }
        
        applyTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                this.updateIcon('dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
                this.updateIcon('light');
            }
            localStorage.setItem('theme', theme);
            this.theme = theme;
            
            // Déclencher un événement pour les autres composants
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));
        }
        
        updateIcon(theme) {
            const icon = document.getElementById('themeIcon');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                    icon.style.color = '#fbbf24';
                } else {
                    icon.className = 'fas fa-moon';
                    icon.style.color = 'white';
                }
            }
        }
        
        setupToggleButton() {
            // Chercher le bouton existant ou le créer
            let toggleBtn = document.getElementById('themeToggle');
            
            if (!toggleBtn) {
                // Créer le bouton s'il n'existe pas
                const langSelector = document.getElementById('languageSelector');
                if (langSelector) {
                    const btnHTML = `
                        <button class="theme-toggle" id="themeToggle" aria-label="Changer de thème">
                            <i class="fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}" id="themeIcon"></i>
                        </button>
                    `;
                    langSelector.insertAdjacentHTML('afterend', btnHTML);
                    toggleBtn = document.getElementById('themeToggle');
                }
            }
            
            if (toggleBtn) {
                // Supprimer les anciens écouteurs
                const newBtn = toggleBtn.cloneNode(true);
                toggleBtn.parentNode.replaceChild(newBtn, toggleBtn);
                
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newTheme = this.theme === 'light' ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                });
                
                console.log('Bouton theme-toggle configuré');
            }
        }
        
        injectStyles() {
            if (document.getElementById('themeStyles')) return;
            
            const styles = `
                <style id="themeStyles">
                    /* ========== VARIABLES (surchargeables) ========== */
                    :root {
                        --bg-primary: #f8fafc;
                        --bg-secondary: #ffffff;
                        --bg-card: #ffffff;
                        --bg-input: #ffffff;
                        --text-primary: #1e293b;
                        --text-secondary: #64748b;
                        --border-color: #e2e8f0;
                        --shadow: 0 4px 15px rgba(0,0,0,0.05);
                        --shadow-hover: 0 20px 40px rgba(0,0,0,0.1);
                        --header-bg: rgba(26, 42, 58, 0.95);
                        --footer-bg: #1a2a3a;
                    }
                    
                    /* ========== THÈME SOMBRE ========== */
                    [data-theme="dark"] {
                        --bg-primary: #0f172a;
                        --bg-secondary: #1e293b;
                        --bg-card: #1e293b;
                        --bg-input: #1e293b;
                        --text-primary: #f1f5f9;
                        --text-secondary: #94a3b8;
                        --border-color: #334155;
                        --shadow: 0 4px 15px rgba(0,0,0,0.3);
                        --shadow-hover: 0 20px 40px rgba(0,0,0,0.5);
                        --header-bg: rgba(15, 23, 42, 0.95);
                        --footer-bg: #0f172a;
                    }
                    
                    /* Application forcée des variables */
                    body {
                        background: var(--bg-primary) !important;
                        color: var(--text-primary) !important;
                        transition: background 0.3s ease, color 0.3s ease;
                    }
                    
                    header {
                        background: var(--header-bg) !important;
                        backdrop-filter: blur(10px);
                    }
                    
                    .product-card, .contact-form, .contact-item {
                        background: var(--bg-card) !important;
                        box-shadow: var(--shadow);
                    }
                    
                    .product-card:hover {
                        box-shadow: var(--shadow-hover);
                    }
                    
                    .product-desc, .contact-item p, .section-subtitle {
                        color: var(--text-secondary) !important;
                    }
                    
                    .filter-btn {
                        background: var(--bg-card) !important;
                        color: var(--text-primary) !important;
                        border: 1px solid var(--border-color);
                    }
                    
                    .filter-btn.active, .filter-btn:hover {
                        background: linear-gradient(135deg, #e67e22, #f39c12) !important;
                        color: white !important;
                        border-color: transparent;
                    }
                    
                    footer {
                        background: var(--footer-bg) !important;
                    }
                    
                    .form-group input,
                    .form-group select,
                    .form-group textarea {
                        background: var(--bg-input) !important;
                        color: var(--text-primary) !important;
                        border: 1px solid var(--border-color) !important;
                    }
                    
                    .modal-content {
                        background: var(--bg-card) !important;
                    }
                    
                    .stats-section {
                        background: linear-gradient(135deg, #1a2a3a, #0f1a24);
                    }
                    
                    [data-theme="dark"] .stats-section {
                        background: linear-gradient(135deg, #0f172a, #0a0f1a);
                    }
                    
                    .hero {
                        background: linear-gradient(135deg, #1a2a3a, #0f1a24);
                    }
                    
                    [data-theme="dark"] .hero {
                        background: linear-gradient(135deg, #0f172a, #0a0f1a);
                    }
                    
                    .product-image {
                        background: linear-gradient(135deg, #1a2a3a, #0f1a24);
                    }
                    
                    [data-theme="dark"] .product-image {
                        background: linear-gradient(135deg, #0f172a, #0a0f1a);
                    }
                    
                    [data-theme="dark"] .contact-icon {
                        background: rgba(230,126,34,0.2);
                    }
                    
                    [data-theme="dark"] .hero-badge {
                        background: rgba(255,255,255,0.05);
                    }
                    
                    /* Scrollbar mode sombre */
                    [data-theme="dark"] ::-webkit-scrollbar {
                        width: 10px;
                    }
                    [data-theme="dark"] ::-webkit-scrollbar-track {
                        background: #1e293b;
                    }
                    [data-theme="dark"] ::-webkit-scrollbar-thumb {
                        background: #475569;
                        border-radius: 5px;
                    }
                    [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
                        background: #e67e22;
                    }
                    
                    /* Bouton toggle */
                    .theme-toggle {
                        width: 45px;
                        height: 45px;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.1);
                        border: 1px solid rgba(255,255,255,0.2);
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s;
                        margin-left: 0.5rem;
                    }
                    .theme-toggle:hover {
                        background: rgba(255,255,255,0.2);
                        transform: scale(1.05);
                    }
                    .theme-toggle i {
                        font-size: 1.2rem;
                        color: white;
                    }
                    [data-theme="dark"] .theme-toggle {
                        background: rgba(255,255,255,0.05);
                    }
                    [data-theme="dark"] .theme-toggle i {
                        color: #fbbf24;
                    }
                    
                    @media (max-width: 768px) {
                        .theme-toggle {
                            width: 40px;
                            height: 40px;
                        }
                    }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        }
        
        detectSystemPreference() {
            if (!localStorage.getItem('theme')) {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    this.applyTheme('dark');
                }
            }
            
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    // Initialisation immédiate
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.themeManager = new ThemeManager();
        });
    } else {
        window.themeManager = new ThemeManager();
    }
})();
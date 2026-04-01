// js/ai-assistant-multilang.js - Assistant AI multilingue
class MultilingualAIAssistant {
    constructor() {
        this.currentLang = window.currentLanguage || 'fr';
        this.conversationHistory = [];
        this.elements = {};
        this.init();
        
        // S'abonner aux changements de langue
        if (window.languageManager) {
            window.languageManager.subscribe((lang) => {
                this.updateLanguage(lang);
            });
        }
    }
    
    init() {
        // Attendre que l'assistant soit chargé
        setTimeout(() => {
            this.elements = {
                headerTitle: document.querySelector('.ai-chat-header h3'),
                input: document.getElementById('aiInput'),
                messages: document.getElementById('aiMessages')
            };
            this.updateUILanguage();
        }, 500);
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        this.updateUILanguage();
        // Ajouter un message de bienvenue dans la nouvelle langue
        this.addWelcomeMessage();
    }
    
    updateUILanguage() {
        const t = translations[this.currentLang];
        
        // Mettre à jour le titre du chat
        if (this.elements.headerTitle) {
            this.elements.headerTitle.innerHTML = `<i class="fas fa-robot"></i> ${t.ai_welcome || 'Assistant Dar El Founoun'}`;
        }
        
        // Mettre à jour le placeholder de l'input
        if (this.elements.input) {
            this.elements.input.placeholder = t.ai_help || 'Comment puis-je vous aider ?';
        }
        
        // Mettre à jour les suggestions
        const suggestionBtns = document.querySelectorAll('.ai-suggestion-btn');
        const suggestions = ['ai_products', 'ai_prices', 'ai_quote', 'ai_deadlines', 'ai_contact'];
        const suggestionTexts = {
            ai_products: t.ai_products || '📋 Produits',
            ai_prices: t.ai_prices || '💰 Prix',
            ai_quote: t.ai_quote || '📄 Devis',
            ai_deadlines: t.ai_deadlines || '⏱️ Délais',
            ai_contact: t.ai_contact || '📍 Contact'
        };
        
        suggestionBtns.forEach((btn, index) => {
            if (suggestions[index] && suggestionTexts[suggestions[index]]) {
                btn.innerHTML = suggestionTexts[suggestions[index]];
                btn.setAttribute('data-msg', this.getDefaultQuestion(suggestions[index]));
            }
        });
    }
    
    getDefaultQuestion(key) {
        const questions = {
            ai_products: this.currentLang === 'ar' ? 'ما هي منتجاتكم؟' : (this.currentLang === 'en' ? 'What are your products?' : 'Quels sont vos produits ?'),
            ai_prices: this.currentLang === 'ar' ? 'أسعار بطاقات العمل' : (this.currentLang === 'en' ? 'Business card prices' : 'Prix des cartes de visite'),
            ai_quote: this.currentLang === 'ar' ? 'طلب عرض سعر' : (this.currentLang === 'en' ? 'Request a quote' : 'Demander un devis'),
            ai_deadlines: this.currentLang === 'ar' ? 'مواعيد التسليم' : (this.currentLang === 'en' ? 'Delivery deadlines' : 'Délais de livraison'),
            ai_contact: this.currentLang === 'ar' ? 'معلومات الاتصال' : (this.currentLang === 'en' ? 'Contact information' : 'Coordonnées')
        };
        return questions[key] || '';
    }
    
    getLocalResponse(message) {
        const msg = message.toLowerCase();
        const t = translations[this.currentLang];
        
        // Détection des mots-clés selon la langue
        const keywords = {
            products: {
                fr: ['produit', 'catalogue', 'proposez', 'vendez', 'offrez'],
                ar: ['منتج', 'كتالوج', 'تقدمون'],
                en: ['product', 'catalog', 'offer', 'provide']
            },
            price_cards: {
                fr: ['carte visite', 'cartes visite', 'prix carte'],
                ar: ['بطاقة', 'بطاقات', 'سعر'],
                en: ['business card', 'cards', 'price']
            },
            quote: {
                fr: ['devis', 'prix', 'tarif', 'combien'],
                ar: ['عرض سعر', 'سعر', 'كم'],
                en: ['quote', 'price', 'cost']
            },
            deadlines: {
                fr: ['délai', 'delai', 'livraison', 'temps'],
                ar: ['موعد', 'تسليم', 'وقت'],
                en: ['deadline', 'delivery', 'time']
            },
            contact: {
                fr: ['contact', 'téléphone', 'email', 'adresse'],
                ar: ['اتصل', 'هاتف', 'بريد', 'عنوان'],
                en: ['contact', 'phone', 'email', 'address']
            }
        };
        
        const langCode = this.currentLang;
        
        if (keywords.products[langCode]?.some(k => msg.includes(k))) {
            return t.ai_products_response || "📋 Nos produits : Cartes de visite, Flyers, Roll-ups, Toiles d'art, Faire-part";
        }
        
        if (keywords.price_cards[langCode]?.some(k => msg.includes(k))) {
            return t.ai_price_cards || "📇 Cartes de visite : dès 50 DT pour 100 cartes";
        }
        
        if (keywords.quote[langCode]?.some(k => msg.includes(k))) {
            return t.ai_quote_response || "📋 Pour un devis personnalisé, merci de préciser le produit, la quantité et les finitions.";
        }
        
        if (keywords.deadlines[langCode]?.some(k => msg.includes(k))) {
            return t.ai_deadlines_response || "⏱️ Délais : 3-7 jours ouvrés standard, 48h en express.";
        }
        
        if (keywords.contact[langCode]?.some(k => msg.includes(k))) {
            return t.ai_contact_response || "📞 Contact : +216 71 123 456, contact@darelfounoun.tn";
        }
        
        return t.ai_default_response || "🤔 Je n'ai pas compris. Comment puis-je vous aider ?";
    }
    
    addWelcomeMessage() {
        const t = translations[this.currentLang];
        const messagesContainer = document.getElementById('aiMessages');
        
        if (messagesContainer && !this.hasWelcomeMessage()) {
            // Supprimer l'ancien message de bienvenue si présent
            const oldWelcome = messagesContainer.querySelector('.ai-message.bot:first-child');
            if (oldWelcome && oldWelcome.innerHTML.includes('Bonjour')) {
                oldWelcome.remove();
            }
            
            // Ajouter le nouveau message de bienvenue
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'ai-message bot';
            welcomeDiv.innerHTML = `<div class="ai-message-content">👋 ${t.ai_welcome || 'Bonjour ! Je suis l\'assistant de Dar El Founoun'}<br><br>${t.ai_help || 'Comment puis-je vous aider ?'}</div>`;
            messagesContainer.insertBefore(welcomeDiv, messagesContainer.firstChild);
        }
    }
    
    hasWelcomeMessage() {
        const messagesContainer = document.getElementById('aiMessages');
        if (!messagesContainer) return false;
        const firstMessage = messagesContainer.querySelector('.ai-message.bot:first-child');
        return firstMessage && (firstMessage.innerHTML.includes('Bonjour') || 
                                firstMessage.innerHTML.includes('مرحباً') || 
                                firstMessage.innerHTML.includes('Hello'));
    }
    
    sendMessage(message) {
        const input = document.getElementById('aiInput');
        const sendBtn = document.getElementById('aiSend');
        
        if (!message || message.trim() === '') return;
        
        // Ajouter le message de l'utilisateur
        this.addMessage('user', message);
        
        if (input) input.value = '';
        
        // Simuler une réponse
        setTimeout(() => {
            const response = this.getLocalResponse(message);
            this.addMessage('bot', response);
        }, 500);
    }
    
    addMessage(sender, text) {
        const messagesContainer = document.getElementById('aiMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        const formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = `<div class="ai-message-content">${formattedText}</div>`;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Exposer globalement
window.MultilingualAIAssistant = MultilingualAIAssistant;
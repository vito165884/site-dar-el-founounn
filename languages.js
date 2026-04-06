// ai-assistant.js - Version multilingue corrigée
(function() {
    'use strict';

    let currentLang = 'fr';
    let isTyping = false;
    let elements = {};

    // Base de connaissances multilingue
    const KNOWLEDGE_BASE = {
        fr: {
            greeting: {
                patterns: ['bonjour', 'salut', 'hello', 'hi', 'coucou', 'hey', 'bonsoir'],
                response: "👋 Bonjour ! Je suis l'assistant virtuel de Dar El Founoun. Je peux vous aider à découvrir nos produits, obtenir des prix, faire un devis, ou répondre à vos questions. Comment puis-je vous aider ?"
            },
            products: {
                patterns: ['produit', 'catalogue', 'proposez', 'vendez', 'services', 'offrez', 'gamme'],
                response: "🎨 Dar El Founoun propose une large gamme de produits d'impression :\n\n📋 **Papeterie** : Cartes de visite, enveloppes, blocs notes, papier à en-tête\n📢 **Publicitaire** : Flyers, roll-ups, bâches, panneaux LED, goodies\n💎 **Luxe** : Catalogues, faire-parts, albums photo, emballages premium\n🖼️ **Art & Design** : Affiches, toiles d'art, posters, livres d'art\n\nQuel type de produit vous intéresse ?"
            },
            price_cards: {
                patterns: ['carte de visite', 'cartes de visite', 'prix carte', 'tarif carte'],
                response: "📇 **Cartes de visite premium**\n\n• Papier luxe 350g\n• Finition mate ou brillante au choix\n• Impression recto-verso incluse\n• Vernis sélectif disponible\n• Dès **50 DT** pour 100 cartes"
            },
            price_flyers: {
                patterns: ['flyer', 'flyers', 'dépliant', 'prospectus', 'tract'],
                response: "📄 **Flyers publicitaires**\n\n• Format A5 (148x210mm)\n• Papier couché 135g à 300g\n• Impression recto ou recto-verso\n• Dès **80 DT** pour 1000 exemplaires"
            },
            price_rollup: {
                patterns: ['roll-up', 'rollup', 'stand', 'bannière'],
                response: "🎪 **Roll-up professionnel**\n\n• Format 85x200cm\n• Structure aluminium robuste\n• Sacoche de transport incluse\n• Dès **120 DT**"
            },
            deadlines: {
                patterns: ['délai', 'delai', 'livraison', 'temps', 'dure', 'quand'],
                response: "⏱️ **Délais de production**\n\n• Standard : **3 à 7 jours ouvrés**\n• Grandes quantités : **10 à 14 jours**\n• Express : **48h** (selon disponibilité)"
            },
            contact: {
                patterns: ['contact', 'joindre', 'téléphone', 'email', 'adresse', 'coordonnées'],
                response: "📞 **Nos coordonnées**\n\n📍 **Adresse** : 12 Rue de la Liberté, Centre Urbain Nord, Tunis\n\n📱 **Téléphone** : +216 71 123 456 / +216 98 765 432\n\n✉️ **Email** : contact@darelfounoun.tn\n\n🕐 **Horaires** : Lun-Ven 8h30-18h, Sam 9h-13h"
            },
            quote: {
                patterns: ['devis', 'devi', 'estimation', 'devis gratuit'],
                response: "📋 **Demande de devis personnalisé**\n\nPour obtenir un devis, merci de nous préciser :\n1️⃣ Type de produit souhaité\n2️⃣ Quantité approximative\n3️⃣ Format / dimensions\n4️⃣ Finitions souhaitées\n\nVous pouvez remplir le formulaire de contact sur notre site."
            },
            thanks: {
                patterns: ['merci', 'thanks', 'thank', 'super', 'génial'],
                response: "🙏 Merci beaucoup ! N'hésitez pas si vous avez d'autres questions. Bonne journée ! ✨"
            },
            goodbye: {
                patterns: ['au revoir', 'bye', 'adieu', 'à plus', 'ciao'],
                response: "👋 Au revoir ! Merci d'avoir visité Dar El Founoun. À bientôt !"
            }
        },
        ar: {
            greeting: {
                patterns: ['مرحبا', 'السلام', 'اهلا', 'صباح'],
                response: "👋 مرحبا! أنا المساعد الافتراضي لدار الفنون. يمكنني مساعدتك في اكتشاف منتجاتنا، الحصول على الأسعار، طلب عرض سعر، أو الإجابة على أسئلتك. كيف يمكنني مساعدتك؟"
            },
            products: {
                patterns: ['منتج', 'كتالوج', 'تقدمون', 'خدمات'],
                response: "🎨 تقدم دار الفنون مجموعة واسعة من منتجات الطباعة:\n\n📋 **القرطاسية**: بطاقات العمل، الأظرف، دفاتر الملاحظات\n📢 **الإعلانات**: المنشورات، الرول آب، اللوحات الإعلانية\n💎 **الفخامة**: الكتالوجات، بطاقات الدعوة، ألبومات الصور\n🖼️ **الفن والتصميم**: الملصقات، اللوحات الفنية، كتب الفن"
            },
            price_cards: {
                patterns: ['بطاقة عمل', 'بطاقات عمل', 'سعر بطاقة'],
                response: "📇 **بطاقات العمل الفاخرة**\n\n• ورق فاخر 350 جرام\n• لمسة غير لامعة أو لامعة\n• طباعة وجهين\n• ابتداء من **50 دينار** لـ 100 بطاقة"
            },
            price_flyers: {
                patterns: ['منشور', 'منشورات', 'مطوية'],
                response: "📄 **المنشورات الإعلانية**\n\n• مقاس A5\n• ورق مطلي 135 جرام\n• طباعة وجه واحد أو وجهين\n• ابتداء من **80 دينار** لـ 1000 نسخة"
            },
            price_rollup: {
                patterns: ['رول آب', 'رولاب', 'stand'],
                response: "🎪 **رول آب احترافي**\n\n• مقاس 85x200 سم\n• هيكل ألمنيوم متين\n• حقيبة حمل متضمنة\n• ابتداء من **120 دينار**"
            },
            deadlines: {
                patterns: ['موعد', 'تسليم', 'وقت', 'مدة'],
                response: "⏱️ **مواعيد الإنتاج**\n\n• عادي: **3 إلى 7 أيام عمل**\n• كميات كبيرة: **10 إلى 14 يوم**\n• سريع: **48 ساعة** (حسب التوفر)"
            },
            contact: {
                patterns: ['اتصل', 'هاتف', 'بريد', 'عنوان', 'إحداثيات'],
                response: "📞 **إحداثياتنا**\n\n📍 **العنوان**: 12 نهج الحرية، المركز العمراني الشمالي، تونس\n\n📱 **الهاتف**: +216 71 123 456 / +216 98 765 432\n\n✉️ **البريد**: contact@darelfounoun.tn\n\n🕐 **الساعات**: الإثنين-الجمعة 8:30-18:00، السبت 9:00-13:00"
            },
            quote: {
                patterns: ['عرض سعر', 'سعر', 'تقييم'],
                response: "📋 **طلب عرض سعر مخصص**\n\nللحصول على عرض سعر، يرجى تحديد:\n1️⃣ نوع المنتج المطلوب\n2️⃣ الكمية التقريبية\n3️⃣ الحجم / الأبعاد\n4️⃣ التشطيبات المطلوبة\n\nيمكنك ملء نموذج الاتصال على موقعنا."
            },
            thanks: {
                patterns: ['شكرا', 'شكر', 'ممتاز', 'رائع'],
                response: "🙏 شكرا جزيلا! لا تتردد في الاتصال بنا إذا كان لديك أي أسئلة أخرى. يوم سعيد! ✨"
            },
            goodbye: {
                patterns: ['مع السلامة', 'الى اللقاء', 'باي'],
                response: "👋 مع السلامة! شكرا لزيارة دار الفنون. إلى اللقاء!"
            }
        },
        en: {
            greeting: {
                patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
                response: "👋 Hello! I'm Dar El Founoun's virtual assistant. I can help you discover our products, get prices, request a quote, or answer your questions. How can I help you today?"
            },
            products: {
                patterns: ['product', 'catalog', 'offer', 'provide', 'services'],
                response: "🎨 Dar El Founoun offers a wide range of printing products:\n\n📋 **Stationery**: Business cards, envelopes, notebooks, letterhead\n📢 **Advertising**: Flyers, roll-ups, banners, LED panels, goodies\n💎 **Luxury**: Catalogs, invitations, photo albums, premium packaging\n🖼️ **Art & Design**: Posters, art canvases, art books\n\nWhat type of product interests you?"
            },
            price_cards: {
                patterns: ['business card', 'cards', 'price card'],
                response: "📇 **Premium Business Cards**\n\n• Luxury 350g paper\n• Matte or glossy finish\n• Double-sided printing included\n• From **50 DT** for 100 cards"
            },
            price_flyers: {
                patterns: ['flyer', 'flyers', 'leaflet', 'brochure'],
                response: "📄 **Advertising Flyers**\n\n• A5 format (148x210mm)\n• 135g coated paper\n• One or two-sided printing\n• From **80 DT** for 1000 copies"
            },
            price_rollup: {
                patterns: ['roll-up', 'rollup', 'stand', 'banner'],
                response: "🎪 **Professional Roll-up**\n\n• 85x200cm format\n• Sturdy aluminum structure\n• Carrying bag included\n• From **120 DT**"
            },
            deadlines: {
                patterns: ['deadline', 'delivery', 'time', 'duration', 'when'],
                response: "⏱️ **Production Deadlines**\n\n• Standard: **3 to 7 business days**\n• Large quantities: **10 to 14 days**\n• Express: **48h** (subject to availability)"
            },
            contact: {
                patterns: ['contact', 'phone', 'email', 'address', 'coordinates'],
                response: "📞 **Our Coordinates**\n\n📍 **Address**: 12 Rue de la Liberté, Centre Urbain Nord, Tunis\n\n📱 **Phone**: +216 71 123 456 / +216 98 765 432\n\n✉️ **Email**: contact@darelfounoun.tn\n\n🕐 **Hours**: Mon-Fri 8:30-18:00, Sat 9:00-13:00"
            },
            quote: {
                patterns: ['quote', 'estimation', 'price', 'cost'],
                response: "📋 **Custom Quote Request**\n\nTo get a quote, please specify:\n1️⃣ Type of product\n2️⃣ Approximate quantity\n3️⃣ Format / dimensions\n4️⃣ Desired finishes\n\nYou can fill out the contact form on our website."
            },
            thanks: {
                patterns: ['thank', 'thanks', 'great', 'awesome', 'perfect'],
                response: "🙏 Thank you very much! Feel free to ask if you have any other questions. Have a great day! ✨"
            },
            goodbye: {
                patterns: ['goodbye', 'bye', 'see you', 'farewell'],
                response: "👋 Goodbye! Thank you for visiting Dar El Founoun. See you soon!"
            }
        }
    };

    const DEFAULT_RESPONSE = {
        fr: "🤔 Je n'ai pas bien compris votre demande. Voici ce que je peux faire pour vous :\n\n• Vous renseigner sur nos produits\n• Vous donner les prix et délais\n• Vous aider à obtenir un devis\n• Vous donner nos coordonnées\n\nComment puis-je vous aider ?",
        ar: "🤔 لم أفهم طلبك جيداً. إليك ما يمكنني فعله لك:\n\n• الاستعلام عن منتجاتنا\n• إعطائك الأسعار والمواعيد\n• مساعدتك في الحصول على عرض سعر\n• إعطائك إحداثياتنا\n\nكيف يمكنني مساعدتك؟",
        en: "🤔 I didn't quite understand your request. Here's what I can do for you:\n\n• Inform you about our products\n• Give you prices and deadlines\n• Help you get a quote\n• Give you our contact information\n\nHow can I help you?"
    };

    function cleanText(text) {
        return text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function getBestResponse(message) {
        const cleanMessage = cleanText(message);
        const kb = KNOWLEDGE_BASE[currentLang] || KNOWLEDGE_BASE.fr;
        
        for (const [key, data] of Object.entries(kb)) {
            if (data.patterns) {
                for (const pattern of data.patterns) {
                    if (cleanMessage.includes(cleanText(pattern))) {
                        return data.response;
                    }
                }
            }
        }
        
        return (DEFAULT_RESPONSE[currentLang] || DEFAULT_RESPONSE.fr);
    }

    function updateLanguage(lang) {
        if (lang === 'ar' || lang === 'en' || lang === 'fr') {
            currentLang = lang;
            updateUILanguage();
        }
    }

    function updateUILanguage() {
        const t = getUITranslations();
        
        const headerTitle = document.querySelector('.ai-chat-header h3');
        if (headerTitle) {
            headerTitle.innerHTML = `<i class="fas fa-robot"></i> ${t.title}`;
        }
        
        const input = document.getElementById('aiInput');
        if (input) input.placeholder = t.placeholder;
        
        const suggestionBtns = document.querySelectorAll('.ai-suggestion-btn');
        const suggestions = ['ai_products', 'ai_prices', 'ai_quote', 'ai_deadlines', 'ai_contact'];
        
        suggestionBtns.forEach((btn, index) => {
            if (suggestions[index] && t[suggestions[index]]) {
                btn.innerHTML = t[suggestions[index]];
            }
        });
        
        // Mettre à jour le message de bienvenue si le chat est vide
        const messagesContainer = document.getElementById('aiMessages');
        if (messagesContainer && messagesContainer.children.length <= 1) {
            const welcomeDiv = messagesContainer.querySelector('.ai-message.bot');
            if (welcomeDiv) {
                welcomeDiv.innerHTML = `<div class="ai-message-content">👋 ${t.welcome}<br><br>${t.help}</div>`;
            }
        }
    }

    function getUITranslations() {
        const uiTranslations = {
            fr: {
                title: "Assistant Dar El Founoun",
                placeholder: "Écrivez votre message...",
                welcome: "Bonjour ! Je suis l'assistant de Dar El Founoun",
                help: "Comment puis-je vous aider ?",
                ai_products: "📋 Produits",
                ai_prices: "💰 Prix",
                ai_quote: "📄 Devis",
                ai_deadlines: "⏱️ Délais",
                ai_contact: "📍 Contact"
            },
            ar: {
                title: "مساعد دار الفنون",
                placeholder: "اكتب رسالتك...",
                welcome: "مرحباً! أنا مساعد دار الفنون",
                help: "كيف يمكنني مساعدتك؟",
                ai_products: "📋 المنتجات",
                ai_prices: "💰 الأسعار",
                ai_quote: "📄 عرض سعر",
                ai_deadlines: "⏱️ المواعيد",
                ai_contact: "📍 اتصل بنا"
            },
            en: {
                title: "Dar El Founoun Assistant",
                placeholder: "Write your message...",
                welcome: "Hello! I'm Dar El Founoun's assistant",
                help: "How can I help you?",
                ai_products: "📋 Products",
                ai_prices: "💰 Prices",
                ai_quote: "📄 Quote",
                ai_deadlines: "⏱️ Deadlines",
                ai_contact: "📍 Contact"
            }
        };
        return uiTranslations[currentLang] || uiTranslations.fr;
    }

    function scrollToBottom() {
        if (elements.messages) {
            elements.messages.scrollTop = elements.messages.scrollHeight;
        }
    }

    function addMessage(text, sender) {
        if (!elements.messages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        const formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = `<div class="ai-message-content">${formattedText}</div>`;
        
        elements.messages.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        removeTypingIndicator();
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message bot';
        typingDiv.id = 'aiTypingIndicator';
        typingDiv.innerHTML = `
            <div class="ai-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        if (elements.messages) {
            elements.messages.appendChild(typingDiv);
            scrollToBottom();
        }
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('aiTypingIndicator');
        if (indicator) indicator.remove();
    }

    function sendMessage(message) {
        if (!message || message.trim() === '' || isTyping) return;
        
        const cleanMsg = message.trim();
        addMessage(cleanMsg, 'user');
        
        if (elements.input) {
            elements.input.value = '';
        }
        
        showTypingIndicator();
        isTyping = true;
        
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBestResponse(cleanMsg);
            addMessage(response, 'bot');
            isTyping = false;
        }, 600);
    }

    function init() {
        // Attendre que le DOM soit prêt
        setTimeout(() => {
            elements = {
                toggle: document.getElementById('aiToggle'),
                chatWindow: document.getElementById('aiChatWindow'),
                close: document.getElementById('aiClose'),
                input: document.getElementById('aiInput'),
                send: document.getElementById('aiSend'),
                messages: document.getElementById('aiMessages')
            };
            
            if (!elements.toggle || !elements.chatWindow) {
                console.log('Assistant AI non trouvé dans le DOM');
                return;
            }
            
            // Mettre à jour la langue depuis localStorage
            const savedLang = localStorage.getItem('language');
            if (savedLang && (savedLang === 'ar' || savedLang === 'en' || savedLang === 'fr')) {
                currentLang = savedLang;
            }
            
            updateUILanguage();
            
            // Événements
            elements.toggle.addEventListener('click', () => {
                elements.chatWindow.classList.toggle('open');
                if (elements.chatWindow.classList.contains('open')) {
                    setTimeout(() => elements.input.focus(), 300);
                    scrollToBottom();
                }
            });
            
            if (elements.close) {
                elements.close.addEventListener('click', () => {
                    elements.chatWindow.classList.remove('open');
                });
            }
            
            if (elements.send) {
                elements.send.addEventListener('click', () => {
                    sendMessage(elements.input.value);
                });
            }
            
            if (elements.input) {
                elements.input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage(elements.input.value);
                    }
                });
            }
            
            // Suggestions
            const suggestionBtns = document.querySelectorAll('.ai-suggestion-btn');
            suggestionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const msg = btn.getAttribute('data-msg');
                    if (msg) sendMessage(msg);
                });
            });
            
            // Ouverture automatique
            setTimeout(() => {
                if (!localStorage.getItem('aiAssistantSeen')) {
                    elements.chatWindow.classList.add('open');
                    localStorage.setItem('aiAssistantSeen', 'true');
                    scrollToBottom();
                }
            }, 3000);
            
            console.log('Assistant AI initialisé - Langue:', currentLang);
        }, 500);
    }

    // Exporter les fonctions globalement
    window.aiAssistant = {
        updateLanguage: updateLanguage,
        sendMessage: sendMessage,
        getCurrentLang: () => currentLang
    };
    
    // Démarrer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
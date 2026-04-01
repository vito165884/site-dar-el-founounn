// ==================== ASSISTANT AI - DAR EL FOUNOUN ====================
// Fichier autonome - À inclure dans votre page HTML

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        apiUrl: 'ai_assistant.php', // URL de l'API (optionnel)
        useServer: false,           // Mettre à true si vous avez le backend PHP
        autoOpenDelay: 3000,        // Délai avant ouverture auto (ms)
        theme: {
            primary: '#e67e22',
            secondary: '#f39c12',
            dark: '#1a2a3a'
        }
    };

    // ==================== BASE DE CONNAISSANCES ====================
    const KNOWLEDGE_BASE = {
        // Salutations
        greeting: {
            patterns: ['bonjour', 'salut', 'hello', 'hi', 'coucou', 'hey', 'bonsoir'],
            response: "👋 Bonjour ! Je suis l'assistant virtuel de Dar El Founoun. Je peux vous aider à découvrir nos produits, obtenir des prix, faire un devis, ou répondre à vos questions. Comment puis-je vous aider ?"
        },
        
        // Produits
        products: {
            patterns: ['produit', 'catalogue', 'proposez', 'vendez', 'services', 'offrez', 'gamme'],
            response: "🎨 Dar El Founoun propose une large gamme de produits d'impression :\n\n📋 **Papeterie** : Cartes de visite, enveloppes, blocs notes, papier à en-tête\n📢 **Publicitaire** : Flyers, roll-ups, bâches, panneaux LED, goodies\n💎 **Luxe** : Catalogues, faire-parts, albums photo, emballages premium\n🖼️ **Art & Design** : Affiches, toiles d'art, posters, livres d'art\n\nQuel type de produit vous intéresse ?"
        },
        
        // Prix Cartes de visite
        priceCards: {
            patterns: ['carte de visite', 'cartes de visite', 'prix carte', 'tarif carte', 'carte visiteur'],
            response: "📇 **Cartes de visite premium**\n\n• Papier luxe 350g\n• Finition mate ou brillante au choix\n• Impression recto-verso incluse\n• Vernis sélectif disponible\n• Dès **50 DT** pour 100 cartes\n\nPour un devis personnalisé, précisez la quantité et les finitions souhaitées !"
        },
        
        // Prix Flyers
        priceFlyers: {
            patterns: ['flyer', 'flyers', 'dépliant', 'prospectus', 'tract'],
            response: "📄 **Flyers publicitaires**\n\n• Format A5 (148x210mm)\n• Papier couché 135g à 300g\n• Impression recto ou recto-verso\n• Vernis sélectif en option\n• Dès **80 DT** pour 1000 exemplaires\n\nQuantité plus importante = meilleur prix !"
        },
        
        // Prix Roll-up
        priceRollup: {
            patterns: ['roll-up', 'rollup', 'stand', 'bannière', 'kakemono'],
            response: "🎪 **Roll-up professionnel**\n\n• Format 85x200cm\n• Structure aluminium robuste\n• Sacoche de transport incluse\n• Impression haute qualité\n• Montage facile en 2 minutes\n• Dès **120 DT**\n\nIdéal pour les salons et événements professionnels !"
        },
        
        // Prix Toiles
        priceCanvas: {
            patterns: ['toile', 'tableau', 'toiles', 'art mural'],
            response: "🖼️ **Toiles d'art**\n\n• Impression directe sur toile premium\n• Châssis bois tendu\n• Vernis de protection UV\n• Plusieurs formats disponibles\n• Dès **65 DT**\n\nParfait pour la décoration intérieure ou les cadeaux d'exception !"
        },
        
        // Prix Faire-part
        priceWedding: {
            patterns: ['faire-part', 'faire part', 'mariage', 'invitation mariage', 'faire-part mariage'],
            response: "💍 **Faire-part de mariage**\n\n• Découpe laser personnalisée\n• Papier texturé haut de gamme\n• Ruban satin assorti\n• Enveloppe personnalisée\n• Dès **3 DT** par pièce (minimum 50)\n\nCréez des souvenirs uniques pour votre grand jour !"
        },
        
        // Délais
        delivery: {
            patterns: ['délai', 'delai', 'livraison', 'temps', 'dure', 'quand', 'prêt'],
            response: "⏱️ **Délais de production**\n\n• Standard : **3 à 7 jours ouvrés**\n• Grandes quantités : **10 à 14 jours**\n• Express : **48h** (selon disponibilité)\n\nLes délais peuvent varier selon le produit, la quantité et les finitions. Contactez-nous pour un délai précis !"
        },
        
        // Contact
        contact: {
            patterns: ['contact', 'joindre', 'téléphone', 'email', 'adresse', 'coordonnées', 'localisation'],
            response: "📞 **Nos coordonnées**\n\n📍 **Adresse** : 12 Rue de la Liberté, Centre Urbain Nord, Tunis, Tunisie\n\n📱 **Téléphone** : +216 71 123 456 / +216 98 765 432\n\n✉️ **Email** : contact@darelfounoun.tn / commercial@darelfounoun.tn\n\n🕐 **Horaires** :\n• Lundi-Vendredi : 8h30 - 18h00\n• Samedi : 9h00 - 13h00\n\nN'hésitez pas à nous contacter !"
        },
        
        // Devis
        quote: {
            patterns: ['devis', 'devi', 'estimation', 'devis gratuit', 'devis personnalisé', 'prix'],
            response: "📋 **Demande de devis personnalisé**\n\nPour obtenir un devis, merci de nous préciser :\n\n1️⃣ Type de produit souhaité\n2️⃣ Quantité approximative\n3️⃣ Format / dimensions\n4️⃣ Finitions souhaitées\n5️⃣ Date de livraison souhaitée\n\nVous pouvez :\n• Remplir le formulaire de contact sur notre site\n• Nous appeler au +216 71 123 456\n• Nous envoyer un email\n\nSouhaitez-vous que je vous aide à préparer votre demande ?"
        },
        
        // Commande
        order: {
            patterns: ['commander', 'acheter', 'commande', 'achat', 'passer commande'],
            response: "🛒 **Passer commande**\n\nPour passer commande, plusieurs options :\n\n✅ Remplir le formulaire de contact sur notre site\n✅ Nous appeler au +216 71 123 456\n✅ Envoyer un email à commercial@darelfounoun.tn\n\nPrécisez votre projet (type de produit, quantité, finitions) pour un traitement plus rapide !\n\nNous vous enverrons un devis sous 24-48h."
        },
        
        // Papeterie
        stationery: {
            patterns: ['papeterie', 'papier', 'en-tête', 'enveloppe', 'carnet', 'bloc note'],
            response: "📋 **Gamme Papeterie**\n\n• **Cartes de visite** : dès 50 DT/100\n• **Enveloppes** : dès 40 DT/100\n• **Blocs notes** : dès 15 DT\n• **Papier à en-tête** : dès 30 DT/500\n• **Carnets Moleskine** : dès 25 DT\n• **Chemises cartonnées** : dès 45 DT/100\n\nQuel produit vous intéresse ?"
        },
        
        // Publicitaire
        advertising: {
            patterns: ['publicitaire', 'flyer', 'roll-up', 'bâche', 'panneau', 'goodies'],
            response: "📢 **Gamme Publicitaire**\n\n• **Flyers** : dès 80 DT/1000\n• **Roll-up** : dès 120 DT\n• **Bâches** : dès 25 DT/m²\n• **Panneaux LED** : sur devis\n• **Goodies** : dès 5 DT (mugs, stylos, porte-clés)\n• **Calendriers** : dès 45 DT/50\n\nParfait pour vos campagnes marketing !"
        },
        
        // Luxe
        luxury: {
            patterns: ['luxe', 'premium', 'haut de gamme', 'catalogue luxe', 'album photo'],
            response: "💎 **Gamme Luxe**\n\n• **Catalogues de luxe** : reliure cousue, papier texturé\n• **Faire-part mariage** : dès 3 DT/pièce\n• **Albums photo premium** : dès 85 DT\n• **Diplômes certificats** : dès 15 DT\n• **Emballages luxe** : dès 8 DT\n\nDes finitions exceptionnelles pour vos projets prestigieux !"
        },
        
        // Art
        art: {
            patterns: ['art', 'artistique', 'affiche', 'poster', 'toile', 'portfolio'],
            response: "🖼️ **Gamme Art & Design**\n\n• **Affiches artistiques** : dès 35 DT\n• **Toiles d'art** : dès 65 DT\n• **Posters d'art** : dès 25 DT\n• **Portfolios artistes** : dès 55 DT\n• **Livres d'art** : sur devis\n\nIdéal pour les artistes, photographes et amateurs d'art !"
        },
        
        // Remerciement
        thanks: {
            patterns: ['merci', 'thanks', 'thank', 'super', 'génial', 'cool'],
            response: "🙏 Merci beaucoup ! N'hésitez pas si vous avez d'autres questions. Nous sommes ravis de pouvoir vous aider. Passez une excellente journée ! ✨"
        },
        
        // Au revoir
        goodbye: {
            patterns: ['au revoir', 'bye', 'adieu', 'à plus', 'ciao'],
            response: "👋 Au revoir ! Merci d'avoir visité Dar El Founoun. N'hésitez pas à revenir si vous avez d'autres questions. À bientôt !"
        }
    };

    // Réponse par défaut
    const DEFAULT_RESPONSE = "🤔 Je n'ai pas bien compris votre demande. Voici ce que je peux faire pour vous :\n\n• Vous renseigner sur nos produits\n• Vous donner les prix et délais\n• Vous aider à obtenir un devis\n• Vous donner nos coordonnées\n\nPosez-moi une question comme :\n- \"Quels sont vos produits ?\"\n- \"Prix des cartes de visite\"\n- \"Délais de livraison\"\n- \"Demander un devis\"\n- \"Coordonnées\"\n\nComment puis-je vous aider ?";

    // ==================== FONCTIONS UTILITAIRES ====================
    
    // Nettoyer le texte
    function cleanText(text) {
        return text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    
    // Trouver la meilleure réponse
    function getBestResponse(message) {
        const cleanMessage = cleanText(message);
        
        for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
            for (const pattern of data.patterns) {
                if (cleanMessage.includes(cleanText(pattern))) {
                    return data.response;
                }
            }
        }
        
        return DEFAULT_RESPONSE;
    }
    
    // ==================== CRÉATION DE L'INTERFACE ====================
    
    // Créer le HTML de l'assistant
    function createAssistantHTML() {
        const html = `
            <div class="ai-assistant" id="aiAssistant">
                <div class="ai-toggle" id="aiToggle">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-chat-window" id="aiChatWindow">
                    <div class="ai-chat-header">
                        <h3>
                            <i class="fas fa-robot"></i>
                            Assistant Dar El Founoun
                        </h3>
                        <button class="ai-close" id="aiClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="ai-chat-messages" id="aiMessages">
                        <div class="ai-message bot">
                            <div class="ai-message-content">
                                👋 Bonjour ! Je suis l'assistant virtuel de <strong>Dar El Founoun</strong>.<br><br>
                                Je peux vous aider à :<br>
                                • Découvrir nos produits d'impression<br>
                                • Obtenir des prix et délais<br>
                                • Faire une demande de devis<br>
                                • Répondre à vos questions<br><br>
                                <strong>Comment puis-je vous aider aujourd'hui ?</strong>
                            </div>
                        </div>
                    </div>
                    <div class="ai-suggestions" id="aiSuggestions">
                        <button class="ai-suggestion-btn" data-msg="Quels sont vos produits ?">📋 Nos produits</button>
                        <button class="ai-suggestion-btn" data-msg="Prix des cartes de visite">💰 Cartes de visite</button>
                        <button class="ai-suggestion-btn" data-msg="Demander un devis">📄 Demander un devis</button>
                        <button class="ai-suggestion-btn" data-msg="Délais de livraison">⏱️ Délais</button>
                        <button class="ai-suggestion-btn" data-msg="Coordonnées">📍 Contact</button>
                        <button class="ai-suggestion-btn" data-msg="Toiles d'art">🖼️ Toiles d'art</button>
                    </div>
                    <div class="ai-chat-input">
                        <input type="text" id="aiInput" placeholder="Écrivez votre message..." autocomplete="off">
                        <button id="aiSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter les styles
        const styles = `
            <style>
                .ai-assistant {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                }

                .ai-toggle {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #e67e22, #f39c12);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 10px 25px rgba(230,126,34,0.3);
                    transition: all 0.3s ease;
                    animation: aiPulse 2s infinite;
                }

                @keyframes aiPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .ai-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 15px 35px rgba(230,126,34,0.4);
                }

                .ai-toggle i {
                    font-size: 28px;
                    color: white;
                }

                .ai-chat-window {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    width: 380px;
                    height: 550px;
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transform: scale(0);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    transform-origin: bottom right;
                    z-index: 9998;
                }

                .ai-chat-window.open {
                    transform: scale(1);
                    opacity: 1;
                }

                .ai-chat-header {
                    background: linear-gradient(135deg, #1a2a3a, #0f1a24);
                    color: white;
                    padding: 1rem 1.25rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .ai-chat-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .ai-chat-header h3 i {
                    color: #e67e22;
                }

                .ai-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 5px;
                    transition: 0.3s;
                }

                .ai-close:hover {
                    transform: rotate(90deg);
                }

                .ai-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    background: #f8fafc;
                }

                .ai-message {
                    margin-bottom: 1rem;
                    display: flex;
                    animation: aiMessageSlide 0.3s ease;
                }

                @keyframes aiMessageSlide {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .ai-message.user {
                    justify-content: flex-end;
                }

                .ai-message.bot {
                    justify-content: flex-start;
                }

                .ai-message-content {
                    max-width: 85%;
                    padding: 0.75rem 1rem;
                    border-radius: 18px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    white-space: pre-line;
                }

                .ai-message.user .ai-message-content {
                    background: linear-gradient(135deg, #e67e22, #f39c12);
                    color: white;
                    border-bottom-right-radius: 4px;
                }

                .ai-message.bot .ai-message-content {
                    background: white;
                    color: #1e293b;
                    border-bottom-left-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    border: 1px solid #e2e8f0;
                }

                .ai-typing {
                    display: flex;
                    gap: 4px;
                    padding: 0.75rem 1rem;
                    background: white;
                    border-radius: 18px;
                    width: fit-content;
                    border: 1px solid #e2e8f0;
                }

                .ai-typing span {
                    width: 8px;
                    height: 8px;
                    background: #e67e22;
                    border-radius: 50%;
                    animation: aiTyping 1.4s infinite ease;
                }

                .ai-typing span:nth-child(1) { animation-delay: 0s; }
                .ai-typing span:nth-child(2) { animation-delay: 0.2s; }
                .ai-typing span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes aiTyping {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-8px); opacity: 1; }
                }

                .ai-chat-input {
                    padding: 1rem;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 0.5rem;
                }

                .ai-chat-input input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 50px;
                    outline: none;
                    font-family: inherit;
                    transition: 0.3s;
                }

                .ai-chat-input input:focus {
                    border-color: #e67e22;
                }

                .ai-chat-input button {
                    padding: 0.75rem 1.25rem;
                    background: linear-gradient(135deg, #e67e22, #f39c12);
                    border: none;
                    border-radius: 50px;
                    color: white;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .ai-chat-input button:hover {
                    transform: translateY(-2px);
                }

                .ai-suggestions {
                    padding: 0.75rem;
                    background: #f1f5f9;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    border-top: 1px solid #e2e8f0;
                }

                .ai-suggestion-btn {
                    padding: 0.4rem 0.8rem;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: 0.3s;
                    font-family: inherit;
                }

                .ai-suggestion-btn:hover {
                    background: #e67e22;
                    color: white;
                    border-color: #e67e22;
                }

                @media (max-width: 480px) {
                    .ai-chat-window {
                        width: calc(100vw - 40px);
                        right: 20px;
                        bottom: 80px;
                        height: 500px;
                    }
                    
                    .ai-assistant {
                        right: 20px;
                        bottom: 20px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.insertAdjacentHTML('beforeend', html);
    }
    
    // ==================== GESTION DU CHAT ====================
    
    let isTyping = false;
    let elements = {};
    
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
        
        // Simuler un délai de réponse
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBestResponse(cleanMsg);
            addMessage(response, 'bot');
            isTyping = false;
        }, 500);
    }
    
    // ==================== INITIALISATION ====================
    
    function init() {
        createAssistantHTML();
        
        // Récupérer les éléments
        elements = {
            toggle: document.getElementById('aiToggle'),
            chatWindow: document.getElementById('aiChatWindow'),
            close: document.getElementById('aiClose'),
            input: document.getElementById('aiInput'),
            send: document.getElementById('aiSend'),
            messages: document.getElementById('aiMessages')
        };
        
        // Vérifier que tous les éléments existent
        if (!elements.toggle || !elements.chatWindow || !elements.close || 
            !elements.input || !elements.send || !elements.messages) {
            console.error('Erreur: Éléments de l\'assistant non trouvés');
            return;
        }
        
        // Événements
        elements.toggle.addEventListener('click', () => {
            elements.chatWindow.classList.toggle('open');
            if (elements.chatWindow.classList.contains('open')) {
                setTimeout(() => elements.input.focus(), 300);
                scrollToBottom();
            }
        });
        
        elements.close.addEventListener('click', () => {
            elements.chatWindow.classList.remove('open');
        });
        
        elements.send.addEventListener('click', () => {
            sendMessage(elements.input.value);
        });
        
        elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage(elements.input.value);
            }
        });
        
        // Suggestions
        const suggestionBtns = document.querySelectorAll('.ai-suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const msg = btn.getAttribute('data-msg');
                if (msg) sendMessage(msg);
            });
        });
        
        // Ouverture automatique pour les nouveaux visiteurs
        setTimeout(() => {
            if (!localStorage.getItem('aiAssistantSeen')) {
                elements.chatWindow.classList.add('open');
                localStorage.setItem('aiAssistantSeen', 'true');
                scrollToBottom();
            }
        }, CONFIG.autoOpenDelay);
        
        console.log('Assistant AI Dar El Founoun - Initialisé avec succès');
    }
    
    // Démarrer quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

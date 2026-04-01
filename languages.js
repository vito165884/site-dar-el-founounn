// js/languages.js - Fichier de traductions
const translations = {
    fr: {
        // Navigation
        nav_home: "Accueil",
        nav_products: "Produits",
        nav_contact: "Contact",
        nav_quote: "Devis",
        
        // Hero section
        hero_badge: "✨ Excellence depuis 1995",
        hero_title: "Dar El",
        hero_title_gradient: "Founoun",
        hero_subtitle: "L'élégance de l'impression, la beauté de l'art",
        hero_description: "Découvrez notre collection exclusive de produits d'impression haut de gamme",
        hero_btn_products: "Découvrir nos produits",
        hero_btn_contact: "Nous contacter",
        hero_scroll: "Défiler",
        
        // Section produits
        products_tag: "Notre Catalogue",
        products_title: "Nos Produits",
        products_title_highlight: "d'Exception",
        products_subtitle: "Des créations uniques pour tous vos besoins d'impression",
        
        // Filtres
        filter_all: "Tous",
        filter_stationery: "Papeterie",
        filter_advertising: "Publicitaire",
        filter_luxury: "Luxe",
        filter_art: "Art & Design",
        
        // Produits
        product_details: "En savoir plus",
        product_price_from: "Dès",
        
        // Stats
        stats_clients: "Clients satisfaits",
        stats_projects: "Projets réalisés",
        stats_years: "Années d'expertise",
        stats_partners: "Partenaires",
        
        // Contact
        contact_tag: "Contactez-nous",
        contact_title: "Parlons de",
        contact_title_highlight: "votre projet",
        contact_description: "Notre équipe est à votre écoute pour tous vos besoins d'impression.",
        contact_address: "Adresse",
        contact_phone: "Téléphone",
        contact_email: "Email",
        contact_hours: "Horaires",
        contact_form_name: "Nom complet",
        contact_form_email: "Email",
        contact_form_phone: "Téléphone",
        contact_form_subject: "Sujet",
        contact_form_message: "Votre message",
        contact_form_submit: "Envoyer le message",
        contact_form_quote: "Demande de devis",
        contact_form_info: "Demande d'information",
        contact_form_appointment: "Prise de rendez-vous",
        contact_form_other: "Autre",
        
        // Footer
        footer_about: "Votre partenaire privilégié pour tous vos besoins d'impression depuis 1995.",
        footer_quick_links: "Liens rapides",
        footer_newsletter: "Newsletter",
        footer_newsletter_placeholder: "Votre email",
        footer_newsletter_btn: "S'abonner",
        footer_copyright: "Tous droits réservés",
        
        // Assistant AI
        ai_welcome: "Bonjour ! Je suis l'assistant de Dar El Founoun",
        ai_help: "Comment puis-je vous aider ?",
        ai_products: "📋 Produits",
        ai_prices: "💰 Prix",
        ai_quote: "📄 Devis",
        ai_deadlines: "⏱️ Délais",
        ai_contact: "📍 Contact",
        
        // Messages
        msg_success: "Message envoyé avec succès !",
        msg_error: "Une erreur est survenue",
        msg_newsletter_success: "Inscription réussie !",
        msg_email_invalid: "Email invalide",
        msg_fields_required: "Tous les champs sont requis",
        
        // Quiz
        quiz_title: "Trouvez votre produit idéal",
        quiz_question_1: "Quel est votre besoin principal ?",
        quiz_question_2: "Quelle quantité vous intéresse ?",
        quiz_question_3: "Quel est votre budget ?",
        quiz_option_business: "Communication d'entreprise",
        quiz_option_event: "Événement / Mariage",
        quiz_option_art: "Art / Décoration",
        quiz_option_marketing: "Marketing / Publicité",
        quiz_option_small: "Petite quantité (<100)",
        quiz_option_medium: "Moyenne quantité (100-1000)",
        quiz_option_large: "Grande quantité (>1000)",
        quiz_option_low: "Moins de 500 DT",
        quiz_option_medium_budget: "500 - 2000 DT",
        quiz_option_high: "Plus de 2000 DT",
        quiz_prev: "Précédent",
        quiz_next: "Suivant",
        quiz_result: "Résultat",
        
        // Loyalty
        loyalty_title: "Programme Fidélité",
        loyalty_points: "points",
        loyalty_next_level: "Encore {points} points pour le prochain palier",
        loyalty_rewards: "Récompenses disponibles",
        
        // Notifications
        notification_copied: "Copié dans le presse-papier !",
        notification_added_to_cart: "Ajouté au panier",
        notification_quote_sent: "Demande de devis envoyée"
    },
    
    ar: {
        // Navigation
        nav_home: "الرئيسية",
        nav_products: "المنتجات",
        nav_contact: "اتصل بنا",
        nav_quote: "طلب عرض سعر",
        
        // Hero section
        hero_badge: "✨ التميز منذ 1995",
        hero_title: "دار",
        hero_title_gradient: "الفنون",
        hero_subtitle: "أناقة الطباعة، جمال الفن",
        hero_description: "اكتشف مجموعتنا الحصرية من منتجات الطباعة الفاخرة",
        hero_btn_products: "اكتشف منتجاتنا",
        hero_btn_contact: "اتصل بنا",
        hero_scroll: "مرر لأسفل",
        
        // Section produits
        products_tag: "كتالوجنا",
        products_title: "منتجاتنا",
        products_title_highlight: "الاستثنائية",
        products_subtitle: "إبداعات فريدة لجميع احتياجات الطباعة الخاصة بك",
        
        // Filtres
        filter_all: "الكل",
        filter_stationery: "القرطاسية",
        filter_advertising: "الإعلانات",
        filter_luxury: "الفخامة",
        filter_art: "الفن والتصميم",
        
        // Produits
        product_details: "اعرف المزيد",
        product_price_from: "ابتداء من",
        
        // Stats
        stats_clients: "عملاء راضون",
        stats_projects: "مشاريع منجزة",
        stats_years: "سنوات من الخبرة",
        stats_partners: "شركاء",
        
        // Contact
        contact_tag: "اتصل بنا",
        contact_title: "تحدث عن",
        contact_title_highlight: "مشروعك",
        contact_description: "فريقنا في انتظاركم لتلبية جميع احتياجات الطباعة الخاصة بكم.",
        contact_address: "العنوان",
        contact_phone: "الهاتف",
        contact_email: "البريد الإلكتروني",
        contact_hours: "ساعات العمل",
        contact_form_name: "الاسم الكامل",
        contact_form_email: "البريد الإلكتروني",
        contact_form_phone: "الهاتف",
        contact_form_subject: "الموضوع",
        contact_form_message: "رسالتك",
        contact_form_submit: "إرسال الرسالة",
        contact_form_quote: "طلب عرض سعر",
        contact_form_info: "طلب معلومات",
        contact_form_appointment: "تحديد موعد",
        contact_form_other: "أخرى",
        
        // Footer
        footer_about: "شريككم المفضل لجميع احتياجات الطباعة منذ 1995.",
        footer_quick_links: "روابط سريعة",
        footer_newsletter: "النشرة البريدية",
        footer_newsletter_placeholder: "بريدك الإلكتروني",
        footer_newsletter_btn: "اشتراك",
        footer_copyright: "جميع الحقوق محفوظة",
        
        // Assistant AI
        ai_welcome: "مرحباً! أنا مساعد دار الفنون",
        ai_help: "كيف يمكنني مساعدتك؟",
        ai_products: "📋 المنتجات",
        ai_prices: "💰 الأسعار",
        ai_quote: "📄 عرض سعر",
        ai_deadlines: "⏱️ المواعيد",
        ai_contact: "📍 اتصل بنا",
        
        // Messages
        msg_success: "تم إرسال الرسالة بنجاح!",
        msg_error: "حدث خطأ",
        msg_newsletter_success: "تم الاشتراك بنجاح!",
        msg_email_invalid: "بريد إلكتروني غير صالح",
        msg_fields_required: "جميع الحقول مطلوبة",
        
        // Quiz
        quiz_title: "ابحث عن منتجك المثالي",
        quiz_question_1: "ما هي حاجتك الرئيسية؟",
        quiz_question_2: "ما هي الكمية التي تهمك؟",
        quiz_question_3: "ما هي ميزانيتك؟",
        quiz_option_business: "اتصالات الشركات",
        quiz_option_event: "مناسبات / زفاف",
        quiz_option_art: "فن / ديكور",
        quiz_option_marketing: "تسويق / إعلانات",
        quiz_option_small: "كمية صغيرة (<100)",
        quiz_option_medium: "كمية متوسطة (100-1000)",
        quiz_option_large: "كمية كبيرة (>1000)",
        quiz_option_low: "أقل من 500 دينار",
        quiz_option_medium_budget: "500 - 2000 دينار",
        quiz_option_high: "أكثر من 2000 دينار",
        quiz_prev: "السابق",
        quiz_next: "التالي",
        quiz_result: "النتيجة",
        
        // Loyalty
        loyalty_title: "برنامج الولاء",
        loyalty_points: "نقطة",
        loyalty_next_level: "تبقى {points} نقطة للمستوى التالي",
        loyalty_rewards: "المكافآت المتاحة",
        
        // Notifications
        notification_copied: "تم النسخ!",
        notification_added_to_cart: "تمت الإضافة إلى السلة",
        notification_quote_sent: "تم إرسال طلب عرض السعر"
    },
    
    en: {
        // Navigation
        nav_home: "Home",
        nav_products: "Products",
        nav_contact: "Contact",
        nav_quote: "Quote",
        
        // Hero section
        hero_badge: "✨ Excellence since 1995",
        hero_title: "Dar El",
        hero_title_gradient: "Founoun",
        hero_subtitle: "The elegance of printing, the beauty of art",
        hero_description: "Discover our exclusive collection of premium printing products",
        hero_btn_products: "Discover our products",
        hero_btn_contact: "Contact us",
        hero_scroll: "Scroll",
        
        // Section produits
        products_tag: "Our Catalog",
        products_title: "Our",
        products_title_highlight: "Exceptional Products",
        products_subtitle: "Unique creations for all your printing needs",
        
        // Filtres
        filter_all: "All",
        filter_stationery: "Stationery",
        filter_advertising: "Advertising",
        filter_luxury: "Luxury",
        filter_art: "Art & Design",
        
        // Produits
        product_details: "Learn more",
        product_price_from: "From",
        
        // Stats
        stats_clients: "Happy Clients",
        stats_projects: "Projects Completed",
        stats_years: "Years of Expertise",
        stats_partners: "Partners",
        
        // Contact
        contact_tag: "Contact Us",
        contact_title: "Let's Talk About",
        contact_title_highlight: "Your Project",
        contact_description: "Our team is here for all your printing needs.",
        contact_address: "Address",
        contact_phone: "Phone",
        contact_email: "Email",
        contact_hours: "Hours",
        contact_form_name: "Full Name",
        contact_form_email: "Email",
        contact_form_phone: "Phone",
        contact_form_subject: "Subject",
        contact_form_message: "Your Message",
        contact_form_submit: "Send Message",
        contact_form_quote: "Quote Request",
        contact_form_info: "Information Request",
        contact_form_appointment: "Appointment",
        contact_form_other: "Other",
        
        // Footer
        footer_about: "Your trusted partner for all your printing needs since 1995.",
        footer_quick_links: "Quick Links",
        footer_newsletter: "Newsletter",
        footer_newsletter_placeholder: "Your email",
        footer_newsletter_btn: "Subscribe",
        footer_copyright: "All rights reserved",
        
        // Assistant AI
        ai_welcome: "Hello! I'm Dar El Founoun's assistant",
        ai_help: "How can I help you?",
        ai_products: "📋 Products",
        ai_prices: "💰 Prices",
        ai_quote: "📄 Quote",
        ai_deadlines: "⏱️ Deadlines",
        ai_contact: "📍 Contact",
        
        // Messages
        msg_success: "Message sent successfully!",
        msg_error: "An error occurred",
        msg_newsletter_success: "Subscription successful!",
        msg_email_invalid: "Invalid email",
        msg_fields_required: "All fields are required",
        
        // Quiz
        quiz_title: "Find Your Ideal Product",
        quiz_question_1: "What is your main need?",
        quiz_question_2: "What quantity interests you?",
        quiz_question_3: "What is your budget?",
        quiz_option_business: "Business Communication",
        quiz_option_event: "Event / Wedding",
        quiz_option_art: "Art / Decoration",
        quiz_option_marketing: "Marketing / Advertising",
        quiz_option_small: "Small quantity (<100)",
        quiz_option_medium: "Medium quantity (100-1000)",
        quiz_option_large: "Large quantity (>1000)",
        quiz_option_low: "Less than 500 DT",
        quiz_option_medium_budget: "500 - 2000 DT",
        quiz_option_high: "More than 2000 DT",
        quiz_prev: "Previous",
        quiz_next: "Next",
        quiz_result: "Result",
        
        // Loyalty
        loyalty_title: "Loyalty Program",
        loyalty_points: "points",
        loyalty_next_level: "{points} more points to next level",
        loyalty_rewards: "Available Rewards",
        
        // Notifications
        notification_copied: "Copied to clipboard!",
        notification_added_to_cart: "Added to cart",
        notification_quote_sent: "Quote request sent"
    }
};

// Exporter pour utilisation globale
window.translations = translations;
window.currentLanguage = localStorage.getItem('language') || 'fr';
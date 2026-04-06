<script>
// ========== NOTIFICATION NEWSLETTER PERSO ==========
(function() {
    // Attendre que le formulaire newsletter existe
    setTimeout(() => {
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            // Sauvegarder l'ancien submit
            const originalSubmit = newsletterForm.submit;
            
            // Ajouter notre notification sans casser l'existant
            newsletterForm.addEventListener('submit', function(e) {
                // Attendre un peu que le message s'affiche
                setTimeout(() => {
                    const msgDiv = document.getElementById('newsletterMessage');
                    if (msgDiv && msgDiv.textContent.includes('succès') || msgDiv.textContent.includes('réussie') || msgDiv.textContent.includes('envoyé')) {
                        showCustomNotif('Email envoyé via Formspree | Données enregistrées en base');
                    }
                }, 500);
            });
        }
        
        function showCustomNotif(message) {
            // Supprimer ancienne notif
            const old = document.getElementById('customNotif');
            if (old) old.remove();
            
            // Créer notif
            const notif = document.createElement('div');
            notif.id = 'customNotif';
            notif.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 20px;
                    background: #10b981;
                    color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    min-width: 350px;
                ">
                    <i class="fas fa-check-circle" style="font-size: 18px;"></i>
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        margin-left: auto;
                        padding: 0 5px;
                        opacity: 0.7;
                    ">&times;</button>
                </div>
            `;
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(notif);
            
            setTimeout(() => notif.remove(), 4000);
        }
        
        // Ajouter l'animation si pas présente
        if (!document.getElementById('notifStyle')) {
            const style = document.createElement('style');
            style.id = 'notifStyle';
            style.textContent = `
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }, 1000);
})();
</script>
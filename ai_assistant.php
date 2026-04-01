<?php
// ai_assistant.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuration de la base de données
$host = 'localhost';
$dbname = 'dar_el_founoun';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Si la base de données n'existe pas, on la crée
    createDatabase();
}

function createDatabase() {
    global $host, $dbname, $username, $password;
    try {
        $pdo = new PDO("mysql:host=$host", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Créer la base de données
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8 COLLATE utf8_general_ci");
        $pdo->exec("USE `$dbname`");
        
        // Créer la table pour les conversations
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `ai_conversations` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `session_id` VARCHAR(100) NOT NULL,
                `user_message` TEXT,
                `bot_response` TEXT,
                `intent` VARCHAR(50),
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX `session_id` (`session_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ");
        
        // Créer la table pour les feedbacks
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `ai_feedback` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `session_id` VARCHAR(100) NOT NULL,
                `message_id` INT,
                `rating` TINYINT,
                `feedback_text` TEXT,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8
        ");
        
    } catch(PDOException $e) {
        // Gérer l'erreur silencieusement
    }
}

// Récupérer la session ID
session_start();
if (!isset($_SESSION['ai_session_id'])) {
    $_SESSION['ai_session_id'] = session_id() . '_' . time();
}
$sessionId = $_SESSION['ai_session_id'];

// Données des produits pour l'assistant
$productsData = [
    'papeterie' => [
        'Cartes de Visite Premium' => ['price' => 'Dès 50 DT', 'desc' => 'Papier luxe 350g, finition mate ou brillante, impression recto-verso, vernis sélectif'],
        'Enveloppes Personnalisées' => ['price' => 'Dès 40 DT/100', 'desc' => 'Plusieurs formats, personnalisation avec logo'],
        'Blocs Notes' => ['price' => 'Dès 15 DT', 'desc' => 'Papier recyclé, couverture cartonnée, personnalisation disponible'],
        'Papier à En-tête' => ['price' => 'Dès 30 DT/500', 'desc' => 'Papier professionnel avec en-tête personnalisé'],
        'Carnets Moleskine' => ['price' => 'Dès 25 DT', 'desc' => 'Carnets haut de gamme, couverture rigide, élastique de fermeture']
    ],
    'publicitaire' => [
        'Flyers Publicitaires' => ['price' => 'Dès 80 DT/1000', 'desc' => 'Format A5, papier couché 135g, idéal pour campagnes marketing'],
        'Roll-up Professionnel' => ['price' => 'Dès 120 DT', 'desc' => 'Stand d\'exposition avec sacoche, idéal pour salons'],
        'Bâches Publicitaires' => ['price' => 'Dès 25 DT/m²', 'desc' => 'Grand format, œillets renforcés, résistantes aux intempéries'],
        'Panneaux LED' => ['price' => 'Sur devis', 'desc' => 'Éclairage intégré, sur-mesure, visibilité maximale'],
        'Goodies Personnalisés' => ['price' => 'Dès 5 DT', 'desc' => 'Mugs, stylos, porte-clés personnalisables']
    ],
    'luxe' => [
        'Catalogue de Luxe' => ['price' => 'Sur devis', 'desc' => 'Reliure cousue, papier texturé, finition haut de gamme'],
        'Faire-part Mariage' => ['price' => 'Dès 3 DT/pièce', 'desc' => 'Découpe laser, ruban satin, personnalisation complète'],
        'Albums Photo Premium' => ['price' => 'Dès 85 DT', 'desc' => 'Couverture cuir, dorure, albums haut de gamme'],
        'Emballages Luxe' => ['price' => 'Dès 8 DT', 'desc' => 'Boîtes sur-mesure, rubans, emballages premium']
    ],
    'art' => [
        'Affiches Artistiques' => ['price' => 'Dès 35 DT', 'desc' => 'Grand format, impression UV sur support rigide'],
        'Toiles d\'Art' => ['price' => 'Dès 65 DT', 'desc' => 'Impression sur toile, châssis bois, reproductions d\'œuvres'],
        'Posters d\'Art' => ['price' => 'Dès 25 DT', 'desc' => 'Papier d\'art 250g, finition mate pour décoration'],
        'Livres d\'Art' => ['price' => 'Sur devis', 'desc' => 'Impression fine art, reliure luxe']
    ]
];

// Fonction de traitement du message
function processMessage($message, $productsData, $pdo, $sessionId) {
    $message = strtolower(trim($message));
    $response = '';
    $intent = 'general';
    
    // Détection de l'intention
    $intents = [
        'bonjour' => ['bonjour', 'salut', 'hello', 'hi', 'coucou', 'hey'],
        'prix' => ['prix', 'coût', 'tarif', 'combien', 'coûte', 'tarifs', 'prix'],
        'delai' => ['délai', 'livraison', 'temps', 'délais', 'quand', 'dure'],
        'contact' => ['contact', 'joindre', 'téléphone', 'email', 'adresse', 'coordonnées'],
        'produit' => ['produit', 'catalogue', 'proposez', 'vendez', 'services', 'offrez'],
        'commande' => ['commander', 'acheter', 'commande', 'achat', 'passer commande'],
        'devis' => ['devis', 'devi', 'devis gratuit', 'estimation', 'devis personnalisé'],
        'carte' => ['carte de visite', 'cartes', 'visite'],
        'flyer' => ['flyer', 'flyers', 'dépliant', 'prospectus'],
        'rollup' => ['roll-up', 'rollup', 'stand', 'exposition'],
        'fairepart' => ['faire-part', 'mariage', 'faire part', 'invitation'],
        'toile' => ['toile', 'tableau', 'art', 'artistique'],
        'papeterie' => ['papeterie', 'papier', 'en-tête', 'enveloppe', 'carnet', 'bloc'],
        'remerciement' => ['merci', 'thanks', 'thank', 'super', 'génial']
    ];
    
    // Détecter l'intention
    foreach ($intents as $intentName => $keywords) {
        foreach ($keywords as $keyword) {
            if (strpos($message, $keyword) !== false) {
                $intent = $intentName;
                break 2;
            }
        }
    }
    
    // Générer la réponse selon l'intention
    switch ($intent) {
        case 'bonjour':
            $response = "👋 Bonjour ! Je suis l'assistant virtuel de Dar El Founoun. Je peux vous renseigner sur nos produits d'impression, vous aider à obtenir un devis, ou répondre à vos questions. Comment puis-je vous aider aujourd'hui ?";
            break;
            
        case 'prix':
            if (strpos($message, 'carte') !== false || strpos($message, 'visite') !== false) {
                $response = "📇 Les cartes de visite premium commencent à partir de 50 DT pour 100 cartes (papier 350g, finition mate ou brillante). Pour un devis personnalisé, veuillez nous préciser vos besoins !";
            } elseif (strpos($message, 'flyer') !== false) {
                $response = "📄 Les flyers publicitaires sont à partir de 80 DT pour 1000 exemplaires (format A5, papier couché 135g). Quantité plus importante = meilleur prix !";
            } elseif (strpos($message, 'roll') !== false) {
                $response = "🎪 Les roll-ups professionnels sont à partir de 120 DT (avec sacoche de transport). Dimensions 85x200cm, impression haute qualité.";
            } else {
                $response = "💰 Nos prix varient selon le produit et la quantité. Voici quelques tarifs de base :\n• Cartes de visite : dès 50 DT\n• Flyers : dès 80 DT/1000\n• Roll-up : dès 120 DT\n• Toiles d'art : dès 65 DT\nPour un devis précis, décrivez-moi votre projet !";
            }
            break;
            
        case 'delai':
            $response = "⏱️ Nos délais de production sont généralement de 3 à 7 jours ouvrés selon le produit et la quantité. Pour les grandes quantités ou les finitions spéciales, comptez 10-14 jours. Nous proposons aussi des services express (48h) pour certains produits. Souhaitez-vous un délai pour un produit spécifique ?";
            break;
            
        case 'contact':
            $response = "📞 Voici nos coordonnées :\n📍 Adresse : 12 Rue de la Liberté, Centre Urbain Nord, Tunis\n📱 Téléphone : +216 71 123 456 / +216 98 765 432\n✉️ Email : contact@darelfounoun.tn\n🕐 Horaires : Lun-Ven 8h30-18h, Sam 9h-13h\nPuis-je vous aider à autre chose ?";
            break;
            
        case 'produit':
            $response = "🎨 Dar El Founoun propose une large gamme de produits d'impression :\n\n📋 Papeterie : Cartes de visite, enveloppes, blocs notes, papier à en-tête\n📢 Publicitaire : Flyers, roll-ups, bâches, panneaux LED, goodies\n💎 Luxe : Catalogues, faire-parts, albums photo, emballages premium\n🖼️ Art & Design : Affiches, toiles d'art, posters, livres d'art\n\nQuel type de produit vous intéresse ?";
            break;
            
        case 'commande':
            $response = "🛒 Pour passer commande, vous pouvez :\n1. Remplir le formulaire de contact sur notre site\n2. Nous appeler au +216 71 123 456\n3. Nous envoyer un email à commercial@darelfounoun.tn\n\nPrécisez votre projet (type de produit, quantité, finitions) pour un traitement plus rapide !";
            break;
            
        case 'devis':
            $response = "📋 Pour obtenir un devis personnalisé, merci de nous fournir :\n• Type de produit souhaité\n• Quantité approximative\n• Format / dimensions\n• Finitions souhaitées\n• Date de livraison souhaitée\n\nVous pouvez utiliser notre formulaire de contact en sélectionnant 'Demande de devis', ou me donner directement ces informations !";
            break;
            
        case 'carte':
            $response = "📇 Les cartes de visite Dar El Founoun :\n• Papier premium 350g\n• Finition mate ou brillante au choix\n• Impression recto-verso incluse\n• Vernis sélectif disponible\n• Dès 50 DT pour 100 cartes\n\nSouhaitez-vous un devis pour vos cartes de visite ?";
            break;
            
        case 'flyer':
            $response = "📄 Flyers publicitaires :\n• Format A5 (148x210mm) ou personnalisé\n• Papier couché 135g à 300g\n• Impression recto ou recto-verso\n• Vernis sélectif en option\n• Dès 80 DT pour 1000 exemplaires\n\nQuelle quantité vous intéresse ?";
            break;
            
        case 'rollup':
            $response = "🎪 Roll-up professionnel :\n• Format 85x200cm\n• Structure aluminium\n• Sacoche de transport incluse\n• Impression haute qualité\n• Dès 120 DT\n\nSouhaitez-vous une bâche publicitaire aussi ?";
            break;
            
        case 'fairepart':
            $response = "💍 Faire-part de mariage :\n• Découpe laser personnalisée\n• Papier texturé haut de gamme\n• Ruban satin assorti\n• Enveloppe personnalisée\n• Dès 3 DT par pièce (min 50)\n\nSouhaitez-vous voir quelques modèles ?";
            break;
            
        case 'toile':
            $response = "🖼️ Toiles d'art :\n• Impression directe sur toile\n• Châssis bois tendu\n• Vernis de protection\n• Plusieurs formats disponibles\n• Dès 65 DT\n\nParfait pour la décoration intérieure !";
            break;
            
        case 'papeterie':
            $response = "📋 Notre gamme papeterie :\n• Cartes de visite (dès 50 DT)\n• Enveloppes personnalisées (dès 40 DT/100)\n• Blocs notes (dès 15 DT)\n• Papier à en-tête (dès 30 DT/500)\n• Carnets Moleskine (dès 25 DT)\n\nQuel produit vous intéresse ?";
            break;
            
        case 'remerciement':
            $response = "🙏 Merci beaucoup ! N'hésitez pas si vous avez d'autres questions. Nous sommes ravis de pouvoir vous aider. Bonne journée ! ✨";
            break;
            
        default:
            $response = "🤔 Je n'ai pas bien compris. Voici ce que je peux faire pour vous :\n\n• Vous renseigner sur nos produits\n• Vous donner les prix et délais\n• Vous aider à obtenir un devis\n• Vous donner nos coordonnées\n\nPouvez-vous reformuler votre question ?";
    }
    
    // Ajouter une suggestion si pertinent
    if ($intent === 'general' || $intent === 'bonjour') {
        $response .= "\n\n💡 Suggestions : \"Quels sont vos produits ?\", \"Prix des cartes de visite\", \"Demander un devis\", \"Coordonnées\"";
    }
    
    // Sauvegarder la conversation
    try {
        $stmt = $pdo->prepare("INSERT INTO ai_conversations (session_id, user_message, bot_response, intent) VALUES (?, ?, ?, ?)");
        $stmt->execute([$sessionId, $message, $response, $intent]);
    } catch(PDOException $e) {
        // Ignorer les erreurs de base de données
    }
    
    return ['response' => $response, 'intent' => $intent];
}

// Traiter la requête
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $message = $input['message'] ?? '';
    
    if (empty($message)) {
        echo json_encode(['error' => 'Message vide']);
        exit;
    }
    
    $result = processMessage($message, $productsData, $pdo, $sessionId);
    echo json_encode($result);
    exit;
}

// Envoyer l'historique des conversations
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['history'])) {
    try {
        $stmt = $pdo->prepare("SELECT user_message, bot_response, created_at FROM ai_conversations WHERE session_id = ? ORDER BY created_at DESC LIMIT 20");
        $stmt->execute([$sessionId]);
        $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'history' => $history]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'history' => []]);
    }
    exit;
}
?>
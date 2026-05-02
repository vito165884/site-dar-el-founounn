<?php
// save_newsletter.php - Version corrigée
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuration Formspree - REMPLACE PAR TON ID FORMSPREE POUR NEWSLETTER
$FORMSPREE_ENDPOINT = 'https://formspree.io/f/xaqlpewe';

// Récupération des données
$email = trim($_POST['email'] ?? '');

// Validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

$formspreeSent = false;
$dbSaved = false;
$messages = [];

// ========== 1. ENVOI VERS FORMSPREE ==========
$ch = curl_init($FORMSPREE_ENDPOINT);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'email' => $email,
    '_subject' => 'Dar El Founoun - Nouvel abonné Newsletter',
    '_replyto' => $email
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$formspreeResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 || $httpCode === 302) {
    $formspreeSent = true;
    $messages[] = 'Email envoyé';
} else {
    $messages[] = 'Email non envoyé';
}

// ========== 2. SAUVEGARDE DANS LA BASE DE DONNÉES ==========
$pdo = getDBConnection();

if ($pdo) {
    try {
        // Vérifier si l'email existe déjà
        $checkStmt = $pdo->prepare("SELECT id FROM newsletter WHERE email = ?");
        $checkStmt->execute([$email]);
        
        if ($checkStmt->rowCount() > 0) {
            $messages[] = 'Email déjà inscrit';
            $dbSaved = true; // Considérer comme succès car déjà présent
        } else {
            // Vérifier si la colonne formspree_sent existe
            $result = $pdo->query("SHOW COLUMNS FROM newsletter LIKE 'formspree_sent'");
            $hasFormspreeColumn = $result->rowCount() > 0;
            
            if ($hasFormspreeColumn) {
                $stmt = $pdo->prepare("
                    INSERT INTO newsletter (email, ip_address, formspree_sent) 
                    VALUES (?, ?, ?)
                ");
                $ip = getClientIP();
                $result = $stmt->execute([$email, $ip, $formspreeSent ? 1 : 0]);
            } else {
                $stmt = $pdo->prepare("
                    INSERT INTO newsletter (email, ip_address) 
                    VALUES (?, ?)
                ");
                $ip = getClientIP();
                $result = $stmt->execute([$email, $ip]);
            }
            
            if ($result) {
                $dbSaved = true;
                $messages[] = 'Inscription enregistrée';
            } else {
                $messages[] = 'Erreur enregistrement';
            }
        }
        
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            $messages[] = 'Email déjà inscrit';
            $dbSaved = true;
        } else {
            $messages[] = 'Erreur DB: ' . $e->getMessage();
            error_log("Erreur MySQL newsletter: " . $e->getMessage());
        }
    }
} else {
    $messages[] = 'Connexion base impossible';
}

$success = ($formspreeSent || $dbSaved);

echo json_encode([
    'success' => $success,
    'message' => implode(' - ', $messages)
]);
?>
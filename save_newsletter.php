<?php
// save_newsletter.php - Version sans colonne formspree_sent
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$FORMSPREE_NEWSLETTER_ENDPOINT = 'https://formspree.io/f/xgopnaer';

$email = trim($_POST['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

$formspreeSent = false;
$dbSaved = false;
$messages = [];

// ========== 1. ENVOI VERS FORMSPREE ==========
$ch = curl_init($FORMSPREE_NEWSLETTER_ENDPOINT);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'email' => $email,
    '_subject' => 'Nouvel abonné newsletter - Dar El Founoun'
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $formspreeSent = true;
    $messages[] = '✅ Newsletter envoyée';
} else {
    $messages[] = '⚠️ Envoi newsletter échoué';
}

// ========== 2. SAUVEGARDE DANS LA BASE DE DONNÉES ==========
$pdo = getDBConnection();

if ($pdo) {
    try {
        // Vérifier si la colonne formspree_sent existe
        $columns = $pdo->query("SHOW COLUMNS FROM newsletter")->fetchAll(PDO::FETCH_COLUMN);
        
        if (in_array('formspree_sent', $columns)) {
            $stmt = $pdo->prepare("INSERT IGNORE INTO newsletter (email, ip_address, formspree_sent) VALUES (?, ?, ?)");
            $ip = getClientIP();
            $stmt->execute([$email, $ip, $formspreeSent ? 1 : 0]);
        } else {
            $stmt = $pdo->prepare("INSERT IGNORE INTO newsletter (email, ip_address) VALUES (?, ?)");
            $ip = getClientIP();
            $stmt->execute([$email, $ip]);
        }
        
        if ($stmt->rowCount() > 0) {
            $dbSaved = true;
            $messages[] = '✅ Email enregistré en base';
        } else {
            $messages[] = '⚠️ Email déjà inscrit';
        }
        
    } catch (PDOException $e) {
        $messages[] = '❌ Erreur DB';
        error_log("Erreur MySQL: " . $e->getMessage());
    }
} else {
    $messages[] = '❌ Connexion base impossible';
}

$success = ($formspreeSent || $dbSaved);
echo json_encode([
    'success' => $success,
    'message' => implode(' | ', $messages)
]);
?>
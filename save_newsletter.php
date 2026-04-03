<?php
// save_newsletter.php - Pour la newsletter
require_once 'config.php';

header('Content-Type: application/json');

// Pour la newsletter, vous pouvez utiliser le même endpoint ou en créer un autre
$FORMSPREE_NEWSLETTER_ENDPOINT = 'https://formspree.io/f/xgopnaer';

$email = trim($_POST['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

// Envoi à Formspree
$ch = curl_init($FORMSPREE_NEWSLETTER_ENDPOINT);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'email' => $email,
    '_subject' => 'Nouvel abonné newsletter - Dar El Founoun'
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Sauvegarde MySQL
$dbSuccess = false;
$pdo = getDBConnection();
if ($pdo) {
    try {
        $stmt = $pdo->prepare("INSERT IGNORE INTO newsletter (email, ip_address, created_at) VALUES (?, ?, NOW())");
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $dbSuccess = $stmt->execute([$email, $ip]);
    } catch (PDOException $e) {
        error_log("Erreur MySQL newsletter: " . $e->getMessage());
    }
}

if ($httpCode === 200 || $dbSuccess) {
    echo json_encode(['success' => true, 'message' => '✅ Inscription réussie !']);
} else {
    echo json_encode(['success' => false, 'message' => '❌ Erreur, veuillez réessayer']);
}
?>
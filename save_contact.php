<?php
// save_contact.php - Version complète avec votre endpoint
require_once 'config.php';

header('Content-Type: application/json');

// VOTRE ENDPOINT FORMPREE
$FORMSPREE_ENDPOINT = 'https://formspree.io/f/xaqlpewe';

// Récupération des données
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
$errors = [];
if (empty($name)) $errors[] = 'Nom requis';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email invalide';
if (empty($message)) $errors[] = 'Message requis';

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// ========== ENVOI VERS FORMSPREE ==========
$ch = curl_init($FORMSPREE_ENDPOINT);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'subject' => $subject,
    'message' => $message,
    '_subject' => 'Dar El Founoun - ' . $subject,
    '_replyto' => $email
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// ========== SAUVEGARDE DANS MySQL ==========
$dbSuccess = false;
$pdo = getDBConnection();
if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO contacts (name, email, phone, subject, message, ip_address, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $dbSuccess = $stmt->execute([$name, $email, $phone, $subject, $message, $ip]);
    } catch (PDOException $e) {
        error_log("Erreur MySQL: " . $e->getMessage());
    }
}

// ========== RÉPONSE ==========
if ($httpCode === 200 || $dbSuccess) {
    echo json_encode(['success' => true, 'message' => '✅ Message envoyé avec succès !']);
} else {
    echo json_encode(['success' => false, 'message' => '❌ Erreur lors de l\'envoi']);
}
?>
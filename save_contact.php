<?php
// save_contact.php - Version sans colonne formspree_sent
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuration Formspree
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

$formspreeSent = false;
$dbSaved = false;
$messages = [];

// ========== 1. ENVOI VERS FORMSPREE ==========
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

$formspreeResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $formspreeSent = true;
    $messages[] = '✅ Email envoyé via Formspree';
} else {
    $messages[] = '⚠️ Envoi email échoué (message sauvegardé en base)';
}

// ========== 2. SAUVEGARDE DANS LA BASE DE DONNÉES ==========
$pdo = getDBConnection();

if ($pdo) {
    try {
        // Vérifier si la colonne formspree_sent existe
        $columns = $pdo->query("SHOW COLUMNS FROM contacts")->fetchAll(PDO::FETCH_COLUMN);
        
        if (in_array('formspree_sent', $columns)) {
            // Version avec formspree_sent
            $stmt = $pdo->prepare("
                INSERT INTO contacts (name, email, phone, subject, message, ip_address, formspree_sent) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $ip = getClientIP();
            $result = $stmt->execute([$name, $email, $phone, $subject, $message, $ip, $formspreeSent ? 1 : 0]);
        } else {
            // Version sans formspree_sent
            $stmt = $pdo->prepare("
                INSERT INTO contacts (name, email, phone, subject, message, ip_address) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $ip = getClientIP();
            $result = $stmt->execute([$name, $email, $phone, $subject, $message, $ip]);
        }
        
        if ($result) {
            $dbSaved = true;
            $messages[] = '✅ Données enregistrées en base';
        } else {
            $messages[] = '❌ Erreur enregistrement base';
        }
        
    } catch (PDOException $e) {
        $messages[] = '❌ Erreur DB: ' . $e->getMessage();
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
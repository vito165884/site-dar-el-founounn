<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'config.php';

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSONResponse(false, 'Méthode non autorisée');
}

// Récupérer les données
$email = '';

if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $json = file_get_contents('php://input');
    $input = json_decode($json, true);
    $email = trim($input['email'] ?? '');
} else {
    $email = trim($_POST['email'] ?? '');
}

// Validation
if (empty($email)) {
    sendJSONResponse(false, 'Veuillez entrer votre adresse email');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJSONResponse(false, 'Adresse email invalide');
}

// Connexion à la base de données
$pdo = getDBConnection();
if (!$pdo) {
    sendJSONResponse(false, 'Erreur de connexion à la base de données');
}

try {
    $ip = getClientIP();
    
    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare("SELECT id, status FROM newsletter WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();
    
    if ($existing) {
        if ($existing['status'] === 'active') {
            sendJSONResponse(false, 'Cet email est déjà inscrit à notre newsletter');
        } else {
            // Réactiver l'abonnement
            $stmt = $pdo->prepare("UPDATE newsletter SET status = 'active', subscribed_at = NOW(), ip_address = ? WHERE email = ?");
            $stmt->execute([$ip, $email]);
            sendJSONResponse(true, '✅ Votre abonnement a été réactivé avec succès !');
        }
    } else {
        // Nouvel abonnement
        $stmt = $pdo->prepare("INSERT INTO newsletter (email, ip_address, created_at, subscribed_at) VALUES (?, ?, NOW(), NOW())");
        $stmt->execute([$email, $ip]);
        sendJSONResponse(true, '✅ Inscription réussie ! Vous recevrez nos actualités et offres spéciales.');
    }
    
} catch (PDOException $e) {
    error_log("Erreur insertion newsletter: " . $e->getMessage());
    sendJSONResponse(false, '❌ Une erreur technique est survenue');
}
?>
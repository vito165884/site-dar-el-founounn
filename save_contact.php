<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'config.php';

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSONResponse(false, 'Méthode non autorisée');
}

// Récupérer les données (JSON ou formulaire)
$input = [];

if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $json = file_get_contents('php://input');
    $input = json_decode($json, true);
} else {
    $input = $_POST;
}

// Validation des champs
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$subject = trim($input['subject'] ?? '');
$message = trim($input['message'] ?? '');

$errors = [];

if (empty($name)) {
    $errors[] = 'Le nom est requis';
} elseif (strlen($name) < 2) {
    $errors[] = 'Le nom doit contenir au moins 2 caractères';
}

if (empty($email)) {
    $errors[] = 'L\'email est requis';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email invalide';
}

if (empty($subject)) {
    $errors[] = 'Le sujet est requis';
}

if (empty($message)) {
    $errors[] = 'Le message est requis';
} elseif (strlen($message) < 10) {
    $errors[] = 'Le message doit contenir au moins 10 caractères';
}

if (!empty($errors)) {
    sendJSONResponse(false, implode(', ', $errors));
}

// Connexion à la base de données
$pdo = getDBConnection();
if (!$pdo) {
    sendJSONResponse(false, 'Erreur de connexion à la base de données');
}

try {
    $ip = getClientIP();
    
    $stmt = $pdo->prepare("
        INSERT INTO contacts (name, email, phone, subject, message, ip_address, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $result = $stmt->execute([$name, $email, $phone, $subject, $message, $ip]);
    
    if ($result) {
        sendJSONResponse(true, '✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
    } else {
        sendJSONResponse(false, '❌ Une erreur est survenue lors de l\'envoi du message');
    }
    
} catch (PDOException $e) {
    error_log("Erreur insertion contact: " . $e->getMessage());
    sendJSONResponse(false, '❌ Une erreur technique est survenue');
}
?>
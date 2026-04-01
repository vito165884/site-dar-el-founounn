<?php
// Configuration de la base de données
$host = 'localhost';
$dbname = 'dar_elfounoun';
$username = 'root';
$password = '';

// Fonction pour obtenir la connexion PDO
function getDBConnection() {
    global $host, $dbname, $username, $password;
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch(PDOException $e) {
        error_log("Erreur connexion DB: " . $e->getMessage());
        return null;
    }
}

// Fonction pour envoyer des réponses JSON
function sendJSONResponse($success, $message) {
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Fonction pour obtenir l'adresse IP du client
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}

// Test de connexion (optionnel, peut être retiré)
try {
    $testConnection = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $testConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Connexion réussie, ne rien afficher pour ne pas polluer les réponses API
} catch(PDOException $e) {
    // En développement, vous pouvez décommenter pour voir l'erreur
    // echo "Erreur de connexion à la base de données: " . $e->getMessage();
}
?>
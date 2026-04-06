<?php
// config.php - Configuration de la base de données
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
        // Si la base n'existe pas, on la crée
        try {
            $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo->exec("USE `$dbname`");
            
            // Créer la table contacts
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS `contacts` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `name` VARCHAR(100) NOT NULL,
                    `email` VARCHAR(100) NOT NULL,
                    `phone` VARCHAR(20),
                    `subject` VARCHAR(100),
                    `message` TEXT NOT NULL,
                    `ip_address` VARCHAR(45),
                    `formspree_sent` TINYINT DEFAULT 0,
                    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ");
            
            // Créer la table newsletter
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS `newsletter` (
                    `id` INT AUTO_INCREMENT PRIMARY KEY,
                    `email` VARCHAR(100) NOT NULL UNIQUE,
                    `ip_address` VARCHAR(45),
                    `formspree_sent` TINYINT DEFAULT 0,
                    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ");
            
            return $pdo;
        } catch(PDOException $e2) {
            error_log("Erreur connexion DB: " . $e2->getMessage());
            return null;
        }
    }
}

// Fonction pour envoyer des réponses JSON
function sendJSONResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    $response = ['success' => $success, 'message' => $message];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit;
}

// Fonction pour obtenir l'adresse IP
function getClientIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        return $_SERVER['REMOTE_ADDR'];
    }
}
?>
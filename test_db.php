<?php
// test_db.php - Tester la connexion à la base
require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html><html><head><title>Test Base de données</title>";
echo "<style>body{font-family:Arial;margin:50px;}.success{color:green;background:#e8f5e9;padding:10px;border-radius:5px;}.error{color:red;background:#ffebee;padding:10px;border-radius:5px;}</style>";
echo "</head><body>";

echo "<h1>🔌 Test de connexion à la base de données</h1>";

$pdo = getDBConnection();

if ($pdo) {
    echo "<div class='success'>✅ Connexion à MySQL réussie !</div>";
    
    // Afficher les tables
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<h2>📋 Tables trouvées :</h2><ul>";
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        echo "<li><strong>$table</strong> - $count enregistrement(s)</li>";
    }
    echo "</ul>";
    
    // Afficher les derniers contacts
    $contacts = $pdo->query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5")->fetchAll();
    if (count($contacts) > 0) {
        echo "<h2>📧 Derniers messages :</h2><ul>";
        foreach ($contacts as $c) {
            echo "<li><strong>{$c['name']}</strong> ({$c['email']}) : " . htmlspecialchars(mb_substr($c['message'], 0, 50)) . "...</li>";
        }
        echo "</ul>";
    }
} else {
    echo "<div class='error'>❌ Erreur de connexion à MySQL</div>";
    echo "<p>💡 Vérifiez que XAMPP/WAMP est démarré (Apache et MySQL)</p>";
}

echo "<p><a href='index.html'>🏠 Retour au site</a> | <a href='admin.php'>📊 Admin</a></p>";
echo "</body></html>";
?>
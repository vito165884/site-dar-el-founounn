<?php
// test_db.php - Tester la connexion
require_once 'config.php';

echo "<h1>🔌 Test Base de Données</h1>";

$pdo = getDBConnection();

if ($pdo) {
    echo "<p style='color:green'>✅ Connexion réussie à la base <strong>$dbname</strong></p>";
    
    // Afficher les tables
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<h2>📋 Tables trouvées :</h2><ul>";
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        echo "<li><strong>$table</strong> - $count enregistrement(s)</li>";
    }
    echo "</ul>";
    
    echo "<p><a href='admin.php'>📊 Accéder à l'administration</a></p>";
    echo "<p><a href='index.html'>🏠 Retour au site</a></p>";
} else {
    echo "<p style='color:red'>❌ Erreur de connexion à MySQL</p>";
    echo "<p>Vérifiez que XAMPP/WAMP est démarré (Apache et MySQL)</p>";
}
?>
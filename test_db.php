<?php
// test_db.php - Tester la connexion
require_once 'config.php';

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html><html><head><title>Test Base de données</title>";
echo "<style>
    body{font-family:Arial;margin:50px;line-height:1.6;}
    .success{color:green;background:#e8f5e9;padding:15px;border-radius:8px;margin:10px 0;}
    .error{color:red;background:#ffebee;padding:15px;border-radius:8px;margin:10px 0;}
    .info{background:#e3f2fd;padding:15px;border-radius:8px;margin:10px 0;}
    table{border-collapse:collapse;width:100%;margin:10px 0;}
    th,td{border:1px solid #ddd;padding:8px;text-align:left;}
    th{background:#f2f2f2;}
</style>";
echo "</head><body>";

echo "<h1>🔌 Test de connexion à la base de données</h1>";

$pdo = getDBConnection();

if ($pdo) {
    echo "<div class='success'>✅ Connexion à MySQL réussie !</div>";
    
    // Afficher les tables
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "<h2>📋 Tables trouvées :</h2>";
    echo "<table><tr><th>Table</th><th>Enregistrements</th></tr>";
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        echo "<tr><td><strong>$table</strong></td><td>$count</td></tr>";
    }
    echo "</table>";
    
    // Afficher les derniers contacts
    $contacts = $pdo->query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5")->fetchAll();
    if (count($contacts) > 0) {
        echo "<h2>📧 Derniers messages :</h2>";
        echo "<table><tr><th>Nom</th><th>Email</th><th>Sujet</th><th>Message</th><th>Date</th></tr>";
        foreach ($contacts as $c) {
            echo "<tr>";
            echo "<td>{$c['name']}</td>";
            echo "<td>{$c['email']}</td>";
            echo "<td>{$c['subject']}</td>";
            echo "<td>" . htmlspecialchars(mb_substr($c['message'], 0, 50)) . "...</td>";
            echo "<td>" . date('d/m/Y H:i', strtotime($c['created_at'])) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<div class='info'>📭 Aucun message pour le moment. Envoyez un test depuis le formulaire de contact !</div>";
    }
    
    echo "<div class='success'>✅ Dashboard accessible ici : <a href='admin.php' style='color:#e67e22;font-weight:bold;'>admin.php</a></div>";
} else {
    echo "<div class='error'>❌ Erreur de connexion à MySQL</div>";
    echo "<div class='info'>💡 Vérifications :<br>
    - XAMPP/WAMP est-il démarré ?<br>
    - MySQL est-il vert (WAMP) ou Started (XAMPP) ?<br>
    - Les identifiants root/mot de passe sont-ils corrects ?<br>
    - La base de données 'dar_elfounoun' existe-t-elle ?
    </div>";
}

echo "<p><br><a href='index.html' style='color:#e67e22;'>🏠 Retour au site</a> | <a href='admin.php' style='color:#e67e22;'>📊 Dashboard</a></p>";
echo "</body></html>";
?>
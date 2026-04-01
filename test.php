<?php
echo "<h1>Test PHP</h1>";
echo "PHP fonctionne !<br>";

require_once 'config.php';
$pdo = getDBConnection();

if ($pdo) {
    echo "✅ Connexion à la base de données réussie !";
} else {
    echo "❌ Erreur de connexion à la base de données";
}
?>
<?php
$host = "sql208.infinityfree.com";
$user = "if0_41571010";
$pass = "fgOrBY0PPTlE";  // Remplace par ton mot de passe
$db   = "if0_41571010_appli";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Erreur : " . mysqli_connect_error());
}
echo "✅ Connecté à la base InfinityFree !";
?>
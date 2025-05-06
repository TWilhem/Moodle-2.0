<?php
session_start();
session_unset(); // Libère toutes les variables de session
session_destroy(); // Détruit la session
header("Location: index.php"); // Redirection vers la page d'accueil ou de connexion
exit;
?>

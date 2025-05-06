<?php
try {
    $conn = new PDO('mysql:host=127.0.0.1;dbname=elevedb', 'root', 'root');
    // Configurer le mode d'erreur de PDO pour lever des exceptions
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connexion réussie!\n";
} catch (PDOException $e) {
    echo "Échec de la connexion : " . $e->getMessage();
}
?>
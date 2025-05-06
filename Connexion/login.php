<?php
session_start();
include('db_connection.php'); // Inclure le fichier de connexion à la base de données

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les valeurs du formulaire
    $email = $_POST['Mail'];
    $password = $_POST['Password'];

    // Sécuriser les entrées
    $email = htmlspecialchars($email);  // Échapper les caractères spéciaux
    $password = htmlspecialchars($password);  // Échapper les caractères spéciaux

    // Requête pour vérifier l'utilisateur dans la base de données
    $sql = "SELECT * FROM utilisateurs WHERE Mail = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // Utilisateur trouvé
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérifier le mot de passe
        if ($password === $row['Password']) {
            // Mot de passe correct, l'utilisateur est connecté
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['user_nom'] = $row['Nom'];
            $_SESSION['user_prenom'] = $row['Prenom'];
            $_SESSION['user_type'] = $row['Autorite'];

            echo "Bienvenue " . $row['Autorite'] . " " . $row['Prenom'] . " " . $row['Nom'];
            // Rediriger ou faire d'autres actions ici après la connexion
        } else {
            echo "Mot de passe incorrect.";
        }
    } else {
        echo "Aucun utilisateur trouvé avec cet e-mail.";
    }
}

$conn = null; // Fermer la connexion PDO
?>

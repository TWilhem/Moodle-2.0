<?php
try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM', '22312218', '981411');
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'] ?? '';
    $mot_de_passe = $_POST['password'] ?? '';

    $hashed_password = hash('sha256', $mot_de_passe);

    // Requête avec JOIN pour récupérer aussi les infos de la table Filiere
    $sql = "SELECT u.*, f.filiere, f.annee, f.groupe
            FROM Utilisateurs u
            LEFT JOIN Filiere f ON u.id = f.Utilisateur_id
            WHERE u.email = :email AND u.mot_de_passe = :motdepasse";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':email' => $email,
        ':motdepasse' => $hashed_password
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        session_start();
        $_SESSION['user'] = [
            'id'        => $user['id'],
            'nom'       => $user['nom'],
            'prenom'    => $user['prenom'],
            'email'     => $email,
            'autorite'  => $user['autorite'],
            'genre'     => $user['genre'] ?? '',
            'naissance' => $user['naissance'] ?? '',
            'filiere'   => $user['filiere'] ?? '',
            'niveau'    => $user['annee'] ?? '',
            'groupe'    => $user['groupe'] ?? '',
            'extension' => $user['extension'] ?? '',
        ];

        header("Location: ../../Ressource/Acceuil/Acceuil.php");
        exit();
    } else {
        echo "Identifiants invalides.";
    }
}
?>

<?php
try {
  $pdo=new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM','22312218','981411');
}
catch (Exception $e) {
  die("Erreur de connexion : " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = $_POST['nom'] ?? '';
    $prenom = $_POST['prenom'] ?? '';
    $email = $_POST['email'] ?? '';
    $mdp = $_POST['password'] ?? '';
    $mdp_confirm = $_POST['confirm-password'] ?? '';

    // Vérifier que les champs ne sont pas vides
    if (empty($nom) || empty($prenom) || empty($email) || empty($mdp) || empty($mdp_confirm)) {
        die("Veuillez remplir tous les champs.");
    }

    // Vérifier que les mots de passe correspondent
    if ($mdp !== $mdp_confirm) {
        die("Les mots de passe ne correspondent pas.");
    }

    // Vérifier si l'email est déjà utilisé
    $check = $pdo->prepare("SELECT id FROM Utilisateurs WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        die("Un compte avec cet email existe déjà.");
    }

    // Hacher le mot de passe en SHA-256
    $hashed_password = hash('sha256', $mdp);

    // Insertion : autorité par défaut = Etudiant
    $sql = "INSERT INTO Utilisateurs (nom, prenom, email, mot_de_passe, autorite) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([$nom, $prenom, $email, $hashed_password, 'Etudiant']);

    if ($success) {
        header("Location: ../../Ressource/Acceuil/Acceuil.php");
        exit();
    } else {
        echo "Erreur lors de l'inscription.";
    }
}
?>
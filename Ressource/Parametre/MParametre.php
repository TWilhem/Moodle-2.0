<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: ../../Connexion/Inscri-Login/Connexion.html");
    exit();
}

$user = $_SESSION['user'];

try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM', '22312218', '981411');
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Traitement du formulaire
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération des champs
    $nom        = $_POST['nom'] ?? '';
    $prenom     = $_POST['prenom'] ?? '';
    $genre      = $_POST['genre'] ?? '';
    $naissance  = $_POST['naissance'] ?? '';
    $email      = $_POST['email'] ?? '';
    $password   = $_POST['password'] ?? '';
    $confirm    = $_POST['confirm-password'] ?? '';
    $extension  = null;

    // Vérification du mot de passe si modifié
    if (!empty($password)) {
        if ($password !== $confirm) {
            die("Les mots de passe ne correspondent pas.");
        }
        $hashed_password = hash('sha256', $password);
    } else {
        $hashed_password = null;
    }

    // Traitement image si présente
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = "../../image/";
        $fileTmp = $_FILES['photo']['tmp_name'];
        $fileInfo = pathinfo($_FILES['photo']['name']);
        $extension = strtolower($fileInfo['extension']);

        // Extensions valides
        $validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($extension, $validExtensions)) {
            die("Format d'image non supporté.");
        }

        // Nouveau nom basé sur l'ID
        $newFileName = $user['id'] . "." . $extension;
        $destination = $uploadDir . $newFileName;

        $oldFile = $uploadDir . $user['id'] . '.' . $user['extension'];
        if (file_exists($oldFile)) {
            unlink($oldFile);
        }

        // Déplacement du fichier
        if (!move_uploaded_file($fileTmp, $destination)) {
            die("Erreur lors de l'enregistrement de l'image.");
        }
    }

    // Requête de mise à jour
    if ($hashed_password) {
        $sql = "UPDATE Utilisateurs 
                SET nom = :nom, prenom = :prenom, genre = :genre, naissance = :naissance, email = :email, mot_de_passe = :mot_de_passe, extension = :ext
                WHERE id = :id";
        $params = [
            ':nom' => $nom,
            ':prenom' => $prenom,
            ':genre' => $genre,
            ':naissance' => $naissance,
            ':email' => $email,
            ':mot_de_passe' => $hashed_password,
            ':id' => $user['id'],
            ':ext' => $extension
        ];
    } else {
        $sql = "UPDATE Utilisateurs 
                SET nom = :nom, prenom = :prenom, genre = :genre, naissance = :naissance, email = :email, extension = :ext
                WHERE id = :id";
        $params = [
            ':nom' => $nom,
            ':prenom' => $prenom,
            ':genre' => $genre,
            ':naissance' => $naissance,
            ':email' => $email,
            ':id' => $user['id'],
            ':ext' => $extension
        ];
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);


    // Récupération des données mises à jour + filière
    $sql = "SELECT u.*, f.filiere, f.annee, f.groupe
            FROM Utilisateurs u
            LEFT JOIN Filiere f ON u.id = f.Utilisateur_id
            WHERE u.id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $user['id']]);
    $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($updatedUser) {
        $_SESSION['user'] = [
            'id'        => $updatedUser['id'],
            'nom'       => $updatedUser['nom'],
            'prenom'    => $updatedUser['prenom'],
            'email'     => $updatedUser['email'],
            'autorite'  => $updatedUser['autorite'],
            'genre'     => $updatedUser['genre'] ?? '',
            'naissance' => $updatedUser['naissance'] ?? '',
            'filiere'   => $updatedUser['filiere'] ?? '',
            'niveau'    => $updatedUser['annee'] ?? '',
            'groupe'    => $updatedUser['groupe'] ?? '',
            'extension' => $updatedUser['extension'] ?? ''
        ];
        header("Location: ./Parametre.php");
        exit();
    } else {
        echo "Erreur lors de la récupération des données mises à jour.";
    }
}
?>

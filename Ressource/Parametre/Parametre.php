<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: ../../Connexion/Inscri-Login/Connexion.html");
    exit();
}

$user = $_SESSION['user'];
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titre</title>
    <link rel="stylesheet" href="../style.css" type="text/css">
    <link rel="stylesheet" href="./Parametre.css" type="text/css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <script src="../script.js" defer></script>
    <script src="./Parametre.js"></script>
</head>
<body>
    <label for="" class="label">
        <div class="left-icon">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Devbox</title><path d="m19.546 7.5726-1.531-1.5703c-.4881.4371-.965.8647-1.442 1.2922l-.959.8596c1.3076 1.3446 2.5887 2.6624 3.8756 3.987l-2.4261 2.4956-1.4508 1.4924c.55.4988 1.0916.9897 1.6397 1.4864l.765.6933 2.209-2.2773c1.2588-1.2976 2.5141-2.5916 3.7736-3.8905v-.001a20797.5906 20797.5906 0 0 1-4.454-4.5674ZM2.992 9.0716A16808.14 16808.14 0 0 1 0 12.141c2.0108 2.0727 3.9927 4.1152 5.9838 6.1666l.5111-.4635c.638-.5786 1.2616-1.144 1.8924-1.715l-1.447-1.4888c-.8134-.8368-1.6208-1.6676-2.431-2.5015 1.0462-1.075 2.0745-2.132 3.1094-3.1959l.7674-.7888c-.4342-.3892-.861-.7718-1.2883-1.1546l-1.114-.9983v.0011c-.9996 1.0251-1.9958 2.0472-2.992 3.0694Zm12.585-6.0372c-1.317 6.199-2.6283 12.3689-3.9453 18.5656l-.1962-.0387a2911.4317 2911.4317 0 0 0-3.0284-.5957c.8529-4.0118 1.7034-8.0133 2.5549-12.0196L12.3533 2.4z"/></svg>
        </div>
        <div class="right-icon">
            <i class="fa-solid fa-bars"></i>
            <div class="Menu">
                <a href="../Acceuil/Acceuil.php">Accueil</a>
                <a href="../Filiere/Filiere/Filiere.php">Filière</a>
                <a href="../Planning/Planning.php">Planning</a>
                <a href="../Devoir/Devoir.php">Devoir</a>
                <i class="fa-solid fa-user-gear"></i>
                <div id="linksMenu">
                    <a href="./Parametre.php">Paramètre</a>
                    <a href="../../Connexion/Php/Deconnexion.php">Déconnexion</a>
                </div>
            </div>
        </div>
    </label>
    <div class="sidebar" id="sidebar">
        <div>
            <img src="../../image/<?= $_SESSION['user']['id'] ?>.<?= $_SESSION['user']['extension'] ?>">
            <p>Bienvenue</p>
            <p class="Presentation">
                <span class="ligne"><?= htmlspecialchars($user['genre']) ?></span>
                <?= htmlspecialchars($user['prenom']) . ' ' . htmlspecialchars($user['nom']) ?>
            </p>
            <a href="../Acceuil/Acceuil.php">Accueil</a>
            <a href="../Filiere/Filiere/Filiere.php">Filière</a>
            <a href="../Planning/Planning.php">Planning</a>
            <a href="../Devoir/Devoir.php">Devoir</a>
        </div>
        <div id="linksSidebar">
            <a href="./Parametre.php">Paramètre</a>
            <a href="../../Connexion/Php/Deconnexion.php">Déconnexion</a>
        </div>
    </div>
    <div class="form-container">
        <h2>Connexion</h2>
        <form method="POST" action="./MParametre.php" enctype="multipart/form-data">

            <div class="form-columns">
                <div class="Left">
                    <div class="input-field">
                        <input type="text" name="nom" id="nom" value="<?= htmlspecialchars($user['nom']) ?>" required placeholder=" ">
                        <label for="nom">Nom</label>
                    </div>
                    <div class="input-field">
                        <input type="text" name="prenom" id="prenom" value="<?= htmlspecialchars($user['prenom']) ?>" required placeholder=" ">
                        <label for="prenom">Prénom</label>
                    </div>
                    <div class="input-field">
                        <input type="text" name="genre" id="genre" value="<?= htmlspecialchars($user['genre']) ?>" required placeholder=" ">
                        <label for="genre">Diminutif</label>
                    </div>
                    <div class="input-field">
                        <input type="date" name="naissance" id="naissance" value="<?= htmlspecialchars($user['naissance']) ?>" required placeholder=" ">
                        <label for="naissance">Date de naissance</label>
                    </div>
                    <div class="input-field">
                        <input type="email" name="email" id="email" value="<?= htmlspecialchars($user['email']) ?>" required placeholder=" ">
                        <label for="email">Adresse Email</label>
                    </div>
                    <button type="button" id="togglePasswordSection" class="Buttonpassword">Changement de Mot de passe</button>
                    <div class="password-section" id="passwordSection">
                        <div class="input-field">
                            <input type="password" name="password" id="password" placeholder=" ">
                            <label for="password">Mot de passe</label>
                            <i class="fa-solid fa-eye-slash toggle-password" id="togglePassword"></i>
                        </div>
                        <div class="input-field">
                            <input type="password" name="confirm-password" id="confirm-password" placeholder=" ">
                            <label for="confirm-password">Confirmation du mot de passe</label>
                        </div>
                    </div>
                </div>

                <div class="Right">
                    <div class="input-field">
                        <input type="text" name="filiere" id="filiere" value="<?= htmlspecialchars($user['filiere']) ?>" readonly>
                        <label for="filiere">Filière</label>
                    </div>
                    <div class="input-field">
                        <input type="text" name="niveau" id="niveau" value="<?= htmlspecialchars($user['niveau']) ?>" readonly>
                        <label for="niveau">Niveau</label>
                    </div>
                    <div class="input-field">
                        <input type="text" name="group" id="group" value="<?= htmlspecialchars($user['groupe']) ?>" readonly>
                        <label for="group">Groupe</label>
                    </div>
                    <div class="input-field">
                    <div class="file-upload" id="file-upload">
                        <input type="file" name="photo" id="photo" accept="image/*" required placeholder=" ">
                        <?php if (!empty($_SESSION['user']['extension'])): ?>
                            <div class="file-upload-box" id="file-upload-box"></div>
                            <img id="image-preview" src="../../image/<?= $_SESSION['user']['id'] ?>.<?= $_SESSION['user']['extension'] ?>" alt="Prévisualisation" style="display: block">
                        <?php else: ?>
                            <div class="file-upload-box" id="file-upload-box">
                                <p>Glissez et déposez une image ici, ou cliquez pour en choisir une</p>
                            </div>
                            <img id="image-preview" src="#" alt="Prévisualisation">
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            </div>
            <button type="submit" class="btn-submit">Enregistrer les modifications</button>
        </form>
    </div>    
</body>
</html>



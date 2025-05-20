<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>
<?php
$user = $_SESSION['user'];
require_once '../../../Connexion/Php/Connexion.php';

function handleImageUpload($id_ressource, $id_parcours, $annee, $semestre, $type, $pk_id, $pdo) {
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $imageUploaded = isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK;

    $dossierDestination = __DIR__ . "/../upload/" . $id_parcours . "/image/" . $id_parcours . $annee . "/" . str_replace('S', 'semestre', $semestre) . "/" . $type;

    if (!is_dir($dossierDestination)) {
        if (!mkdir($dossierDestination, 0777, true)) {
            echo "Échec de la création du dossier.<br>";
            exit;
        }
    }

    // Récupérer l'ancien id_ressource et extension
    $oldData = null;
    if (!empty($pk_id)) {
        $stmt = $pdo->prepare("SELECT id_ressource, extension FROM Ressources WHERE id = :id");
        $stmt->execute([':id' => $pk_id]);
        $oldData = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if ($oldData) {
        $oldIdRessource = $oldData['id_ressource'];
        $oldExt = $oldData['extension'];

        // Si le id_ressource a changé, on renomme l'image même sans upload
        if ($oldIdRessource !== $id_ressource && $oldExt) {
            $oldPath = "$dossierDestination/$oldIdRessource.$oldExt";
            $newPath = "$dossierDestination/$id_ressource.$oldExt";

            if (file_exists($oldPath)) {
                rename($oldPath, $newPath);
            }
        }

        // Si une nouvelle image est envoyée, on supprime l'ancienne
        if ($imageUploaded && $oldExt) {
            $existingFile = "$dossierDestination/$id_ressource.$oldExt";
            if (file_exists($existingFile)) {
                unlink($existingFile);
            }
        }
    }

    // Si une image est uploadée, on l'enregistre
    if ($imageUploaded) {
        $imageTmpPath = $_FILES['image']['tmp_name'];
        $imageName = basename($_FILES['image']['name']);
        $imageExtension = strtolower(pathinfo($imageName, PATHINFO_EXTENSION));

        if (!preg_match('/^[a-zA-Z0-9_-]+$/', $id_ressource)) {
            echo "Nom de fichier invalide.";
            return;
        }

        if (in_array($imageExtension, $allowedExtensions)) {
            $cheminFinal = "$dossierDestination/$id_ressource.$imageExtension";

            if (move_uploaded_file($imageTmpPath, $cheminFinal)) {
                // Mettre à jour l'extension dans la BDD
                if (!empty($pk_id)) {
                    $sql = "UPDATE Ressources SET extension = :ext WHERE id = :pk_id";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([':ext' => $imageExtension, ':pk_id' => $pk_id]);
                }
            } else {
                echo "Erreur lors de l'enregistrement de la nouvelle image.";
            }
        } else {
            echo "Format d'image non autorisé.";
        }
    }
}

// Enregistrement formulaire post
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_modif'])) {
    $pk_id = $_POST['id'] ?? null; // clé primaire (pour update uniquement)
    $id_ressource = $_POST['id_ressource'] ?? null;
    $nom_ressource = $_POST['nom_ressource'] ?? null;
    $id_parcours = $_POST['id_parcours'] ?? null;
    $annee = $_POST['annee'] ?? null;
    $semestre = $_POST['semestre'] ?? null;
    $type = $_POST['type'] ?? null;

    // Cas modification
    if ($pk_id && $id_ressource && $nom_ressource && $id_parcours && $annee && $semestre && $type) {

        handleImageUpload($id_ressource, $id_parcours, $annee, $semestre, $type, $pk_id, $pdo);

        $sql = "UPDATE Ressources
                SET nom_ressource = :nom_ressource, id_ressource = :id_ressource
                WHERE id = :pk_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nom_ressource' => $nom_ressource,
            ':id_ressource' => $id_ressource,
            ':pk_id' => $pk_id
        ]);

        header("Location: " . $_SERVER['REQUEST_URI']); // Rechargement propre
        exit;
    }
    // Cas insertion
    else if ($id_ressource && $nom_ressource && $id_parcours && $annee && $semestre && $type) {
        $sql = "INSERT INTO Ressources (id_ressource, nom_ressource, id_parcours, annee, semestre, type)
                VALUES (:id_ressource, :nom_ressource, :id_parcours, :annee, :semestre, :type)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id_ressource' => $id_ressource,
            ':nom_ressource' => $nom_ressource,
            ':id_parcours' => $id_parcours,
            ':annee' => $annee,
            ':semestre' => $semestre,
            ':type' => $type
        ]);

        // Tu peux récupérer l'ID si tu veux faire un traitement après :
        $pk_id = $pdo->lastInsertId();
        handleImageUpload($id_ressource, $id_parcours, $annee, $semestre, $type, $pk_id, $pdo);

        header("Location: " . $_SERVER['REQUEST_URI']); // Rechargement propre
        exit;

    } else {
        echo "Données incomplètes pour l'insertion ou la mise à jour.";
    }
}

// Suppression d'une ressource
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_ressource'])) {
    $pk_id = $_POST['id'] ?? null;

    if ($pk_id) {
        // Récupérer les infos pour supprimer l'image
        $stmt = $pdo->prepare("SELECT id_ressource, id_parcours, annee, semestre, type, extension FROM Ressources WHERE id = :pk_id");
        $stmt->execute([':pk_id' => $pk_id]);
        $ressource = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($ressource) {
            $id_ressource = $ressource['id_ressource'];
            $id_parcours = $ressource['id_parcours'];
            $annee = $ressource['annee'];
            $semestre = str_replace('S', 'semestre', $ressource['semestre']);
            $type = $ressource['type'];
            $extension = $ressource['extension'];

            $imagePath = __DIR__ . "/../upload/$id_parcours/image/{$id_parcours}{$annee}/$semestre/$type/$id_ressource.$extension";;
            if (file_exists($imagePath)) {
                unlink($imagePath); // Supprime l'image
            }
        }

        // Supprimer la ressource dans la BDD
        $sql = "DELETE FROM Ressources WHERE id = :pk_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':pk_id' => $pk_id]);

        // Redirection
        header("Location: " . strtok($_SERVER['REQUEST_URI'], '?') . '?' . $_SERVER['QUERY_STRING']);
        exit;
    } else {
        echo "Identifiant manquant pour la suppression.";
    }
}

// Paramètres GET
$id = $_GET['id'] ?? null;        // ex: MMI
$anneeParam = $_GET['A'] ?? null; // ex: 1
$partieParam = $_GET['P'] ?? null; // "Ressource" ou "SAE"
$semestreParam = $_GET['S'] ?? null; // ex: S1

if ($id === null) {
    echo "Aucune filière spécifiée.";
    exit;
}

// Préparation de la requête SQL
$sql = "SELECT * FROM Ressources WHERE id_parcours = :id";
$params = [':id' => $id];

if ($anneeParam !== null) {
    $sql .= " AND annee = :annee";
    $params[':annee'] = (int)$anneeParam;
}
if ($semestreParam !== null) {
    $sql .= " AND semestre = :semestre";
    $params[':semestre'] = $semestreParam;
}
if ($partieParam !== null) {
    $sql .= " AND type = :type";
    $params[':type'] = $partieParam;
}

// Exécution de la requête
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$ressources = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Affichage Choix Semestre
if ($anneeParam != 0) {
    $sem1 = ($anneeParam - 1) * 2 + 1;
    $sem2 = $sem1 + 1;
} else {
    $sem1 = 0;
    $sem2 = 0;
}
?>
<div class="Cbubble">
    <div class="button">
        <button class="choix-btn <?= ($semestreParam === "S$sem1") ? 'actif' : '' ?>" onclick="redirigerVersSemestre(<?= $sem1 ?>)">Semestre <?= $sem1 ?></button>
        <button class="choix-btn <?= ($semestreParam === "S$sem2") ? 'actif' : '' ?>" onclick="redirigerVersSemestre(<?= $sem2 ?>)">Semestre <?= $sem2 ?></button>
        <button class="choix-btn <?= (empty($semestreParam)) ? 'actif' : '' ?>" onclick="redirigerVersSemestre('tous')">Tout</button>
    </div>
</div>

<?php
// Affichage Ressource
if (count($ressources) > 0) {
    foreach ($ressources as $item) {
        // Vérification de l'autorité de l'utilisateur
        $isAuthorized = false;
        if (isset($user['autorite'])) {
            if ($user['autorite'] === 'Admin') {
                $isAuthorized = true;
            } elseif ($user['autorite'] === 'Prof') {
                // Récupérer la filière de l'utilisateur (supposons que ce soit stocké dans la session)
                $userFiliere = $user['filiere'] ?? null;

                // Récupérer la filière de la ressource
                $ressourceFiliere = $item['id_parcours'] ?? null;

                // Vérifier si les filières correspondent
                if ($userFiliere === $ressourceFiliere) {
                    $isAuthorized = true;
                }
            }
        }
?>
        <div class="bubble" data-id="<?= $item['id_ressource'] ?>">
            <?php if ($isAuthorized): ?>
                <div class="bubble-settings">
                    <i class="fa-solid fa-gear" onclick="enableEditMode(this)"></i>
                    <form method="post" onsubmit="return confirm('Confirmer la suppression ?');">
                        <input type="hidden" name="id" value="<?= htmlspecialchars($item['id']) ?>">
                        <button type="submit" name="delete_ressource" class="icon-button" title="Supprimer">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </form>
                </div>
            <?php endif; ?>
            <div class="Image">
                <img src="../upload/<?= htmlspecialchars($item['id_parcours']) ?>/image/<?= htmlspecialchars($item['id_parcours']) ?><?= htmlspecialchars($item['annee']) ?>/<?= htmlspecialchars(str_replace('S', 'semestre', $item['semestre'])) ?>/<?= htmlspecialchars($item['type']) ?>/<?= htmlspecialchars($item['id_ressource']) ?>.<?= htmlspecialchars($item['extension']) ?>" alt="" onclick="window.location.href='../Cours/Cours.php?id=<?= htmlspecialchars($item['id']) ?>'">
            </div>
            <div class="Info">
                <p><strong><?= htmlspecialchars($item['id_ressource']) ?></strong></p>
                <p><?= htmlspecialchars($item['nom_ressource']) ?></p>
            </div>
            <form class="edit-form" method="post" enctype="multipart/form-data" onsubmit="return syncContent(this);" style="display: none;">
                <input type="hidden" name="id" value="<?= htmlspecialchars($item['id']) ?>">
                <input type="hidden" name="id_parcours" value="<?= htmlspecialchars($item['id_parcours']) ?>">
                <input type="hidden" name="annee" value="<?= htmlspecialchars($item['annee']) ?>">
                <input type="hidden" name="semestre" value="<?= htmlspecialchars($item['semestre']) ?>">
                <input type="hidden" name="type" value="<?= htmlspecialchars($item['type']) ?>">

                <!-- Affichage modifiable -->
                <p contenteditable="true" class="editable" data-field="id_ressource"><strong><?= htmlspecialchars($item['id_ressource']) ?></strong></p>
                <p contenteditable="true" class="editable" data-field="nom_ressource"><?= htmlspecialchars($item['nom_ressource']) ?></p>

                <!-- Champs masqués pour POST -->
                <input type="hidden" name="id_ressource" value="<?= htmlspecialchars($item['id_ressource']) ?>">
                <input type="hidden" name="nom_ressource" value="<?= htmlspecialchars($item['nom_ressource']) ?>">

                <div class="upload-zone" ondrop="handleDrop(event, this)" ondragover="event.preventDefault()">
                    <p>Glissez une image ici ou cliquez</p>
                    <input type="file" class="file-Input" name="image" accept="image/*" onchange="previewImage(this)">
                    <img class="preview" src="#" alt="Aperçu de l'image">
                </div>

                <div class="bubble-settings">
                    <button type="submit" class="icon-button green" name="submit_modif"><i class="fa-solid fa-check"></i></button>
                    <button type="button" class="icon-button red" onclick="cancelEdit(this)"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </form>
        </div>
    <?php } ?>
<?php } else {
    echo "Aucune donnée trouvée pour les paramètres fournis.";
}
?>
<?php //Ajout de Ressource ?>
<?php if (isset($user['autorite']) && ($user['autorite'] === 'Admin' or $user['autorite'] === 'Prof')): ?>
    <div class="Abubble">
        <div class="Ajout">
            + Ajouter
        </div>
        <form class="edit-form" id="ADJ" method="post" enctype="multipart/form-data" onsubmit="return syncContent(this);" style="display: none">
            <input type="hidden" name="id_parcours" value="<?= htmlspecialchars($id) ?>">
            <input type="hidden" name="annee" value="<?= htmlspecialchars($anneeParam) ?>">
            <input type="hidden" name="semestre" value="<?= htmlspecialchars($semestreParam) ?>">
            <input type="hidden" name="type" value="<?= htmlspecialchars($partieParam) ?>">

            <p contenteditable="true" class="editable" data-field="id_ressource"><strong>ID</strong></p>
            <p contenteditable="true" class="editable" data-field="nom_ressource">Descriptif</p>
            <select name="semestre" class="editable" data-field="semestre">
                <option value="S1" <?= ($semestreParam === "S1") ? "selected" : "" ?>>Semestre 1</option>
                <option value="S2" <?= ($semestreParam === "S2") ? "selected" : "" ?>>Semestre 2</option>
            </select>

            <input type="hidden" name="id_ressource" value="ID">
            <input type="hidden" name="nom_ressource" value="Descriptif">

            <div class="upload-zone" ondrop="handleDrop(event, this)" ondragover="event.preventDefault()">
                <p>Glissez une image ici ou cliquez</p>
                <input type="file" class="file-Input" name="image" accept="image/*" onchange="previewImage(this)">
                <img class="preview" src="#" alt="Aperçu de l'image">
            </div>

            <div class="bubble-settings">
                <button type="submit" class="icon-button green" name="submit_modif"><i class="fa-solid fa-check"></i></button>
                <button type="button" class="icon-button red" onclick="AcancelEdit()"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </form>
    </div>
<?php endif; ?>

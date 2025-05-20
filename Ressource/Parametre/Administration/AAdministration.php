<?php
try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM', '22312218', '981411');
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Recuperation des options Enum
function getEnumValues(PDO $pdo, string $table, string $column): array {
    $query = $pdo->prepare("SHOW COLUMNS FROM `$table` LIKE :column");
    $query->execute([':column' => $column]);
    $row = $query->fetch(PDO::FETCH_ASSOC);

    if (!$row) return [];

    // Le type est de la forme: enum('val1','val2','val3')
    preg_match("/^enum\('(.*)'\)$/", $row['Type'], $matches);
    if (!isset($matches[1])) return [];

    $values = explode("','", $matches[1]);
    return $values;
}

$autorites = getEnumValues($pdo, 'Utilisateurs', 'autorite');
$filieres = getEnumValues($pdo, 'Filiere', 'filiere');
$annees = getEnumValues($pdo, 'Filiere', 'annee');
$groupes = getEnumValues($pdo, 'Filiere', 'groupe');



// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['utilisateur_id'];
    $action = $_POST['action'] ?? '';

    if ($action === 'modifier') {
        $autorite = $_POST['autorite'];
        $filiere = $_POST['filiere'] ?: null;
        $annee = $_POST['annee'] ?: null;
        $groupe = $_POST['groupe'] ?: null;

        // Mise à jour de l'autorité dans Utilisateurs seulement pour administrateur
        if ($user['autorite'] === 'Admin') {
            $updateUser = $pdo->prepare("UPDATE Utilisateurs SET autorite = :autorite WHERE id = :id");
            $updateUser->execute([
                ':autorite' => $autorite,
                ':id' => $id
            ]);
        }

        // Vérifie si l'entrée Filiere existe
        $checkFiliere = $pdo->prepare("SELECT id FROM Filiere WHERE Utilisateur_id = :id");
        $checkFiliere->execute([':id' => $id]);
        $exist = $checkFiliere->fetch();

        if ($exist) {
            // Mise à jour
            $updateFiliere = $pdo->prepare("
                UPDATE Filiere 
                SET filiere = :filiere, annee = :annee, groupe = :groupe 
                WHERE Utilisateur_id = :id
            ");
            $updateFiliere->execute([
                ':filiere' => $filiere,
                ':annee' => $annee,
                ':groupe' => $groupe,
                ':id' => $id
            ]);
        } else {
            // Insertion
            $insertFiliere = $pdo->prepare("
                INSERT INTO Filiere (Utilisateur_id, filiere, annee, groupe) 
                VALUES (:id, :filiere, :annee, :groupe)
            ");
            $insertFiliere->execute([
                ':id' => $id,
                ':filiere' => $filiere,
                ':annee' => $annee,
                ':groupe' => $groupe
            ]);
        }
    } elseif ($action === 'supprimer') {
        // Supprimer d'abord la filière liée
        $deleteFiliere = $pdo->prepare("DELETE FROM Filiere WHERE Utilisateur_id = :id");
        $deleteFiliere->execute([':id' => $id]);

        // Puis supprimer l'utilisateur
        $deleteUser = $pdo->prepare("DELETE FROM Utilisateurs WHERE id = :id");
        $deleteUser->execute([':id' => $id]);
    }
}

// Chargement des données après mise à jour
$sql = "
    SELECT 
        u.id AS utilisateur_id,
        u.nom, 
        u.prenom, 
        u.email, 
        u.genre, 
        u.naissance, 
        u.autorite,
        f.filiere, 
        f.annee, 
        f.groupe
    FROM Utilisateurs u
    LEFT JOIN Filiere f ON f.Utilisateur_id = u.id
    ORDER BY u.id
";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$donnees = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>



<h2>Liste des Utilisateurs</h2>
<table border="2">
    <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Prénom</th>
        <th>Email</th>
        <th>Genre</th>
        <th>Naissance</th>
        <th>Autorité</th>
        <th>Filière</th>
        <th>Année</th>
        <th>Groupe</th>
        <th>Action</th>
    </tr>
    <?php foreach ($donnees as $row): ?>
        <?php
            $isProf = $user['autorite'] === 'Prof';
            $isNotEtudiant = $row['autorite'] !== 'Etudiant';
            $readOnly = $isProf && $isNotEtudiant;
        ?>
        <tr>
            <form method="POST">
                <input type="hidden" name="utilisateur_id" value="<?= $row['utilisateur_id'] ?>">
                <td><?= htmlspecialchars($row['utilisateur_id']) ?></td>
                <td><?= htmlspecialchars($row['nom']) ?></td>
                <td><?= htmlspecialchars($row['prenom']) ?></td>
                <td><?= htmlspecialchars($row['email']) ?></td>
                <td><?= htmlspecialchars($row['genre']) ?></td>
                <td><?= htmlspecialchars($row['naissance']) ?></td>
                <td>
                    <?php if ($user['autorite'] === 'Admin'): ?>
                        <select name="autorite">
                            <?php foreach ($autorites as $role): ?>
                                <option value="<?= $role ?>" <?= $row['autorite'] === $role ? 'selected' : '' ?>><?= $role ?></option>
                            <?php endforeach; ?>
                        </select>
                    <?php else: ?>
                        <?= htmlspecialchars($row['autorite']) ?>
                        <input type="hidden" name="autorite" value="<?= htmlspecialchars($row['autorite']) ?>">
                    <?php endif; ?>
                </td>
                <td>
                    <?php if ($readOnly): ?>
                        <?= htmlspecialchars($row['filiere']) ?>
                        <input type="hidden" name="filiere" value="<?= htmlspecialchars($row['filiere']) ?>">
                    <?php else: ?>
                        <select name="filiere">
                            <option value=""></option>
                            <?php foreach ($filieres as $f): ?>
                                <option value="<?= $f ?>" <?= $row['filiere'] === $f ? 'selected' : '' ?>><?= $f ?></option>
                            <?php endforeach; ?>
                        </select>
                    <?php endif; ?>
                </td>
                <td>
                    <?php if ($readOnly): ?>
                        <?= htmlspecialchars($row['annee']) ?>
                        <input type="hidden" name="annee" value="<?= htmlspecialchars($row['annee']) ?>">
                    <?php else: ?>
                        <select name="annee">
                            <option value=""></option>
                            <?php foreach ($annees as $a): ?>
                                <option value="<?= $a ?>" <?= $row['annee'] === $a ? 'selected' : '' ?>><?= $a ?></option>
                            <?php endforeach; ?>
                        </select>
                    <?php endif; ?>
                </td>
                <td>
                    <?php if ($readOnly): ?>
                        <?= htmlspecialchars($row['groupe']) ?>
                        <input type="hidden" name="groupe" value="<?= htmlspecialchars($row['groupe']) ?>">
                    <?php else: ?>
                        <select name="groupe">
                            <option value=""></option>
                            <?php foreach ($groupes as $g): ?>
                                <option value="<?= $g ?>" <?= $row['groupe'] === $g ? 'selected' : '' ?>><?= $g ?></option>
                            <?php endforeach; ?>
                        </select>
                    <?php endif; ?>
                </td>
                <td>
                    <?php if (!$readOnly): ?>
                        <button type="submit" name="action" value="modifier">Modifier</button>
                    <?php endif; ?>
                    <?php if ($user['autorite'] === 'Admin'): ?>
                        <button type="submit" name="action" value="supprimer" onclick="return confirm('Confirmer la suppression ?');">Supprimer</button>
                    <?php endif; ?>
                </td>
            </form>
        </tr>
    <?php endforeach; ?>
</table>

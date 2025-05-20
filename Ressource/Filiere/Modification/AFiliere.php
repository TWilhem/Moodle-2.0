<?php
// Charger les données JSON
$jsonPath = '../Filiere.json';
$filiereData = file_exists($jsonPath) ? json_decode(file_get_contents($jsonPath), true) : [];

$id = $_GET['id'] ?? null;
$filiere = null;

if ($id) {
    foreach ($filiereData as $item) {
        if ($item['ID'] === $id) {
            $filiere = $item;
            break;
        }
    }
}
?>


<?php if ($filiere): ?>
    <h2 contenteditable="true"><?= htmlspecialchars($filiere['Nom']) ?></h2>

    <div class="upload-zone" id="uploadZone">
        <?php if (!empty($filiere['Image'])): ?>
            <input type="file" id="fileInput">
            <img id="previewImage" src="../upload/<?= htmlspecialchars($filiere['ID']) ?>/image/<?= htmlspecialchars($filiere['Image']) ?>" alt="<?= htmlspecialchars($filiere['Nom']) ?>" alt="Aperçu de l'image">
        <?php else: ?>
            <div class="drop-placeholder">+</div>
            <input type="file" id="fileInput">
            <img id="previewImage" src="#" alt="Aperçu de l'image", style="display: none">
        <?php endif; ?>

    </div>

    <?php foreach ($filiere['Années'] as $anneeIndex => $annee): ?>
        <div class="niveau">
            <h3 contenteditable="true" data-annee-index="0">
                <?= htmlspecialchars($annee['Niveau'] ?? 'Null') ?>
            </h3>
            <ul>
                <?php foreach ($annee['Liens'] as $lienIndex => $lien): ?>
                    <li data-annee="<?= $anneeIndex ?>" data-lien="<?= $lienIndex ?>">
                        <span contenteditable="true" class="editable-lien-nom"><?= htmlspecialchars($lien['Nom']) ?></span>
                        —
                        <span contenteditable="true" class="editable-lien-url"><?= htmlspecialchars($lien['URL']) ?></span>
                    </li>
                <?php endforeach; ?>
                <li class="add-block" data-annee="0">+</li>
            </ul>
        </div>
    <?php endforeach; ?>

    <div class="add-niveau">+</div>

<?php elseif ($id): ?>
    <p>Aucune filière trouvée pour l'ID : <strong><?= htmlspecialchars($id) ?></strong></p>
<?php else: ?>
    <h2 contenteditable="true">Nouvelle Filière</h2>

    <div class="upload-zone" id="uploadZone">
        <div class="drop-placeholder">+</div>
        <input type="file" id="fileInput"  name="image">
        <img id="previewImage" src="#" alt="Aperçu de l'image" style="display: none">
    </div>
        <div class="niveau">
            <h3 contenteditable="true" data-annee-index="0">
                Nouveau niveau
            </h3>
            <ul>
                <li class="add-block" data-annee="0">+</li>
            </ul>
        </div>
    <div class="add-niveau">+</div>
    <script>
        const id = prompt("Veuillez entrer un ID pour la nouvelle filière :");
    </script>
<?php endif; ?>
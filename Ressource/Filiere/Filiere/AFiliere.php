<?php
$filiereData = json_decode(file_get_contents('../Filiere.json'), true);

function convertirNiveau($niveau) {
    switch ($niveau) {
        case 'Première année':
            return 1;
        case 'Seconde année':
            return 2;
        case 'Troisième année':
            return 3;
        default:
            return 0;
    }
}

$semestre = null
?>

<?php foreach ($filiereData as $filiere): ?>
    <div class="bubble">
        <?php if ($user['autorite'] === 'Admin'): ?>
            <div class="bubble-settings">
                <i class="fa-solid fa-gear" style="cursor:pointer;" onclick="window.location.href='../Modification/MFiliere.php?id=<?= $filiere['ID'] ?>'"></i>
            </div>
        <?php endif; ?>

        <div class="Image">
            <img src="../upload/<?= $filiere['ID'] ?>/image/<?= htmlspecialchars($filiere['Image']) ?>" alt="<?= htmlspecialchars($filiere['Nom']) ?>">
        </div>

        <div class="bubble-second-group">
            <p><?= htmlspecialchars($filiere['Nom']) ?></p>

            <?php foreach ($filiere['Années'] as $annee): ?>
                <?php if (!empty($annee['Niveau'])): ?>
                    <div class="bubble-second">
                        <span class="bubble-second-text"><?= htmlspecialchars($annee['Niveau']) ?></span>
                        <div class="sub-links">
                            <?php foreach ($annee['Liens'] as $lien): ?>
                                <a href="../Ressource/Ressource.php?id=<?= htmlspecialchars($filiere['ID']) ?>&A=<?= convertirNiveau($annee['Niveau']) ?>&P=<?= htmlspecialchars($lien['URL']) ?>"><?= htmlspecialchars($lien['Nom']) ?></a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="sub-links">
                        <?php foreach ($annee['Liens'] as $lien): ?>
                            <a href="../Ressource/Ressource.php?id=<?= htmlspecialchars($filiere['ID']) ?>&Partie=<?= htmlspecialchars($lien['URL']) ?>"><?= htmlspecialchars($lien['Nom']) ?></a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
    </div>
<?php endforeach; ?>

<?php if ($user['autorite'] === 'Admin'): ?>
    <div class="Abubble" onclick="window.location.href='../Modification/MFiliere.php'">
        + Ajouter
    </div>
<?php endif; ?>


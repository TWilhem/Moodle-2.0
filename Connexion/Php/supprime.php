<?php
function supprimerDossierComplet(string $dir): bool {
    if (!is_dir($dir)) {
        echo "no";
        return false;
    }

    // Ouvre le dossier
    $elements = scandir($dir);
    foreach ($elements as $element) {
        if ($element === '.' || $element === '..') {
            continue;
        }

        $chemin = $dir . DIRECTORY_SEPARATOR . $element;

        if (is_dir($chemin)) {
            // Appel récursif pour les sous-dossiers
            supprimerDossierComplet($chemin);
        } else {
            // Supprime le fichier
            unlink($chemin);
        }
    }

    // Supprime le dossier vide
    return rmdir($dir);
}


$dossierASupprimer = __DIR__ . '/../../Ressource/Filiere/upload/RT/image/RT1/semestreemestre/';

// echo $dossierASupprimer;
// if (supprimerDossierComplet($dossierASupprimer)) {
//     echo "Dossier supprimé avec succès.";
// } else {
//     echo "Échec de la suppression du dossier.";
// }
?>

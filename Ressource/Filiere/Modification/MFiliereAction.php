<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $filiereFile = __DIR__ . '/../Filiere.json';
    $uploadsDir = __DIR__ . '/../upload/';

    $filiereData = file_exists($filiereFile) ? json_decode(file_get_contents($filiereFile), true) : [];

    $action = $_POST['action'] ?? null;

    function deleteFolderRecursively($folder) {
        if (!is_dir($folder)) return;

        $items = scandir($folder);
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') continue;

            $path = $folder . DIRECTORY_SEPARATOR . $item;
            if (is_dir($path)) {
                deleteFolderRecursively($path); // récursion
            } else {
                unlink($path); // supprime fichier
            }
        }

        rmdir($folder); // supprime dossier une fois vide
    }

    if ($action === 'delete') {
        $id = $_POST['id'] ?? '';
        if ($id) {
            // Supprimer la filière du fichier JSON
            $filiereData = array_filter($filiereData, fn($f) => $f['ID'] !== $id);
            file_put_contents($filiereFile, json_encode(array_values($filiereData), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            // Supprimer les fichiers associés
            $dir = $uploadsDir . $id;
            if (is_dir($dir)) {
                deleteFolderRecursively($dir);
            }

            header('Location: ../Filiere/Filiere.php');
            exit;
        }
    }

    if ($action === 'export') {
        $exportedData = $_POST['data'] ?? null;

        if ($exportedData) {
            $newFiliere = json_decode($exportedData, true);
            $id = $newFiliere['ID'] ?? null;

            if ($id) {
                // Charger le fichier existant
                $filiereFile = __DIR__ . '/../Filiere.json';
                $filiereData = file_exists($filiereFile) ? json_decode(file_get_contents($filiereFile), true) : [];

                // Chercher l’entrée à mettre à jour
                $found = false;
                foreach ($filiereData as &$filiere) {
                    if ($filiere['ID'] === $id) {
                        $filiere = $newFiliere;
                        $found = true;
                        break;
                    }
                }

                // Sinon, ajouter une nouvelle filière
                if (!$found) {
                    $filiereData[] = $newFiliere;
                }
                
                // Enregistre l'image dans son dossier (id)
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = __DIR__ . '/../upload/' . $id . '/';
                    $uploadDirImage = $uploadDir . 'image/';
                    if (!file_exists($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                        chmod($uploadDir, 0777);
                        mkdir($uploadDirImage, 0777, true);
                        chmod($uploadDirImage, 0777);
                    }

                    $imageName = basename($_FILES['image']['name']);
                    $imagePath = $uploadDirImage . $imageName;

                    // Déplace l'image uploadée
                    if (move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
                        $newFiliere['Image'] = $imageName;
                    } else {
                        echo "Échec de l'enregistrement de l'image.";
                        exit;
                    }
                }

                // Sauvegarder dans le fichier
                file_put_contents($filiereFile, json_encode($filiereData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

                // Reponse et Redirection
                echo json_encode([
                    'success' => true,
                    'redirect_url' => "MFiliere.php?id=" . urlencode($id)
                ]);
                exit;
            } else {
                echo "ID manquant dans les données exportées.";
                exit;
            }
        } else {
            echo "Aucune donnée reçue.";
            exit;
        }
    }

    echo json_encode(["message" => "Action inconnue."]);
    exit;
}
?>

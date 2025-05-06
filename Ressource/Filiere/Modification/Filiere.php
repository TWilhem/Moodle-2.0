<?php
// Autoriser les requêtes depuis un autre domaine (si nécessaire)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Vérifie que la méthode est POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lire le JSON brut envoyé
    $json = file_get_contents('php://input');

    // Vérifier que le JSON est valide
    if ($json === false || empty($json)) {
        http_response_code(400);
        echo json_encode(["message" => "Aucune donnée reçue."]);
        exit;
    }

    // Tenter de décoder (valide JSON)
    $decoded = json_decode($json, true);
    if ($decoded === null) {
        http_response_code(400);
        echo json_encode(["message" => "JSON invalide."]);
        exit;
    }

    // Écrire les données dans le fichier
    $result = file_put_contents('Filiere.json', json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    if ($result === false) {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de l'écriture."]);
    } else {
        echo json_encode(["message" => "Fichier mis à jour avec succès."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Méthode non autorisée."]);
}
?>

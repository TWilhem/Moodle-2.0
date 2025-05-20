<?php
try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM', '22312218', '981411');
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

$id = $_POST['id'];
$repertoire = $_POST['repertoire'];
$description = $_POST['description'];
$file = isset($_POST['file']) ? $_POST['file'] : null;
$dateDebut = isset($_POST['date_debut']) ? $_POST['date_debut'] : null;
$dateFin = isset($_POST['date_fin']) ? $_POST['date_fin'] : null;

$sql = "UPDATE Cours SET repertoire = ?, description = ?, file = ?, date_debut = ?, date_fin = ? WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$repertoire, $description, $file, $dateDebut, $dateFin, $id]);

echo "Bulle modifiée avec succès!";
?>

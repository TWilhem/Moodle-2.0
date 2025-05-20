<?php
try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM', '22312218', '981411');
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

$id_secondary = $_POST['id_secondary'];
$repertoire = $_POST['repertoire'];
$description = $_POST['description'];
$file = isset($_POST['file']) ? $_POST['file'] : null;
$dateDebut = isset($_POST['date_debut']) ? $_POST['date_debut'] : null;
$dateFin = isset($_POST['date_fin']) ? $_POST['date_fin'] : null;

$sql = "INSERT INTO Cours (id_secondary, repertoire, description, file, date_debut, date_fin) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id_secondary, $repertoire, $description, $file, $dateDebut, $dateFin]);

echo "Bulle ajoutée avec succès!";
?>

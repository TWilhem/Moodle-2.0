<?php
try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM', '22312218', '981411');
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Vérifiez si l'utilisateur est connecté
if (!isset($_SESSION['user'])) {
    die("Utilisateur non connecté.");
}

$user = $_SESSION['user'];

// Récupérer la filière et l'année de l'utilisateur
$sql = "SELECT filiere, annee FROM Filiere WHERE Utilisateur_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user['id']]);
$filiereInfo = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$filiereInfo) {
    die("Aucune filière trouvée pour cet utilisateur.");
}

$filiere = $filiereInfo['filiere'];
$annee = $filiereInfo['annee'];

// Construire la requête SQL en fonction de la disponibilité de l'année
$sql = "SELECT Cours.description, Cours.date_fin
        FROM Cours
        JOIN Ressources ON Cours.id_secondary = Ressources.id
        WHERE Ressources.id_parcours = ?";

$params = [$filiere];

if ($annee !== null) {
    $sql .= " AND Ressources.annee = ?";
    $params[] = $annee;
}

$sql .= " ORDER BY Cours.date_fin ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$cours = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$cours) {
    echo "<p>Aucun cours trouvé pour cette filière" . ($annee !== null ? " et cette année." : ".") . "</p>";
} else {
    echo "<div class='bubble-container'>";
    echo "<h2>Descriptions des cours pour la filière $filiere" . ($annee !== null ? " et l'année $annee" : "") . "</h2>";

    // Ajout des pastilles de sélection
    echo "<div class='filter-buttons'>";
    echo "<button onclick='filterCours(\"all\")'>Tous</button>";
    echo "<button onclick='filterCours(\"upcoming\")'>À venir</button>";
    echo "<button onclick='filterCours(\"expired\")'>Dépassés</button>";
    echo "<button onclick='filterCours(\"no-date\")'>Sans date limite</button>";
    echo "</div>";

    foreach ($cours as $coursItem) {
        $dateFin = isset($coursItem['date_fin']) ? new DateTime($coursItem['date_fin']) : null;
        $aujourdHui = new DateTime();
        $isDepasse = $dateFin && $dateFin < $aujourdHui;
        $hasDate = $dateFin !== null;
        $style = $isDepasse ? "style='background-color: #ccc;'" : "";

        $dataFilter = $isDepasse ? "expired" : ($hasDate ? "upcoming" : "no-date");

        echo "<div class='cours-block' $style data-filter='$dataFilter'>";
        echo "<p class='description'>" . nl2br(htmlspecialchars($coursItem['description'])) . "</p>";
        echo "<p class='date-fin'>Date de fin: " . ($dateFin ? $dateFin->format('Y-m-d') : "Aucune date limite") . "</p>";
        echo "</div>";
    }
    echo "</div>";
}
?>

<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: ../../Connexion/Inscri-Login/Connexion.html");
    exit();
}

$user = $_SESSION['user'];

// Connexion à la base de données avec PDO
try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM', '22312218', '981411');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// Récupération des données de la base de données
$sql = "SELECT * FROM Planning";
$stmt = $pdo->query($sql);

$events = [];
if ($stmt) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $events[] = $row;
    }
}

// Fonction pour générer le calendrier
function creationCalendrier($jour_debut, $mois_debut, $annee_debut) {
    $calendrier = [];
    $nom_jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    $jour = $jour_debut;
    $mois = $mois_debut;
    $annee = $annee_debut;
    $i = 0;

    while ($i < 371) {
        $joursDansMois = cal_days_in_month(CAL_GREGORIAN, $mois, $annee);
        while ($jour <= $joursDansMois && $i < 371) {
            $calendrier[] = $nom_jours[$i % 7] . " " . $jour . "/" . $mois . "/" . $annee;
            $jour++;
            $i++;
        }
        $mois++;
        if ($mois > 12) {
            $mois = 1;
            $annee++;
        }
        $jour = 1;
    }
    return $calendrier;
}

$date = creationCalendrier(2, 9, 2024);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Planning</title>
    <link rel="stylesheet" href="../style.css" type="text/css">
    <link rel="stylesheet" href="./Planning.css" type="text/css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <script>
        function changeSemaine(delta) {
            const params = new URLSearchParams(window.location.search);
            let semaine = params.get('semaine') ? parseInt(params.get('semaine')) : 0;
            semaine += delta;
            params.set('semaine', semaine);
            window.location.search = params.toString();
        }
    </script>
</head>
<body>
    <!-- Navigation et barre latérale -->
    <!-- ... raccourci ici pour clarté, reste inchangé ... -->

    <div id="planning-wrapper">
        <div class="Calendar">
            <div id="Grid-planning">
                <?php
                $semaine = isset($_GET['semaine']) ? intval($_GET['semaine']) : 0;
                $heures = [];
                for ($h = 8 * 60; $h < 19 * 60; $h += 30) {
                    $heures[] = sprintf('%02d:%02d', intdiv($h, 60), $h % 60);
                }

                echo '<table class="planning-table">';
                echo '<thead><tr><td id="entete"></td>';
                for ($i = 0; $i < 7; $i++) {
                    echo '<td id="entete">' . $date[$semaine * 7 + $i] . '</td>';
                }
                echo '</tr></thead><tbody>';

                foreach ($heures as $heureIndex => $heure) {
                    echo '<tr><td id="entete">' . $heure . '</td>';
                    for ($jour = 0; $jour < 7; $jour++) {
                        echo '<td id="cell-' . $jour . '-' . $heureIndex . '"></td>';
                    }
                    echo '</tr>';
                }
                echo '</tbody></table>';

                // Génération des événements
                echo "<script>";
                foreach ($events as $event) {
                    $event_date = date_create($event['day']);
                    $event_day = date_format($event_date, "j/n/Y");

                    // Trouver le bon jour dans la semaine affichée
                    $dayIndex = -1;
                    for ($i = 0; $i < 7; $i++) {
                        if (strpos($date[$semaine * 7 + $i], $event_day) !== false) {
                            $dayIndex = $i;
                            break;
                        }
                    }
                    if ($dayIndex === -1) continue;

                    $startMinutes = intval(substr($event['start_time'], 0, 2)) * 60 + intval(substr($event['start_time'], 3, 2));
                    $endMinutes = intval(substr($event['end_time'], 0, 2)) * 60 + intval(substr($event['end_time'], 3, 2));

                    // Ajouter dans chaque cellule horaire concernée
                    foreach ($heures as $heureIndex => $heure) {
                        $heureMinutes = intval(substr($heure, 0, 2)) * 60 + intval(substr($heure, 3, 2));
                        if ($heureMinutes >= $startMinutes && $heureMinutes < $endMinutes) {
                            $color = ($event['type'] == 'CM') ? '#e0f7fa' : (($event['type'] == 'TD') ? '#fff081' : '#ff9081');
                            $contenu = htmlspecialchars($event['location']) . '<br>' .
                                       htmlspecialchars($event['teacher']) . ' (' .
                                       htmlspecialchars($event['type']) . ')';

                            echo "document.getElementById('cell-{$dayIndex}-{$heureIndex}').innerHTML += 
                                `<div class='div' style='background-color:{$color}; font-size:0.8em; padding:2px;'>{$contenu}</div>`;";
                        }
                    }
                }
                echo "</script>";
                ?>
            </div>

            <div class="change-semaine">
                <button onclick="changeSemaine(-1)" class="btn" id="previous">Semaine précédente</button>
                <button onclick="changeSemaine(1)" class="btn" id="next">Semaine suivante</button>
            </div>
        </div>
    </div>
</body>
</html>

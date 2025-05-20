<?php
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo "<p>ID invalide ou manquant dans l'URL.</p>";
    exit();
}

try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8;dbname=db_WILHEM', '22312218', '981411');
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

$id_secondary = intval($_GET['id']);
$user = $_SESSION['user'];

// Vérifiez si l'utilisateur est Admin
$isAdmin = isset($user['autorite']) && $user['autorite'] === 'Admin';

// Vérifiez si l'utilisateur est Prof
$isProf = isset($user['autorite']) && $user['autorite'] === 'Prof';

// Récupérer la filière de l'utilisateur
$userFiliere = $user['filiere'] ?? null;

// Récupérer la filière associée au cours
$sqlFiliere = "SELECT id_parcours FROM Ressources WHERE id = ?";
$stmtFiliere = $pdo->prepare($sqlFiliere);
$stmtFiliere->execute([$id_secondary]);
$ressource = $stmtFiliere->fetch(PDO::FETCH_ASSOC);
$coursFiliere = $ressource['id_parcours'] ?? null;

// Vérifier si l'utilisateur appartient à la filière du cours
if (!$isAdmin && ($isProf && $userFiliere !== $coursFiliere)) {
    header("Location: ../Filiere/Filiere.php"); // Rediriger vers une autre page
    exit();
}

$sql = "SELECT id, repertoire, description, file, date_debut, date_fin FROM Cours WHERE id_secondary = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id_secondary]);
$cours = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<div class='bubble-container'>";

if (!$cours) {
    echo "<p>Aucun cours trouvé pour cette ressource.</p>";
} else {
    $repertoires = array_unique(array_column($cours, 'repertoire'));

    echo "<div class='index-list'>";
    foreach ($repertoires as $repertoire) {
        echo "<div class='index-item' onclick='filterBubbles(\"$repertoire\")'>" . htmlspecialchars($repertoire) . "</div>";
    }
    echo "</div>";
    echo "<div class='main-bubble'>";
    foreach ($cours as $coursItem) {
        echo "<div class='cours-block' data-repertoire='" . htmlspecialchars($coursItem['repertoire']) . "'>";
        echo "<p class='description'>" . nl2br(htmlspecialchars($coursItem['description'])) . "</p>";
        echo "<p class='date-info'>Date de début: " . htmlspecialchars($coursItem['date_debut']) . "</p>";
        if ($coursItem['date_fin']) {
            echo "<p class='date-info'>Date de fin: " . htmlspecialchars($coursItem['date_fin']) . "</p>";
        } else {
            echo "<p class='date-info'>Date de fin: Non spécifiée</p>";
        }

        // Afficher le bouton de téléchargement seulement si le champ 'file' n'est pas vide
        if (!empty($coursItem['file'])) {
            echo "<a class='download-link' href='../../../fichiers/{$coursItem['file']}' download>Télécharger : " . htmlspecialchars($coursItem['file']) . "</a>";
        }

        // Ajouter un bouton d'édition si l'utilisateur est Admin ou Prof
        if ($isAdmin || $isProf) {
            echo "<button class='edit-button' onclick='editBubble(" . htmlspecialchars(json_encode($coursItem)) . ")'>Modifier</button>";
        }

        echo "</div>";
    }
    echo "</div>";
}

// Ajouter un bouton pour ajouter une nouvelle bulle si l'utilisateur est Admin ou Prof
if ($isAdmin || $isProf) {
    echo "<button class='add-button' onclick='showAddBubbleForm()'>Ajouter une bulle</button>";
}

echo "</div>";

// Formulaire pour ajouter une nouvelle bulle
echo "<div id='addBubbleForm' class='edit-form'>";
echo "<h2>Ajouter une bulle</h2>";
echo "<form id='formAddBubble'>";
echo "<input type='text' id='newRepertoire' placeholder='Répertoire' required><br>";
echo "<textarea id='newDescription' placeholder='Description' required></textarea><br>";
echo "<input type='text' id='newFile' placeholder='Fichier'><br>";
echo "<input type='datetime-local' id='newDateDebut' placeholder='Date de début'><br>";
echo "<input type='datetime-local' id='newDateFin' placeholder='Date de fin'><br>";
echo "<button type='button' onclick='addBubble()'>Ajouter</button>";
echo "</form>";
echo "</div>";

// Formulaire pour modifier une bulle
echo "<div id='editBubbleForm' class='edit-form'>";
echo "<h2>Modifier la bulle</h2>";
echo "<form id='formEditBubble'>";
echo "<input type='hidden' id='editId'><br>";
echo "<input type='text' id='editRepertoire' placeholder='Répertoire' required><br>";
echo "<textarea id='editDescription' placeholder='Description' required></textarea><br>";
echo "<input type='text' id='editFile' placeholder='Fichier'><br>";
echo "<input type='datetime-local' id='editDateDebut' placeholder='Date de début'><br>";
echo "<input type='datetime-local' id='editDateFin' placeholder='Date de fin'><br>";
echo "<button type='button' onclick='saveBubble()'>Enregistrer</button>";
echo "</form>";
echo "</div>";

echo "<script>
function filterBubbles(repertoire) {
    var bubbles = document.querySelectorAll('.cours-block');
    bubbles.forEach(function(bubble) {
        if (bubble.getAttribute('data-repertoire') === repertoire) {
            bubble.style.display = 'block';
        } else {
            bubble.style.display = 'none';
        }
    });
}

function showAddBubbleForm() {
    document.getElementById('addBubbleForm').style.display = 'block';
}

function editBubble(coursItem) {
    document.getElementById('editBubbleForm').style.display = 'block';
    document.getElementById('editId').value = coursItem.id;
    document.getElementById('editRepertoire').value = coursItem.repertoire;
    document.getElementById('editDescription').value = coursItem.description;
    document.getElementById('editFile').value = coursItem.file;

    // Convertir les dates au format datetime-local
    if (coursItem.date_debut) {
        var dateDebut = new Date(coursItem.date_debut);
        var dateDebutLocal = dateDebut.toISOString().slice(0, 16);
        document.getElementById('editDateDebut').value = dateDebutLocal;
    }

    if (coursItem.date_fin) {
        var dateFin = new Date(coursItem.date_fin);
        var dateFinLocal = dateFin.toISOString().slice(0, 16);
        document.getElementById('editDateFin').value = dateFinLocal;
    }
}

function addBubble() {
    var repertoire = document.getElementById('newRepertoire').value;
    var description = document.getElementById('newDescription').value;
    var file = document.getElementById('newFile').value;
    var dateDebut = document.getElementById('newDateDebut').value;
    var dateFin = document.getElementById('newDateFin').value;

    fetch('add_bubble.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'id_secondary=".$id_secondary."&repertoire=' + encodeURIComponent(repertoire) + '&description=' + encodeURIComponent(description) + (file ? '&file=' + encodeURIComponent(file) : '') + (dateDebut ? '&date_debut=' + encodeURIComponent(dateDebut) : '') + (dateFin ? '&date_fin=' + encodeURIComponent(dateFin) : '')
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function saveBubble() {
    var id = document.getElementById('editId').value;
    var repertoire = document.getElementById('editRepertoire').value;
    var description = document.getElementById('editDescription').value;
    var file = document.getElementById('editFile').value;
    var dateDebut = document.getElementById('editDateDebut').value;
    var dateFin = document.getElementById('editDateFin').value;

    fetch('edit_bubble.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'id=' + encodeURIComponent(id) + '&repertoire=' + encodeURIComponent(repertoire) + '&description=' + encodeURIComponent(description) + (file ? '&file=' + encodeURIComponent(file) : '') + (dateDebut ? '&date_debut=' + encodeURIComponent(dateDebut) : '') + (dateFin ? '&date_fin=' + encodeURIComponent(dateFin) : '')
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
</script>";
?>

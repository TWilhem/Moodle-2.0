document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
        document.getElementById("filiere-info").textContent = "Aucun ID fourni dans l'URL.";
        return;
    }

    let filiereData = [];

    fetch('../Filiere.json')
        .then(response => {
            if (!response.ok) throw new Error("Erreur de chargement du fichier Filiere.json");
            return response.json();
        })
        .then(data => {
            filiereData = data;
            const filiere = data.find(item => item.ID === id);

            if (!filiere) {
                document.getElementById("filiere-info").textContent = "Aucune filière trouvée pour l'ID : " + id;
                return;
            }

            renderFiliere(filiere);
        })
        .catch(error => {
            console.error("Erreur :", error);
            document.getElementById("filiere-info").textContent = "Erreur de chargement des données.";
        });

    function renderFiliere(filiere) {
        const container = document.getElementById("filiere-info");
        container.innerHTML = `
            <h2>${filiere.Nom}</h2>
            <img src="../${filiere.Image}" alt="${filiere.Nom}" style="max-width: 200px;">
        `;

        filiere.Années.forEach((annee, anneeIndex) => {
            const section = document.createElement("div");

            const h3 = document.createElement("h3");
            h3.innerHTML = `${annee.Niveau ?? "Niveau non défini"} <button data-index="${anneeIndex}" class="delete-annee">Supprimer niveau</button>`;
            section.appendChild(h3);

            const ul = document.createElement("ul");
            annee.Liens.forEach((lien, lienIndex) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <a href="${lien.URL}">${lien.Nom}</a>
                    <button data-annee="${anneeIndex}" data-lien="${lienIndex}" class="delete-lien">Supprimer</button>
                `;
                ul.appendChild(li);
            });

            // Ajouter nouveau lien
            const addLi = document.createElement("li");
            addLi.innerHTML = `
                <button data-annee="${anneeIndex}" class="add-lien">Ajouter un lien</button>
            `;
            ul.appendChild(addLi);

            section.appendChild(ul);
            container.appendChild(section);
        });

        // Ajouter un nouveau niveau
        const addNiveauBtn = document.createElement("button");
        addNiveauBtn.textContent = "Ajouter un niveau";
        addNiveauBtn.id = "add-niveau";
        container.appendChild(addNiveauBtn);
    }

    // Gestionnaire d’événements global
    document.addEventListener("click", (e) => {
        const filiere = filiereData.find(item => item.ID === id);
        if (!filiere) return;

        // Supprimer un niveau
        if (e.target.classList.contains("delete-annee")) {
            const index = parseInt(e.target.dataset.index);
            filiere.Années.splice(index, 1);
            renderFiliere(filiere);
        }

        // Supprimer un lien
        if (e.target.classList.contains("delete-lien")) {
            const anneeIdx = parseInt(e.target.dataset.annee);
            const lienIdx = parseInt(e.target.dataset.lien);
            filiere.Années[anneeIdx].Liens.splice(lienIdx, 1);
            renderFiliere(filiere);
        }

        // Ajouter un lien
        if (e.target.classList.contains("add-lien")) {
            const anneeIdx = parseInt(e.target.dataset.annee);
            const nom = prompt("Nom du lien :");
            const url = "#"
            if (nom && url) {
                filiere.Années[anneeIdx].Liens.push({ Nom: nom, URL: url });
                renderFiliere(filiere);
            }
        }

        // Ajouter un niveau
        if (e.target.id === "add-niveau") {
            const niveau = prompt("Nom du nouveau niveau :");
            if (niveau) {
                filiere.Années.push({
                    Niveau: niveau,
                    Liens: []
                });
                renderFiliere(filiere);
            }
        }
    });

    // Exporter les données modifiées
    document.getElementById("export-json").addEventListener("click", () => {
        fetch("Filiere.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filiereData)  // filiereData = les données à sauvegarder
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
        })
        .catch(err => {
            console.error("Erreur de sauvegarde :", err);
            alert("Échec de l'enregistrement.");
        });
    });
});

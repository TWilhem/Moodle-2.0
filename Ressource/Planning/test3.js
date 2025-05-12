document.addEventListener("DOMContentLoaded", () => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const heureDebut = 8;
    const heureFin = 19;
    const dureeCreneau = 30; // Utilisé pour l'affichage des heures, mais plus pour le placement
    const couleur=['#e0f7fa','#fff081','#ff9081']
    function formatHeure(heure, minute) {
        return `${String(heure).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function remplissage(data) {
        const joursHeader = Array.from(document.querySelectorAll('.planning-table thead th'));
        const lignesHeures = Array.from(document.querySelectorAll('.planning-table tbody tr'));
        const planningParJour = {};
        let historique=[]
        joursHeader.slice(1).forEach(jourHeader => {
            const jour = jourHeader.textContent.trim();
            planningParJour[jour] = [];
        });

        data.forEach(event => {
            if (planningParJour[event.day]) {
                planningParJour[event.day].push(event);
            } else {
                console.warn(`Jour "${event.day}" non reconnu dans les données.`);
            }
        });

        lignesHeures.forEach(ligneHeure => {
            const heureLigne = ligneHeure.querySelector('td').textContent.trim();
            const heureLigneMinutes = timeToMinutes(heureLigne);
            const cellulesJour = Array.from(ligneHeure.querySelectorAll('td')).slice(1); // Exclut la colonne des heures

            cellulesJour.forEach((celluleJour, indexJour) => {
                const jour = joursHeader[indexJour + 1].textContent.trim(); // +1 pour exclure la colonne des heures
                const evenementsDuJour = planningParJour[jour] || [];

                // Filtrer les événements qui se chevauchent avec cette ligne d'heure
                const evenementsDansCeCreneau = evenementsDuJour.filter(event => {
                    const debutMinutes = timeToMinutes(event.start);
                    const finMinutes = timeToMinutes(event.end);
                    // Ici, on vérifie si l'événement *chevauche* la ligne d'heure.
                    return debutMinutes <= heureLigneMinutes && finMinutes > heureLigneMinutes;
                });

                celluleJour.innerHTML = ''; // IMPORTANT : Nettoie la cellule avant d'ajouter de nouveaux événements

                evenementsDansCeCreneau.forEach(event => {
                    const eventDiv = document.createElement('div');
                    if (event.type=='CM'){eventDiv.style.backgroundColor = couleur[0];}
                    else if (event.type=='TD'){ eventDiv.style.backgroundColor = couleur[1];}
                    else if (event.type=='TP'){ eventDiv.style.backgroundColor = couleur[2];}
                    eventDiv.id=event.title;
                    eventDiv.classList.add(event.start);
                    eventDiv.innerHTML = `${event.title}<br>${event.location}<br>${event.teacher}`;
                    eventDiv.title = `Début: ${event.start}\nFin: ${event.end}`;
                    
                    // Calculer la position et la hauteur de l'événement
                    const debutMinutes = timeToMinutes(event.start);
                    const finMinutes = timeToMinutes(event.end);
                    const dureeEnMinutes = finMinutes - debutMinutes;
                    const decalageEnMinutes = debutMinutes - (Math.floor(debutMinutes / 30) * 30); // Décalage par rapport au début de la tranche de 30 minutes
                    const hauteurPourcentage = (dureeEnMinutes / dureeCreneau) * 100;
                    const topPourcentage = (decalageEnMinutes / dureeCreneau) * 100;


                    eventDiv.style.height = `${hauteurPourcentage}%`;
                    eventDiv.style.top = `${topPourcentage}%`;
                    celluleJour.appendChild(eventDiv);

                });
            });
        });
    }

    function genererHeures(debut, fin, intervalle) {
        const creneaux = [];
        for (let h = debut * 60; h < fin * 60; h += intervalle) {
            const debutHeure = formatHeure(Math.floor(h / 60), h % 60);
            creneaux.push(debutHeure);
        }
        return creneaux;
    }

    const heures = genererHeures(heureDebut, heureFin, dureeCreneau);

    const container = document.getElementById("Grid-planning");
    const table = document.createElement("table");
    table.classList.add("planning-table");

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const emptyTh = document.createElement("th");
    headRow.appendChild(emptyTh);

    jours.forEach(jour => {
        const th = document.createElement("th");
        th.textContent = jour;
        headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    heures.forEach(heure => {
        const row = document.createElement("tr");
        const heureCell = document.createElement("td");
        heureCell.id="entete";
        heureCell.textContent = heure;
        row.appendChild(heureCell);
        jours.forEach(() => {
            const cell = document.createElement("td");
            cell.classList.add("planning-cell");
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    fetch('Planning.json')
        .then(response => response.json())
        .then(data => remplissage(data));
});
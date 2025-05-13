document.addEventListener("DOMContentLoaded", () => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const heureDebut = 8;
    const heureFin = 19;
    const dureeCreneau = 30;
    const couleurEvenement = ['#e0f7fa', '#fff081', '#ff9081'];
    const couleurParDefaut = '#ffffff';

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
        const cellulesTraitees = {};

        joursHeader.slice(1).forEach(jourHeader => {
            const jour = jourHeader.textContent.trim();
            planningParJour[jour] = [];
            cellulesTraitees[jour] = {};
            for (let i = 0; i < lignesHeures.length; i++) {
                cellulesTraitees[jour][i] = false;
            }
        });

        data.forEach(event => {
            if (planningParJour[event.day]) {
                planningParJour[event.day].push(event);
            } else {
                console.warn(`Jour "${event.day}" non reconnu dans les données.`);
            }
        });

        lignesHeures.forEach((ligneHeure, indexLigneHeure) => {
            const heureLigneMinutes = timeToMinutes(ligneHeure.querySelector('td').textContent.trim());

            joursHeader.slice(1).forEach((jourHeader, indexJour) => {
                const jour = jourHeader.textContent.trim();
                const cellulePlanning = document.getElementById(indexLigneHeure * jours.length + indexJour);
                cellulePlanning.style.backgroundColor = couleurParDefaut;

                if (!cellulesTraitees[jour][indexLigneHeure]) {
                    const evenementsDebutantIci = planningParJour[jour].filter(event => timeToMinutes(event.start) === heureLigneMinutes);

                    if (evenementsDebutantIci.length > 0) {
                        cellulePlanning.classList.add('has-event');
                        cellulePlanning.innerHTML = '';

                        const nombreEvenements = evenementsDebutantIci.length;
                        const largeurParEvenement = 100 / nombreEvenements;

                        evenementsDebutantIci.forEach(event => {
                            const eventTd = document.createElement('td');
                            eventTd.textContent = ` ${event.title}\n ${event.location}\n ${event.teacher}`;
                            eventTd.title = `Début: ${event.start}\nFin: ${event.end}`;
                            eventTd.setAttribute("id", event.title);
                            if (event.type == 'CM') {
                                eventTd.style.backgroundColor = couleurEvenement[0];
                            } else if (event.type == 'TD') {
                                eventTd.style.backgroundColor = couleurEvenement[1];
                            } else if (event.type == 'TP') {
                                eventTd.style.backgroundColor = couleurEvenement[2];
                            }
                            eventTd.style.textAlign = 'center';
                            eventTd.style.height = "70px";
                            eventTd.style.width = `${largeurParEvenement}%`;

                            const dureeEnMinutes = timeToMinutes(event.end) - timeToMinutes(event.start);
                            const rowSpan = Math.max(1, Math.round(dureeEnMinutes / dureeCreneau)); // Assurez-vous que rowSpan est au moins 1
                            eventTd.rowSpan = rowSpan;

                            cellulePlanning.appendChild(eventTd);

                            for (let i = 1; i < rowSpan; i++) {
                                if (indexLigneHeure + i < lignesHeures.length) { // Vérifiez les limites du tableau
                                    cellulesTraitees[jour][indexLigneHeure + i] = true;
                                }
                            }
                        });
                    }
                } else {
                    cellulePlanning.innerHTML = '';
                }
            });
        });
    }

    function commeavant(data) {
        const debutMinutes = timeToMinutes(data.start);
        const finMinutes = timeToMinutes(data.end);
        const dureeEnCreneaux = (finMinutes - debutMinutes) / dureeCreneau;
        return dureeEnCreneaux;
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
    let id2 = 0;
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
        heureCell.setAttribute("id", "entete");
        heureCell.textContent = heure;
        row.appendChild(heureCell);

        jours.forEach(() => {
            const cell = document.createElement("td");
            cell.setAttribute("id", id2);
            cell.classList.add("planning-cell");
            cell.style.backgroundColor = couleurParDefaut;
            row.appendChild(cell);
            id2++;
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    fetch('Planning.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            remplissage(data);
        });
});

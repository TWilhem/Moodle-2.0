document.addEventListener("DOMContentLoaded", () => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const heureDebut = 8;
    const heureFin = 19;
    const dureeCreneau = 30;
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
        let id=0
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
        })
        lignesHeures.forEach(ligneHeure => {

            const heureLigne = ligneHeure.querySelector('td').textContent.trim();
            const heureLigneMinutes = timeToMinutes(heureLigne);

            joursHeader.slice(1).forEach((jourHeader, indexJour) => {

                const jour = jourHeader.textContent.trim();
                const celluleJour = document.getElementById(id);
                id++

                const evenementsDansCeCreneau = planningParJour[jour].filter(event => {
                        const debutMinutes = timeToMinutes(event.start);
                        const finMinutes = timeToMinutes(event.end);
                        return heureLigneMinutes >= debutMinutes && heureLigneMinutes < finMinutes;
                    });

                    const nombreEvenements = evenementsDansCeCreneau.length;
                    if (nombreEvenements > 0) {
                        celluleJour.style.display = 'inlineflex';
                        evenementsDansCeCreneau.forEach(event => {

                            const eventDiv = document.createElement('td');
                            eventDiv.textContent = ` ${event.title} \n ${event.salle} \n ${event.location} \n ${event.teacher}`;
                            eventDiv.title = `Début: ${event.start}Fin: ${event.end}`;
                            eventDiv.setAttribute("class","div");
                            eventDiv.setAttribute("id", event.title);
                            if (event.type=='CM'){eventDiv.style.backgroundColor = couleur[0];}
                            else if (event.type=='TD'){ eventDiv.style.backgroundColor = couleur[1];}
                            else if (event.type=='TP'){ eventDiv.style.backgroundColor = couleur[2];}
                            eventDiv.style.textAlign = 'center';
                            const heightDiv=40;
                            console.log(heightDiv);
                            eventDiv.style.maxHeight= `${heightDiv}px`;
                            eventDiv.style.height=`${heightDiv}px`;
                            const largeur = 100 / nombreEvenements;
                            eventDiv.style.width = `${largeur}%`;
                            celluleJour.appendChild(eventDiv);

                        });
                        
                        
                    }
                })
            })
        }


    function mergeIdenticalCells() {
        function areEventsEqual(div1, div2) {
            return div1 && div2 && div1.textContent.trim() === div2.textContent.trim();
        }

        const eventCells = Array.from(document.querySelectorAll('.planning-table tbody td:not(#entete)'));

        for (let i = 0; i < eventCells.length; i++) {
            const currentCell = eventCells[i];
            const currentDiv = currentCell.querySelector('.div');

            if (currentDiv && !currentCell.dataset.merged) {
                let colspan = 1;
                let nextHorizontalCell = eventCells[i + 1];

                while (nextHorizontalCell && !nextHorizontalCell.dataset.merged && areEventsEqual(currentDiv, nextHorizontalCell.querySelector('.div')) && currentCell.parentNode === nextHorizontalCell.parentNode) {
                    colspan++;
                    nextHorizontalCell.dataset.merged = true;
                    nextHorizontalCell = eventCells[i + colspan];
                }

                if (colspan > 1) {
                    currentCell.setAttribute('colspan', colspan);
                }

                let rowspan = 1;
                const tableRows = Array.from(document.querySelectorAll('.planning-table tbody tr'));
                const currentRowIndex = currentCell.parentNode.rowIndex - 1;
                const currentColumnIndex = currentCell.cellIndex;

                for (let j = currentRowIndex + 1; j < tableRows.length; j++) {
                    const nextVerticalRow = tableRows[j];
                    const nextVerticalCell = nextVerticalRow.cells[currentColumnIndex];

                    if (nextVerticalCell && !nextVerticalCell.dataset.merged && areEventsEqual(currentDiv, nextVerticalCell.querySelector('.div'))) {
                        rowspan++;
                        nextVerticalCell.dataset.merged = true;
                    } else {
                        break;
                    }
                }

                if (rowspan > 1) {
                    currentCell.setAttribute('rowspan', rowspan);
                    const heightDiv2=(940/23)*rowspan;
                    //console.log(rowspan)
                    //console.log(heightDiv2)
                    currentDiv.style.maxHeight='none'
                    currentDiv.style.height=`${heightDiv2}px`;                  

                }
            }
        }

        eventCells.forEach(cell => {
            if (cell.dataset.merged) {
                cell.style.display = 'none';
            }
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
    let id2=0;
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
        heureCell.setAttribute("id","entete");
        heureCell.textContent = heure;
        row.appendChild(heureCell);

        jours.forEach(() => {
            const cell = document.createElement("td");
            cell.setAttribute("id",id2);
            cell.classList.add("planning-cell");
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
    mergeIdenticalCells(); // Call the merging function AFTER remplissage
  })

});
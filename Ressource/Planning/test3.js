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
        dico={}
        let id=0
        joursHeader.slice(1).forEach(jourHeader => {
            const jour = jourHeader.textContent.trim();
            planningParJour[jour] = [];
        });

        data.forEach(event => {
            // **IMPORTANT : Assurez-vous que event.day correspond EXACTEMENT (en casse)
            // aux clés de planningParJour (qui sont extraites du header du tableau).**
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
                        celluleJour.style.display = 'inlineflex'; // Utiliser Flexbox pour disposer les événements
                    
                        
                                evenementsDansCeCreneau.forEach(event => {    
                                                               
                                    const eventDiv = document.createElement('td');
                                    eventDiv.textContent = ` ${event.title}\n ${event.location}\n${event.teacher}`;
                                    eventDiv.title = `Début: ${event.start}Fin: ${event.end}`;
                                    eventDiv.setAttribute("class","div");
                                    eventDiv.setAttribute("id", event.title);
                                    //eventDiv.style.display='inline-block'
                                    if (event.type=='CM'){eventDiv.style.backgroundColor = couleur[0];}
                                    else if (event.type=='TD'){ eventDiv.style.backgroundColor = couleur[1];}
                                    else if (event.type=='TP'){ eventDiv.style.backgroundColor = couleur[2];}
                                    eventDiv.style.textAlign = 'center';
                                    eventDiv.style.height="80px";
                                    const largeur = 100 / evenementsDansCeCreneau.length;
                                    eventDiv.style.width = `${largeur}%`; // Utiliser des pourcentages pour la largeur
                                    celluleJour.appendChild(eventDiv);
                                    
                                });
                            if (celluleJour.lastChild) {
                    celluleJour.lastChild.style.borderRight = 'none';
                        }
                    }  
                })
            })
        }       
                    
        
     

    

   function areEventsEqual(div1, div2) {
        return div1 && div2 && div1.textContent.trim() === div2.textContent.trim();
    }

    // Get all the data cells with event divs
    const eventCells = Array.from(document.querySelectorAll('.planning-table tbody td:not(#entete)'));

    // Iterate through the event cells to find and merge identical ones
    for (let i = 0; i < eventCells.length; i++) {
        const currentCell = eventCells[i];
        const currentDiv = currentCell.querySelector('.div');

        if (currentDiv && !currentCell.dataset.merged) { // Only process if it has an event and is not already merged

            // --- Merge Horizontally (Colspan) ---
            let colspan = 1;
            let nextHorizontalCell = eventCells[i + 1];

            while (nextHorizontalCell && !nextHorizontalCell.dataset.merged && areEventsEqual(currentDiv, nextHorizontalCell.querySelector('.div')) && currentCell.parentNode === nextHorizontalCell.parentNode) {
                colspan++;
                nextHorizontalCell.dataset.merged = true; // Mark as merged
                nextHorizontalCell = eventCells[i + colspan];
            }

            if (colspan > 1) {
                currentCell.setAttribute('colspan', colspan);
            }

            // --- Merge Vertically (Rowspan) ---
            let rowspan = 1;
            const tableRows = Array.from(document.querySelectorAll('.planning-table tbody tr'));
            const currentRowIndex = currentCell.parentNode.rowIndex - 1; // Adjust for header row
            const currentColumnIndex = currentCell.cellIndex;

            for (let j = currentRowIndex + 1; j < tableRows.length; j++) {
                const nextVerticalRow = tableRows[j];
                const nextVerticalCell = nextVerticalRow.cells[currentColumnIndex];

                if (nextVerticalCell && !nextVerticalCell.dataset.merged && areEventsEqual(currentDiv, nextVerticalCell.querySelector('.div'))) {
                    rowspan++;
                    nextVerticalCell.dataset.merged = true; // Mark as merged
                } else {
                    break; // Stop if the next cell is different or already merged
                }
            }

            if (rowspan > 1) {
                currentCell.setAttribute('rowspan', rowspan);
            }
        }
    }

    // Finally, hide all the cells that were marked as merged
    eventCells.forEach(cell => {
        if (cell.dataset.merged) {
            cell.style.display = 'none';
        }
    });

    
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
    remplissage(data)
    
  })
  
});

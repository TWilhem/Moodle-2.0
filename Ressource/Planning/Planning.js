document.addEventListener("DOMContentLoaded", () => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const heureDebut = 8;
    const heureFin = 19;
    const dureeCreneau = 30;
    const couleur=['#e0f7fa','#fff081','#ff9081']
    const date=creationcalendrier(2,9,2024)
    function formatHeure(heure, minute) {
        return `${String(heure).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    function creationcalendrier(jour_debut,mois_debut,annee_debut){
        calendrier=[];
        const nom_jours=["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
        let jour=jour_debut;
        let mois=mois_debut;
        let annee=annee_debut;
        let i=0;
        while (i<371){
            if (mois==1 || mois==3 || mois==5 || mois==7 || mois==8 || mois==10){
                while (jour<=31){
                    calendrier.push(nom_jours[i%7]+" " + jour+"/"+mois+"/"+annee);
                    jour++;
                    i++;
                    if (i==371){
                        return calendrier;
                    }                   
                }

                mois++;
                jour=1;
                if (i==371){
                        return calendrier;
                    }   
            }
            else if (mois==4 || mois==6 ||mois==9 ||mois==11){
                while (jour<=30){
                    calendrier.push(nom_jours[i%7]+" " + jour+"/"+mois+"/"+annee);
                    jour++;
                    i++; 
                    if (i==371){
                        return calendrier;
                    }   
                }
                mois++;
                jour=1;
                if (i==371){
                        return calendrier;
                    }   
            }
            else if (mois==2){
                while (jour<=28){
                    calendrier.push(nom_jours[i%7]+" " + jour+"/"+mois+"/"+annee);
                    jour++;
                    i++;
                    if (i==371){
                        return calendrier;
                    }   
                }
                mois++;
                jour=1;

                if (i==371){
                        return calendrier;
                    }  
            }
            else if (mois==12){
                while(jour<=31){
                    calendrier.push(nom_jours[i%7]+" " + jour+"/"+mois+"/"+annee);
                    jour++;
                    i++;
                    if (i==371){
                        return calendrier;
                    }  
                }
                annee++;
                mois=1;
                jour=1;
                if (i==371){
                        return calendrier;
                    }  

            }



        }

        
        
        return calendrier
    }
    function remplissage(data) {
        const joursHeader = Array.from(document.querySelectorAll('.planning-table thead td'));
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
                            eventDiv.title = `Début: ${event.start} Fin: ${event.end}`;
                            eventDiv.setAttribute("class","div");
                            eventDiv.setAttribute("id", event.title);
                            if (event.type=='CM'){eventDiv.style.backgroundColor = couleur[0];}
                            else if (event.type=='TD'){ eventDiv.style.backgroundColor = couleur[1];}
                            else if (event.type=='TP'){ eventDiv.style.backgroundColor = couleur[2];}
                            eventDiv.style.textAlign = 'center';
                            const heightDiv=900/25;
                            eventDiv.style.maxHeight=`${heightDiv}px` ;
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
                    const heightDiv2=(900/23)*rowspan;
                    currentDiv.style.maxHeight=`${heightDiv2}px`;
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
    let semaine=0
    function createtable(semaine){
    const heures = genererHeures(heureDebut, heureFin, dureeCreneau);
    const container = document.getElementById("Grid-planning");
    const oldTable = container.querySelector(".planning-table");
    if (oldTable) {
        container.removeChild(oldTable);
    }
    const oldBarre = container.querySelector(".change-semaine");
    if (oldBarre) {
        container.removeChild(oldBarre);
    }
    let id2=0;
    const table = document.createElement("table");
    table.classList.add("planning-table");

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const emptyTh = document.createElement("td");
    emptyTh.setAttribute("id","entete")
    headRow.appendChild(emptyTh);
    for (let i=0;i<7;i++){
        const th = document.createElement("td");
        th.textContent = date[semaine*7+i];
        th.setAttribute("id",'entete')
        headRow.appendChild(th);
    }
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
    const barre= document.createElement("div");
    barre.setAttribute("class","change-semaine")
    barre.style.height="31px";
    const previous=document.createElement("div");
    previous.setAttribute("class","div2");
    if (semaine !=0){
        const previousbtn=document.createElement("button");
        previousbtn.setAttribute("class",'btn');
        previousbtn.setAttribute("id","previous");
        previousbtn.textContent="semaine précédente";  
        previousbtn.addEventListener('click', () => {
            semaine = semaine - 1;
            createtable(semaine);
        });
        previous.appendChild(previousbtn);
    }
    barre.appendChild(previous);
    const next=document.createElement("div");
    next.setAttribute("class","div2");
    if (semaine!=53){
    const nextbtn=document.createElement("button")
    nextbtn.setAttribute("class",'btn');
    nextbtn.setAttribute("id","next");
    nextbtn.textContent="semaine suivante";
    nextbtn.addEventListener('click', () => {
            semaine = semaine + 1;
            createtable(semaine);
        });
    next.appendChild(nextbtn);
}
    barre.appendChild(next);
    container.appendChild(barre);
     fetch('Planning.json')
  .then(response => {

    return response.json();
  })
  .then(data => {
    remplissage(data);
    mergeIdenticalCells(); // Call the merging function AFTER remplissage
  })
}
   
    
  createtable(semaine)
});
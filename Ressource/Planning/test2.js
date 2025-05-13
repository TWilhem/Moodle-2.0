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
        dico={}
        joursHeader.slice(1).forEach(jourHeader => {
            const jour = jourHeader.textContent.trim();
            planningParJour[jour] = [];
        });

        data.forEach(event => {
            dico[event.title]=commeavant(event)
            // **IMPORTANT : Assurez-vous que event.day correspond EXACTEMENT (en casse)
            // aux clés de planningParJour (qui sont extraites du header du tableau).**
            if (planningParJour[event.day]) {
                planningParJour[event.day].push(event);
            } else {
                console.warn(`Jour "${event.day}" non reconnu dans les données.`);
            }
        });
        //console.log(dico)
        //console.log(planningParJour)
        lignesHeures.forEach(ligneHeure => {
            
            const heureLigne = ligneHeure.querySelector('td').textContent.trim();
            const heureLigneMinutes = timeToMinutes(heureLigne);

            joursHeader.slice(1).forEach((jourHeader, indexJour) => {
                const jour = jourHeader.textContent.trim();
                const celluleJour = ligneHeure.querySelectorAll('td')[indexJour+1];
                

               
                    const evenementsDansCeCreneau = planningParJour[jour].filter(event => {
                        const debutMinutes = timeToMinutes(event.start);
                        const finMinutes = timeToMinutes(event.end);
                        return heureLigneMinutes >= debutMinutes && heureLigneMinutes < finMinutes;
                    });

                    const nombreEvenements = evenementsDansCeCreneau.length;
                    if (nombreEvenements > 0) {
                        celluleJour.classList.add('has-event');
                    }
                    
        });
    })
    function mergeIdenticalDivs() {
        const allTableCells = document.querySelectorAll('.planning-table tbody td');
        const a=allTableCells.length
        for (let i=0;i<a-8;i++){
            const currentCells = allTableCells[i];
            const nextCells = allTableCells[i + 8];
            const currentEventDivs = Array.from(currentCells.querySelectorAll('div'));
            const nextEventDivs = Array.from(nextCells.querySelectorAll('div'));
            currentEventDivs.forEach(currentDiv =>{
                nextEventDivs.forEach(nextDiv =>{
                    if (currentDiv.title==nextDiv.title  ){
                        currentDiv.style.marginBottom='0';
                        nextDiv.style.marginTop='0';
                        currentDiv.style.borderBottom='none';
                        nextDiv.style.borderTop='none'; 
                        nextDiv.innerHTML='';
                        currentDiv.style.paddingBottom = '0';
                        nextDiv.style.paddingTop = '0';
                    }
                })
            })
                        
            }

           }
        
        
    
    
    // Call the merging function after the table is populated
    
    

    function commeavant(data){
        debut=data.start;
        a=debut.split(":");
        a[0]=a[0]*60;
        b=a[0]+a[1];
        fin=data.end;
        c=fin.split(":");
        c[0]=c[0]*60;
        d=c[0]+c[1];
        e=(d-b)/3000;
        return e;
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
    let id=0;
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
            cell.setAttribute("id",id);
            cell.classList.add("planning-cell");
            row.appendChild(cell);
            id++;
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
    mergeIdenticalDivs();
    
  })
  
});
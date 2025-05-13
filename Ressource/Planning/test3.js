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
                        celluleJour.classList.add('has-event');

                                evenementsDansCeCreneau.forEach(event => {                               
                                    const eventDiv = document.createElement('td');
                                    eventDiv.textContent = ` ${event.title}\n ${event.location}\n ${event.teacher}`;
                                    eventDiv.title = `Début: ${event.start}\nFin: ${event.end}`;
                                    eventDiv.setAttribute("id",event.title)
                                    //eventDiv.style.display='inline-block'
                                    if (event.type=='CM'){eventDiv.style.backgroundColor = couleur[0];}
                                    else if (event.type=='TD'){ eventDiv.style.backgroundColor = couleur[1];}
                                    else if (event.type=='TP'){ eventDiv.style.backgroundColor = couleur[2];}
                                    eventDiv.style.textAlign = 'center';
                                    eventDiv.style.height="70px";
                                    const largeur = 100 / evenementsDansCeCreneau.length;
                                    eventDiv.style.width = `${largeur}%`; // Utiliser des pourcentages pour la largeur
                                    
                                    celluleJour.appendChild(eventDiv);
                                    
                                });
                            
                        }
                        
                })
            }) 
        }       
                    
        
     

    

    function mergeIdenticalDivs(data) {
        for (let i=0;i<8;i++){
            for (let j=0;j<22;j++){
                const cell= document.getElementById(i*8+j);
                    if (cell.classList.contains("has-event")) {
                        
                        for (let k=0;k<data.length;k++){
                            const divi=document.getElementById(data[k].title);
                            
                            if(data[k].title==divi.id){
                                let nombre=commeavant(data[k]);
                                
                                divi.style.rowSpan=nombre;
                                console.log(divi)

                                
                            
                            //divi=cell.getElementById(info)
                        }
                       
                    }
            }
            }
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
    mergeIdenticalDivs(data);
    
  })
  
});

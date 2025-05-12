document.addEventListener("DOMContentLoaded", () => {
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const heureDebut = 8;
    const heureFin = 19;
    const dureeCreneau = 30;

    function formatHeure(heure, minute) {
        return `${String(heure).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function genererHeures(debut, fin, intervalle) {
        const creneaux = [];
        for (let h = debut * 60; h < fin * 60; h += intervalle) {
            const debutHeure = formatHeure(Math.floor(h / 60), h % 60);
            creneaux.push(debutHeure);
        }
        return creneaux;
    }

    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    function remplissage(data) {
        const joursHeader = Array.from(document.querySelectorAll('.planning-table thead th'));
        const lignesHeures = Array.from(document.querySelectorAll('.planning-table tbody tr'));
        const planningParJour = {};
        
        joursHeader.slice(1).forEach(jourHeader => {
            const jour = jourHeader.textContent.trim();
            planningParJour[jour] = [];
        });

        data.forEach(event => {
            if (planningParJour[event.day]) {
                planningParJour[event.day].push(event);
            }
        });

        lignesHeures.forEach(ligneHeure => {
            const heureLigne = ligneHeure.querySelector('th').textContent.trim();
            const heureLigneMinutes = timeToMinutes(heureLigne);

            joursHeader.slice(1).forEach((jourHeader, indexJour) => {
                const jour = jourHeader.textContent.trim();
                const celluleJour = ligneHeure.querySelectorAll('td')[indexJour];

                if (celluleJour) {
                    celluleJour.innerHTML = '';
                    celluleJour.style.padding = '0';
                    celluleJour.style.display = 'flex';
                    celluleJour.style.flexDirection = 'column';
                    celluleJour.style.alignItems = 'stretch';
                    celluleJour.style.borderCollapse = 'collapse';

                    const evenementsDansCeCreneau = planningParJour[jour].filter(event => {
                        const debutMinutes = timeToMinutes(event.start);
                        const finMinutes = timeToMinutes(event.end);
                        return heureLigneMinutes >= debutMinutes && heureLigneMinutes < finMinutes;
                    });

                    const nombreEvenements = evenementsDansCeCreneau.length;

                    if (nombreEvenements > 0) {
                        evenementsDansCeCreneau.forEach(event => {
                            const eventDiv = document.createElement('div');
                            eventDiv.innerHTML = `Matière: ${event.title}<br>Lieu: ${event.location}<br>Professeur: ${event.teacher}`;
                            eventDiv.title = `Début: ${event.start}\nFin: ${event.end}`;
                            eventDiv.style.backgroundColor = '#e0f7fa';
                            eventDiv.style.padding = '5px';
                            eventDiv.style.margin = '2px 0';
                            eventDiv.style.textAlign = 'center';
                            eventDiv.style.border = '1px solid #b2ebf2';
                            let largeur= 100/evenementsDansCeCreneau.length
                            largeur=largeur+"%"
                            console.log(largeur)
                            eventDiv.style.width=largeur
                            celluleJour.appendChild(eventDiv);
                        });
                    }
                }
            });
        });
    }

    function timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
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
          const heureCell = document.createElement("th");
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
      const data=[
        {
          "day": "Lundi",
          "start": "09:30",
          "end": "13:30",
          "title": "R206 Numérisation",
          "location": "Beziers / IUT de Béziers / 1/2",
          "teacher": "BORELLY CHRISTOPHE"
        },
        {
          "day": "Mardi",
          "start": "08:00",
          "end": "10:00",
          "title": "SAE Application Web",
          "location": "Beziers / IUT de Béziers / 1/2",
          "teacher": "BORELLY CHRISTOPHE"
        },
        {
          "day": "Lundi",
          "start": "08:30",
          "end": "11:30",
          "title": "R205 Numérisation",
          "location": "Beziers / IUT de Béziers / 1/2",
          "teacher": "BORELLY CHRISTOPHE"
        }
      ]
    remplissage
      
    });
    
document.addEventListener("DOMContentLoaded", () => {
    
    const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    const heureDebut = 8; // 08:00
    const heureFin = 19;  // 18:00
    const dureeCreneau = 30; // en minutes

    // Fonction pour formater les heures
    function formatHeure(heure, minute) {
        return `${String(heure).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    // Génère les créneaux horaires automatiquement
    function genererHeures(debut, fin, intervalle) {
        const creneaux = [];
        for (let h = debut * 60; h < fin * 60; h += intervalle) {
            const debutHeure = formatHeure(Math.floor(h / 60), h % 60);
            creneaux.push(debutHeure);
        }
        return creneaux;
    }


    function remplissage(data) {
      const joursHeader = Array.from(document.querySelectorAll('.planning-table thead th'));
      const lignesHeures = Array.from(document.querySelectorAll('.planning-table tbody tr'));
  
      const planningParJour = {};
  
      // Organiser les événements par jour
      joursHeader.slice(1).forEach(jourHeader => {
          const jour = jourHeader.textContent.trim();
          planningParJour[jour] = data.filter(event => event.day === jour);
      });
  
      lignesHeures.forEach(ligneHeure => {
          const heureLigne = ligneHeure.querySelector('td').textContent.trim();
          const heureLigneMinutes = timeToMinutes(heureLigne);
  
          joursHeader.slice(1).forEach((jourHeader, indexJour) => {
              const jour = jourHeader.textContent.trim();
              const celluleJour = ligneHeure.querySelectorAll('td')[indexJour];
  
              if (celluleJour) {
                  celluleJour.innerHTML = '';
                  celluleJour.style.padding = '0';
                  celluleJour.style.display = 'flex';
                  celluleJour.style.flexDirection = 'row';
                  celluleJour.style.alignItems = 'stretch';
                  celluleJour.style.borderCollapse = 'collapse';
  
                  const evenementsDansCeCreneau = planningParJour[jour].filter(event => {
                      const debutMinutes = timeToMinutes(event.start);
                      const finMinutes = timeToMinutes(event.end);
                      return heureLigneMinutes >= debutMinutes && heureLigneMinutes < finMinutes;
                  });
  
                  const nombreEvenements = evenementsDansCeCreneau.length;
  
                  if (nombreEvenements > 0) {
                      evenementsDansCeCreneau.forEach(evenement => {
                          const eventDiv = document.createElement('div');
                          eventDiv.innerHTML = `Matière: ${evenement.title}<br>Lieu: ${evenement.location}<br>Professeur: ${evenement.teacher}`;
                          eventDiv.title = `Début: ${evenement.start}\nFin: ${evenement.end}`;
                          eventDiv.style.backgroundColor = '#e0f7fa';
                          eventDiv.style.display= 'flex'
                          eventDiv.style.padding = '5px';
                          eventDiv.style.margin = '2px';
                          eventDiv.style.flexGrow = '1';
                          eventDiv.style.textAlign = 'center';
                          eventDiv.style.border = '1px solid #b2ebf2';
                          const largeur = `${100 / nombreEvenements}%`;
                          eventDiv.style.width = largeur;
                          celluleJour.appendChild(eventDiv);
                      });
                  }
              }
          });
      });
  }
  
  // Fonction utilitaire pour convertir une heure "HH:MM" en minutes
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

        const heureCell = document.createElement("td");
        heureCell.setAttribute('entete')
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
  .then(response => {
    
    return response.json();
  })
  .then(data => {
    remplissage(data)
    
  })
  
});

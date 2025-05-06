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

//   function remplissage(data){
 //       data.forEach(evenement =>{
   //         jours.forEach(jour =>{
     //           if (jour==evenement.day){
       //             console.log("identique")
//                }
  //          })
    //    })
        
  
   // }
   function remplissage(data) {
    const joursHeader = Array.from(document.querySelectorAll('.planning-table thead th')); // Récupérer les en-têtes de jours
  
    data.forEach(event => {
      const jourEvenement = event.day;
      const heureDebutEvenement = event.start;
      const heureFinEvenement = event.end;
      const titreEvenement = event.title;
      const jourIndex = joursHeader.findIndex(th => th.textContent.trim() === jourEvenement);
  
      if (jourIndex > 0) { // Vérifier que le jour existe dans l'en-tête (index 0 est l'en-tête des heures)
        const lignesHeures = Array.from(document.querySelectorAll('.planning-table tbody tr'));
  
        lignesHeures.forEach(ligneHeure => {
        const heureLigne = ligneHeure.querySelector('th').textContent.trim(); // Récupérer l'heure de la ligne
        let i=0
        const heureDebutLigneMinutes = timeToMinutes(heureLigne);
        const heureDebutEvenementMinutes = timeToMinutes(heureDebutEvenement);
        const heureFinEvenementMinutes = timeToMinutes(heureFinEvenement);
        const dureeCreneauMinutes = 30; // D'après votre code précédent
        if (heureDebutLigneMinutes >= heureDebutEvenementMinutes && heureDebutLigneMinutes < heureFinEvenementMinutes) {
            i+=1
          }
          // Vérifier si l'événement se déroule pendant ce créneau horaire
          if (heureDebutLigneMinutes >= heureDebutEvenementMinutes && heureDebutLigneMinutes < heureFinEvenementMinutes) {
            const celluleJour = ligneHeure.querySelectorAll('td')[jourIndex - 1]; // -1 car la première colonne est l'heure
            if (celluleJour && !celluleJour.textContent.trim()) { // Si la cellule est vide
              celluleJour.textContent = titreEvenement;
              celluleJour.title = `Matière: ${event.title}\nLieu: ${event.location}\nProfesseur: ${event.teacher}\nDébut: ${event.start}\nFin: ${event.end}`;
              celluleJour.style.backgroundColor = '#cce5ff';
              celluleJour.style.cursor = 'default';
            } else if (celluleJour && celluleJour.textContent.trim() && !celluleJour.textContent.includes(titreEvenement)) {
              // Gérer les chevauchements (afficher plusieurs événements)
              celluleJour.textContent += `\n${titreEvenement}`;
              celluleJour.title += `\nMatière: ${event.title}\nLieu: ${event.location}\nProfesseur: ${event.teacher}\nDébut: ${event.start}\nFin: ${event.end}`;
              celluleJour.style.backgroundColor = '#ffe0b2'; // Couleur différente pour les chevauchements
            }
          }
        });
      }
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
    fetch('Planning.json')
  .then(response => {
    
    return response.json();
  })
  .then(data => {
    remplissage(data)
    
  })
  
});
const monTableau = document.getElementById('planning-wrapper');

monTableau.addEventListener('click', (event) => {
    const target=event.target;
    target.textContent="bonjour"
})

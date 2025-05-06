document.addEventListener("DOMContentLoaded", () => {
    fetch('./Filiere.json')
        .then(response => {
            if (!response.ok) throw new Error("Erreur de chargement JSON");
            return response.json();
        })
        .then(data => {
            const container = document.querySelector('.bubble-container');

            data.forEach(filiere => {
                const filiereDiv = document.createElement('div');
                filiereDiv.className = 'bubble';

                const imageDiv = document.createElement('div');
                imageDiv.className = 'Image';
                const logo = document.createElement('img');
                logo.src = filiere.Image;
                logo.alt = filiere.Nom;
                imageDiv.appendChild(logo);

                const groupDiv = document.createElement('div');
                groupDiv.className = 'bubble-second-group';

                const nom = document.createElement('p');
                nom.textContent = filiere.Nom;
                groupDiv.appendChild(nom);

                filiere.Années.forEach(annee => {
                    const anneeDiv = document.createElement('div');
                    anneeDiv.className = 'bubble-second';

                    const niveau = document.createElement('span');
                    niveau.className = 'bubble-second-text';
                    niveau.textContent = annee.Niveau;
                    anneeDiv.appendChild(niveau);

                    const linksDiv = document.createElement('div');
                    linksDiv.className = 'sub-links';

                    annee.Liens.forEach(lien => {
                        const a = document.createElement('a');
                        a.href = lien.URL;
                        a.textContent = lien.Nom;
                        linksDiv.appendChild(a);
                    });

                    anneeDiv.appendChild(linksDiv);
                    groupDiv.appendChild(anneeDiv);
                });

                filiereDiv.appendChild(imageDiv);
                filiereDiv.appendChild(groupDiv);
                container.appendChild(filiereDiv);
            });

            // Initialiser Filiere.js
            if (typeof window.initFiliere === 'function') {
                window.initFiliere();
            }

        })
        .catch(error => {
            console.error("Erreur lors du chargement des données :", error);
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const jsonData = [
        {
            "Image": "./RT/image/LogoRT2023b.png",
            "Nom": "Réseaux & Télécoms",
            "Années": [
                {
                    "Niveau": "Première année",
                    "Liens": [
                        { "Nom": "Retour", "URL": "#" },
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Seconde année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Troisième année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                }
            ]
        },
        {
            "Image": "./TC/image/logo_TC_temp.png",
            "Nom": "Technique de Commercialisation",
            "Années": [
                {
                    "Niveau": "Première année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Seconde année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Troisième année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                }
            ]
        },
        {
            "Image": "./ROBIA/image/logo_robia_officiel.png",
            "Nom": "ROB & IA",
            "Années": [
                {
                    "Niveau": "Première année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Seconde année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Troisième année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                }
            ]
        },
        {
            "Image": "./MMI/image/logo_mmi.jpg",
            "Nom": "Métiers du Multimédia et de l'Internet",
            "Années": [
                {
                    "Niveau": "Première année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Seconde année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Troisième année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                }
            ]
        },
        {
            "Image": "./CS/image/logo_CS2.png",
            "Nom": "Carrières Sociales",
            "Années": [
                {
                    "Niveau": "Première année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Seconde année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Troisième année",
                    "Liens": [
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                }
            ]
        },
        {
            "Image": "./Cours Transversaux/image/cours_transversaux.png",
            "Nom": "Cours Transversaux",
            "Années": [
                {
                    "Niveau": "Anglais",
                    "Liens": [
                        { "Nom": "Retour", "URL": "#" },
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Communication",
                    "Liens": [
                        { "Nom": "Retour", "URL": "#" },
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Méthodologie",
                    "Liens": [
                         { "Nom": "Retour", "URL": "#" },
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                }
            ]
        },
        {
            "Image": "./Appui Pedagogique/image/logo_appui_peda_3.png",
            "Nom": "Appui Pédagogique",
            "Années": [
                 {
                    "Niveau": "Soutien Scolaire",
                    "Liens": [
                        { "Nom": "Retour", "URL": "#" },
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Ateliers Pratiques",
                    "Liens": [
                         { "Nom": "Retour", "URL": "#" },
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                },
                {
                    "Niveau": "Coaching Pédagogique",
                    "Liens": [
                         { "Nom": "Retour", "URL": "#" },
                        { "Nom": "Ressource", "URL": "#" },
                        { "Nom": "SAE", "URL": "#" }
                    ]
                }
            ]
        }
    ];


    const container = document.querySelector('.bubble-container');

    jsonData.forEach(filiere => {
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
    initFiliere();
})

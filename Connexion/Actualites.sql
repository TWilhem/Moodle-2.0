CREATE TABLE Actualites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255),
    image VARCHAR(255),
    description TEXT
);

INSERT INTO Actualites (titre, image, description) VALUES
("Tournoi multisport", "tournoi-multisport.png", "Le 10 avril 2025 à eu lieu le premier Tournoi Multisport Etudiant. Au programme : padel, volley-ball, pétanque, jeux vidéo... Et sutout plus de 100 étudiant rassemblé "),
("Je filme ma formation", "je-filme-ma-formation.jpg", "L'IUT de béziers a remporté l'édition 2025 du concours national 'Je filme ma formation'. Le département TC e reçu le Prix Diamant et le département MMI deux Prix de Bronze"),
("La chrysalide de Satin Rouge", "la-Chrysalide.jpg", "Le 29 avirl 2025, au théâtre des Franciscains à Béziers le département TC a presenté le moyen-metrage rélisé par les 2e et 3e année TC avec un projet ayant duré deux ans"),
("IA DAY", "IA-day.png", "le 8 avril 2025 l'IUT de Béziers a accueilli une journée que le thème 'L'Intelligence Artificielle pour l'industrie: enjeux et perspectives'. Cette journée a eu comme objectif de démystifier l'IA"),
("Forum de l'alternance", "forum-alternance.png", "Le 3 avril l'IUT de Béziers à organisé un forum de l'alternance pour toutes les filières. Pour permettre une rencontre entre des entreprises qui recrutent et des étudiants en recherche de contrats pour septembre"),
("Conférence : Sorcières Sorciers", "sorcières.png", "Le 19 mars 2025 l'IUT a acceuilli une conférence de Michelle Zancarini-Fournel pour présenté son essai 'Lettre aux jeunes féministes' où elle explore l'histoire des sorcières et les liens avec les combats féministes actuels"),
("6e Hackathon", "hackathon.jpg", "Du 11 au 14 mars 2025, l'IUT a organisé le 6e Hackathon. Cette édition à porté sur le thème de 'La transition écologique et le développement soutenable"),
("Portes ouvertes", "porte-ouverte.png", "Le samedi 8 février 2025 ont eu lieu les protes ouverte de l'IUT. Dans l'objectif de faire découvrir l'IUT aux lycéens et de leur permettrent d'échanger avec les étudiants et enseignants"),
("Poursuite d'étude", "poursuite-etude.png", "Le 23 janvier l'IUT à organisé un forum de poursuite d'étude pour présenter aux étudiants les oppotunités pour poursuivre leurs études après leur BAc+3");

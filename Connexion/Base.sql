-- Table des utilisateurs
CREATE TABLE Utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe CHAR(64) NOT NULL,
    genre VARCHAR(100),
    naissance DATE,
    autorite ENUM('Etudiant', 'Prof', 'Admin') NOT NULL,
    extension ENUM('jpg', 'jpeg', 'png', 'gif', 'webp')
);

-- Table des informations d'études liées à un utilisateur
CREATE TABLE Filiere (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Utilisateur_id INT NOT NULL,
    filiere ENUM('RT', 'MMI', 'CS', 'ROBIA', 'TC'),
    annee ENUM('1', '2', '3'),
    groupe ENUM('A1', 'A2', 'B1', 'B2'),
    FOREIGN KEY (Utilisateur_id) REFERENCES Utilisateurs(id) ON DELETE CASCADE
);

-- Insertion des utilisateurs avec dates de naissance
INSERT INTO Utilisateurs (nom, prenom, email, mot_de_passe, genre, naissance, autorite) VALUES
('Durand', 'Alice', 'alice.durand@example.com', SHA2('alice123', 256), 'Mme', '2002-05-14', 'Etudiant'),
('Martin', 'Julien', 'julien.martin@example.com', SHA2('profjulien', 256), 'Mr', '1980-03-22', 'Prof'),
('Nguyen', 'Linh', 'linh.nguyen@example.com', SHA2('linhpass', 256), null, '2003-09-08', 'Etudiant'),
('Petit', 'Marc', 'marc.petit@example.com', SHA2('adminmarc', 256), 'Mr', '1975-12-01', 'Admin'),
('Dupont', 'Sophie', 'sophie.dupont@example.com', SHA2('sophiepass', 256), 'Mme', '2001-07-17', 'Etudiant');

-- Insertion des informations de filière
INSERT INTO Filiere (utilisateur_id, filiere, annee, groupe) VALUES
(1, 'MMI', '2', 'A1'),
(3, 'CS', '1', 'B2'),
(5, 'TC', '3', 'A2');

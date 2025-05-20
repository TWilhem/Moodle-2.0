CREATE TABLE Cours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_secondary INT NOT NULL,
  repertoire VARCHAR(255),
  description TEXT,
  file VARCHAR(255),
  date_debut DATETIME DEFAULT CURRENT_TIMESTAMP,
  date_fin DATETIME DEFAULT NULL,
  FOREIGN KEY (id_secondary) REFERENCES Ressources(id) ON DELETE CASCADE
);


INSERT INTO Cours (id_secondary, repertoire, description, file, date_fin)
VALUES 
(125, 'TD', 'Image d’introduction à la ressource', 'intro.png', NULL),
(125, 'TP', 'Document PDF de support', 'support.pdf', '2025-12-31 23:59:59'),
(125, 'CM', 'Présentation semaine 1', 'semaine1.pptx', NULL),
(125, 'CM', 'Exemples de code associés à la ressource', 'exemple_code.zip', NULL),
(125, 'TP', 'Annexes diverses pour approfondissement', 'annexes.docx', NULL);
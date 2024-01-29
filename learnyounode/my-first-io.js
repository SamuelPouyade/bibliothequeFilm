const fs = require('fs');

// Le chemin du fichier est fourni en tant que premier argument de ligne de commande
const filePath = process.argv[2];

// Lecture du contenu du fichier de manière synchrone
const fileContents = fs.readFileSync(filePath, 'utf8');

// Compter le nombre de nouvelles lignes
const numNewLines = fileContents.split('\n').length - 1;

console.log(numNewLines);

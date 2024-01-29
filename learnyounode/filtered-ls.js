const fs = require('fs');
const path = require('path');

// Récupération des arguments de ligne de commande
const directory = process.argv[2];
const extension = '.' + process.argv[3];

// Lecture du contenu du répertoire de manière asynchrone
fs.readdir(directory, (err, files) => {
    if (err) {
        return console.error(err);
    }

    // Filtrer les fichiers par l'extension et les afficher
    files.forEach(file => {
        if (path.extname(file) === extension) {
            console.log(file);
        }
    });
});

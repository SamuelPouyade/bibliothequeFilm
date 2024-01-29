let sum = 0;

// Commence à l'indice 2 pour ignorer les deux premiers éléments de process.argv
for (let i = 2; i < process.argv.length; i++) {
    sum += Number(process.argv[i]);
}

console.log(sum);

const fs = require('fs'); 

data = fs.readFileSync('misPartidas.json'); 
misPartidas = JSON.parse(data); 

console.log(`Los datos procesados contienen ${misPartidas.games.length} partidas`); 

console.log(misPartidas.games[0].pgn); 

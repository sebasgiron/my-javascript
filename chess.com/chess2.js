const https = require('node:https'); 
const fs = require('fs'); 

const USUARIO = 'sebas8642'; 

let miJugador; 
let misPartidas; 

/* Crear Request *********************************************************** */
function createRequest(path, callback) {
	const options = {
	  hostname: 'api.chess.com',
	  port: 443,
	  path: path,
	  method: 'GET', 
	  headers: {
		  'User-Agent': 'MiAgentePersonalizado/1.0(contact: sebasgiron@gmail.com)' 
	}}
	
	return https.request(options, (res) => {
		let data = ''; 
		console.log(`REQ path: ${options.path}`); 
		console.log(`REQ Código respuesta: ${res.statusCode}`); 
		// Recibir los datos en fragmentos
		res.on('data', (chunk) => {
			data += chunk;
		});
		// Fin
		res.on('end', () => {
			console.log('REQ Finalizado'); 
			callback(data); 
		}); 
	}); 
};

function getJugador(handle = USUARIO) {
	return new Promise(
	  (resolve, reject) => {
		let req = createRequest(`/pub/player/${handle}`, 
			resolve); 
		req.on('error', (e) => {reject(e)}); 
		req.end(); 
	  });	
}

function getGames(handle = USUARIO) {
	return new Promise(
		(resolve, reject) => {
			let req = createRequest(
				`/pub/player/${handle}/games/2024/08`,
				resolve); 
			req.on('error', (e) => {reject(e)}); 
			req.end(); 			
		}); 
}

function onJugador(data) {
	miJugador = new Jugador(JSON.parse(data)); 
	console.log(`miJugador = ${miJugador.ID}`); 
	getGames().then(onPartidas); 
}


function onPartidas(data) {
	misPartidas = JSON.parse(data); 
	console.log(`Los datos recibidos contienen ${misPartidas.games.length} partidas`); 
	partida = new Partida(misPartidas.games[0]); 
	console.log(partida.toString()); 
	fs.writeFileSync('misPartidas.json', data); 
	
}

/* Proceso principal ********************************************************/
getJugador().then(onJugador); 



/* ***************************************************************************
 * Clase Partida 
 * ***************************************************************************/

class Partida {
	constructor(unObjeto) {
		this.objeto = unObjeto; 
		this.setColorUsuario(); 
	}
	url() {
		return this.objeto.url; 
	}
	
	setColorUsuario() {
		this.valorColorUsuario = null; 
		if (this.objeto.black['@id'] == miJugador.ID) {
			this.valorColorUsuario = 'black'; 
		}
		if (this.objeto.white['@id'] == miJugador.ID) {
			this.valorColorUsuario = 'white'; 
		}
	}
	
	get colorUsuario() {
		return this.valorColorUsuario; 
	}
	
	toString() {
		return `El objeto de la partida ${this.url()}` + '\n' + 
			`El color del usuario es ${this.colorUsuario}`; 
	}
}

/* ***************************************************************************
 * Clase Jugador 
 * ***************************************************************************/
 
 class Jugador{
	 constructor(unObjeto) {
		 this.objeto = unObjeto; 
	 }
	 get ID() {
		 return this.objeto['@id']; 
	 }	 
 }
 

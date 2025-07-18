const https = require('node:https'); 

const USUARIO = 'sebas8642'; 

let miJugador; 

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

reqPlayer = createRequest(`/pub/player/${USUARIO}`, 
	(data) => {
		console.log('Ola ke ase'); 
		miJugador = new Jugador(data); 		
	});

reqPlayer.on('error', (e) => {
  console.error(`Error en la solicitud: ${e.message}`);
});	

reqPlayer.end(); 
	




// Parse JSON
function parseJSON(data) {
	let objeto = JSON.parse(data); 
	console.log(`Los datos recibidos contienen ${objeto.games.length} partidas`); 
	
	let partida = new Partida(objeto.games[0]); 
	//console.log(partida.toString()); 	
	console.log(objeto.games[0]); 
}

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
		this.colorUsuario = null; 
		if (this.objeto.black.username == USUARIO) {
			this.colorUsuario = 'black'; 
		}
		if (this.objeto.white.username == USUARIO) {
			this.colorUsuario = 'white'; 
		}
		console.log(this.objeto.black.username); 
		console.log(this.objeto.white.username); 
		console.log(USUARIO); 
	}
	
	colorUsuario() {
		return this.colorUsuario; 
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
 }
 

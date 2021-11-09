const http = require('http'); 
const fs = require('fs'); 
const SRV_PUERTO = 8081; 
const OAUTH_CALLBACK_URL = '/autorizar_evernote_callback.html'; 

/* Funciones de respuesta ************************************************** */
const dummyResponse = function(res, myMessage, statusCode = 200) {
	res.writeHead(statusCode, {'Content-Type': 'text/plain; charset=UTF-8'});
	res.end(myMessage); 
}

const getStatic = function(res, path, contentType = 'text/html') {
	res.writeHead(200, {
		'Content-Type': contentType
	});
	readable = fs.createReadStream('.' + path);
	readable.pipe(res)
}

const notFound = function(res, path)  {
	console.log('notFound: ' + path); 
	res.writeHead(404, {'Content-Type' : 'text/plain'});
	res.end('Requested path not found: ' + path); 	
}

/* Funciones de oAuth ****************************************************** */
const prueba_evernote = require('./prueba_evernote.js'); 

var prueba_session = {
	oauthToken : undefined,
	oauthTokenSecret : undefined, 
	error : undefined
}; 

/* Listener **************************************************************** */
var requestListener = function(req, res) {
	switch(req.method) {
	case 'GET': {
		switch(req.url) {
			case '/': 
				dummyResponse(res, "Ya estás aquí; ahora, ¿qué quieres hacer?"); 
				break; 
			// case '/nueva_nota.html': 
				// getStatic(res, req.url); 			
				// break; 
			case '/autorizar_evernote.html':
				prueba_evernote.oauth(req, res, OAUTH_CALLBACK_URL, prueba_session); 
				break; 
			case OAUTH_CALLBACK_URL: 
				prueba_evernote.oauth_callback(req, res); 
				break; 
			default: 
				notFound(res, req.url); 
				break; 					
		}
		break; 
	}
	case 'POST': {
		switch(req.url) {
			// case '/begin_oauth.txt': 
				// beginOAuth(res); 
				// break; 
			default:
				dummyResponse(res, "No sé hacer POST a la URL " + req.url); 
				break; 		
		}		
		break; 
	}
	default: {
		dummyResponse(res, "No sé qué hacer con el método " + req.method); 
		break; 
	}
	}
}	

/* Inicializar ************************************************************** */
var servidor = http.createServer(requestListener); 
servidor.listen(SRV_PUERTO); 
console.log("Ola ke ase, servidor escuchando en puerto " + SRV_PUERTO); 


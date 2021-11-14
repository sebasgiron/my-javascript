const http = require('http'); 
const fs = require('fs'); 
const urlJS = require('url'); 
const nuevaNota = require('./nueva_nota.js'); 

const SRV_PUERTO = 8081; 
const OAUTH_CALLBACK_URL = '/autorizar_evernote_callback.html'; 
const OAUTH_END_URL = '/autorizar_evernote_fin.html'; 
const OAUTH_SAVE_CONFIG_URL = '/save_oauth_config.txt';

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
const evernoteJS = require('./evernote.js'); 

var oAuth_session = {
	oauthToken : undefined,
	oauthTokenSecret : undefined, 
	error : undefined, 
	oauthAccessToken : undefined, 
	oauthAccessTokenSecret : undefined, 
	edamShard : undefined, 
	edamUserId : undefined, 
	edamExpires : undefined, 
	edamNoteStoreUrl : undefined, 
	edamWebApiUrlPrefix : undefined,
	toHtml: function() {
		return (
		'<table><tr><td>Propiedad</td><td>Valor</td></tr>' + 
		'<tr><td>oauthToken</td><td>' + this.oauthToken + '</td></tr>' +
		'<tr><td>oauthTokenSecret</td><td>' + this.oauthTokenSecret + '</td></tr>' +
		'<tr><td>oauthAccessToken</td><td>' + this.oauthAccessToken + '</td></tr>' +
		'<tr><td>oauthAccessTokenSecret</td><td>' + this.oauthAccessTokenSecret + '</td></tr>' +
		'<tr><td>edamShard</td><td>' + this.edamShard + '</td></tr>' +
		'<tr><td>edamUserId</td><td>' + this.edamUserId + '</td></tr>' +
		'<tr><td>edamExpires</td><td>' + this.edamExpires + '</td></tr>' +
		'<tr><td>edamNoteStoreUrl</td><td>' + this.edamNoteStoreUrl + '</td></tr>' +
		'<tr><td>edamWebApiUrlPrefix</td><td>' + this.edamWebApiUrlPrefix + '</td></tr>' +
		'</table>');		
	}
	
}; 

function generarCallbackURL(pathname) {
	return ('http://localhost:' + SRV_PUERTO + pathname); 
}

function oauthEnd(res) {
	res.writeHead(200, {'Content-Type': 'text/html'}); 
	res.end(
	'<html>' + 
	'<head></head>' + 
	'<body>' +
	'<p>Fin del proceso oAuth</p>' +
	'<p>' + oAuth_session.toHtml() + '</p>' + 
	'<form action="' + OAUTH_SAVE_CONFIG_URL + '" method="post"><button type="submit">Guardar config</button></form>' + 
	'</body>' +
	'</html>'); 
}

function oAuthSaveConfig(res) {
	evernoteJS.saveConfig(); 
	dummyResponse(res, 'Configuración Evernote guardada'); 
}	

function verConfiguracionEvernote(res) {
	res.writeHead(200, {'Content-Type': 'text/html'}); 
	res.end(
	'<html>' + 
	'<head></head>' + 
	'<body>' +	
	'<p>' + evernoteJS.getConfigHTML() + '</p>' + 
	'</body>'); 
}


/* Listener **************************************************************** */
var requestListener = function(req, res) {
	var reqUrl = urlJS.parse(req.url); 
	switch(req.method) {
	case 'GET': {
		switch(reqUrl.pathname) {
			case '/': 
				dummyResponse(res, "Ya estás aquí; ahora, ¿qué quieres hacer?"); 
				break; 
			case '/nota_nueva.html': 
				getStatic(res, req.url); 			
				break; 
			case '/estilos.css':
				getStatic(res, req.url, 'text/css'); 
				break; 
			case '/autorizar_evernote.html':
				evernoteJS.oauth(
					req, res, generarCallbackURL(OAUTH_CALLBACK_URL), 
					oAuth_session); 
				break; 
			case '/ver_config_evernote.html': 
				verConfiguracionEvernote(res); 
				break; 
			case OAUTH_CALLBACK_URL: 
				console.log('Solicitada OAUTH_CALLBACK_URL');
				evernoteJS.oauth_callback(
					req, res, generarCallbackURL(OAUTH_END_URL), 
					oAuth_session); 
				break; 
			case OAUTH_END_URL: 
				console.log('Solicitada OAUTH_END_URL'); 				
				oauthEnd(res); 
				break; 
			default: 
				notFound(res, req.url); 
				break; 					
		}
		break; 
	}
	case 'POST': {
		switch(reqUrl.pathname) {
			case OAUTH_SAVE_CONFIG_URL: 
				oAuthSaveConfig(res); 
				break; 
			case '/crear_nota.txt': 
				nuevaNota.postNotaNueva(req, res); 				
				break; 
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



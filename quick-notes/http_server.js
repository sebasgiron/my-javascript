const http = require('http'); 
const fs = require('fs'); 
const SRV_PUERTO = 8081; 

/* Funciones de respuesta ************************************************** */
const dummyResponse = function(res, myMessage, statusCode = 200) {
	res.writeHead(statusCode, {'Content-Type': 'text/plain; charset=UTF-8'});
	res.end(myMessage); 
}

const getStatic = function(res, path) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	readable = fs.createReadStream('.' + path);
	readable.pipe(res)
}

const notFound = function(res, path)  {
	res.writeHead(404, {'Content-Type' : 'text/plain'});
	res.end('Requested path not found: ' + path); 
}

/* Listener **************************************************************** */
const requestListener = function(req, res) {
	switch(req.url) {
		case '/': 
			dummyResponse(res, "Ya estás aquí; ahora, ¿qué quieres hacer?"); 
			break; 
		case '/nueva_nota.html': 
			getStatic(res, req.url); 			
			break; 
		default: 
			notFound(res, req.url); 
			break; 					
	}
	
}	

/* Inicializar ************************************************************** */
var servidor = http.createServer(requestListener); 
servidor.listen(SRV_PUERTO); 
console.log("Ola ke ase, servidor escuchando en puerto " + SRV_PUERTO); 



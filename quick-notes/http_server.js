const http = require('http'); 
const fs = require('fs'); 


const SRV_PUERTO = 8081; 
const SRV_HOST = 'localhost'; 

const entregar_archivo = function(archivo, res) {
	var archivo = fs.createReadStream(archivo); 
	res.writeHead(200, {'Content-Type': 'text/html'}); 
	archivo.pipe(res); 
}

const requestListener = function(req, res) {
	switch(req.url) {
		case '/nueva_nota.html': {
			entregar_archivo('nueva_nota.html', res); 
			break; 
		}
		default: {
			// Dummy
			res.writeHead(200); 
			res.end('<html><p>Respuesta dummy.</p><p>La URL que pediste es: ' + req.url + '</p><p>Gracias por participar.</p></html>')
		}
	}
	
}	

const servidor = http.createServer(requestListener); 

servidor.listen(SRV_PUERTO, SRV_HOST, () => {
	console.log("Ola ke ase, servidor corriendo"); 
})


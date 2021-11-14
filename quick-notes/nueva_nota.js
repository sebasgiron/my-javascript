/* 
	Un módulo para nota_nueva

*/

/* POST request para procesar nueva nota *********************************** */
exports.postNotaNueva = function(req, res) {
	var my_data = ''; 
	var my_input; 
	req.on('data', (chunk) => {
			my_data = my_data + chunk; 
			//console.log(`getUpdates data ${chunk}`); 
		}); 
	req.on('end', () => {
		my_input = procesarInput(my_data); 
		
		// Final
		res.writeHead(200, {'Content-Type':'text/plain'}); 
		res.end(procesarInput(my_data).toString()); 
	}); 	
}

function procesarInput(strData) {
	
	function newElemento() {
		return({
			nombre:'', 
			valor:'', 
			toString: function() {
				return ('Nombre: ' + this.nombre + '\r\nValor: ' + this.valor + '\r\n');
			}
		}); 
	}	
	
	const ESTADO_NOMBRE = 1
	const ESTADO_VALOR = 2
	const ESTADO_FIN = 3
	
	var result = []; 
	var estado = ESTADO_NOMBRE;
	var continuar = true; 
	var i = 0; 
	
	var buffer = ''; 
	var elemento = newElemento(); 
	
	while (continuar) {
		if (estado == ESTADO_FIN) {
			// terminar
			continuar = false; 
		} else {
			if (i >= strData.length) {
				// asignar 
				elemento.valor = buffer; 
				result.push(elemento); 
				elemento = null; 
				// cambiar estado
				estado = ESTADO_FIN				
			} else {
				switch(estado) {
					case ESTADO_NOMBRE: {
						if (strData.charAt(i) == '=') {
							elemento.nombre = buffer; 
							buffer = ''; 
							estado = ESTADO_VALOR; 
						} else {
							buffer = buffer + strData.charAt(i); 
						}
						break; 						
					}
					case ESTADO_VALOR: {
						if (strData.charAt(i) == "&") {
							elemento.valor = buffer; 
							result.push(elemento); 
							elemento = newElemento(); 
							buffer = ''; 
							estado = ESTADO_NOMBRE; 
						} else {
							buffer = buffer + strData.charAt(i); 
						}
						break; 
				}				
			}
			i++; 			
			}		
		}
	}
	return(result); 	
}

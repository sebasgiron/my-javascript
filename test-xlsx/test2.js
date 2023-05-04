function getCodFactura(nombreSoporte) {
	var regex = /.+\/(.+)\.xlsx/
	var regex_ex = regex.exec(nombreSoporte); 
	return regex_ex[1]; 
}


var XLSX = require("xlsx"); 
var fs = require("fs"); 

/* Obtener todos los archivos que cumplan el patrón */
const RUTA_ORIGEN = 'C:/tmp/etl-in/'; 
const PATRON = /soporte_factu_sabadell_.+\.xlsx$/i; 
var archivos_origen = fs.readdirSync(RUTA_ORIGEN).filter(file => PATRON.test(file)); 
   
console.log('archivos_origen = ', archivos_origen); 

/* Preparar salida */
let CSV_SALIDA = RUTA_ORIGEN + 'ventas_facturables.csv'; 
fs.writeFileSync(CSV_SALIDA, 'id_bs_crm,ind_facturable,cod_factura,imp_comision,accion\n')

archivos_origen.forEach(
	a_element => {
		var wbk_soporte = RUTA_ORIGEN + a_element;
		console.log('Procesando wbk_soporte = ', wbk_soporte);		
		var codFactura = getCodFactura(wbk_soporte);
		console.log('codFactura = ', codFactura); 
		var workbook = XLSX.readFile(wbk_soporte); 
		var ws = workbook.Sheets[workbook.SheetNames[0]]
		var range = XLSX.utils.decode_range(ws['!ref'])
		var d_celda; 
		for(var i = range.s.r + 1; i <= range.e.r; i++) {
			id_bs_crm = ws[XLSX.utils.encode_cell({r: i, c: 6})]['w']
			imp_comision = ws[XLSX.utils.encode_cell({r: i, c: 7})]['w']
			fs.appendFileSync(CSV_SALIDA, 
				id_bs_crm + ',TRUE,' + codFactura + ',' + imp_comision + ',insert\n'); 
		}	
	}); 
	
console.log('End'); 
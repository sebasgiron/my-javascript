/* Prueba lectura hoja de soporte BS Préstamos
*/ 

/* Extraer codigo de factura de nombre de archivo */
function getCodFactura(nombreSoporte) {
	var regex = /.+\/(.+)\.xlsx/
	var regex_ex = regex.exec(nombreSoporte); 
	return regex_ex[1]; 
}

var XLSX = require("xlsx"); 
var fs = require("fs"); 

let WBK_SOPORTE = "G:/Unidades compartidas/Data Analytics/tlmk/sabadell/facturacion/soporte_factu_sabadell_202303.xlsx"; 

var codFactura = getCodFactura(WBK_SOPORTE); 

console.log(codFactura); 

var workbook = XLSX.readFile(WBK_SOPORTE); 

console.log(workbook.SheetNames); 

var ws = workbook.Sheets[workbook.SheetNames[0]]

console.log(ws['!ref'])
/* decode_range devuelve algo como esto: 
	{ s: { c: 0, r: 0 }, e: { c: 7, r: 1201 } }
*/
var range = XLSX.utils.decode_range(ws['!ref'])
var d_celda; 

let CSV_SALIDA = "C:/Users/u00003/Downloads/ventas_facturables.csv"

fs.writeFileSync(CSV_SALIDA, 'id_bs_crm,ind_facturable,cod_factura,imp_comision,accion\n')

for(var i = range.s.r + 1; i <= range.e.r; i++) {
	id_bs_crm = ws[XLSX.utils.encode_cell({r: i, c: 6})]['w']
	imp_comision = ws[XLSX.utils.encode_cell({r: i, c: 7})]['w']
	fs.appendFileSync(CSV_SALIDA, 
		id_bs_crm + ',TRUE,' + codFactura + ',' + imp_comision + ',insert\n'); 
}


console.log('End'); 

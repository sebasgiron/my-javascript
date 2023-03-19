// Calcular origen

var origen_xl = !(cod_prestamo_xl.getString() === null);
var origen_bd = !(cod_prestamo_bd.getString() === null);

var origen; 

if (origen_xl && origen_bd) {
	origen = 'comun'; 	
} else {
	if (origen_xl) {
		origen = 'archivo';
    } else {
		origen = 'bbdd'
 	}
}


// Calcular flagfield

// Función para comprobar y sumar
function chequeo(condicion) {
	return Number(!Boolean(condicion)); 
}

// Comprobacion tipo fecha
function check_date(t1, t2) {
    if (t1 === null) 
        return (t2 === null); 

    if (t2 === null)
        return false; 

    return date2str(t1).equals(date2str(t2)); 
}

var flagfield; 
var comprobaciones = []; 
var n_check = 0;

switch (origen) {
	// Origen indica de dónde viene el registro 
	// del archivo de entrada, de la bbdd o de ambos
	case 'archivo': 
		flagfield = 'new'; 
		break; 
	case 'bbdd': 
		flagfield = 'deleted'; 
		break; 
	case 'comun': 
		comprobaciones.push(chequeo(abs(imp_prestamo_bd.getNumber() - imp_prestamo_xl.getNumber())<=0.005)); 
		comprobaciones.push(chequeo(cod_titularidad_bd.getString().equals(cod_titularidad_xl.getString()))); 
		comprobaciones.push(chequeo(check_date(d_contratacion_bd.getDate(), d_contratacion_xl.getDate())));

		for (var i = 0; i < comprobaciones.length; i++) {
			n_check =+ comprobaciones[i]; 
		}
		
		if (n_check > 0) {
			flagfield = 'changed'; 
		} else {
			flagfield = 'identical'; 
		}
		break; 
	default: 
		flagfield = 'unknown'; 
		break; 
}

var s_debug = comprobaciones.toString(); 

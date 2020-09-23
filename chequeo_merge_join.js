/* Script chequeo de campos en un merge join de pentaho
	Esta es una primera versión que hicimos en su momento, luego hicimos
	algunas mejoras para hacer el código algo más elegante
	*/


function check_integer(int1, int2) {
	if (int1 === null) 
		return (int2 === null); 

	if (int2 === null)
		return false; 

	return (int1 == int2); 
}

function check_string(s1, s2) {
	if (s1 === null) 
		return (s2 === null); 

	if (s2 === null)
		return false; 

	return s1.compareTo(s2) == 0; 
}

function check_date(t1, t2) {
	if (t1 === null) 
		return (t2 === null); 

	if (t2 === null)
		return false; 

	return date2str(t1).equals(date2str(t2)); 
}



var check_id_original = check_integer(id_original.getInteger(), id_original_ds.getInteger());

var check_t_nacimiento = check_date(t_nacimiento.getDate(), t_nacimiento_ds.getDate());

var check_t_alta = check_date(t_alta.getDate(), t_alta_ds.getDate());

var check_s_nombre = check_string(s_nombre.getString(), s_nombre_ds.getString());

var check_s_apellido1 = check_string(s_apellido1.getString(), s_apellido1_ds.getString()); 

var check_s_apellido2 = check_string(s_apellido2.getString(), s_apellido2_ds.getString()); 

var check_s_nombre_completo = check_string(s_nombre_completo.getString(),s_nombre_completo_ds.getString()); 

var check_s_direccion = check_string(s_direccion.getString(),s_direccion_ds.getString()); 

var check_s_poblacion = check_string(s_poblacion.getString(),s_poblacion_ds.getString()); 

var check_s_codigo_postal = check_string(s_codigo_postal.getString(),s_codigo_postal_ds.getString()); 

var check_s_provincia = check_string(s_provincia.getString(),s_provincia_ds.getString()); 

var check_s_pais = check_string(s_pais.getString(),s_pais_ds.getString()); 

var check_n_idioma = check_integer(n_idioma.getInteger(), n_idioma_ds.getInteger()); 

var check_s_dni = check_string(s_dni.getString(),s_dni_ds.getString());

var check_s_empresa = check_string(s_empresa.getString(),s_empresa_ds.getString()); 

var check_s_sexo = check_string(s_sexo.getString(),s_sexo_ds.getString()); 

var check_s_telefono = check_string(s_telefono.getString(),s_telefono_ds.getString()); 

var check_s_telefono2 = check_string(s_telefono2.getString(),s_telefono2_ds.getString()); 

var check_s_fax = check_string(s_fax.getString(),s_fax_ds.getString()); 

var check_s_email = check_string(s_email.getString(),s_email_ds.getString()); 

var check_s_email2 = check_string(s_email2.getString(),s_email2_ds.getString()); 

var check_s_movil = check_string(s_movil.getString(),s_movil_ds.getString()); 

var check_s_movil2 = check_string(s_movil2.getString(),s_movil2_ds.getString());

var check_s_observaciones = check_string(s_observaciones.getString(),s_observaciones_ds.getString());

var check_n_localizable_desde = check_integer(n_localizable_desde.getInteger(), n_localizable_desde_ds.getInteger());

var check_n_localizable_hasta = check_integer(n_localizable_hasta.getInteger(), n_localizable_hasta_ds.getInteger()); 

var check_n_canal_preferencial = check_integer(n_canal_preferencial.getInteger(), n_canal_preferencial_ds.getInteger()); 

var check_s_texto1 = check_string(s_texto1.getString(), s_texto1_ds.getString());

var check_s_texto2 = check_string(s_texto2.getString(), s_texto2_ds.getString());

var check_s_texto3 = check_string(s_texto3.getString(), s_texto3_ds.getString());

var check_n_num1 = check_integer(n_num1.getInteger(), n_num1_ds.getInteger()); 

var check_n_num2 = check_integer(n_num2.getInteger(), n_num2_ds.getInteger()); 

var check_n_num3 = check_integer(n_num3.getInteger(), n_num3_ds.getInteger()); 


var origen_2;

origen_2 = origen.getInteger(); 
if (origen_2 === null)
	origen_2 = 0; 

if (!(origen_ds.getInteger() === null)) 
	origen_2 = origen_2 + origen_ds.getInteger(); 

// Comprobación de todas
var check_all = check_id_original && check_t_nacimiento && check_t_alta && check_s_nombre && check_s_apellido1 && check_s_apellido1 &&
	 check_s_apellido2 && check_s_nombre_completo && check_s_direccion && check_s_poblacion && check_s_codigo_postal &&
	 check_s_provincia && check_s_pais && check_n_idioma && check_s_dni && check_s_empresa && check_s_sexo &&
	 check_s_telefono && check_s_telefono2 && check_s_fax && check_s_email && check_s_email2 && check_s_movil && check_s_movil2 &&
	 check_s_observaciones && check_n_localizable_desde && check_n_localizable_hasta && check_n_canal_preferencial &&
	 check_s_texto1 && check_s_texto2 && check_s_texto3 && check_n_num1 && check_n_num2 && check_n_num3; 

// Calculo del flagfield
var flagfield; 

switch(origen_2) {
	case 1: 
		flagfield = "deleted"; break; 
    case 2: 
        flagfield = "new"; break; 
	case 3: 
		if (check_all) {
			flagfield = "identical"; 
		} else {
			flagfield = "changed"; 
		}
		break; 
	default: 
		flagfield = "unknown"; 
		break; 
}


// Parámetro: la longitud del eje
// El canvas debe tener tamaño (al menos) 2*LONGITUD_EJE x 2*LONGITUD_EJE
var LONGITUD_EJE = 500

// Líneas de los ejes
function dibujarEjes(ctx) {
	ctx.beginPath()
	ctx.moveTo(0, LONGITUD_EJE)
	ctx.lineTo(2*LONGITUD_EJE, LONGITUD_EJE)
	ctx.moveTo(LONGITUD_EJE, 0)
	ctx.lineTo(LONGITUD_EJE, 2*LONGITUD_EJE)
	ctx.stroke()
}

// Línea del i-esimo tramo (sobre n totales)
// Sentido horizontal y vertical T/F segun si es positivo o negativo
function dibujarLinea(i, n, horizontal, vertical, ctx) {
	// Origen en el eje horizontal
	// Verdadero es hacia derecha desde el eje, por eso tiene multiplicador +1
	if (horizontal) {
		multiplicador_h = 1 
	} else {
		multiplicador_h = -1
	}	
	origen = LONGITUD_EJE + multiplicador_h * i * LONGITUD_EJE / n
	// Destino en el eje vertical
	// Verdadero es hacia arriba desde el eje, por eso tiene multiplicador -1
	if (vertical) {
		multiplicador_v = -1 
	} else {
		multiplicador_v = 1
	}		
	destino = LONGITUD_EJE + multiplicador_v * (n - i + 1) * LONGITUD_EJE / n
	// A pintar
	ctx.beginPath()
	ctx.moveTo(origen, LONGITUD_EJE)
	ctx.lineTo(LONGITUD_EJE, destino)
	ctx.stroke()	
}

// Dibujar toda la figura con n tramos
function dibujarFigura(n, ctx) {
	ctx.clearRect(0,0, 2*LONGITUD_EJE, 2*LONGITUD_EJE)
	dibujarEjes(ctx)
	for(i=0; i<n; i++) {
		dibujarLinea(i+1, n, true, true, ctx);
		dibujarLinea(i+1, n, true, false, ctx);
		dibujarLinea(i+1, n, false, true, ctx);
		dibujarLinea(i+1, n, false, false, ctx);
	}
}

/* Triángulos de Sierpinski 
   Para dibujar los triángulos de Sierpinski en un canvas 
*/

/* objPosicion es una ayuda para dibujar solo con lo que necesitamos en este caso. 
   Almacena la posición actual (x,y) y un ángulo (alpha) que indica la dirección. 
   La función mover desplaza la posición en la dirección actual una determinada distancia, 
   pinta la línea y actualiza las coordenadas */   
var objPosicion = {
	x : 0, 	
	y : 0 , 
	alpha : 0, 
	ctx : null,
  mover: function (distancia) {
    // Destino, en función de distancia y ángulo
		var x_target = this.x + distancia * Math.cos(this.alpha); 
		var y_target = this.y - distancia * Math.sin(this.alpha);
    // Dibujar
		this.ctx.beginPath(); 
		this.ctx.moveTo(this.x, this.y); 
		this.ctx.lineTo(x_target, y_target); 
		this.ctx.stroke(); 
    // Actualizar coordenadas
		this.x = x_target; 
		this.y = y_target; 
    },	
}

/* Función recursiva para dibujar los triángulos
   nivel es el nivel de recursión, cuando es 0 ya no pinta 
   lado es la longitud del lado del triángulo */
function dibujarSierpinski(nivel, lado) {
	if (nivel > 0) {
		if (lado < 1) {
      // Tampoco pinto si el lado es menor que 1
      // (No estoy seguro de si este 1 es pixels o puntos o qué)
			console.log('Nivel ' + nivel + ' no dibujado por lado <1'); 
			return; 
		}
		// Primer lado
		objPosicion.alpha += 2 * Math.PI / 3; 
		objPosicion.mover(lado/2); 
		dibujarSierpinski(nivel-1, lado/2); 
		objPosicion.mover(lado/2); 
		// Segundo lado
		objPosicion.alpha += 2 * Math.PI / 3; 
		objPosicion.mover(lado/2); 
		dibujarSierpinski(nivel-1, lado/2); 
		objPosicion.mover(lado/2); 
		// Tercer lado
		objPosicion.alpha += 2 * Math.PI / 3; 
		objPosicion.mover(lado/2); 
		dibujarSierpinski(nivel-1, lado/2); 
		objPosicion.mover(lado/2); 
		// Devolver a la dirección original
		objPosicion.alpha -= 6*Math.PI / 3; 		
	}
}

/* Preparar el objPosicion para el dibujo, colocado en el vértice de 
   abajo a la izquierda del triángulo exterior
   padding es el margen respecto a los bordes izquierdo e inferior del canvas */
function inicializarSierpinski(padding) {
	objPosicion.x = padding; 
	objPosicion.y = objPosicion.ctx.canvas.height - padding; 
	objPosicion.alpha = -2 * Math.PI / 3; 
}

/* Una función para lanzar el dibujo desde un botón en un documento HTML
  El documento debe contener un canvas 'myCanvas' 
  y un textbox 'txtLevel' con el nivel de dibujo deseado */
function btnDibujarClick() {
  // Obtener valor de nivel
	var myNivel = parseInt(document.getElementById('txtLevel').value); 
  // Contexto
	var myCtx = document.getElementById('myCanvas').getContext('2d'); 
  // Limpiar canvas
	myCtx.clearRect(0,0, myCtx.canvas.width, myCtx.canvas.height)	
  // Asignar copntexto en objeto posición
	objPosicion.ctx = myCtx; 
  // Lanzar dibujado
	var myPadding = 20; 
	inicializarSierpinski(myPadding); 
	dibujarSierpinski(myNivel, myCtx.canvas.width - 2 * myPadding); 	
}

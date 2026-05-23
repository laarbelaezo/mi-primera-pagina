// Seleccionamos los elementos del HTML
const contadorElemento = document.getElementById('contador');
const botonIncrementar = document.getElementById('btn-incrementar');

// Variable para llevar la cuenta
let cuenta = 0;

// Escuchamos el clic del botón
botonIncrementar.addEventListener('click', () => {
    cuenta++; // Sumamos 1
    contadorElemento.textContent = cuenta; // Actualizamos el número en pantalla
});

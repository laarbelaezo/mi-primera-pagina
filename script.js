// La URL base de tu servidor en PythonAnywhere
const API_URL = "https://leonardoarbelaez.pythonanywhere.com";

const contadorElemento = document.getElementById('contador');
const botonIncrementar = document.getElementById('btn-incrementar');

// Función para obtener los clics globales desde Python al cargar la página
async function cargarClicsGlobales() {
    try {
        const respuesta = await fetch(`${API_URL}/obtener-clics`);
        const datos = await respuesta.json();
        contadorElemento.textContent = datos.clics;
    } catch (error) {
        console.error("Error al obtener datos del servidor:", error);
    }
}

// Escuchamos el clic del botón e informamos al servidor en la nube
botonIncrementar.addEventListener('click', async () => {
    try {
        // Hacemos una petición POST para decirle a Python que sume 1
        const respuesta = await fetch(`${API_URL}/sumar-clic`, {
            method: 'POST'
        });
        const datos = await respuesta.json();
        // Actualizamos la pantalla con el total real de la base de datos
        contadorElemento.textContent = datos.clics;
    } catch (error) {
        console.error("Error al registrar el clic en la nube:", error);
    }
});

// Ejecutamos la carga inicial apenas se abra la página
cargarClicsGlobales();

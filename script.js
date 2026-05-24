// Tu URL real de producción en PythonAnywhere
const API_URL = "https://leonardoarbelaez.pythonanywhere.com";

// Selección de elementos de la interfaz
const tbody = document.getElementById("tabla-usuarios");
const botonGuardar = document.getElementById("btn-guardar");
const nombreInput = document.getElementById("nombre");
const edadInput = document.getElementById("edad");
const sexoInput = document.getElementById("sexo");

// 1. FUNCIÓN PARA DIBUJAR LAS FILAS EN LA TABLA HTML
function actualizarTabla(usuarios) {
    tbody.innerHTML = ""; // Limpia la tabla para evitar duplicaciones

    usuarios.forEach(usuario => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.edad}</td>
            <td>${usuario.sexo}</td>
        `;
        tbody.appendChild(fila);
    });
}

// 2. PEDIR LA LISTA COMPLETA AL SERVIDOR AL ABRIR LA PÁGINA
async function cargarUsuarios() {
    try {
        const respuesta = await fetch(`${API_URL}/usuarios`);
        const datos = await respuesta.json();
        actualizarTabla(datos);
    } catch (error) {
        console.error("Error al cargar los usuarios de la nube:", error);
    }
}

// 3. ENVIAR LOS NUEVOS DATOS AL SERVIDOR AL DAR CLIC
async function registrarUsuario() {
    if (!nombreInput.value || !edadInput.value) {
        alert("Por favor, ingresa Nombre y Edad.");
        return;
    }

    // Estructura del objeto que viajará hacia Python
    const paqueteUsuario = {
        nombre: nombreInput.value,
        edad: parseInt(edadInput.value),
        sexo: sexoInput.value
    };

    try {
        const respuesta = await fetch(`${API_URL}/guardar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paqueteUsuario) // Serialización a cadena JSON
        });
        
        const resultado = await respuesta.json();
        
        if (resultado.status === "success") {
            actualizarTabla(resultado.data); // Redibuja con el nuevo registro
            
            // Limpia los controles para una nueva inserción
            nombreInput.value = "";
            edadInput.value = "";
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Hubo un problema de conexión con el servidor backend.");
    }
}

// Vinculación de eventos controladores
botonGuardar.addEventListener('click', registrarUsuario);
window.addEventListener('DOMContentLoaded', cargarUsuarios);

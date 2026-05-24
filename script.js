// URL unificada de producción en la nube
const API_URL = "https://leonardoarbelaez.pythonanywhere.com";

// Enlaces a los componentes de la interfaz de usuario
const tbody = document.getElementById("tabla-usuarios");
const botonGuardar = document.getElementById("btn-guardar");
const botonCancelar = document.getElementById("btn-cancelar");
const tituloFormulario = document.getElementById("titulo-formulario");

const idInput = document.getElementById("usuario-id");
const nombreInput = document.getElementById("nombre");
const edadInput = document.getElementById("edad");
const sexoInput = document.getElementById("sexo");

// 1. RENDERIZAR FILAS EN LA TABLA CON COMPORTAMIENTO DINÁMICO
function actualizarTabla(usuarios) {
    tbody.innerHTML = ""; // Evitamos redundancia de datos limpiando el contenedor

    usuarios.forEach(usuario => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.edad}</td>
            <td>${usuario.sexo}</td>
            <td>
                <button class="btn-accion btn-editar" onclick="prepararEdicion(${usuario.id}, '${usuario.nombre}', ${usuario.edad}, '${usuario.sexo}')">Editar</button>
                <button class="btn-accion btn-eliminar" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// 2. PETICIÓN GET: CARGAR HISTORIAL AL ARRANCAR EL SITIO
async function cargarUsuarios() {
    try {
        const respuesta = await fetch(`${API_URL}/usuarios`);
        const datos = await respuesta.json();
        actualizarTabla(datos);
    } catch (error) {
        console.error("Error al conectar con la base de datos remota:", error);
    }
}

// 3. PETICIÓN POST / PUT: ROUTING DE ACCIÓN AL GUARDAR FORMULARIO
async function procesarFormulario() {
    if (!nombreInput.value || !edadInput.value) {
        alert("Por favor, introduce el nombre y la edad.");
        return;
    }

    const paqueteUsuario = {
        nombre: nombreInput.value,
        edad: parseInt(edadInput.value),
        sexo: sexoInput.value
    };

    const idExistente = idInput.value;
    let url = `${API_URL}/guardar`;
    let metodo = 'POST';

    // Si el input oculto contiene un ID, conmutamos a modo de edición (UPDATE)
    if (idExistente) {
        url = `${API_URL}/editar/${idExistente}`;
        metodo = 'PUT';
    }

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paqueteUsuario)
        });
        
        const resultado = await respuesta.json();
        
        if (resultado.status === "success") {
            actualizarTabla(resultado.data);
            resetearFormulario();
        }
    } catch (error) {
        console.error("Error en la transacción del formulario:", error);
    }
}

// 4. PETICIÓN DELETE: SOLICITAR ELIMINACIÓN POR ID ÚNICO
async function eliminarUsuario(id) {
    if (!confirm("¿Estás completamente seguro de que deseas eliminar este registro?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/eliminar/${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();
        if (resultado.status === "success") {
            actualizarTabla(resultado.data);
            resetearFormulario(); // Devuelve el formulario a la normalidad si se estaba editando
        }
    } catch (error) {
        console.error("Error al procesar la baja del usuario:", error);
    }
}

// 5. MANIPULADORES ESTÁTICOS DEL ESTADO VISUAL
function prepararEdicion(id, nombre, edad, sexo) {
    idInput.value = id;
    nombreInput.value = nombre;
    edadInput.value = edad;
    sexoInput.value = sexo;

    tituloFormulario.innerText = "Modificando Registro";
    botonGuardar.innerText = "Actualizar Cambios";
    botonGuardar.style.backgroundColor = "#2980b9";
    botonCancelar.style.display = "block";
}

function resetearFormulario() {
    idInput.value = "";
    nombreInput.value = "";
    edadInput.value = "";
    sexoInput.value = "Masculino";

    tituloFormulario.innerText = "Formulario de Registro";
    botonGuardar.innerText = "Guardar Datos";
    botonGuardar.style.backgroundColor = "#27ae60";
    botonCancelar.style.display = "none";
}

// Escuchadores de eventos controladores de acciones
botonGuardar.addEventListener('click', procesarFormulario);
botonCancelar.addEventListener('click', resetearFormulario);
window.addEventListener('DOMContentLoaded', cargarUsuarios);

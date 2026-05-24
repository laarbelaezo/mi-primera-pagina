const API_URL = "https://leonardoarbelaez.pythonanywhere.com";

const tbody = document.getElementById("tabla-usuarios");
const botonGuardar = document.getElementById("btn-guardar");
const botonCancelar = document.getElementById("btn-cancelar");
const tituloFormulario = document.getElementById("titulo-formulario");

const idInput = document.getElementById("usuario-id");
const nombreInput = document.getElementById("nombre");
const edadInput = document.getElementById("edad");
const sexoInput = document.getElementById("sexo");

// 1. LEER Y DIBUJAR LA TABLA CON LOS BOTONES DE ACCIÓN
function actualizarTabla(usuarios) {
    tbody.innerHTML = "";

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

async function cargarUsuarios() {
    try {
        const respuesta = await fetch(`${API_URL}/usuarios`);
        const datos = await respuesta.json();
        actualizarTabla(datos);
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// 2. CREATE / UPDATE: GUARDAR (SABER SI ES NUEVO O EDICIÓN)
async function procesarFormulario() {
    if (!nombreInput.value || !edadInput.value) {
        alert("Campos Nombre y Edad obligatorios.");
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

    // Si el campo invisible tiene un ID, significa que estamos EDITANDO
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
        console.error("Error al procesar formulario:", error);
    }
}

// 3. DELETE: ELIMINAR REGISTRO DE LA NUBE
async function eliminarUsuario(id) {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/eliminar/${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();
        if (resultado.status === "success") {
            actualizarTabla(resultado.data);
            resetearFormulario(); // Por si acaso borrarn mientras editaban
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// 4. FUNCIONES AUXILIARES DE INTERFAZ
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

botonGuardar.addEventListener('click', procesarFormulario);
botonCancelar.addEventListener('click', resetearFormulario);
window.addEventListener('DOMContentLoaded', cargarUsuarios);

const API_URL = "https://leonardoarbelaez.pythonanywhere.com";

// ==========================================
// PROTECCIÓN 1: CABECERAS DE AUTENTICACIÓN (TOKENS)
// ==========================================
function getAuthHeaders() {
    const token = sessionStorage.getItem("admin_token");
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ==========================================
// PROTECCIÓN 3: ESCUDO ANTI-XSS (NUEVO)
// ==========================================
// Esta función convierte etiquetas de código malicioso en texto plano inofensivo
function escaparHTML(texto) {
    if (!texto) return "";
    return texto.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 1. LOGIN
async function login() {
    const user = document.getElementById("admin-user").value;
    const pass = document.getElementById("admin-pass").value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user, pass})
        });
        const data = await res.json();
        
        if(data.status === "success") {
            sessionStorage.setItem("admin_token", data.token); // Bóveda abierta
            document.getElementById("login-section").style.display = "none";
            document.getElementById("dashboard-section").style.display = "block";
            cargarUsuarios();
        } else {
            alert("Credenciales incorrectas");
        }
    } catch(err) { alert("Error de conexión"); }
}

// 2. CARGAR DATOS (CON DESINFECCIÓN EN TIEMPO REAL)
async function cargarUsuarios() {
    const res = await fetch(`${API_URL}/admin/usuarios`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    
    if(res.status === 401) { alert("Sesión inválida o expirada"); cerrarSesion(); return; }
    
    const usuarios = await res.json();
    const tabla = document.getElementById("tabla-admin");
    tabla.innerHTML = ""; // Limpiamos la tabla
    
    usuarios.forEach(u => {
        // Pasamos toda la información de texto por el filtro anti-XSS antes de usarla
        const nombreSeguro = escaparHTML(u.nombre);
        const sexoSeguro = escaparHTML(u.sexo);
        const tipoIdSeguro = escaparHTML(u.tipo_id);
        const numeroIdSeguro = escaparHTML(u.numero_id);
        // La edad no necesita escape porque en el backend es un INTEGER (número puro)

        tabla.innerHTML += `
            <tr>
                <td>${nombreSeguro}</td>
                <td>${u.edad}</td>
                <td>${sexoSeguro}</td>
                <td>${tipoIdSeguro}: ${numeroIdSeguro}</td>
                <td>
                    <button class="btn-accion btn-edit" onclick="prepararEdicion(${u.id}, '${nombreSeguro}', ${u.edad}, '${sexoSeguro}', '${tipoIdSeguro}', '${numeroIdSeguro}')">Editar</button>
                    <button class="btn-accion btn-del" onclick="eliminar(${u.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// 3. ELIMINAR
async function eliminar(id) {
    if(!confirm("¿Borrar permanentemente?")) return;
    await fetch(`${API_URL}/admin/eliminar/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders() 
    });
    cargarUsuarios();
}

// 4. EDITAR
function prepararEdicion(id, n, e, s, tid, nid) {
    // Como usamos .value en lugar de .innerHTML, los campos de input son naturalmente inmunes al XSS
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-nombre").value = n;
    document.getElementById("edit-edad").value = e;
    document.getElementById("edit-sexo").value = s;
    document.getElementById("edit-tipo-id").value = tid;
    document.getElementById("edit-numero-id").value = nid;
}

document.getElementById("btn-actualizar").addEventListener("click", async () => {
    const id = document.getElementById("edit-id").value;
    const datos = {
        nombre: document.getElementById("edit-nombre").value,
        edad: document.getElementById("edit-edad").value,
        sexo: document.getElementById("edit-sexo").value,
        tipo_id: document.getElementById("edit-tipo-id").value,
        numero_id: document.getElementById("edit-numero-id").value
    };
    await fetch(`${API_URL}/admin/editar/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(datos)
    });
    cargarUsuarios();
    alert("Usuario actualizado");
});

// 5. CAMBIAR CREDENCIALES
async function cambiarCredenciales() {
    const datos = {
        old_user: document.getElementById("old-user").value,
        old_pass: document.getElementById("old-pass").value,
        new_user: document.getElementById("new-user").value,
        new_pass: document.getElementById("new-pass").value
    };
    const res = await fetch(`${API_URL}/admin/cambiar-credenciales`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(datos)
    });
    const data = await res.json();
    alert(data.message);
}

// 6. CERRAR SESIÓN SEGURA
function cerrarSesion() { 
    sessionStorage.removeItem("admin_token");
    location.reload(); 
}

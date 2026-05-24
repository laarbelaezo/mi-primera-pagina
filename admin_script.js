const API_URL = "https://leonardoarbelaez.pythonanywhere.com";

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
            document.getElementById("login-section").style.display = "none";
            document.getElementById("dashboard-section").style.display = "block";
            cargarUsuarios();
        } else {
            alert("Credenciales incorrectas");
        }
    } catch(err) { alert("Error de conexión"); }
}

// 2. CARGAR DATOS
async function cargarUsuarios() {
    const res = await fetch(`${API_URL}/admin/usuarios`);
    const usuarios = await res.json();
    const tabla = document.getElementById("tabla-admin");
    tabla.innerHTML = "";
    usuarios.forEach(u => {
        tabla.innerHTML += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.edad}</td>
                <td>${u.sexo}</td>
                <td>${u.tipo_id}: ${u.numero_id}</td>
                <td>
                    <button class="btn-accion btn-edit" onclick="prepararEdicion(${u.id}, '${u.nombre}', ${u.edad}, '${u.sexo}', '${u.tipo_id}', '${u.numero_id}')">Editar</button>
                    <button class="btn-accion btn-del" onclick="eliminar(${u.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// 3. ELIMINAR
async function eliminar(id) {
    if(!confirm("¿Borrar permanentemente?")) return;
    const res = await fetch(`${API_URL}/admin/eliminar/${id}`, { method: 'DELETE' });
    const data = await res.json();
    cargarUsuarios();
}

// 4. EDITAR
function prepararEdicion(id, n, e, s, tid, nid) {
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
        headers: {'Content-Type': 'application/json'},
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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
    });
    const data = await res.json();
    alert(data.message);
}

function cerrarSesion() { location.reload(); }

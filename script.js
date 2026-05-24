const API_URL = "https://leonardoarbelaez.pythonanywhere.com";

document.getElementById("btn-registrar").addEventListener("click", async () => {
    const datos = {
        nombre: document.getElementById("nombre").value,
        edad: document.getElementById("edad").value,
        sexo: document.getElementById("sexo").value,
        tipo_id: document.getElementById("tipo_id").value,
        numero_id: document.getElementById("numero_id").value
    };

    if (!datos.nombre || !datos.numero_id) {
        alert("Por favor rellene los campos obligatorios");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/registrar`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
        const resData = await res.json();
        if (resData.status === "success") {
            alert("¡Registro exitoso!");
            location.reload();
        }
    } catch (err) {
        alert("Error al conectar con el servidor");
    }
});

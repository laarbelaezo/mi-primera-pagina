# Sistema CRUD Pro

Plataforma web completa para el registro de usuarios y gestión de bases de datos. Diseñada con una arquitectura dividida (Frontend estático y Backend dinámico) para garantizar rendimiento, seguridad y escalabilidad.

## Características Principales

* **Portal Público (Landing & Registro):** Interfaz limpia y responsiva para la captura de datos de usuarios (Nombre, Edad, Sexo, Tipo y Número de Documento).
* **Panel Administrativo Protegido:** Acceso restringido mediante sistema de Login (usuario y contraseña).
* **Gestión Total (CRUD):** Visualización en tiempo real, edición de registros y eliminación de datos directamente desde el navegador.
* **Seguridad Integrada:** Cambio de credenciales de administrador desde la interfaz web, guardadas de forma segura en la base de datos.

## Arquitectura del Sistema

El proyecto separa completamente la capa de presentación visual de la lógica del servidor y la base de datos:

* **Frontend (Cliente):** * Construido con HTML5, CSS3 y JavaScript puro (Vanilla JS).
  * Desplegado de forma gratuita y continua en **GitHub Pages**.
  * Diseño modular (`index.html`, `registro.html`, `admin.html`).

* **Backend (Servidor):**
  * Construido con **Python** utilizando el micro-framework **Flask**.
  * Base de datos relacional **SQLite3** con dos tablas (Usuarios y Credenciales).
  * Alojado en la nube mediante **PythonAnywhere**.
  * Comunicación habilitada mediante `Flask-CORS`.

## Funcionamiento API REST

El Frontend se comunica con el Backend mediante peticiones asíncronas (`fetch`) utilizando el formato JSON para el intercambio de datos.

| Endpoint | Método | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `/registrar` | `POST` | Inserta un nuevo usuario en la base de datos. | Público |
| `/login` | `POST` | Valida las credenciales del administrador. | Público |
| `/admin/usuarios` | `GET` | Devuelve el historial completo de registros. | Privado |
| `/admin/editar/<id>` | `PUT` | Actualiza la información de un usuario específico. | Privado |
| `/admin/eliminar/<id>`| `DELETE`| Borra un registro de la base de datos. | Privado |

## Autor
Desarrollado y mantenido por **Leonardo Alfonso Arbeláez Olarte**.

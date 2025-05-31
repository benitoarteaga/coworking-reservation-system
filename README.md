# 🏢 Coworking Reservation System

Este proyecto es una aplicación web para gestionar el **registro de usuarios** y la **reserva de citas** en un espacio de coworking. El sistema admite diferentes **roles** (admin y cliente), maneja la **validación de usuarios**, y permite ver todas las **especialidades y tipos de citas** disponibles.

El proyecto está desarrollado con:

- **Frontend**: React.js (Vite)
- **Backend**: Express.js (Node.js)
- **Base de Datos**: PostgreSQL
- **Gestor Web de DB**: pgAdmin
- **Contenerización**: Docker y Docker Compose

---

## 🌐 Repositorio

Clonar el repositorio desde GitHub:

```bash
git clone https://github.com/benitoarteaga/coworking-reservation-system.git
cd coworking-reservation-system

📁 Estructura del Proyecto

coworking-reservation-system/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── app.js
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       └── pages/
│   ├── App.jsx
│   └── main.jsx
│
├── database/
│   └── database.sql          # Script de inicialización de la base de datos
│
├── docker-compose.yml        # Orquestación de servicios
└── README.md                 # Documentación del proyecto


⚙️ Configuración con Docker

docker-compose up --build

🐘 PostgreSQL (puerto 5432)

🧰 pgAdmin (puerto 5050)

🚀 Backend Express.js (puerto 4000)

⚛️ Frontend React.js (puerto 5173)

🗃️ Inicializar la Base de Datos

    Ir a http://localhost:5050

    Ingresar con el correo admin@admin.com y contraseña admin

    Crear el servidor con los datos de PostgreSQL

    Ejecutar manualmente el contenido de db/database.sql en la base de datos con el nombre de medical_appointments_db

▶️ Iniciar Frontend (Iniciar el frontend manual importante)

    cd frontend
    npm install
    npm run dev

✨ Funcionalidades del Sistema

    Registro y login de usuarios (clientes y administradores)

    Validación de rol en autenticación y autorización

    Registro y visualización de citas

    Gestión de especialidades disponibles

    Administración de tipos de citas

    Panel de usuario con vista según el rol

    Gestión completa vía frontend React.js

🧪 Scripts útiles

    docker-compose up         # Inicia todo el sistema
    docker-compose down       # Detiene y elimina contenedores
    docker-compose build      # Reconstruye las imágenes

📄 Licencia
Este proyecto es público y puede usarse con fines académicos o comerciales bajo atribución.

👨‍💻 Autor

Benito Arteaga

---

### ✅ ¿Qué contiene este `README.md`?

- ✅ Nombre del proyecto
- ✅ Clonación desde GitHub
- ✅ Estructura clara del proyecto
- ✅ Pasos para levantar el sistema con Docker
- ✅ Uso de `database.sql`
- ✅ Comandos útiles
- ✅ Descripción funcional del sistema
- ✅ Endpoints del backend



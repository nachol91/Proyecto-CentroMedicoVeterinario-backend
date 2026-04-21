# CeDiVe - Centro Médico Veterinario (Backend API) ⚙️

Esta es la API REST robusta que alimenta el sistema **CeDiVe**. Está construida con una arquitectura de capas (Modelos, Rutas, Controladores y Helpers) para garantizar la escalabilidad y el mantenimiento del sistema de gestión veterinaria.

## 🛠️ Tecnologías y Stack

- **Node.js**: Entorno de ejecución para el servidor.
- **Express.js**: Framework para la gestión de rutas y middlewares.
- **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos de objetos.
- **Bcryptjs**: Encriptación de contraseñas mediante hashing de una vía.
- **JSON Web Token (JWT)**: Generación de tokens para autenticación segura.
- **Cors**: Configuración de intercambio de recursos de origen cruzado para la conexión con el frontend.

## 🔐 Seguridad e Implementación Técnica

- **Autenticación Protegida**: Implementación de JWT para proteger endpoints sensibles.
- **Encriptación**: Uso de saltos (rounds) con Bcrypt para asegurar que las contraseñas nunca se almacenen en texto plano.
- **Filtrado de Datos (Data Sanitization)**: Los controladores de login y usuarios están diseñados para desestructurar los objetos de la base de datos y eliminar el campo `password` antes de enviar cualquier respuesta al cliente, aplicando el principio de "Seguridad por Diseño".
- **Validaciones de Estado**: Control de acceso basado en el estado del usuario (Habilitado/Deshabilitado).
- **Middlewares Personalizados**: Validación de campos obligatorios y verificación de roles (ADMIN, MEDICO, USER).

## 📂 Estructura del Servidor

```text
server/
├── controllers/    # Lógica de negocio (auth, usuarios, mascotas, turnos).
├── helpers/        # Generación de JWT y validadores personalizados.
├── models/         # Esquemas de Mongoose (Usuario, Mascota, Turno).
├── middlewares/    # Validadores de JWT y roles de usuario.
├── routes/         # Definición de endpoints de la API.
├── database/       # Configuración y conexión a MongoDB Atlas.
└── index.js        # Punto de entrada y configuración de Express.

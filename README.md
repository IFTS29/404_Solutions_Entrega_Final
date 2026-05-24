# TodoStock S.A. - Sistema de Gestión de Inventario

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-1572B6?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## Proyecto: Desarrollo de Sistemas Web (Back End)

**Tecnicatura Superior en Desarrollo de Software**
**Instituto de Formación Técnica Superior N° 29 (IFTS 29)**

---

## Descripción del Proyecto

Este proyecto es la **Segunda Entrega** de la materia de Desarrollo de Sistemas Web - Back End. Toma como base la primer entrega e incorpora dos mejoras principales: la **migración de la persistencia de archivos JSON a MongoDB** utilizando Mongoose, y la incorporación de un **sistema de autenticación** (registro, login y logout) que protege el acceso al sistema.

La plataforma está diseñada para la distribuidora de productos de limpieza **TodoStock S.A.** y permite gestionar el ciclo de vida de productos, clientes y proveedores, con control de stock y acceso restringido por usuario.


---

## 👥 Integrantes del Equipo y Roles

El desarrollo se gestionó dividiendo el trabajo por capas de la arquitectura MVC y por módulos de negocio, consolidando la entrega mediante una revisión colaborativa.

| Integrante / GitHub | Rol y Responsabilidad Principal |
| :--- | :--- |
| **Aiello, Mariana**<br>[🔗 Ver Perfil](https://github.com/Aiello-M) | **Desarrollo de Finanzas, Integración de Datos y Documentación de Repositorio**<br>Desarrollo del módulo de Finanzas (consulta cruzada de colecciones de clientes/proveedores) y confección del archivo `README.md`. |
| **Flores, Miguel Ángel**<br>[🔗 Ver Perfil](https://github.com/mikefink22) | **Desarrollo de Clientes y Verificación de Calidad (QA)**<br>Desarrollo del módulo de Clientes (persistencia asíncrona con validaciones) y ejecución de la demostración funcional en vivo. |
| **González, Mario**<br>[🔗 Ver Perfil](https://github.com/elavincho) | **Infraestructura y Seguridad**<br>Configuración de la conexión global a MongoDB Atlas, definición de middlewares de protección de rutas y sistema de autenticación de usuarios. |
| **Rodríguez, Raquel**<br>[🔗 Ver Perfil](https://github.com/raquerh) | **Desarrollo de Productos e Identificadores**<br>Desarrollo del módulo de Productos (persistencia asíncrona con validaciones) y migración de IDs manuales a `ObjectId` nativos. |
| **Thomas, Valeria**<br>[🔗 Ver Perfil](https://github.com/Irinath) | **Desarrollo de Proveedores e Informe Técnico**<br>Desarrollo del módulo de Proveedores (persistencia asíncrona con validaciones) y redacción del documento PDF de entrega final. |
---

## Novedades respecto a la Primera Entrega

- **Migración a MongoDB:** Los datos ya no se persisten en archivos `.json` locales. Ahora se utiliza **MongoDB** como base de datos en la nube, gestionada con **Mongoose**.
- **Sistema de autenticación:** Se incorporaron las vistas y la lógica de login, registro y logout. Las rutas protegidas requieren autenticación para ser accedidas.
- **Nuevas entidades:** Se sumaron los modelos de **Cliente**, **Proveedor** y **Usuario**, cada uno con su schema Mongoose, controlador y rutas correspondientes.
- **Variables de entorno:** La configuración sensible (URI de MongoDB, puerto) se gestiona mediante un archivo `.env` y la librería `dotenv`.
- **Programación asincrónica:** Los controladores utilizan `async/await` para todas las operaciones con la base de datos.
- **Manejo de errores:** Se incorporaron bloques `try/catch` en los controladores con mensajes descriptivos al usuario.

---

## Funcionalidades Principales

- **Autenticación:** Registro de nuevos usuarios, inicio y cierre de sesión. Middleware `isAuthenticated` que redirige al login si no hay sesión activa, y `isGuest` que impide el acceso a login/registro si ya hay una sesión iniciada.
- **CRUD de Productos:** Creación, listado, edición y eliminación de productos de limpieza con validaciones Mongoose.
- **CRUD de Clientes:** Gestión de clientes con soporte para tipo de documento (DNI/CUIT), razón social y saldo de cuenta corriente.
- **CRUD de Proveedores:** Gestión de proveedores con la misma estructura que clientes.
- **Control de Stock:** Alertas visuales (color rojo) para productos por debajo del stock mínimo.
- **Validaciones:** Campos obligatorios, formatos de email, rangos numéricos y valores permitidos (enums) definidos en los schemas de Mongoose.
- **Interfaz Dinámica:** Motor de plantillas **Pug** con layouts reutilizables y estilos CSS personalizados.

---

## Tecnologías Utilizadas

- **Node.js** (Entorno de ejecución)
- **Express.js v5** (Framework web)
- **Pug** (Motor de plantillas)
- **MongoDB Atlas + Mongoose** (Base de datos en la nube y ODM)
- **dotenv** (Gestión de variables de entorno)
- **CSS3** (Diseño y estilos)
- **JavaScript (ES6+)** (Lógica de negocio y POO)

---

## Estructura del Proyecto

```
404Solution_BE1c2026_G1cD/
├── controllers/
│   ├── authController.js       # Login, registro, logout y middlewares de auth
│   ├── clienteController.js
│   ├── finanzasController.js
│   ├── homeController.js
│   ├── productoController.js
│   └── proveedorController.js
├── models/
│   ├── Cliente.js              # Schema Mongoose de clientes
│   ├── Producto.js             # Schema Mongoose de productos
│   ├── Proveedor.js            # Schema Mongoose de proveedores
│   └── Usuario.js              # Schema Mongoose de usuarios
├── routes/
│   ├── authRoutes.js
│   ├── clienteRoutes.js
│   ├── finanzasRoutes.js
│   ├── homeRoutes.js
│   ├── productoRoutes.js
│   └── proveedorRoutes.js
├── views/
│   ├── auth/
│   │   ├── login.pug
│   │   └── register.pug
│   ├── clientes/
│   ├── productos/
│   ├── proveedores/
│   ├── finanzas/
│   ├── home/
│   └── layout.pug
├── public/                     # Archivos estáticos (CSS, imágenes)
├── .env                        # Variables de entorno (no incluir en el repo)
├── app.js                      # Punto de entrada del servidor
└── package.json
```

---

## Instalación y Configuración

### Prerrequisitos
- **Node.js** (v18 o superior)
- **Git**
- Una cuenta en **MongoDB Atlas** (o un servidor local de MongoDB).

---

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd 404Solution_BE1c2026_G1cD
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<nombre-db>
PORT=3000
```

### 4. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`.

---

## Uso Básico

1. Al ingresar a la ruta principal, el sistema redirigirá automáticamente a la pantalla de Login.
2. Hacer clic en "Registrarse" para crear un usuario inicial.
3. Una vez iniciada la sesión, se habilitará el acceso al Dashboard principal y a los módulos de Productos, Clientes, Proveedores y Finanzas.

---

## Uso de Inteligencia Artificial

Durante el desarrollo de esta etapa se utilizaron asistentes de Inteligencia Artificial como herramientas de apoyo técnico, limitándose su uso a las siguientes tareas:

- Asistencia en la depuración de código (debugging) y resolución de errores asincrónicos.
- Optimización en la redacción y formato de la documentación técnica y manuales de despliegue.

*Nota: Toda la arquitectura, lógica de negocio y definiciones de base de datos fueron diseñadas, evaluadas e implementadas por el equipo de desarrollo.*

---

## Bibliografía

- [Documentación oficial de Node.js](https://nodejs.org/en/docs/)
- [Documentación oficial de Express.js](https://expressjs.com/)
- [Documentación oficial de Mongoose](https://mongoosejs.com/docs/)
- [Documentación oficial de MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Documentación oficial de Pug](https://pugjs.org/api/getting-started.html)
- [MDN Web Docs - JavaScript async/await](https://developer.mozilla.org/es/docs/Learn/JavaScript/Asynchronous/Promises)
- [dotenv - npm](https://www.npmjs.com/package/dotenv)

---

## Video Explicativo

> *https://youtu.be/5x6fUrPxQ7k*

---

*Materia: Desarrollo de Sistemas Web - Back End | IFTS 29 | 2026*

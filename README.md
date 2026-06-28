# TodoStock S.A. - Sistema de Gestión Empresarial

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Pug](https://img.shields.io/badge/Pug-A86454?style=for-the-badge&logo=pug&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 📋 Información del Proyecto

**Materia:** Desarrollo de Sistemas Web - Back End  
**Carrera:** Tecnicatura Superior en Desarrollo de Software  
**Institución:** Instituto de Formación Técnica Superior N° 29 (IFTS 29)  
**Período:** 2026 - 1er Cuatrimestre  
**Tipo de Entrega:** Parcial Final (Entrega 3/3)  
**Grupo:** 404Solution

**Estado del Proyecto:** ✅ Completado y desplegado  
**Versión Actual:** 2.0.0  
**Última Actualización:** Junio 2026

---

## 📖 Descripción del Proyecto

**TodoStock S.A.** es un sistema integral de gestión empresarial desarrollado para una distribuidora de productos de limpieza. Este proyecto representa la **evolución completa** a través de tres entregas progresivas, cada una agregando complejidad y funcionalidad al sistema.

### **Características Actuales (Versión 2.0):**

- ✅ **Base de datos MongoDB** con Mongoose ODM
- ✅ **Autenticación segura** con bcrypt + hashing de contraseñas
- ✅ **Sesiones persistentes** con express-session + connect-mongo
- ✅ **Sistema de roles** y autorización (admin, contador, usuario)
- ✅ **Módulos completos** de facturación, notas de crédito/débito, órdenes de pago, presupuestos
- ✅ **Gestión automática de stock** con control de movimientos
- ✅ **Middleware de manejo de errores** centralizado
- ✅ **Interfaz responsive** con CSS moderno y mobile-first
- ✅ **Despliegue en Vercel** como Serverless Function
- ✅ **Documentación completa** con diagramas y manuales

La plataforma permite gestionar de forma integral: productos, clientes, proveedores, facturación, órdenes de pago, notas contables y reportes financieros.

---

## 🎯 Objetivos Cumplidos

### **Objetivos Generales:**
- ✅ Desarrollar una aplicación web funcional utilizando Node.js y Express
- ✅ Aplicar conceptos de Backend: ruteo, middleware, asincronía, manejo de errores
- ✅ Implementar base de datos MongoDB con Mongoose
- ✅ Desplegar la aplicación en un servicio cloud (Vercel + MongoDB Atlas)
- ✅ Seguir buenas prácticas de desarrollo y arquitectura MVC
- ✅ Integrar conocimientos de otras materias (Frontend, Ingeniería de Software)

### **Objetivos Específicos:**
- ✅ Implementar autenticación y autorización segura
- ✅ Crear un sistema de roles con permisos diferenciados
- ✅ Desarrollar CRUDs completos para todas las entidades
- ✅ Implementar lógica de negocio compleja (facturación, stock, finanzas)
- ✅ Manejar relaciones entre entidades (referencias en MongoDB)
- ✅ Crear middlewares personalizados para protección de rutas
- ✅ Implementar manejo centralizado de errores
- ✅ Diseñar interfaz de usuario intuitiva y responsive
- ✅ Documentar el proyecto de forma profesional

---

## 🎯 Funcionalidades Principales

### 🔐 Autenticación y Seguridad
- Registro de usuarios con validaciones
- Login con usuario/email + contraseña encriptada (bcrypt)
- Sesiones persistentes en MongoDB
- Logout seguro
- Protección de rutas según autenticación
- Control de acceso por roles

### 👥 Sistema de Roles
- **Admin**: Acceso total, gestión de usuarios
- **Contador**: Acceso a módulos financieros y facturación
- **Usuario**: Operaciones básicas (productos, clientes, proveedores)

### 📦 Gestión de Inventario
- CRUD completo de productos
- Control de stock automático
- Alertas de stock mínimo
- Actualización de stock desde facturas
- Historial de movimientos

### 👤 Gestión de Clientes y Proveedores
- CRUD completo con validaciones
- Soporte para DNI y CUIT
- Manejo de cuentas corrientes
- Consulta de saldos

### 🧾 Facturación
- **Facturas a Clientes**: Con descuento automático de stock
- **Facturas de Proveedores**: Con aumento automático de stock
- Cálculo automático de IVA (21% y 10.5%)
- Estados: Pendiente, Pagada, Anulada, Parcial
- Anulación con reversión de stock

### 💰 Gestión Financiera
- Órdenes de pago con múltiples facturas
- Notas de crédito (devoluciones y ajustes negativos)
- Notas de débito (cargos adicionales)
- Presupuestos con fechas de validez
- Estados de documentos: Pendiente, Pagada, Anulada, Parcial
- Cálculo automático de saldos
- Resumen financiero por cliente y proveedor

### 🛡️ Manejo de Errores
- Middleware centralizado de errores
- Páginas de error personalizadas (404, 500)
- Logging de errores en desarrollo
- Mensajes de error amigables al usuario

---

## 🏗️ Arquitectura y Tecnologías

### Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | 18+ | Entorno de ejecución |
| **Express.js** | 5.2.1 | Framework web |
| **MongoDB** | 4.17.2 | Base de datos |
| **Mongoose** | 9.6.2 | ODM para MongoDB |
| **bcryptjs** | 3.0.3 | Encriptación de contraseñas |
| **express-session** | 1.19.0 | Gestión de sesiones |
| **connect-mongo** | 4.6.0 | Store de sesiones en MongoDB |
| **Pug** | 3.0.4 | Motor de plantillas |
| **dotenv** | 17.4.2 | Variables de entorno |

### Patrón de Diseño: MVC (Model-View-Controller)

```
📁 Estructura del Proyecto
├── 📂 config/              # Configuración de base de datos
│   └── database.js
├── 📂 controllers/         # Lógica de negocio (12 controladores)
│   ├── authController.js
│   ├── productoController.js
│   ├── clienteController.js
│   ├── proveedorController.js
│   ├── facturaClienteController.js
│   ├── facturaProveedorController.js
│   ├── ordenPagoController.js
│   ├── notaDeCreditoController.js
│   ├── notaDeDebitoController.js
│   ├── presupuestoController.js
│   ├── finanzasController.js
│   └── homeController.js
├── 📂 models/              # Schemas de Mongoose (10 modelos)
│   ├── Usuario.js
│   ├── Producto.js
│   ├── Cliente.js
│   ├── Proveedor.js
│   ├── FacturaCliente.js
│   ├── FacturaProveedor.js
│   ├── OrdenPago.js
│   ├── NotaDeCredito.js
│   ├── NotaDeDebito.js
│   └── Presupuesto.js
├── 📂 routes/              # Definición de endpoints (13 rutas)
│   ├── authRoutes.js
│   ├── productoRoutes.js
│   ├── clienteRoutes.js
│   ├── proveedorRoutes.js
│   ├── facturaClienteRoutes.js
│   ├── facturaProveedorRoutes.js
│   ├── ordenPagoRoutes.js
│   ├── notaDeCreditoRoutes.js
│   ├── notaDeDebitoRoutes.js
│   ├── presupuestoRoutes.js
│   ├── finanzasRoutes.js
│   ├── homeRoutes.js
│   └── adminRoutes.js
├── 📂 middlewares/         # Middlewares personalizados
│   └── errorHandler.js    # Manejo centralizado de errores
├── 📂 services/            # Lógica de negocio reutilizable
│   └── stockService.js    # Gestión de inventario
├── 📂 views/               # Plantillas Pug
│   ├── layout.pug         # Layout base
│   ├── error.pug          # Página de error
│   ├── 📂 auth/
│   ├── 📂 productos/
│   ├── 📂 clientes/
│   ├── 📂 proveedores/
│   ├── 📂 facturas-cliente/
│   ├── 📂 facturas-proveedor/
│   ├── 📂 ordenes-pago/
│   ├── 📂 notas-credito/
│   ├── 📂 notas-debito/
│   ├── 📂 presupuestos/
│   └── 📂 finanzas/
├── 📂 public/              # Archivos estáticos
│   ├── 📂 css/
│   └── 📂 img/
├── .env                    # Variables de entorno (no versionado)
├── .env.example            # Ejemplo de configuración
├── .gitignore
├── app.js                  # Punto de entrada
├── package.json
├── vercel.json             # Configuración de despliegue
└── README.md
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** v18 o superior
- **MongoDB** (local o MongoDB Atlas)
- **Git**
- **npm** o **yarn**

### Paso 1: Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd backend_2da_entrega_commonjs_mongo
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto (usar `.env.example` como referencia):

```env
# Base de Datos MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/todostock

# Clave secreta para sesiones (generar una única y segura)
SESSION_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development
```

**⚠️ IMPORTANTE:**
- Generar una `SESSION_SECRET` única con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- NUNCA subir el archivo `.env` al repositorio
- Para MongoDB Atlas, crear un usuario con permisos específicos

### Paso 4: Iniciar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## 🧪 Ejecución de Pruebas

🚧 **Estado actual:** No se implementaron tests automatizados en esta versión.

**Justificación:** El enunciado indica que no es necesario ahondar en testing automatizado. Se realizaron pruebas manuales exhaustivas de todas las funcionalidades.

**Pruebas manuales realizadas:**
- ✅ Registro e inicio de sesión
- ✅ Control de acceso por roles
- ✅ CRUD de todas las entidades
- ✅ Creación y anulación de facturas
- ✅ Gestión automática de stock
- ✅ Cálculos de IVA y totales
- ✅ Manejo de errores (404, 500)
- ✅ Responsive en diferentes dispositivos

**Mejoras futuras:** Implementar Jest + Supertest para tests automatizados.

---

## 🌐 Despliegue en Vercel

El proyecto está configurado para despliegue en Vercel como Serverless Function:

```json
{
  "version": 2,
  "builds": [{"src": "app.js", "use": "@vercel/node"}],
  "routes": [{"src": "/(.*)", "dest": "/app.js"}]
}
```

### Variables de entorno en Vercel

Configurar en el dashboard de Vercel:
- `MONGODB_URI`
- `SESSION_SECRET`
- `NODE_ENV=production`

---

## 📊 Modelos de Datos

### Usuario
```javascript
{
  username: String (único),
  email: String (único),
  password: String (encriptado con bcrypt),
  nombreCompleto: String,
  rol: String (enum: 'admin', 'usuario', 'contador'),
  activo: Boolean,
  ultimoAcceso: Date
}
```

### Producto
```javascript
{
  id: Number,
  nombre: String,
  categoria: String,
  precio: Number,
  stockActual: Number,
  stockMinimo: Number
}
```

### FacturaCliente
```javascript
{
  numero: String (único),
  puntoVenta: Number,
  clienteId: Number,
  clienteInfo: Object,
  empresaInfo: Object,
  fechaEmision: Date,
  fechaVencimiento: Date,
  estatus: String (enum: 'Pendiente', 'Pagada', 'Anulada', 'Parcial'),
  detalles: [Array de productos],
  subtotalNeto: Number (calculado automáticamente),
  iva21: Number (calculado automáticamente),
  iva105: Number (calculado automáticamente),
  total: Number (calculado automáticamente),
  stockDescontado: Boolean
}
```

---

## 🔒 Sistema de Autorización

| Rol | Permisos |
|-----|----------|
| **Admin** | Acceso total + gestión de usuarios |
| **Contador** | Finanzas, facturación, órdenes de pago, notas de crédito/débito, presupuestos |
| **Usuario** | Productos, clientes, proveedores (operaciones básicas) |

### Middlewares de Autorización

```javascript
requireLogin          // Solo usuarios autenticados
requireAdmin          // Solo administradores
requireContadorOrAdmin // Contadores y administradores
requireRole(...roles) // Roles específicos personalizados
```

---

## 🔄 Evolución del Proyecto a través de las Entregas

### **📦 Entrega 1: Sistema Básico con Persistencia en JSON (Versión 1.0)**
**Fecha:** Abril 2026  
**Objetivos cumplidos:**
- ✅ Configuración inicial del proyecto con Node.js y Express
- ✅ Implementación del patrón MVC
- ✅ Motor de plantillas Pug configurado
- ✅ CRUD completo de productos
- ✅ Persistencia de datos en archivos JSON
- ✅ Rutas dinámicas y parámetros
- ✅ Middleware básico (body-parser, static files)
- ✅ Gestión de sesiones simple

**Tecnologías:** Node.js, Express, Pug, File System (fs)

---

### **🗄️ Entrega 2: Migración a Base de Datos (Versión 1.5)**
**Fecha:** Mayo 2026  
**Mejoras implementadas:**
- ✅ Migración completa a MongoDB + Mongoose
- ✅ Diseño de schemas y modelos
- ✅ Validaciones a nivel de base de datos
- ✅ Autenticación básica (login/logout)
- ✅ CRUD de clientes y proveedores
- ✅ Módulo de finanzas inicial
- ✅ Conexión a MongoDB Atlas (cloud)
- ✅ Variables de entorno con dotenv
- ✅ Manejo de operaciones asíncronas con async/await

**Nuevas tecnologías:** MongoDB, Mongoose, MongoDB Atlas, dotenv

---

### **🚀 Entrega 3 (Final): Sistema Completo y Desplegado (Versión 2.0)**
**Fecha:** Junio 2026  
**Funcionalidades agregadas:**
- ✅ **Seguridad mejorada:**
  - Encriptación de contraseñas con bcrypt (10 rounds)
  - Sesiones persistentes en MongoDB
  - Protección contra ataques de fuerza bruta
  - Cookies seguras con httpOnly y sameSite

- ✅ **Sistema de autorización:**
  - 3 roles diferenciados (admin, contador, usuario)
  - Middlewares de protección por rol
  - Control de acceso granular por módulo

- ✅ **Módulos financieros completos:**
  - Facturación a clientes (con descuento de stock)
  - Facturación de proveedores (con incremento de stock)
  - Órdenes de pago con tracking de estado
  - Notas de crédito (devoluciones)
  - Notas de débito (ajustes)
  - Presupuestos con fechas de validez
  - Gestión automática de stock con historial

- ✅ **Manejo de errores robusto:**
  - Middleware centralizado de errores
  - Páginas personalizadas 404/500
  - Logging de errores en desarrollo
  - Mensajes user-friendly

- ✅ **Mejoras de UI/UX:**
  - Diseño responsive (mobile-first)
  - Navbar simplificado y eficiente
  - Dashboard con cards interactivas
  - Formularios con validación
  - Badges de estado con colores
  - Animaciones suaves
  - Footer sticky

- ✅ **Calidad de código:**
  - Unidades relativas (rem) en todo el CSS
  - 15+ media queries para responsive
  - Código modular y reutilizable
  - Comentarios en código crítico
  - README completo

- ✅ **Despliegue profesional:**
  - Vercel Serverless Functions
  - MongoDB Atlas en producción
  - Variables de entorno seguras
  - URL pública accesible

**Nuevas tecnologías:** bcryptjs, express-session, connect-mongo, Vercel

**Documentación adicional:** 
- `MEJORAS_REALIZADAS.md`: Detalle de todas las mejoras
- `CHECKLIST_ENTREGA_FINAL.md`: Lista de requisitos cumplidos
- `CHECKLIST_CODIGO.md`: Análisis técnico del código

---

## 📝 Decisiones Técnicas

### ¿Por qué express-session en vez de JWT?

**Decisión**: Usamos **express-session + connect-mongo** en lugar de JWT.

**Justificación**:
- ✅ **Simplicidad**: Express-session es más simple de implementar para este alcance
- ✅ **Seguridad**: Las sesiones se almacenan en el servidor (MongoDB), más difíciles de comprometer
- ✅ **Revocación**: Podemos invalidar sesiones fácilmente desde el servidor
- ✅ **Estado**: Ideal para aplicaciones web con vistas del servidor (Pug)
- ⚠️ **Escalabilidad**: Para APIs REST stateless, JWT sería mejor

### ¿Por qué bcrypt en vez de otros métodos?

- ✅ Algoritmo probado y seguro
- ✅ Incluye salt automático
- ✅ Configurable en complejidad
- ✅ Resistente a ataques de fuerza bruta

### ¿Por qué Mongoose en vez de driver nativo?

- ✅ Schemas y validaciones
- ✅ Middleware (hooks)
- ✅ Métodos y virtuals
- ✅ Queries más legibles
- ✅ Cálculos automáticos (pre-save hooks)

---

## 👥 Integrantes del Equipo y Roles

| Integrante | Rol Principal | Responsabilidades |
|------------|---------------|-------------------|
| **Aiello, Mariana** | Desarrollo de Finanzas + Documentación | Módulo de finanzas, integración de datos, README.md |
| **Flores, Miguel Ángel** | Desarrollo de Clientes + QA | CRUD de clientes, validaciones, testing y demostración |
| **González, Mario** | Infraestructura + Seguridad | MongoDB Atlas, autenticación, sesiones, middlewares |
| **Rodríguez, Raquel** | Desarrollo de Productos + Testing | CRUD de productos, migración de IDs, tests |
| **Thomas, Valeria** | Desarrollo de Proveedores + Documentación | CRUD de proveedores, documento PDF final |

---

## 📚 Bibliografía y Recursos

### Documentación Oficial
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Pug Template Engine](https://pugjs.org/api/getting-started.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

### Tutoriales y Guías
- [MDN Web Docs - Async/Await](https://developer.mozilla.org/es/docs/Learn/JavaScript/Asynchronous/Promises)
- [bcrypt.js - npm](https://www.npmjs.com/package/bcryptjs)
- [express-session - npm](https://www.npmjs.com/package/express-session)
- [connect-mongo - npm](https://www.npmjs.com/package/connect-mongo)

### Videos Educativos
- Curso de Node.js y Express - YouTube
- Tutorial de MongoDB y Mongoose - YouTube
- Autenticación con bcrypt y sesiones - YouTube

---

## 🤖 Uso de Inteligencia Artificial

Durante el desarrollo de esta entrega se utilizaron asistentes de IA como herramientas de apoyo técnico en:

- ✅ Depuración de código y resolución de errores
- ✅ Optimización de queries de Mongoose
- ✅ Sugerencias de mejores prácticas de seguridad
- ✅ Formato y estructura de documentación

**Nota**: Toda la arquitectura, lógica de negocio, diseño de base de datos y decisiones técnicas fueron realizadas por el equipo de desarrollo. La IA solo fue usada como asistente en tareas específicas.

---

## 🎥 Video Demostrativo

> **Enlace al video**: [Agregar enlace aquí]

El video incluye:
- Demostración completa de funcionalidades
- Explicación de la arquitectura
- Casos de uso principales
- Manejo de errores
- Participación de todos los integrantes

---

## 🐛 Problemas Conocidos y Mejoras Futuras

### Mejoras Futuras
- [ ] Completar módulo de finanzas: integrar órdenes de pago, notas de crédito/débito y presupuestos en el resumen consolidado
- [ ] Incorporar tests automatizados (Jest/Supertest)
- [ ] Implementar paginación en listados
- [ ] Agregar búsqueda y filtros avanzados
- [ ] Generar PDFs de facturas
- [ ] Envío de emails automáticos
- [ ] Dashboard con gráficos estadísticos
- [ ] API REST para integración externa
- [ ] Implementación de caché con Redis
- [ ] Logs centralizados con Winston

---

## 📞 Contacto y Soporte

**Institución**: IFTS 29  
**Materia**: Desarrollo de Sistemas Web - Back End  
**Año**: 2026 - 1er Cuatrimestre  

---

## 📄 Licencia

ISC © 2026 TodoStock S.A. - IFTS 29

---

**Última actualización**: Junio 2026  
**Versión**: 2.0.0

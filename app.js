// const express = require('express');
// const app = express();
// const path = require('path');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const connectDB = require('./config/database');
// const { notFound, errorHandler } = require('./middlewares/errorHandler');
// require('dotenv').config();


// const homeRoutes = require("./routes/homeRoutes");
// const rutasProductos = require("./routes/productoRoutes");
// const clienteRoutes = require("./routes/clienteRoutes");
// const proveedorRoutes = require("./routes/proveedorRoutes");
// const finanzasRoutes = require("./routes/finanzasRoutes");
// const ordenPagoRoutes = require("./routes/ordenPagoRoutes");
// const facturaProveedorRoutes = require("./routes/facturaProveedorRoutes");
// const authRoutes = require("./routes/authRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const facturaClienteRoutes = require("./routes/facturaClienteRoutes");
// const notaDeDebitoRoutes = require("./routes/notaDeDebitoRoutes");
// const notaDeCreditoRoutes = require("./routes/notaDeCreditoRoutes");
// const presupuestoRoutes = require("./routes/presupuestoRoutes");
// const cobranzasRoutes = require("./routes/cobranzasRoutes");

// // Conectar a MongoDB
// connectDB();

// app.use(session({
//   secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro_2024',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URI,
//     ttl: 24 * 60 * 60
//   }),
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax'
//   },
//   proxy: true,
//   trustProxy: 1
// }));


// // Middleware para pasar usuario a todas las vistas
// app.use((req, res, next) => {
//   res.locals.usuario = req.session?.usuario || null;
//   next();
// });

// // Middleware para proteger rutas
// const requireLogin = (req, res, next) => {
//   if (!req.session?.usuario) {
//     return res.redirect('/login');
//   }
//   next();
// };

// // Configuración de vistas
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

// // Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// // Uso de las rutas - Rutas públicas
// app.use("/", authRoutes);

// // Rutas protegidas (requieren login)
// app.use("/dashboard", requireLogin, authRoutes);
// app.use("/home", requireLogin, homeRoutes);
// app.use("/productos", requireLogin, rutasProductos);
// app.use("/clientes", requireLogin, clienteRoutes);
// app.use("/proveedores", requireLogin, proveedorRoutes);
// app.use("/finanzas", requireLogin, finanzasRoutes);
// app.use("/ordenes-pago", requireLogin, ordenPagoRoutes);
// app.use("/facturas-proveedor", requireLogin, facturaProveedorRoutes);
// app.use("/admin", requireLogin, adminRoutes);
// app.use("/facturas-cliente", requireLogin, facturaClienteRoutes);
// app.use("/notas-debito", requireLogin, notaDeDebitoRoutes);
// app.use("/notas-credito", requireLogin, notaDeCreditoRoutes);
// app.use("/presupuestos", requireLogin, presupuestoRoutes);
// app.use("/cobranzas", requireLogin, cobranzasRoutes);

// // Redireccionar raíz a login o dashboard
// app.get("/", (req, res) => {
//   if (req.session?.usuario) {
//     res.redirect('/dashboard');
//   } else {
//     res.redirect('/login');
//   }
// });

// // Middleware de manejo de errores (DEBE IR AL FINAL)
// app.use(notFound);
// app.use(errorHandler);

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// // });   --> reemplazado en siguiente linea 

// const PORT = process.env.PORT || 3000;

// // Para desarrollo local
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(PORT, () => {
//     console.log(`Servidor corriendo en http://localhost:${PORT}`);
//   });
// }

// // module.exports = { requireLogin };

// // Exportar para Vercel (Serverless Function)
// module.exports = app;


const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser'); // NUEVO
const jwt = require('jsonwebtoken'); // NUEVO
const connectDB = require('./config/database');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
require('dotenv').config();

// Importar rutas
const homeRoutes = require("./routes/homeRoutes");
const rutasProductos = require("./routes/productoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const finanzasRoutes = require("./routes/finanzasRoutes");
const ordenPagoRoutes = require("./routes/ordenPagoRoutes");
const facturaProveedorRoutes = require("./routes/facturaProveedorRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const facturaClienteRoutes = require("./routes/facturaClienteRoutes");
const notaDeDebitoRoutes = require("./routes/notaDeDebitoRoutes");
const notaDeCreditoRoutes = require("./routes/notaDeCreditoRoutes");
const presupuestoRoutes = require("./routes/presupuestoRoutes");
const reciboCobroRoutes = require("./routes/reciboCobroRoutes");

// NUEVO: Importar rutas API con JWT
const apiRoutes = require("./routes/apiRoutes");

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); // NUEVO: Para leer cookies

// Configuración de sesiones (mantener para compatibilidad)
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  },
  proxy: true,
  trustProxy: 1
}));

// NUEVO: Middleware para autenticación híbrida (sesión + JWT)
app.use((req, res, next) => {
  // Primero intentar obtener usuario de la sesión
  if (req.session?.usuario) {
    res.locals.usuario = req.session.usuario;
    return next();
  }

  // Si no hay sesión, intentar con JWT
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.session.usuario = decoded; // Sincronizar con sesión
      res.locals.usuario = decoded;
    } catch (error) {
      // Token inválido o expirado
      res.clearCookie('token');
    }
  }

  res.locals.usuario = req.session?.usuario || null;
  next();
});

// Middleware para proteger rutas (modificado para soportar JWT)
const requireLogin = (req, res, next) => {
  // Verificar sesión primero
  if (req.session?.usuario) {
    return next();
  }

  // Si no hay sesión, verificar token JWT
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.session.usuario = decoded; // Sincronizar
      return next();
    } catch (error) {
      // Token inválido
      res.clearCookie('token');
    }
  }

  // Si llegamos aquí, no está autenticado
  res.redirect('/login');
};

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ============ RUTAS ============

// Rutas públicas
app.use("/", authRoutes);

// Rutas API con JWT (NUEVO)
app.use("/api", apiRoutes);

// Rutas protegidas (requieren login)
app.use("/dashboard", requireLogin, authRoutes);
app.use("/home", requireLogin, homeRoutes);
app.use("/productos", requireLogin, rutasProductos);
app.use("/clientes", requireLogin, clienteRoutes);
app.use("/proveedores", requireLogin, proveedorRoutes);
app.use("/finanzas", requireLogin, finanzasRoutes);
app.use("/ordenes-pago", requireLogin, ordenPagoRoutes);
app.use("/facturas-proveedor", requireLogin, facturaProveedorRoutes);
app.use("/admin", requireLogin, adminRoutes);
app.use("/facturas-cliente", requireLogin, facturaClienteRoutes);
app.use("/notas-debito", requireLogin, notaDeDebitoRoutes);
app.use("/notas-credito", requireLogin, notaDeCreditoRoutes);
app.use("/presupuestos", requireLogin, presupuestoRoutes);
app.use("/recibos-cobro", requireLogin, reciboCobroRoutes);

// Redireccionar raíz
app.get("/", (req, res) => {
  if (req.session?.usuario) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Configuración del servidor
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Middleware para pasar el usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado correctamente'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/', require('./routes/homeRoutes'));
app.use('/', require('./routes/authRoutes'));  // Las rutas de auth
app.use('/productos', require('./routes/productoRoutes'));
app.use('/clientes', require('./routes/clienteRoutes'));
app.use('/proveedores', require('./routes/proveedorRoutes'));
app.use('/finanzas', require('./routes/finanzasRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
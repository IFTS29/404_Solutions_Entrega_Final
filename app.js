const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware para pasar el usuario a todas las vistas
const { getUsuarioActual } = require('./controllers/authController');

app.use((req, res, next) => {
  res.locals.usuario = getUsuarioActual();
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
app.use('/', require('./routes/authRoutes'));
app.use('/productos', require('./routes/productoRoutes'));
app.use('/clientes', require('./routes/clienteRoutes'));
app.use('/proveedores', require('./routes/proveedorRoutes'));
app.use('/finanzas', require('./routes/finanzasRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
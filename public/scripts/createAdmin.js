const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde la raíz
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Importar el modelo Usuario
const Usuario = require('../models/Usuario');

const createAdmin = async () => {
  try {
    // Conectar a MongoDB usando la URI del .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
    
    const adminExists = await Usuario.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const admin = new Usuario({
        username: 'admin',
        password: 'admin123',
        nombre: 'Admin',
        email: 'admin@todostock.com',
        rol: 'admin'
      });
      
      await admin.save();
      console.log('Usuario administrador creado exitosamente');
      console.log('Usuario: admin');
      console.log('Contraseña: admin123');
    } else {
      console.log('El usuario administrador ya existe');
    }
    
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
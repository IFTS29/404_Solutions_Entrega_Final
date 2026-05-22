const Usuario = require("../models/Usuario");

// Variable global para almacenar el usuario actual (solo en memoria)
let usuarioActual = null;

// ============ MIDDLEWES DE AUTENTICACIÓN ============
const isAuthenticated = (req, res, next) => {
  if (usuarioActual) {
    return next();
  }
  res.redirect("/login");
};

const isGuest = (req, res, next) => {
  if (usuarioActual) {
    return res.redirect("/");
  }
  next();
};

// ============ CONTROLADOR DE AUTENTICACIÓN ============
const authController = {
  // Mostrar formulario de login
  loginForm: (req, res) => {
    res.render("auth/login", {
      titulo: "Login - TodoStock S.A.",
      error: null,
      datos: null,
    });
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const usuario = await Usuario.findOne({ email });

      if (!usuario) {
        return res.render("auth/login", {
          titulo: "Login - TodoStock S.A.",
          error: "Email o contraseña incorrectos",
          datos: { email },
        });
      }

      // Comparación directa (sin encriptación)
      if (usuario.password !== password) {
        return res.render("auth/login", {
          titulo: "Login - TodoStock S.A.",
          error: "Email o contraseña incorrectos",
          datos: { email },
        });
      }

      // Guardar usuario actual en variable global
      usuarioActual = {
        id: usuario._id,
        username: usuario.username,
        nombre: usuario.nombre,
        email: usuario.email,
      };

      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.render("auth/login", {
        titulo: "Login - TodoStock S.A.",
        error: "Error al iniciar sesión",
        datos: req.body,
      });
    }
  },

  // Mostrar formulario de registro
  registerForm: (req, res) => {
    res.render("auth/register", {
      titulo: "Registro - TodoStock S.A.",
      error: null,
      datos: null,
    });
  },

  register: async (req, res) => {
    try {
      const { username, password, confirmPassword, nombre, email } = req.body;

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        return res.render("auth/register", {
          titulo: "Registro - TodoStock S.A.",
          error: "Las contraseñas no coinciden",
          datos: { username, nombre, email },
        });
      }

      // Verificar si el email ya está registrado
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.render("auth/register", {
          titulo: "Registro - TodoStock S.A.",
          error: "El email ya está registrado",
          datos: { username, nombre, email },
        });
      }

      // Verificar si el username ya existe (CORREGIDO)
      const existeUsername = await Usuario.findOne({ username });
      if (existeUsername) {
        return res.render("auth/register", {
          titulo: "Registro - TodoStock S.A.",
          error: "El nombre de usuario ya está en uso",
          datos: { username, nombre, email },
        });
      }

      // Crear usuario
      await Usuario.create({
        username,
        password,
        nombre,
        email,
      });

      // Redirigir al login después de registrarse
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      res.render("auth/register", {
        titulo: "Registro - TodoStock S.A.",
        error: "Error al registrar usuario",
        datos: req.body,
      });
    }
  },

  // Cerrar sesión
  logout: (req, res) => {
    usuarioActual = null;
    res.redirect("/login");
  },
};

// Función para obtener el usuario actual
const getUsuarioActual = () => {
  return usuarioActual;
};

module.exports = {
  authController,
  isAuthenticated,
  isGuest,
  getUsuarioActual,
};
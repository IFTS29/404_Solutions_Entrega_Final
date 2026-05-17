const Usuario = require("../models/Usuario");

// ============ MIDDLEWES DE AUTENTICACIÓN ============
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.usuario) {
    return next();
  }
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (
    req.session &&
    req.session.usuario &&
    req.session.usuario.rol === "admin"
  ) {
    return next();
  }
  res
    .status(403)
    .send("Acceso denegado. Se requieren permisos de administrador.");
};

const isGuest = (req, res, next) => {
  if (req.session && req.session.usuario) {
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
      const { username, password } = req.body;

      const usuario = await Usuario.findOne({ username });
      if (!usuario) {
        return res.render("auth/login", {
          titulo: "Login - TodoStock S.A.",
          error: "Usuario o contraseña incorrectos",
          datos: { username },
        });
      }

      const isValid = await usuario.comparePassword(password);
      if (!isValid) {
        return res.render("auth/login", {
          titulo: "Login - TodoStock S.A.",
          error: "Usuario o contraseña incorrectos",
          datos: { username },
        });
      }

      // Guardar sesión
      req.session.usuario = {
        id: usuario._id,
        username: usuario.username,
        nombre: usuario.nombre,
        rol: usuario.rol,
      };

      // Debug: Verificar que se guardó
      console.log("Usuario guardado en sesión:", req.session.usuario);

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

  // Procesar registro
  register: async (req, res) => {
    try {
      const { username, password, confirmPassword, nombre, email } = req.body;

      if (password !== confirmPassword) {
        return res.render("auth/register", {
          titulo: "Registro - TodoStock S.A.",
          error: "Las contraseñas no coinciden",
          datos: { username, nombre, email },
        });
      }

      const existeUsuario = await Usuario.findOne({ username });
      if (existeUsuario) {
        return res.render("auth/register", {
          titulo: "Registro - TodoStock S.A.",
          error: "El nombre de usuario ya está en uso",
          datos: { username, nombre, email },
        });
      }

      await Usuario.create({
        username,
        password,
        nombre,
        email,
      });

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
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect("/login");
    });
  },
};

// Exportamos
module.exports = {
  authController,
  isAuthenticated,
  isAdmin,
  isGuest,
};

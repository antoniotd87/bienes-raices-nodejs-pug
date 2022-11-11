import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js";
import { generarId } from "../helpers/tokens.js";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesion",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  // Validacion
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre no puede estar vacio")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("Creo que ese no es un correo")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);
  await check("repite_password")
    .equals(req.body.password)
    .withMessage("Los passwords no son iguales")
    .run(req);

  let resultado = validationResult(req);
  // Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
      csrfToken: req.csrfToken(),
    });
  }
  const { nombre, email, password } = req.body;

  // Verificar que el usuario no este duplicado
  // const existeUsuario = await Usuario.findOne({
  //   where: { email },
  // });
  // if (existeUsuario) {
  //   return res.render("auth/registro", {
  //     pagina: "Crear Cuenta",
  //     errores: [{ msg: "El usuario esta registrado" }],
  //     usuario: {
  //       nombre: req.body.nombre,
  //       email: req.body.email,
  //     },
  //     csrfToken: req.csrfToken(),
  //   });
  // }

  //Almacenar un usuario
  // const usuario = await Usuario.create({
  //   nombre,
  //   email,
  //   password,
  //   token: generarId(),
  // });

  // envia Email de Confirmacion
  emailRegistro({
    nombre: nombre,
    email: email,
    token: generarId(),
  });

  res.render("templates/mensaje", {
    pagina: "Cuenta Creada Correctamente",
    mensaje: "Hemos enviado un correo de confirmacion, presiona en el enlace",
  });
};

// Funcion que comprueba una cuenta
const confirmar = async (req, res, next) => {
  const { token } = req.params;
  // Verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }

  // Confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();
  return res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "La cuenta se confirmo correctamente",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu acceso a Bienes Raices",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  // Validacion
  await check("email")
    .isEmail()
    .withMessage("Creo que ese no es un correo")
    .run(req);

  let resultado = validationResult(req);
  // Verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    return res.render("auth/olvide-password", {
      pagina: "Crear Cuenta",
      errores: resultado.array(),
      usuario: {
        email: req.body.email,
      },
      csrfToken: req.csrfToken(),
    });
  }
  // Buscar Usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "El Email no pertenece a ningun usuario" }],
      usuario: {
        email: req.body.email,
      },
      csrfToken: req.csrfToken(),
    });
  }
  // Generar un token y enviar por email
  usuario.token = generarId();
  await usuario.save();

  // Enviar el email
  emailOlvidePassword({ email, nombre: usuario.nombre, token: usuario.token });

  res.render("templates/mensaje", {
    pagina: "Reestablece tu Password",
    mensaje: "Hemos enviado un correo con las instrucciones",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    res.render("auth/confirmar-cuenta", {
      pagina: "Reestablece tu Password",
      mensaje: "Hubo un error al validar tu informacion, intenta de nuevo",
      error: true,
    });
  }
  // Mosatrar Foremulario para Modificar el password
  res.render("auth/reset-password", {
    pagina: "Reestablece tu Password",
    csrfToken: req.csrfToken(),
  });
};
const nuevoPassword = async (req, res) => {
  // Validacion
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);
  await check("repite_password")
    .equals(req.body.password)
    .withMessage("Los passwords no son iguales")
    .run(req);

  let resultado = validationResult(req);
  if (!resultado.isEmpty()) {
    res.render("auth/reset-password", {
      pagina: "Reestablece tu Password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }
  const { token } = req.params;
  const { password } = req.body;
  // Identificar quien hace el cambio
  const usuario = await Usuario.findOne({ where: { token } });

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;
  await usuario.save();
  res.render("auth/confirmar-cuenta", {
    pagina: "Password Reestablecido",
    mensaje: "El password se actualizo correctamente",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  confirmar,
  registrar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};

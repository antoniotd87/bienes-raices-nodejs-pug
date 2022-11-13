import express from "express";
import {
  formularioLogin,
  formularioOlvidePassword,
  formularioRegistro,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticar
} from "../controller/usuarioController.js";

const router = express.Router();
router.get("/login", formularioLogin);
router.post("/login", autenticar);
router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/confirmar/:token", confirmar);
router.get("/olvide-password", formularioOlvidePassword);
router.post("/olvide-password", resetPassword);
router.get("/olvide-password/:token", comprobarToken);
router.post("/olvide-password/:token", nuevoPassword);

export default router;

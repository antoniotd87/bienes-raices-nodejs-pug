// const express = require("express");
import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios, esto es similar a bodyparser
app.use(express.urlencoded({ extended: true }));

// Habilitar Cockie Parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Conexion a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log("Conexion Correcta a la Base de datos");
} catch (error) {
  console.log(error);
}

// Habilitar Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta Publica
app.use(express.static("public"));

// Routing
app.use("/auth", usuarioRoutes);
// Definir un puerto y arrancarlo
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`El servidor esta corroendo en el puerto ${port}`);
});

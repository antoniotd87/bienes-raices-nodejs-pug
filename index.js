// const express = require("express");
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";

// Crear la app
const app = express();

// Habilitar Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta Publica
app.use(express.static('public'))

// Routing
app.use("/auth", usuarioRoutes);
// Definir un puerto y arrancarlo
const port = 3000;

app.listen(port, () => {
  console.log(`El servidor esta corroendo en el puerto ${port}`);
});

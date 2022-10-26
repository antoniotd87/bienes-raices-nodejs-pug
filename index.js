// const express = require("express");
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
const app = express();

// Routing
app.use("/", usuarioRoutes);
// Definir un puerto y arrancarlo
const port = 3000;

app.listen(port, () => {
  console.log(`El servidor esta corroendo en el puerto ${port}`);
});

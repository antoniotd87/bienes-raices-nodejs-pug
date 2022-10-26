// const express = require("express");
import express from "express";
const app = express();

// Routing
app.get("/", function (req, res) {
  res.send("Hola Mundo en express");
});
app.get("/nosotros", function (req, res) {
  res.json({ msg: "Hola Mundo en nosotros" });
});

// Definir un puerto y arrancarlo
const port = 3000;

app.listen(port, () => {
  console.log(`El servidor esta corroendo en el puerto ${port}`);
});

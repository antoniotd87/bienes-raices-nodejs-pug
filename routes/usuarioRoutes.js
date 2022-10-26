import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hola Mundo en express");
});
router.post("/", (req, res) => {
  res.send("Hola Mundo en express");
});
router.get("/nosotros", (req, res) => {
  res.json({ msg: "Hola Mundo en nosotros" });
});

/* router
  .route("/")
  .get("/", function (req, res) {
    res.send("Hola Mundo en express");
  })
  .post("/", function (req, res) {
    res.send("Hola Mundo en express");
  }); */

export default router;

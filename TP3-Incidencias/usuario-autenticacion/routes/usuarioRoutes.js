const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { validateRegistro, validateLogin } = require("../validators/usuarioValidator");

router.post("/registro", validateRegistro, usuarioController.registro);
router.post("/login", validateLogin, usuarioController.login);

module.exports = router;

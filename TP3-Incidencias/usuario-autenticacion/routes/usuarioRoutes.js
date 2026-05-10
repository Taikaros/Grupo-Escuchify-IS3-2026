const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { validateRegistro, validateLogin, validateEdicion } = require("../validators/usuarioValidator");
const verificarToken = require("../middlewares/verificarToken");

router.post("/registro", validateRegistro, usuarioController.registro);
router.post("/login", validateLogin, usuarioController.login);
router.get("/:id_usuario", verificarToken, usuarioController.obtenerPerfil);
router.put("/:id_usuario", verificarToken, validateEdicion, usuarioController.editarPerfil);

module.exports = router;

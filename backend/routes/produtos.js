const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const verificarLogin = require("../middleware/auth");

router.get("/", produtoController.listar);

router.post("/", verificarLogin, produtoController.criar);

router.put("/:id", verificarLogin, produtoController.editar);

router.delete("/:id", verificarLogin, produtoController.deletar);

module.exports = router;
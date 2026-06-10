const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");
const verificarLogin = require("../middleware/auth");

router.get("/", produtoController.listar);

router.post("/", produtoController.criar);

router.put("/:id", produtoController.editar);

router.delete("/:id", produtoController.deletar);

module.exports = router;
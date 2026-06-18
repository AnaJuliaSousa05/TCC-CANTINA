const express = require("express");
const router = express.Router();

const {
    criarPedido,
    listarPedidos,
    pagarPedido
} = require("../controllers/pedidosController");

router.post("/criar", criarPedido);
router.get("/", listarPedidos);
router.put("/:id/pagar", pagarPedido);

module.exports = router;
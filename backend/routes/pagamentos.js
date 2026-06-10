const express = require("express");
const router = express.Router();

const {
    criarPagamento
} = require("../controllers/pagamentoController");

router.post("/criar", criarPagamento);

module.exports = router;
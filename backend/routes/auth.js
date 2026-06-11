const express = require("express");
const router = express.Router();

console.log("ARQUIVO AUTH CERTO CARREGADO");

router.get("/me", (req, res) => {
    console.log("ROTA /ME FOI CHAMADA");
    res.json({
        teste: "funcionando"
    });
});

module.exports = router;
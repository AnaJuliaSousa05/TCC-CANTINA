const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authController");
const verificarLogin = require("../middleware/auth");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", (req, res, next) => {
    console.log("ROTA LOGIN FOI CHAMADA");
    next();
}, login);

// DASHBOARD
router.get('/dashboard', verificarLogin, (req, res) => {
    res.send("Você está logado");
});

// LOGOUT
router.get('/logout', logout);

module.exports = router;
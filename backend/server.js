const express = require("express");
const cors = require("cors");

const app = express();

const sessionConf = require('./config/session') 

app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

//ativandp a session
app.use(sessionConf);

console.log("IMPORTANDO ROTAS...");
const authRoutes = require("./routes/auth");

app.use("/", authRoutes);
console.log("ROTAS CARREGADAS ");

app.listen(5000, () => {
    console.log("Servidor ok");
});




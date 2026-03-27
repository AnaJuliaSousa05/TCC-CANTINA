const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

console.log("IMPORTANDO ROTAS...");
const authRoutes = require("./routes/auth");

app.use("/", authRoutes);
console.log("ROTAS CARREGADAS ");


app.use("/",authRoutes);

app.listen(5000,() => {
    console.log("Servidor ok")

});




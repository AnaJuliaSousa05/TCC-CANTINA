const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/",(req, res) => {
 res.send("API está funcionando");
});

app.use(express.json());

app.listen(5000, () =>{
    console.log("Servidor funcionando")
})

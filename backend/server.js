const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth")

app.use("/",authRoutes);

app.listen(5000,() => {
    console.log("Servidor ok")

});

app.get("/teste", (req,res)=>{
    res.send("Backend top")
})


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const db = require("./db/db");

const app = express();

// CONFIGURAÇÕES
app.use(express.json());
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

// ROTAS EXISTENTES
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// ROTA TESTE
app.get("/", (req, res) => {
    res.send("API funcionando");
});


// cofig email


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }

  
});


//esqueceu a senaha
app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    const token = crypto.randomBytes(32).toString("hex");
    const expira = new Date(Date.now() + 3600000); // 1h

    db.query(
    "UPDATE usuarios SET reset_token = ?, reset_token_expira = ? WHERE email = ?",
    [token, expira, email],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erro no banco");
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Email não encontrado");
            }
               const link = `http://127.0.0.1:5500/recuperacao-senha/reset-password.html?token=${token}`;
            const mailOptions = {
                from: "annaclaracq@gmail.com",
                to: email,
                subject: "Recuperação de senha",
                text: `Clique aqui para redefinir sua senha: ${link}`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Erro ao enviar email");
                }

                console.log("Token gerado:", token);
                res.send("Email enviado com sucesso!");
            });
        }
    );
});


//reset senha
app.post("/reset-password", async (req, res) => {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
        return res.status(400).send("Dados inválidos");
    }

    db.query(
        "SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expira > NOW()",
        [token],
        async (err, results) => {
            if (err) return res.status(500).send("Erro no banco");

            if (results.length === 0) {
                return res.status(400).send("Token inválido ou expirado");
            }

            const usuario = results[0];

            const hash = await bcrypt.hash(novaSenha, 10);

            db.query(
                "UPDATE usuarios SET password = ?, reset_token = NULL, reset_token_expira = NULL WHERE id = ?",
                [hash, usuario.id],
                (err) => {
                    if (err) {
                        console.log("ERRO AO ATUALIZAR:", err);
                        return res.status(500).send("Erro ao atualizar senha");
                    }

                    res.send("Senha alterada com sucesso!");
                }
            );
        }
    );
});

//server
app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});
const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

// ======================
// REGISTER
// ======================
exports.register = (req, res) => {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
        return res.status(400).send({ msg: "Preencha todos os campos" });
    }

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).send({ msg: "Erro no banco", err });
            }

            if (result.length > 0) {
                return res.send({ msg: "Email já cadastrado" });
            }

            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).send({ msg: "Erro ao criptografar senha" });
                }

                db.query(
                    "INSERT INTO usuarios (email, password, nickname) VALUES (?, ?, ?)",
                    [email, hash, nickname],
                    (error) => {
                        if (error) {
                            return res.status(500).send({ msg: "Erro ao cadastrar usuário" });
                        }

                        return res.send({ msg: "Usuário cadastrado com sucesso" });
                    }
                );
            });
        }
    );
};

// ======================
// LOGIN
// ======================
exports.login = (req, res) => {

    console.log("LOGIN CHAMADO");
    console.log(req.body);
    
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.send({ msg: "Usuário não encontrado" });
            }

            const user = result[0];

            bcrypt.compare(password, user.password, (error, match) => {
                if (error) return res.status(500).send(error);

                if (!match) {
                    return res.send({ msg: "Senha incorreta" });
                }

                // 🔥 AQUI entra o JWT (no lugar da session)
                const token = jwt.sign(
                    {
                        id: user.id,
                        role: user.role
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                return res.send({
                    msg: "Usuario logado com sucesso",
                    token: token,
                    role: user.role
                });
            });
        }
    );
};

//logout

exports.logout = (req, res) => {
    // JWT não tem sessão no servidor
    return res.send({ msg: "Logout feito (remova o token do front)" });
};
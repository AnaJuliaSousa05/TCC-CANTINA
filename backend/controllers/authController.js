const db = require("../db/db");
const bcrypt = require("bcrypt");

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
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.send({ msg: "Usuário não encontrado" });
            }

            bcrypt.compare(password, result[0].password, (error, match) => {
                if (error) return res.status(500).send(error);

                if (!match) {
                    return res.send({ msg: "Senha incorreta" });
                }

                req.session.usuario = result[0].id;

                return res.send({ msg: "Usuario logado com sucesso" });
            });
        }
    );
};

// ======================
// LOGOUT
// ======================
exports.logout = (req, res) => {
    req.session.destroy();
    res.send({ msg: "Logout feito" });
};
const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
console.log("AUTHCONTROLLER CARREGADO");

const saltRounds = 10;

//registro 
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

//login
exports.login = (req, res) => {


    console.log("=================================");
    console.log("SERVIDOR TESTE 123");
    console.log("=================================");

    console.log("LOGIN CHAMADO");
    console.log(req.body);
    
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(401).send({
                 msg: "Usuário não encontrado"
                    });
            }

            const user = result[0];

            bcrypt.compare(password, user.password, (error, match) => {
                    if (error) return res.status(500).send(error);
                if (!match) {
            console.log("ENTROU NO BLOCO SENHA INCORRETA");

              return res.status(401).json({
                msg: "Senha incorreta"
               });
             }
                //  AQUI entra o JWT (no lugar da session)
                const token = jwt.sign(
                    {
                        id: user.id,
                        role: user.role
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                console.log("USER COMPLETO:", user);
                console.log("NICKNAME BANCO:", user.nickname);
                return res.send({
                    msg: "Usuario logado com sucesso",
                    token: token,
                    role: user.role,
                    nickname: user.nickname
             })
                
            });
        }
    );
};

//logout

exports.logout = (req, res) => {
    // JWT não tem sessão no servidor
    return res.send({ msg: "Logout feito (remova o token do front)" });
};

exports.me = (req, res) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            msg: "Token não enviado"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        db.query(
            "SELECT id, nickname, email FROM usuarios WHERE id = ?",
            [decoded.id],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        msg: "Erro no banco"
                    });
                }

                if (result.length === 0) {
                    return res.status(404).json({
                        msg: "Usuário não encontrado"
                    });
                }

                return res.json(result[0]);
            }
        );

    } catch (err) {

        return res.status(401).json({
            msg: "Token inválido"
        });

    }
};

//update no perfil
exports.updateProfile = async (req, res) => {
   console.log("ENTROU NO UPDATE");
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            msg: "Token não enviado"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const { nickname, email, password } = req.body;

        if (!nickname || !email) {
            return res.status(400).json({
                msg: "Nickname e email são obrigatórios"
            });
        }

        if (password && password.trim() !== "") {

            const senhaHash = await bcrypt.hash(
                password,
                saltRounds
            );

            db.query(
                `UPDATE usuarios
                 SET nickname = ?, email = ?, password = ?
                 WHERE id = ?`,
                [
                    nickname,
                    email,
                    senhaHash,
                    decoded.id
                ],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            msg: "Erro ao atualizar"
                        });
                    }

                    return res.json({
                        msg: "Perfil atualizado"
                    });
                }
            );

        } else {

            db.query(
                `UPDATE usuarios
                 SET nickname = ?, email = ?
                 WHERE id = ?`,
                [
                    nickname,
                    email,
                    decoded.id
                ],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            msg: "Erro ao atualizar"
                        });
                    }

                    return res.json({
                        msg: "Perfil atualizado"
                    });
                }
            );
        }

    } catch (err) {

        console.log(err);

        return res.status(401).json({
            msg: "Token inválido"
        });

    }
};
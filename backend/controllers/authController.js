const db = require("../db/db");
const bcrypt = require("bcrypt");

const saltRounds = 10;

exports.register = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const nome = req.body.nickname

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.lenght == 0) {
            // Se for um novo usuario o hash bcrypt criptografam 
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).send(err);
                }
                //inserir o usuario no banco
                db.query(
                    "INSERT INTO usuarios (email, password, nickname) VALUES (?,?)",
                    [email, hash, nome],
                    (error, response) => {
                        if (error) {
                            return res.status(500).send(error)
                        }
                        res.send({ msg: "Usuario cadastrado com sucesso" });
                    }


                )
            });

        } else {
            return res.send({ msg: "Email já cadastrado" });

        }
    });
};

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password
    const nome = req.body.nickname

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
        if (err) {
           return res.status(500).send(err);
        }
    
    if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (response) {
                res.send({ msg: "Usuario logado com sucesso" });
            } else {
                res.send({ msg: "Senha incorreta" });
            }
        });

    } else {
        res.send({ msg: "Usuario não encontrado" });

    }
});

}





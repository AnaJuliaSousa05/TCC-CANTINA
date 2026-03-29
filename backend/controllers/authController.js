//autenticação 

const db = require("../db/db");
const bcrypt = require("bcrypt");

const saltRounds = 10;


//REGISTRO
exports.register = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const nickname = req.body.nickname;
    console.log("cheguei aqui");

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
        console.log("email recebido:", email);
        console.log("resultado do SELECT", result);
       
       
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length == 0) {
            // Se for um novo usuario o hash bcrypt criptografam 
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).send(err);
                }
                //inserir o usuario no banco
                db.query(
                    "INSERT INTO usuarios (email, password, nickname) VALUES (?,?, ?)",
                    [email, hash, nickname],
                    (error, response) => {
                        if (error) {
                            return res.status(500).send(error)
                        }
                        res.send({ msg: "Usuario cadastrado com sucesso" });
                    }


                )
            });

        } else {
            return res.send({ msg: "Email já possui um cadastrado" });

        }
    });
};


//LOGIN
exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password
    const nickname = req.body.nickname

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
        console.log("Email digitado:", email);
        console.log("Resultado do SELECT:", result);

        if (err) {
           return res.status(500).send(err);
        }
    
    if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
        console.log("Senha digitada:", password);
        console.log("Senha do banco:", result[0].password);
        console.log("Senha correta?", response);


            if (error) {
                return res.status(500).send(error);
            }
            if (response) {

                req.session.usuario =result[0].id;
                  
                console.log(req.session)
                
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

exports.logout = (req, res) => {
    req.session.destroy()
    res.send({ msg: "Logout feito" })
}





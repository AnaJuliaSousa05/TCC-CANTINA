function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).send ({msg: "Não autorizado"})


    } next()

}

module.exports = verificarLogin;
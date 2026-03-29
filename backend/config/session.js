//SESSÃO E COOKIES

const session = require("express-session");

module.exports = session({
    secret: 'sessão-protegida',
    resave:false, //não salva se não houver nenuma alteração dentro da sessão
    saveUninitialized:false, // não salva sessão sem dado
    cookie: {
        secure: false //configuração cookie
    }
})
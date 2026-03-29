//BANCO DE DADOS

const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Amora@2023",
    database: "tcc",
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("Erro ao conectar:", err);
    } else {
        console.log("Conectado ao banco: tcc");
        connection.release();
    }
});

module.exports = db;
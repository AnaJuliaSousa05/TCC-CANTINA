const mysql = require("mysql")

const db = mysql.createPool({
    host: "localhost",
    user:"root",
    password: "Amora@2023",
    database: "TCC",
});

module.exports = db;

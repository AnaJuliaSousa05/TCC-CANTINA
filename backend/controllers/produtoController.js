const db = require("../db/db");

// LISTAR
exports.listar = (req, res) => {
    db.query("SELECT * FROM produtos", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
};

// CRIAR
exports.criar = (req, res) => {
    const { nome, descricao, preco, imagem } = req.body;

    db.query(
        "INSERT INTO produtos (nome, descricao, preco, imagem) VALUES (?, ?, ?, ?)",
        [nome, descricao, preco, imagem],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send({ msg: "Produto criado" });
        }
    );
};

// EDITAR
exports.editar = (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, imagem } = req.body;

    db.query(
        "UPDATE produtos SET nome=?, descricao=?, preco=?, imagem=? WHERE id=?",
        [nome, descricao, preco, imagem, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send({ msg: "Produto atualizado" });
        }
    );
};

// DELETAR
exports.deletar = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM produtos WHERE id=?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ msg: "Produto deletado" });
    });
};
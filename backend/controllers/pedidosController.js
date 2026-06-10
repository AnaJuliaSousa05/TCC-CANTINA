const db = require("../db/db");

const criarPedido = (req, res) => {

    const { usuario_id, valor_total } = req.body;

    db.query(
        "INSERT INTO pedidos (usuario_id, valor_total) VALUES (?, ?)",
        [usuario_id, valor_total],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao criar pedido"
                });
            }

            res.json({
                pedido_id: result.insertId,
                mensagem: "Pedido criado com sucesso"
            });
        }
    );
};

const listarPedidos = (req, res) => {

    db.query(
        "SELECT * FROM pedidos ORDER BY data_pedido DESC",
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    erro: "Erro ao listar pedidos"
                });
            }

            res.json(results);
        }
    );
};

const pagarPedido = (req, res) => {

    const { id } = req.params;

    db.query(
        "UPDATE pedidos SET status = 'PAGO' WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    erro: "Erro ao atualizar pedido"
                });
            }

            res.json({
                mensagem: "Pedido atualizado para PAGO"
            });
        }
    );
};

module.exports = {
    criarPedido,
    listarPedidos,
    pagarPedido
};
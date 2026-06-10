const db = require("../db/db");
const client = require("../services/mercadoPago");
const { Preference } = require("mercadopago");

const criarPagamento = async (req, res) => {
    try {

        const { pedido_id } = req.body;

        db.query(
            "SELECT * FROM pedidos WHERE id = ?",
            [pedido_id],
            async (err, results) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        erro: "Erro ao buscar pedido"
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        erro: "Pedido não encontrado"
                    });
                }

                const pedido = results[0];

                const preference = new Preference(client);

                const response = await preference.create({
                    body: {
                        items: [
                            {
                                title: `Pedido #${pedido.id}`,
                                quantity: 1,
                                unit_price: Number(pedido.valor_total)
                            }
                        ]
                    }
                });

                res.json({
                    pedido_id: pedido.id,
                    valor: pedido.valor_total,
                    init_point: response.init_point
                });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({
            erro: "Erro ao criar pagamento"
        });
    }
};

module.exports = {
    criarPagamento
};
const API_URL = "http://localhost:5000/produtos";

async function carregarProdutos() {
    try {

        const resposta = await fetch(API_URL);
        const produtos = await resposta.json();

        const lista = document.getElementById("lista-produtos");

        lista.innerHTML = "";

        produtos.forEach(produto => {

            lista.innerHTML += `
                <div class="item-admin">

                    <img src="../foto/${produto.imagem}" alt="${produto.nome}">

                    <div class="info">

                        <h3>${produto.nome}</h3>

                        <span class="preco-admin">
                            R$ ${produto.preco}
                        </span>

                        <h4>${produto.descricao}</h4>

                        <div class="acoes-admin">

                            <button
                                class="btn-editar"
                                onclick="editarProduto(${produto.id})">
                                Editar
                            </button>

                            <button
                                class="btn-excluir"
                                onclick="excluirProduto(${produto.id})">
                                Excluir
                            </button>

                        </div>

                    </div>

                </div>
            `;
        });

    } catch (erro) {
        console.error(erro);
    }
}

const btnNovo = document.querySelector(".btn-novo-item");

btnNovo.addEventListener("click", async () => {

    const nome = prompt("Nome do produto:");
    const descricao = prompt("Descrição:");
    const preco = prompt("Preço:");
    const imagem = prompt("Imagem:");

    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            descricao,
            preco,
            imagem
        })
    });

    const dados = await resposta.json();

    alert(dados.msg);

    carregarProdutos();
});

carregarProdutos();

async function excluirProduto(id) {

    const confirmar = confirm("Deseja realmente excluir este produto?");

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const dados = await resposta.json();

        alert(dados.msg);

        carregarProdutos();

    } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
    }
}

async function editarProduto(id) {

    const nome = prompt("Novo nome:");
    const descricao = prompt("Nova descrição:");
    const preco = prompt("Novo preço:");
    const imagem = "sem-imagem.png";

    if (!nome || !descricao || !preco) {
        return;
    }

    try {

        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                descricao,
                preco,
                imagem
            })
        });

        const dados = await resposta.json();

        alert(dados.msg);

        carregarProdutos();

    } catch (erro) {
        console.error("Erro ao editar produto:", erro);
    }
}
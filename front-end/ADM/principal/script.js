document.addEventListener("DOMContentLoaded", () => {
    const nomeAdmin = document.getElementById("nome-admin");
    const cargoAdmin = document.getElementById("cargo-admin");

    const nickname = localStorage.getItem("nickname");
    const role = localStorage.getItem("role");

    if (nomeAdmin) {
        nomeAdmin.textContent = nickname || "ADMINISTRADOR";
    }

    if (cargoAdmin) {
        cargoAdmin.textContent = role === "admin" ? "ADMINISTRADOR" : role;
    }
});

const API_URL = "http://localhost:5000/produtos";

// ==========================================
// CARREGAR PRODUTOS (CORRIGIDO SEM LOOP 404)
// ==========================================
async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        const produtos = await resposta.json();

        const lista = document.getElementById("lista-produtos");
        if (!lista) return;

        lista.innerHTML = "";

        produtos.forEach(produto => {
            // Se a imagem for inválida ou "sem-imagem.png", usamos "icon3.png" que já existe na sua pasta
            let nomeImagem = produto.imagem;
            if (!nomeImagem || nomeImagem === "sem-imagem.png" || nomeImagem.trim() === "") {
                nomeImagem = "icon3.png"; 
            }

            lista.innerHTML += `
                <div class="item-admin">
                    <img src="../foto/${nomeImagem}" alt="${produto.nome}">
                    <div class="info">
                        <h3>${produto.nome}</h3>
                        <span class="preco-admin">
                            R$ ${Number(produto.preco).toFixed(2)}
                        </span>
                        <h4>${produto.descricao}</h4>
                        <div class="acoes-admin">
                            <button class="btn-editar" onclick="editarProduto(${produto.id})">
                                Editar
                            </button>
                            <button class="btn-excluir" onclick="excluirProduto(${produto.id})">
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

// ==========================================
// CADASTRAR NOVO PRODUTO
// ==========================================
const btnNovo = document.querySelector(".btn-novo-item");

if (btnNovo) {
    btnNovo.addEventListener("click", async () => {
        const nome = prompt("Nome do produto:");
        if (nome === null) return; 

        const descricao = prompt("Descrição:");
        if (descricao === null) return;

        const preco = prompt("Preço:");
        if (preco === null) return;

        // Sugere o preenchimento com "icon3.png" caso o usuário não tenha uma foto específica
        const imagem = prompt("Nome do arquivo de imagem (ex: coxinha.png):", "icon3.png");
        if (imagem === null) return;

        if (!nome.trim() || !descricao.trim() || !preco.trim() || !imagem.trim()) {
            alert("Todos os campos são obrigatórios para cadastrar um produto!");
            return;
        }

        try {
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
            alert(dados.msg || "Produto cadastrado com sucesso!");
            carregarProdutos();
            
        } catch (erro) {
            console.error("Erro ao cadastrar produto:", erro);
        }
    });
}

// Executa o carregamento inicial ao abrir a página
carregarProdutos();

// ==========================================
// EXCLUIR PRODUTO
// ==========================================
async function excluirProduto(id) {
    const confirmar = confirm("Deseja realmente excluir este produto?");
    if (!confirmar) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const dados = await resposta.json();
        alert(dados.msg || "Produto excluído!");
        carregarProdutos();

    } catch (erro) {
        console.error("Erro ao excluir produto:", erro);
    }
}

// ==========================================
// EDITAR PRODUTO (CORRIGIDO)
// ==========================================
async function editarProduto(id) {
    const nome = prompt("Novo nome:");
    if (nome === null) return; 

    const descricao = prompt("Nova descrição:");
    if (descricao === null) return;

    const preco = prompt("Novo preço:");
    if (preco === null) return;

    // Agora permite definir a imagem ou aceita a imagem padrão, sem quebrar o layout
    const imagem = prompt("Nome do arquivo de imagem:", "icon3.png");
    if (imagem === null) return;

    if (!nome.trim() || !descricao.trim() || !preco.trim() || !imagem.trim()) {
        alert("Todos os campos precisam ser preenchidos para editar!");
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
        alert(dados.msg || "Produto atualizado com sucesso!");
        carregarProdutos();

    } catch (erro) {
        console.error("Erro ao editar produto:", erro);
    }
}

// ==========================================
// COMPRESSÃO E UPLOAD DA FOTO DE PERFIL
// ==========================================
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");

const usuarioLogado = localStorage.getItem("nickname") || "comum";
const chaveFotoUsuario = `fotoPerfil_${usuarioLogado}`;

if (photoInput) {
    photoInput.addEventListener("change", function(){
        const file = photoInput.files[0];

        if(file){
            const reader = new FileReader();

            reader.onload = function(e){
                const img = new Image();
                img.src = e.target.result;

                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = 150;
                    canvas.height = 150;
                    
                    ctx.drawImage(img, 0, 0, 150, 150);
                    
                    const fotoCompactada = canvas.toDataURL('image/jpeg', 0.7);

                    if (photoPreview) {
                        photoPreview.src = fotoCompactada;
                    }
                    
                    localStorage.setItem(chaveFotoUsuario, fotoCompactada);
                };
            }

            reader.readAsDataURL(file);
        }
    });
}

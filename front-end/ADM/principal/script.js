const API_URL = "http://localhost:5000/produtos";


const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
    alert("Acesso restrito!");
    window.location.replace("/login.html");
}


//carregar produtos 
async function carregarProdutos() {
    try {
        const resposta = await fetch(API_URL);
        const produtos = await resposta.json();

        const lista = document.getElementById("lista-produtos");
        if (!lista) return;

        lista.innerHTML = "";

        produtos.forEach(produto => {
            let dadosImagem = produto.imagem;
            if (!dadosImagem || dadosImagem === "sem-imagem.png" || dadosImagem.trim() === "") {
                dadosImagem = "../foto/icon3.png"; 
            }

            const urlFinalImagem = dadosImagem.startsWith("data:") ? dadosImagem : `../foto/${dadosImagem}`;

            lista.innerHTML += `
                <div class="item-admin">
                    <img src="${urlFinalImagem}" alt="${produto.nome}">
                    <div class="info">
                        <h3>${produto.nome}</h3>
                        <span class="preco-admin">
                            R$ ${Number(produto.preco).toFixed(2)}
                        </span>
                        <h4>${produto.descricao || "Sem descrição"}</h4>
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

//comprimir img
function processarArquivoImagem(file) {
    return new Promise((resolve) => {
        if (!file) {
            resolve("icon3.png");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = 300;
                canvas.height = 300;

                ctx.drawImage(img, 0, 0, 300, 300);

                const base64Comprimido = canvas.toDataURL("image/jpeg", 0.6); // Reduzi um pouco a qualidade para diminuir o tamanho textual no banco
                resolve(base64Comprimido);
            };
        };
        reader.readAsDataURL(file);
    });
}

// inicialização adm 
document.addEventListener("DOMContentLoaded", () => {
    const nomeAdmin = document.getElementById("nome-admin");
    const cargoAdmin = document.getElementById("cargo-admin");

    const nickname = localStorage.getItem("nickname");
    const role = localStorage.getItem("role");

    if (nomeAdmin) nomeAdmin.textContent = nickname || "ADMINISTRADOR";
    if (cargoAdmin) cargoAdmin.textContent = role === "admin" ? "ADMINISTRADOR" : role;

    // Executa o carregamento inicial dos cards
    carregarProdutos();
});

//cadastrar um novo produto
const btnNovo = document.querySelector(".btn-novo-item");
const inputImagemProduto = document.getElementById("input-imagem-produto");

if (btnNovo && inputImagemProduto) {
    btnNovo.addEventListener("click", () => {
        inputImagemProduto.click();
    });

    inputImagemProduto.addEventListener("change", async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        const nome = prompt("Nome do produto:");
        if (nome === null) { inputImagemProduto.value = ""; return; }

        const descricao = prompt("Descrição:");
        if (descricao === null) { inputImagemProduto.value = ""; return; }

        const preco = prompt("Preço:");
        if (preco === null) { inputImagemProduto.value = ""; return; }

        if (!nome.trim() || !descricao.trim() || !preco.trim()) {
            alert("Todos os campos são obrigatórios!");
            inputImagemProduto.value = "";
            return;
        }

        try {
            const imagemBase64 = await processarArquivoImagem(arquivo);

            const resposta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    descricao,
                    preco: parseFloat(preco),
                    imagem: imagemBase64
                })
            });

            if (!resposta.ok) {
                throw new Error("Erro interno do servidor (Verifique se a coluna do banco aceita textos longos!)");
            }

            const dados = await resposta.json();
            alert(dados.msg || "Produto cadastrado com sucesso!");
            
            inputImagemProduto.value = "";
            carregarProdutos();
            
        } catch (erro) {
            console.error("Erro ao cadastrar produto:", erro);
            alert("Erro ao salvar o produto. Verifique o console do backend.");
            inputImagemProduto.value = "";
        }
    });
}

//editar um produto
async function editarProduto(id) {
    const nome = prompt("Novo nome:");
    if (nome === null) return; 

    const descricao = prompt("Nova descrição:");
    if (descricao === null) return;

    const preco = prompt("Novo preço:");
    if (preco === null) return;

    let imagem = "icon3.png";
    const mudarFoto = confirm("Deseja alterar a foto deste produto?");
    
    if (mudarFoto) {
        const inputTemp = document.createElement("input");
        inputTemp.type = "file";
        inputTemp.accept = "image/*";
        
        const fotoSelecionada = await new Promise((resolve) => {
            inputTemp.onchange = (e) => resolve(e.target.files[0]);
            inputTemp.click();
        });

        if (fotoSelecionada) {
            imagem = await processarArquivoImagem(fotoSelecionada);
        } else {
            return; 
        }
    } else {
        try {
            const resposta = await fetch(API_URL);
            const produtos = await resposta.json();
            const atual = produtos.find(p => p.id === id);
            if (atual) imagem = atual.imagem;
        } catch (e) {
            console.error(e);
        }
    }

    if (!nome.trim() || !descricao.trim() || !preco.trim()) {
        alert("Todos os campos precisam ser preenchidos para editar!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                descricao,
                preco: parseFloat(preco),
                imagem
            })
        });

        if (!response.ok) throw new Error("Erro de resposta do servidor.");

        const dados = await response.json(); 
        alert(dados.msg || "Produto atualizado com sucesso!");
        carregarProdutos();

    } catch (erro) {
        console.error("Erro ao editar produto:", erro);
        alert("Erro ao salvar as alterações.");
    }
}

//excluir um produto
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

//foto de perfil adm
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
                    if (photoPreview) photoPreview.src = fotoCompactada;
                    localStorage.setItem(chaveFotoUsuario, fotoCompactada);
                };
            }
            reader.readAsDataURL(file);
        }
    });
}

const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                // Avisa o servidor que o ADM deslogou
                await fetch('http://localhost:5000/auth/logout', {
                    method: 'GET'
                });
            } catch (err) {
                console.log("Servidor offline, limpando dados locais...", err);
            }

            alert("Sessão do Administrador encerrada!");

            // Limpa o Token e o Role ("admin") do LocalStorage
            localStorage.clear(); 

            // Redireciona o ADM expulso para a tela inicial/login
            window.location.replace("/front-end/INICIO/index.html"); 
        });
    }
// ==========================================
// 1. MANTÉM O TEMA CLARO ATIVO, TROCA OS ÍCONES E ATUALIZA O NOME
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const temaSalvo = localStorage.getItem("tema");
    const logoCantina = document.getElementById("logo-cantina");

    if (temaSalvo === "claro") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        
        if (logoCantina) {
            logoCantina.src = "../PRINCIPAL/foto/icon2.png"; 
        }
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        
        if (logoCantina) {
            logoCantina.src = "../PRINCIPAL/foto/icon3.png"; 
        }
    }

    // --- SINCRONIZAÇÃO DO NOME DE USUÁRIO NA HOME ---
    const nomeDoLocalStorage = localStorage.getItem("nickname");
    const roleDoLocalStorage = localStorage.getItem("role");

    const displayNomeHome = document.getElementById("nome-usuario-home");
    const displayCargo = document.getElementById("cargo-usuario");

    if (nomeDoLocalStorage && displayNomeHome) {
        displayNomeHome.textContent = nomeDoLocalStorage;
    }

    if (roleDoLocalStorage && displayCargo) {
        displayCargo.textContent =
            roleDoLocalStorage === "admin"
                ? "ADMINISTRADOR"
                : "ESTUDANTE";
    }
});

// ==========================================
// 2. CONTROLE DA FOTO DE PERFIL (UPLOAD, COMPRESSÃO E CARREGAMENTO)
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

window.addEventListener("load", function(){
    const fotoSalva = localStorage.getItem(chaveFotoUsuario);

    if(fotoSalva && photoPreview){
        photoPreview.src = fotoSalva;
    } else if (photoPreview) {
        photoPreview.src = "/LOGIN/foto/teste.png";
    }
});

// ==========================================
// 3. FUNÇÃO MULTI-USO: FAVORITAR E SALVAR NO LOCALSTORAGE
// ==========================================
function favoritar(botao){
    botao.classList.toggle("active");
    const icone = botao.querySelector("i");

    if(botao.classList.contains("active")){
        icone.classList.remove("fa-regular");
        icone.classList.add("fa-solid");
        icone.style.color = "red";
    } else {
        icone.classList.remove("fa-solid");
        icone.classList.add("fa-regular");
        
        const temaAtual = localStorage.getItem("tema");
        icone.style.color = (temaAtual === "claro") ? "#000000" : "white";
    }

    const item = botao.closest(".frito, .lanche, .doce, .bebidas");
    if (!item) return; 
    
    const itemId = item.id;
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if(favoritos.includes(itemId)){
        favoritos = favoritos.filter(id => id !== itemId);
    } else {
        favoritos.push(itemId);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

// ==========================================
// 4 e 5. FILTROS DAS CATEGORIAS (CORRIGIDO PARA FUNCIONAR DINAMICAMENTE)
// ==========================================
function configurarEventosFiltros() {
    const botoesFiltro = document.querySelectorAll(".filtro-bnt");
    
    botoesFiltro.forEach(botao => {
        botao.replaceWith(botao.cloneNode(true)); // Remove listeners antigos para evitar duplicações
    });

    const novosBotoes = document.querySelectorAll(".filtro-bnt");

    novosBotoes.forEach(botao => {
        botao.addEventListener("click", () => {
            novosBotoes.forEach(btn => btn.classList.remove("active"));
            botao.classList.add("active");

            const category = botao.dataset.categoria;
            const itens = document.querySelectorAll(".frito, .lanche, .doce, .bebidas");
            const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

            itens.forEach(item => {
                if (category === "todos") {
                    item.style.display = "flex";
                } else if (category === "favoritos" && favoritos.includes(item.id)) {
                    item.style.display = "flex";
                } else if (category === "salgados" && item.classList.contains("frito")) {
                    item.style.display = "flex";
                } else if (category === "lanches" && item.classList.contains("lanche")) {
                    item.style.display = "flex";
                } else if (category === "doces" && item.classList.contains("doce")) {
                    item.style.display = "flex";
                } else if (category === "bebidas" && item.classList.contains("bebidas")) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
}

// ==========================================
// 6. SISTEMA DE CARRINHO DE COMPRAS & MODAL
// ==========================================
const cardapioPrecos = {
    "pastel": { nome: "Pastel de Frango", preco: 11.00, foto: "foto/pastel.png" },
    "batata": { nome: "Batata Frita C/ Cheddar", preco: 15.00, foto: "foto/batata.png" },
    "dog": { nome: "Cachorro Quente", preco: 10.00, foto: "foto/dog.png" },
    "hamburguer": { nome: "X- tudo Completo", preco: 20.00, foto: "foto/hamburguer.png" },
    "brownie": { nome: "Brownie de Chocolate", preco: 10.00, foto: "foto/broni.png" }, 
    "coxinha": { nome: "Coxinha de Frango", preco: 8.00, foto: "foto/coxinha.png" },
    "fanta": { nome: "Fanta Laranja", preco: 6.00, foto: "foto/fanta.png" },
    "coca-cola": { nome: "Coca-Cola", preco: 7.00, foto: "foto/coca-cola.png" },
    "guarana": { nome: "Guaraná Zero", preco: 7.00, foto: "foto/guarana.png" }
};

const botaoAbrirCarrinho = document.getElementById("btnAbrirCarrinho"); 
const modalCarrinho = document.getElementById("modal-carrinho");
const botaoFecharCarrinho = document.getElementById("fechar-carrinho");

if (botaoAbrirCarrinho && modalCarrinho) {
    botaoAbrirCarrinho.addEventListener("click", (e) => {
        e.preventDefault();
        modalCarrinho.classList.add("active");
        exibirItensNoCarrinho();
    });
}

if (botaoFecharCarrinho && modalCarrinho) {
    botaoFecharCarrinho.addEventListener("click", () => {
        modalCarrinho.classList.remove("active");
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modalCarrinho) {
        modalCarrinho.classList.remove("active");
    }
});

function adicionarAoCarrinho(idProduto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

    if (carrinho[idProduto]) {
        carrinho[idProduto].quantidade += 1;
    } else {
        carrinho[idProduto] = {
            quantidade: 1,
            observacao: ""
        };
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarHeaderCarrinho();

    if (modalCarrinho && modalCarrinho.classList.contains("active")) {
        exibirItensNoCarrinho();
    }
}

function removerDoCarrinho(idProduto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

    if (carrinho[idProduto]) {
        carrinho[idProduto].quantidade -= 1;

        if (carrinho[idProduto].quantidade <= 0) {
            delete carrinho[idProduto];
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        atualizarHeaderCarrinho();

        if (modalCarrinho && modalCarrinho.classList.contains("active")) {
            exibirItensNoCarrinho();
        }
    }
}

function salvarObservacao(idProduto, texto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    if (carrinho[idProduto]) {
        carrinho[idProduto].observacao = texto;
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }
}

function atualizarHeaderCarrinho() {
    Object.assign(cardapioPrecos, JSON.parse(localStorage.getItem("cardapioPrecosSalvos")) || {});

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    let totalItens = 0;
    let valorTotal = 0.00;

    for (const idProduto in carrinho) {
        const itemDoCarrinho = carrinho[idProduto];
        if (!itemDoCarrinho) continue;

        const quantidade = itemDoCarrinho.quantidade;
        if (cardapioPrecos[idProduto] && !isNaN(quantidade)) {
            totalItens += quantidade; 
            valorTotal += cardapioPrecos[idProduto].preco * quantidade; 
        }
    }

    const displayContador = document.getElementById("contador-carrinho");
    const displayTotal = document.getElementById("total-carrinho");

    if (displayContador) displayContador.textContent = totalItens;
    if (displayTotal) displayTotal.textContent = valorTotal.toFixed(2);
}

// ==========================================
// RENDERIZADOR DO CARRINHO 
// ==========================================
function exibirItensNoCarrinho() {
    Object.assign(cardapioPrecos, JSON.parse(localStorage.getItem("cardapioPrecosSalvos")) || {});

    const containerItens = document.getElementById("itens-do-carrinho");
    const displayTotalModal = document.getElementById("total-modal");
    
    if (!containerItens) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    containerItens.innerHTML = ""; 

    let precoTotalGeral = 0;
    let possuiItens = false;

    for (const idProduto in carrinho) {
        const itemDoCarrinho = carrinho[idProduto];
        if (!itemDoCarrinho) continue;

        const quantidade = itemDoCarrinho.quantidade;
        const obsAtual = itemDoCarrinho.observacao || "";
        const produtoInfo = cardapioPrecos[idProduto];

        if (produtoInfo && quantidade > 0) {
            possuiItens = true;
            const subtotalItem = produtoInfo.preco * quantity;
            precoTotalGeral += subtotalItem;

            containerItens.innerHTML += `
                <div class="item-carrinho">
                    <div class="item-carrinho-topo">
                        <div class="item-carrinho-info">
                            <h4>${produtoInfo.nome}</h4>
                            <span>R$ ${produtoInfo.preco.toFixed(2)}</span>
                        </div>
                        <div class="item-carrinho-controles">
                            <button onclick="removerDoCarrinho('${idProduto}')">-</button>
                            <span>${quantidade}</span>
                            <button onclick="adicionarAoCarrinho('${idProduto}')">+</button>
                        </div>
                    </div>
                    <input type="text" 
                           class="input-observacao"
                           placeholder="Observação..." 
                           value="${obsAtual}" 
                           oninput="salvarObservacao('${idProduto}', this.value)">
                </div>
            `;
        }
    }

    if (!possuiItens) {
        containerItens.innerHTML = `<p class="carrinho-vazio">Seu carrinho está vazio.</p>`;
    }

    if (displayTotalModal) {
        displayTotalModal.textContent = precoTotalGeral.toFixed(2);
    }
}

// ==========================================
// 7. FUNÇÃO EXCLUSIVA DO BOTÃO "PEDIR AGORA"
// ==========================================
function pedirAgoraAoCarrinho(idProduto) {
    adicionarAoCarrinho(idProduto);
    
    if (modalCarrinho) {
        modalCarrinho.classList.add("active"); 
        exibirItensNoCarrinho(); 
    }
}

// ==========================================
// 8. FINALIZAR COMPRA & ENVIAR HISTÓRICO
// ==========================================
async function finalizarCompra() {
    Object.assign(cardapioPrecos, JSON.parse(localStorage.getItem("cardapioPrecosSalvos")) || {});
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    
    if (Object.keys(carrinho).length === 0) {
        alert("Adicione pelo menos um item antes de finalizar!");
        return;
    }

    let precoTotalGeral = 0;
    let itensPedido = [];

    for (const idProduto in carrinho) {
        if (carrinho[idProduto] && cardapioPrecos[idProduto]) {
            precoTotalGeral += cardapioPrecos[idProduto].preco * carrinho[idProduto].quantidade;
            
            itensPedido.push({
                produto_id: idProduto,
                quantidade: carrinho[idProduto].quantidade,
                observacao: carrinho[idProduto].observacao || ""
            });
        }
    }

    try {
        const respostaPedido = await fetch("http://localhost:5000/pedidos/criar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                valor_total: precoTotalGeral,
                itens: itensPedido,
                nickname: localStorage.getItem("nickname")
            })
        });

        const dadosPedidoSalvo = await respostaPedido.json();
        const pedidoId = dadosPedidoSalvo.id || dadosPedidoSalvo.pedido_id || dadosPedidoSalvo.insertId;

        if (!pedidoId) {
            console.error("Resposta do servidor de pedidos:", dadosPedidoSalvo);
            alert("Erro ao registrar o pedido no servidor.");
            return;
        }

        const respostaPagamento = await fetch("http://localhost:5000/pagamentos/criar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pedido_id: pedidoId })
        });

        const dadosPagamento = await respostaPagamento.json();

        if (dadosPagamento.init_point) {
            alert("Pedido gerado com sucesso! Redirecionando para a tela de pagamento...");
            localStorage.removeItem("carrinho");
            atualizarHeaderCarrinho();
            window.location.href = dadosPagamento.init_point;
        } else {
            console.error("Resposta do pagamento:", dadosPagamento);
            alert("Erro ao gerar o link de pagamento.");
        }

    } catch (erro) {
        console.error("Erro na integração do fluxo de pagamento:", erro);
        alert("Não foi possível conectar ao servidor backend.");
    }
}

// ==========================================
// 9. PROCESSAR PAGAMENTO PIX E LIMPAR DADOS
// ==========================================
function processarPagamentoPix() {
    Object.assign(cardapioPrecos, JSON.parse(localStorage.getItem("cardapioPrecosSalvos")) || {});
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    const modalPagamento = document.getElementById("modal-pagamento");
    
    if (Object.keys(carrinho).length === 0) {
        alert("Erro: Seu carrinho está vazio!");
        return;
    }

    const minhaChavePix = "00020101021126580014BR.GOV.BCB.PIX0136e8af626c-89c7-45b4-9798-23ad25721e5e5204000053039865802BR5925roselene gomes iglezias i6009SAO PAULO62080504daqr6304C3AF"; 
    navigator.clipboard.writeText(minhaChavePix);
    alert("Código Pix copiado para a área de transferência com sucesso!");

    let resumoPedido = "Pedido Confirmado e Pago via Pix!\n\nEnviando para a cozinha:\n";
    let itensPedido = [];
    let precoTotalGeral = 0;

    for (const idProduto in carrinho) {
        const item = carrinho[idProduto];
        const info = cardapioPrecos[idProduto];
        if (info && item) {
            const quantity = item.quantidade;
            const observacao = item.observacao || "";
            const subtotal = info.preco * quantity;
            precoTotalGeral += subtotal;

            resumoPedido += `- ${quantity}x ${info.nome}`;
            if (observacao.trim() !== "") {
                resumoPedido += ` (Obs: "${observacao}")`;
            }
            resumoPedido += "\n";

            itensPedido.push({
                nome: info.nome,
                quantidade: quantity,
                observacao: observacao
            });
        }
    }

    alert(resumoPedido + `\nTotal Pago: R$ ${precoTotalGeral.toFixed(2)}\n\nO painel da cozinha já recebeu seu pedido!`);

    let historico = JSON.parse(localStorage.getItem("historicoPedidos")) || [];
    const novoPedidoHistorico = {
        idPedido: "#" + Math.floor(1000 + Math.random() * 9000), 
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        itens: itensPedido,
        total: precoTotalGeral
    };

    historico.unshift(novoPedidoHistorico);
    localStorage.setItem("historicoPedidos", JSON.stringify(historico));

    localStorage.removeItem("carrinho");
    
    if (modalPagamento) modalPagamento.classList.remove("active");
    
    atualizarHeaderCarrinho();
}

// ==========================================
// 10. INICIALIZADOR DE EVENTOS DA PÁGINA (UNIFICADO)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const modalPagamento = document.getElementById("modal-pagamento");
    const botaoFecharPagamento = document.getElementById("fechar-pagamento");

    if (botaoFecharPagamento && modalPagamento) {
        botaoFecharPagamento.addEventListener("click", () => {
            modalPagamento.classList.remove("active");
        });
    }

    atualizarHeaderCarrinho();
    carregarCardapioUsuario();
});

// ==========================================
// 11. SISTEMA DINÂMICO: INTEGRAÇÃO COM A API (CORRIGIDO SEM LOOP ONERROR)
// ==========================================
const API_URL = "http://localhost:5000/produtos";

async function carregarCardapioUsuario() {
    try {
        const respuesta = await fetch(API_URL);
        const produtos = await respuesta.json();

        const containerCardapio = document.getElementById("lista-cardapio-usuario");
        if (!containerCardapio) return;

        containerCardapio.innerHTML = ""; 

        if (produtos.length === 0) {
            containerCardapio.innerHTML = `<p style="color: var(--text-secondary); text-align: center; width: 100%;">Nenhum item disponível no momento.</p>`;
            return;
        }

        produtos.forEach(produto => {
            let classeCategoria = "lanche"; 
            const desc = (produto.descricao || "").toLowerCase();
            const nome = (produto.nome || "").toLowerCase();

            if (desc.includes("pastel") || desc.includes("frito") || desc.includes("coxinha") || nome.includes("batata")) {
                classeCategoria = "frito";
            } else if (desc.includes("doce") || desc.includes("chocolate") || desc.includes("brownie")) {
                classeCategoria = "doce";
            } else if (desc.includes("ml") || desc.includes("suco") || desc.includes("refrigerante") || desc.includes("coca") || desc.includes("fanta") || desc.includes("guarana")) {
                classeCategoria = "bebidas";
            }

            // TRATAMENTO SEGURO DA IMAGEM: Removemos o atributo 'onerror' que gerava o loop infinito
            let fotoProduto = produto.imagem;
            if (!fotoProduto || fotoProduto === "sem-imagem.png" || fotoProduto.trim() === "") {
                fotoProduto = "icon3.png"; // Usa o ícone padrão que já existe no seu projeto
            }

            containerCardapio.innerHTML += `
                <div class="${classeCategoria}" id="${produto.id}">
                    <img src="../PRINCIPAL/foto/${fotoProduto}" alt="${produto.nome}">
                    <div class="info"> 
                        <div class="titulo-container">
                            <h3>${produto.nome}</h3> 
                            <button class="btn-add" onclick="adicionarAoCarrinhoDinamicico(${produto.id}, '${produto.nome}', ${produto.preco})">
                                <i class='bx bxs-message-square-add'></i>
                            </button>
                            <button class="btn-remove-carrinho" onclick="removerDoCarrinhoDinamico(${produto.id})">
                                <i class='bx bxs-message-square-minus'></i>
                            </button>
                        </div>
                        <span>R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</span>
                        <button class="btn-favorito" onclick="favoritar(this)">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                        <h4>${produto.descricao}</h4>
                        <a href="#"> 
                           <button class="pedir" onclick="pedirAgoraDinamico(${produto.id}, '${produto.nome}', ${produto.preco})">Pedir agora</button>
                        </a>
                    </div>
                </div>
            `;
        });

        // Inicializa os filtros somente APÓS os elementos da API serem criados na tela
        configurarEventosFiltros();

    } catch (erro) {
        console.error("Erro ao carregar o cardápio:", erro);
        const containerCardapio = document.getElementById("lista-cardapio-usuario");
        if (containerCardapio) {
            containerCardapio.innerHTML = `<p style="color: red; text-align: center; width: 100%;">Erro ao carregar o cardápio. Certifique-se de que o servidor está online.</p>`;
        }
    }
}

// ==========================================
// 12. ADAPTADORES DE PERSISTÊNCIA DA API
// ==========================================
function adicionarAoCarrinhoDinamicico(id, nome, preco) {
    cardapioPrecos[id] = { nome: nome, preco: parseFloat(preco) };
    
    let precosSalvos = JSON.parse(localStorage.getItem("cardapioPrecosSalvos")) || {};
    precosSalvos[id] = { nome: nome, preco: parseFloat(preco) };
    localStorage.setItem("cardapioPrecosSalvos", JSON.stringify(precosSalvos));

    adicionarAoCarrinho(id);
}

function removerDoCarrinhoDinamico(id) {
    removerDoCarrinho(id);
}

function pedirAgoraDinamico(id, nome, preco) {
    cardapioPrecos[id] = { nome: nome, preco: parseFloat(preco) };
    
    let precosSalvos = JSON.parse(localStorage.getItem("cardapioPrecosSalvos")) || {};
    precosSalvos[id] = { nome: nome, preco: parseFloat(preco) };
    localStorage.setItem("cardapioPrecosSalvos", JSON.stringify(precosSalvos));

    pedirAgoraAoCarrinho(id);
}
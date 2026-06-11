// ==========================================
// MANTÉM O TEMA CLARO ATIVO E TROCA OS ÍCONES
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
});

// ==========================================
// CONTROLE DA FOTO DE PERFIL (UPLOAD E CARREGAMENTO)
// ==========================================
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");

if (photoInput) {
    photoInput.addEventListener("change", function(){
        const file = photoInput.files[0];

        if(file){
            const reader = new FileReader();

            reader.onload = function(e){
                photoPreview.src = e.target.result;
                localStorage.setItem("fotoPerfil", e.target.result);
            }

            reader.readAsDataURL(file);
        }
    });
}

window.addEventListener("load", function(){
    const fotoSalva = localStorage.getItem("fotoPerfil");

    if(fotoSalva && photoPreview){
        photoPreview.src = fotoSalva;
    }
});

// ==========================================
// FUNÇÃO MULTI-USO: FAVORITAR E SALVAR NO LOCALSTORAGE
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
// FILTROS DAS CATEGORIAS (FRITOS, DOCES, LANCHES, BEBIDAS)
// ==========================================
const botoesFiltro = document.querySelectorAll(".filtro-bnt");
const itens = document.querySelectorAll(".frito, .lanche, .doce, .bebidas");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", () => {
        botoesFiltro.forEach(btn => btn.classList.remove("active"));
        if (botaoFavoritos) botaoFavoritos.classList.remove("active");
        
        botao.classList.add("active");
        const category = botao.dataset.categoria;

        itens.forEach(item => {
            if (category === "todos") {
                item.style.display = "flex";
            }
            else if (category === "salgados" && item.classList.contains("frito")) {
                item.style.display = "flex";
            }
            else if (category === "lanches" && item.classList.contains("lanche")) {
                item.style.display = "flex";
            }
            else if (category === "doces" && item.classList.contains("doce")) {
                item.style.display = "flex";
            }
            else if (category === "bebidas" && item.classList.contains("bebidas")) {
                item.style.display = "flex";
            }
            else {
                item.style.display = "none";
            }
        });
    });
});

// ==========================================
// FILTRO DA CATEGORIA ESPECÍFICA: FAVORITOS
// ==========================================
const botaoFavoritos = document.querySelector('[data-categoria="favoritos"]');

if (botaoFavoritos) {
    botaoFavoritos.addEventListener("click", () => {
        botoesFiltro.forEach(btn => {
            btn.classList.remove("active");
        });

        botaoFavoritos.classList.add("active");
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

        itens.forEach(item => {
            if(favoritos.includes(item.id)){
                item.style.display = "flex"; 
            } else {
                item.style.display = "none";
            }
        });
    });
}

window.addEventListener("load", () => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const botoesFavorito = document.querySelectorAll(".btn-favorito");

    botoesFavorito.forEach(botao => {
        const item = botao.closest("[id]");

        if(item && favoritos.includes(item.id)){
            botao.classList.add("active");
            const icone = botao.querySelector("i");

            icone.classList.remove("fa-regular");
            icone.classList.add("fa-solid");
            icone.style.color = "red";
        }
    });
});

// ==========================================
// SISTEMA DE CARRINHO DE COMPRAS & MODAL FLUTUANTE
// ==========================================
const cardapioPrecos = {
    "pastel": { nome: "Pastel de Frango", preco: 11.00 },
    "batata": { nome: "Batata Frita C/ Cheddar", preco: 15.00 },
    "dog": { nome: "Cachorro Quente", preco: 10.00 },
    "hamburguer": { nome: "X- tudo Completo", preco: 20.00 },
    "brownie": { nome: "Brownie de Chocolate", preco: 10.00 },
    "coxinha": { nome: "Coxinha de Frango", preco: 8.00 },
    "fanta": { nome: "Fanta Laranja", preco: 6.00 },
    "coca-cola": { nome: "Coca-Cola", preco: 7.00 },
    "guarana": { nome: "Guaraná Zero", preco: 7.00 }
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

    if (carrinho[idProduto] && typeof carrinho[idProduto] === 'object') {
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
        let quantidade = typeof carrinho[idProduto] === 'object' ? carrinho[idProduto].quantidade : carrinho[idProduto];
        let observacao = typeof carrinho[idProduto] === 'object' ? carrinho[idProduto].observacao : "";

        quantidade -= 1;

        if (quantidade <= 0) {
            delete carrinho[idProduto];
        } else {
            carrinho[idProduto] = {
                quantidade: quantidade,
                observacao: observacao
            };
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
    
    if (carrinho[idProduto] && typeof carrinho[idProduto] === 'object') {
        carrinho[idProduto].observacao = texto;
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }
}

function atualizarHeaderCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    
    let totalItens = 0;
    let valorTotal = 0.00;

    for (const idProduto in carrinho) {
        const itemDoCarrinho = carrinho[idProduto];
        if (!itemDoCarrinho) continue;

        const quantidade = typeof itemDoCarrinho === 'object' ? itemDoCarrinho.quantidade : Number(itemDoCarrinho);
        
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

function exibirItensNoCarrinho() {
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

        const quantidade = typeof itemDoCarrinho === 'object' ? itemDoCarrinho.quantidade : Number(itemDoCarrinho);
        const obsAtual = typeof itemDoCarrinho === 'object' ? itemDoCarrinho.observacao : "";

        const produtoInfo = cardapioPrecos[idProduto];

        if (produtoInfo && !isNaN(quantidade) && quantidade > 0) {
            possuiItens = true;
            const subtotalItem = produtoInfo.preco * quantidade;
            precoTotalGeral += subtotalItem;

            const itemHTML = `
                <div class="item-carrinho">
                    <div class="item-carrinho-topo">
                        <div class="item-carrinho-info">
                            <h4>${produtoInfo.nome}</h4>
                            <span>R$ ${produtoInfo.preco.toFixed(2)}</span>
                        </div>
                        <div class="item-carrinho-controles">
                            <button onclick="alterarQuantidadeModal('${idProduto}', -1)">-</button>
                            <span>${quantidade}</span>
                            <button onclick="alterarQuantidadeModal('${idProduto}', 1)">+</button>
                        </div>
                    </div>
                    <input type="text" 
                           class="input-observacao" 
                           placeholder="Algum detalhe extra? Ex: sem cebola..." 
                           value="${obsAtual || ''}" 
                           oninput="salvarObservacao('${idProduto}', this.value)">
                </div>
            `;
            containerItens.innerHTML += itemHTML;
        }
    }

    if (!possuiItens) {
        containerItens.innerHTML = `<p class="carrinho-vazio" style="text-align:center; color:#aaa;"><i class='bx bx-cart-alt' style='font-size: 2rem;'></i><br>Seu carrinho está vazio.</p>`;
    }

    if (displayTotalModal) {
        displayTotalModal.textContent = precoTotalGeral.toFixed(2);
    }
}

function alterarQuantidadeModal(idProduto, valor) {
    if (valor === 1) {
        adicionarAoCarrinho(idProduto);
    } else {
        removerDoCarrinho(idProduto);
    }
}

// ==========================================
// FUNÇÃO: Enviar pedido / Salvar no Histórico
// ==========================================
function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    
    if (Object.keys(carrinho).length === 0) {
        alert("Adicione pelo menos um item antes de finalizar!");
        return;
    }

    let resumoPedido = "Resumo do seu Pedido:\n\n";
    let itensPedido = [];
    let precoTotalGeral = 0;

    for (const idProduto in carrinho) {
        const item = carrinho[idProduto];
        const info = cardapioPrecos[idProduto];
        if (info && item) {
            const quantidade = typeof item === 'object' ? item.quantidade : item;
            const observacao = typeof item === 'object' ? item.observacao : "";
            const subtotal = info.preco * quantidade;
            precoTotalGeral += subtotal;

            resumoPedido += `- ${quantidade}x ${info.nome}`;
            if (observacao && observacao.trim() !== "") {
                resumoPedido += ` (Obs: "${observacao}")`;
            }
            resumoPedido += "\n";

            itensPedido.push({
                nome: info.nome,
                quantidade: quantidade,
                observacao: observacao
            });
        }
    }

    alert(resumoPedido + "\nPedido enviado com sucesso para a cozinha da Cantina!");
    
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
    if (modalCarrinho) modalCarrinho.classList.remove("active");
    
    atualizarHeaderCarrinho();
}

// Inicializa o contador do cabeçalho ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarHeaderCarrinho);
// ==========================================
// CONTROLE E FUNÇÕES DO MODAL DE PIX (COM TRAVA DE SEGURANÇA)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const modalPagamento = document.getElementById("modal-pagamento");
    const botaoFecharPagamento = document.getElementById("fechar-pagamento");

    if (botaoFecharPagamento && modalPagamento) {
        botaoFecharPagamento.addEventListener("click", () => {
            modalPagamento.classList.remove("active");
        });
    }
});

// PASSO 1: Apenas calcula o valor e abre a tela do Pix (Não envia nada para a cozinha ainda)
function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    const modalCarrinho = document.getElementById("modal-carrinho");
    const modalPagamento = document.getElementById("modal-pagamento");
    
    if (Object.keys(carrinho).length === 0) {
        alert("Adicione pelo menos um item antes de finalizar!");
        return;
    }

    let precoTotalGeral = 0;
    for (const idProduto in carrinho) {
        const item = carrinho[idProduto];
        const info = cardapioPrecos[idProduto];
        if (info && item) {
            const quantidade = typeof item === 'object' ? item.quantidade : item;
            precoTotalGeral += info.preco * quantidade;
        }
    }

    const displayTotalPagamento = document.getElementById("total-pagamento-modal");
    if (displayTotalPagamento) {
        displayTotalPagamento.textContent = precoTotalGeral.toFixed(2);
    }

    // Transiciona de um modal para o outro
    if (modalCarrinho) modalCarrinho.classList.remove("active");
    if (modalPagamento) modalPagamento.classList.add("active");
}

// PASSO 2: OBRIGATÓRIO - O pedido só é gerado e enviado aqui após a confirmação do pagamento
function processarPagamentoPix() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
    const modalPagamento = document.getElementById("modal-pagamento");
    
    if (Object.keys(carrinho).length === 0) {
        alert("Erro: Seu carrinho está vazio!");
        return;
    }

    // Copia a chave Pix fictícia/real para a área de transferência
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
            const quantidade = typeof item === 'object' ? item.quantidade : item;
            const observacao = typeof item === 'object' ? item.observacao : "";
            const subtotal = info.preco * quantidade;
            precoTotalGeral += subtotal;

            resumoPedido += `- ${quantidade}x ${info.nome}`;
            if (observacao && observacao.trim() !== "") {
                resumoPedido += ` (Obs: "${observacao}")`;
            }
            resumoPedido += "\n";

            itensPedido.push({
                nome: info.nome,
                quantidade: quantidade,
                observacao: observacao
            });
        }
    }

    // Exibe a confirmação final na tela
    alert(resumoPedido + `\nTotal Pago: R$ ${precoTotalGeral.toFixed(2)}\n\nO painel da cozinha já recebeu seu pedido!`);
    
    // SÓ SALVA NO HISTÓRICO AGORA
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

    // LIMPA O CARRINHO SÓ DEPOIS QUE PAGOU
    localStorage.removeItem("carrinho");
    
    // Fecha o modal do Pix
    if (modalPagamento) modalPagamento.classList.remove("active");
    
    // Reseta os contadores visuais do topo da página
    atualizarHeaderCarrinho();
}
// ==========================================================================
// temas
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const temaSalvo = localStorage.getItem("tema");
    const logoCantina = document.getElementById("logo-cantina");
     const logoCantina2 = document.getElementById("logo-cantina2");
    
    if (temaSalvo === "claro") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        if (logoCantina) {
            logoCantina.src = "../foto/icon2.png"; 
            logoCantina2.src = "../foto/icon2.png"
        }
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        if (logoCantina) {
            logoCantina.src = "../foto/icon3.png"; 
              logoCantina2.src = "../foto/icon3.png"
        }
    }
    exibirHistoricoPedidos();
});

// ==========================================================================
// 2. CONFIGURAÇÃO DOS CLIQUES (Protegido contra erros em outras abas)
// ==========================================================================
const temaClaro = document.getElementById("theme-light");
const temaEscuro = document.getElementById("theme-dark");

// O "if (temaClaro)" impede que o JavaScript trave nas páginas onde esses botões não existem!
if (temaClaro && temaEscuro) {
    temaClaro.addEventListener("click", () => {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        temaClaro.classList.add("active");
        temaEscuro.classList.remove("active");
        localStorage.setItem("tema", "claro");
    });

    temaEscuro.addEventListener("click", () => {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        temaEscuro.classList.add("active");
        temaClaro.classList.remove("active");
        localStorage.setItem("tema", "escuro");
    });
}

// ==========================================================================
// 3. FUNÇÃO: Puxar os dados do localStorage e desenhar os Cards na Tela
// ==========================================================================
function exibirHistoricoPedidos() {
    const containerHistorico = document.getElementById("lista-historico");
    if (!containerHistorico) return;

    const historico = JSON.parse(localStorage.getItem("historicoPedidos")) || [];
    
    if (historico.length === 0) {
        containerHistorico.innerHTML = `
            <p class="carrinho-vazio" style="text-align: center; padding: 40px; font-size: 1.1rem;">
                <i class='bx bx-history' style='font-size: 2.5rem; color: var(--accent);'></i><br><br>
                Você ainda não realizou nenhum pedido na Cantina.
            </p>`;
        return;
    }

    let htmlFinal = "";

    historico.forEach(pedido => {
        let itensHTML = "";
        
        pedido.itens.forEach(item => {
            itensHTML += `
                <div class="alimento-item">
                    <span class="alimento-nome"><strong>${item.quantidade}x</strong> ${item.nome}</span>
                    <span class="alimento-preco">
                        R$ ${(item.preco * item.quantidade || 0).toFixed(2)}
                        ${item.observacao ? `<br><small style="color: var(--accent); font-style: italic; font-size: 0.8rem;">Obs: "${item.observacao}"</small>` : ""}
                    </span>
                </div>
            `;
        });

        const statusTexto = "Entregue";
        const statusClasse = "status-entregue";

        htmlFinal += `
            <div class="pedido-card">
                <div class="pedido-header">
                    <div class="pedido-info-topo">
                        <span class="pedido-id"><i class='bx bx-receipt'></i> Pedido ${pedido.idPedido}</span>
                        <span class="pedido-data">${pedido.data} às ${pedido.hora}</span>
                    </div>
                    <span class="status ${statusClasse}">${statusTexto}</span>
                </div>
                
                <div class="pedido-corpo">
                    ${itensHTML}
                </div>
                
                <div class="pedido-footer">
                    <span class="total-pedido">Total do Pedido: <strong>R$ ${pedido.total.toFixed(2)}</strong></span>
                    <button class="btn-repetir" onclick="repetirPedido(${JSON.stringify(pedido.itens).replace(/"/g, '&quot;')})">
                        <i class='bx bx-refresh'></i> Pedir de novo
                    </button>
                </div>
            </div>
        `;
    });

    containerHistorico.innerHTML = htmlFinal;
}

// ==========================================================================
// 4. FUNÇÃO: "Pedir de novo" 
// ==========================================================================
function repetirPedido(itensDoPedido) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

    const mapaNomesParaIds = {
        "Pastel de Frango": "pastel",
        "Batata Frita C/ Cheddar": "batata",
        "Cachorro Quente": "dog",
        "X- tudo Completo": "hamburguer",
        "Brownie de Chocolate": "brownie",
        "Coxinha de Frango": "coxinha",
        "Fanta Laranja": "fanta",
        "Coca-Cola": "coca-cola",
        "Guaraná Zero": "guarana"
    };

    itensDoPedido.forEach(item => {
        const idProduto = mapaNomesParaIds[item.nome];
        
        if (idProduto) {
            if (carrinho[idProduto]) {
                carrinho[idProduto].quantidade += item.quantidade;
            } else {
                carrinho[idProduto] = {
                    whitespace: true,
                    quantidade: item.quantidade,
                    observacao: item.observacao || ""
                };
            }
        }
    });

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produtos adicionados ao seu carrinho novamente! Redirecionando...");
    window.location.href = "../PRINCIPAL/index.html"; 
}
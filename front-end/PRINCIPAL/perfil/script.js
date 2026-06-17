document.addEventListener("DOMContentLoaded", async () => {
    
    // ==========================================
    // 1. GERENCIAMENTO DE TEMA
    // ==========================================
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "claro") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    }

    // ==========================================
    // 2. RENDERIZADOR DINÂMICO DE FAVORITOS (CORRIGIDO PARA BASE64)
    // ==========================================
    async function carregarFavoritosNoPerfil() {
        const containerFavoritos = document.getElementById("lista-favoritos-perfil");
        if (!containerFavoritos) return;

        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        containerFavoritos.innerHTML = ""; 

        if (favoritos.length === 0) {
            containerFavoritos.innerHTML = `<p style="text-align:center; color:var(--text-secondary); grid-column: 1/-1; padding: 20px;">Você ainda não favoritou nenhum item.</p>`;
            return;
        }

        try {
            // Busca a lista atualizada de produtos da API
            const resposta = await fetch("http://localhost:5000/produtos");
            const produtosAPI = await resposta.json();
            
            let possuiFavoritosExibidos = false;

            favoritos.forEach(idProduto => {
                const produto = produtosAPI.find(p => String(p.id) === String(idProduto));
                
                if (produto) {
                    possuiFavoritosExibidos = true;
                    
                    // Tratamento seguro contra imagens vazias ou nulas
                    let fotoProduto = produto.imagem;
                    if (!fotoProduto || fotoProduto === "sem-imagem.png" || fotoProduto.trim() === "") {
                        fotoProduto = "icon3.png"; 
                    }

                    // CORREÇÃO CRUCIAL: Se a string começar com data:, ela já é o Base64 puro.
                    // Se não começar, aí sim nós adicionamos o caminho da pasta local.
                    const urlFinalImagem = fotoProduto.startsWith("data:") ? fotoProduto : `../PRINCIPAL/foto/${fotoProduto}`;

                    containerFavoritos.innerHTML += `
                        <div class="fav-profile-card" id="fav-${produto.id}">
                            <img src="${urlFinalImagem}" alt="${produto.nome}">
                            <div class="fav-profile-info">
                                <h3>${produto.nome}</h3>
                                <span class="fav-profile-price">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</span>
                                <p>${produto.descricao || "Sem descrição disponível."}</p>
                            </div>
                            <button class="btn-remove-fav" data-id="${produto.id}" title="Remover dos favoritos">
                                <i class="fa-solid fa-heart" style="color: red;"></i>
                            </button>
                        </div>
                    `;
                }
            });

            if (!possuiFavoritosExibidos) {
                containerFavoritos.innerHTML = `<p style="text-align:center; color:var(--text-secondary); grid-column: 1/-1; padding: 20px;">Você ainda não favoritou nenhum item.</p>`;
            }

            // Evento para remover dos favoritos direto pela tela de perfil
            const botoesRemover = containerFavoritos.querySelectorAll(".btn-remove-fav");
            botoesRemover.forEach(botao => {
                botao.addEventListener("click", () => {
                    const idParaRemover = botao.dataset.id;
                    removerFavoritoDoPerfil(idParaRemover);
                });
            });

        } catch (erro) {
            console.error("Erro ao carregar favoritos da API, recorrendo ao backup local:", erro);
            const precosSalvos = JSON.parse(localStorage.getItem("cardapioPrecosSalvos")) || {};
            
            favoritos.forEach(idProduto => {
                const produto = precosSalvos[idProduto];
                if (produto) {
                    containerFavoritos.innerHTML += `
                        <div class="fav-profile-card" id="fav-${idProduto}">
                            <img src="../PRINCIPAL/foto/icon3.png" alt="${produto.nome}">
                            <div class="fav-profile-info">
                                <h3>${produto.nome}</h3>
                                <span class="fav-profile-price">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</span>
                            </div>
                            <button class="btn-remove-fav" data-id="${idProduto}">
                                <i class="fa-solid fa-heart" style="color: red;"></i>
                            </button>
                        </div>
                    `;
                }
            });
        }
    }

    function removerFavoritoDoPerfil(idProduto) {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        favoritos = favoritos.filter(id => String(id) !== String(idProduto));
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        carregarFavoritosNoPerfil();
    }

    // Inicializa a renderização dos favoritos
    carregarFavoritosNoPerfil();

    // ==========================================
    // 3. CARREGAR INFORMAÇÕES DO USUÁRIO (APENAS VISUALIZAÇÃO)
    // ==========================================
    const displayNomeHeader = document.getElementById('display-nome'); 
    const displayRole = document.querySelector(".badge-role");
    const inputUsername = document.getElementById('input-username');
    const inputEmail = document.getElementById('input-email');
    const photoPreview = document.getElementById('photo-preview');

    const token = localStorage.getItem("token");

    if (token) {
        try {
            const res = await fetch("http://localhost:5000/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const user = await res.json();

                if (displayNomeHeader) displayNomeHeader.textContent = user.nickname;
                if (displayRole) {
                    displayRole.textContent = user.role === "admin" ? "ADMINISTRADOR" : "ESTUDANTE";
                }
                if (inputUsername) inputUsername.value = user.nickname || "";
                if (inputEmail) inputEmail.value = user.email || "";
            }
        } catch (err) {
            console.error("ERRO AO BUSCAR USUÁRIO NO PERFIL:", err);
        }
    }

    // Carrega a foto de perfil baseada na regra de login da Home
    const usuarioLogado = localStorage.getItem("nickname") || "comum";
    const chaveFotoUsuario = `fotoPerfil_${usuarioLogado}`;
    const fotoSalva = localStorage.getItem(chaveFotoUsuario);

    if (fotoSalva && photoPreview) {
        photoPreview.src = fotoSalva;
    } else if (photoPreview) {
        photoPreview.src = "/LOGIN/foto/teste.png";
    }
});
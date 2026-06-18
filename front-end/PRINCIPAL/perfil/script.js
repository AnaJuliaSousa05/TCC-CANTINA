document.addEventListener("DOMContentLoaded", async () => {
    
//gerenciamento do tema
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "claro") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    }

    //pedidos favoritos
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
            const resposta = await fetch("http://localhost:5000/produtos");
            const produtosAPI = await resposta.json();
            
            let possuiFavoritosExibidos = false;

            favoritos.forEach(idProduto => {
                const produto = produtosAPI.find(p => String(p.id) === String(idProduto));
                
                if (produto) {
                    possuiFavoritosExibidos = true;
                    
                    let fotoProduto = produto.imagem;
                    if (!fotoProduto || fotoProduto === "sem-imagem.png" || fotoProduto.trim() === "") {
                        fotoProduto = "icon3.png"; 
                    }

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

    carregarFavoritosNoPerfil();

  //carregar foto
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

                // 🔥 Garante que o nickname local está atualizado com o banco
                localStorage.setItem("nickname", user.nickname);

                // 🔥 BUSCA A FOTO BASEADA NO NOME RETORNADO DIRETAMENTE DO BANCO
                const fotoSalva = localStorage.getItem(`fotoPerfil_${user.nickname}`);

                if (fotoSalva && photoPreview) {
                    photoPreview.src = fotoSalva;
                } else if (photoPreview) {
                    // Fallback idêntico às outras telas para não quebrar o layout
                    photoPreview.src = "../PRINCIPAL/foto/icon3.png";
                }
            }
        } catch (err) {
            console.error("ERRO AO BUSCAR USUÁRIO NO PERFIL:", err);
        }
    }
});
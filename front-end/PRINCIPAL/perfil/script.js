document.addEventListener("DOMContentLoaded", () => {
    
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
    // 2. DICIONÁRIO DE DADOS (Igual ao da página principal)
    // ==========================================
    const cardapioPrecos = {
        "pastel": { nome: "Pastel de Frango", preco: 11.00, foto: "../foto/pastel.png", desc: "Pastel de frango desfiado, bacon e catupiry" },
        "batata": { nome: "Batata Frita C/ Cheddar", preco: 15.00, foto: "../foto/batata.png", desc: "Batata frita, queijo cheddar e bacon" },
        "dog": { nome: "Cachorro Quente", preco: 10.00, foto: "../foto/dog.png", desc: "Salsicha, molho especial e batata palha" },
        "hamburguer": { nome: "X- tudo Completo", preco: 20.00, foto: "../PRINCIPAL/foto/hamburguer.png", desc: "Hambúrguer, ovo, queijo, presunto e salada" },
        "brownie": { nome: "Brownie de Chocolate", preco: 10.00, foto: "../foto/broni.png", desc: "Brownie com cobertura de chocolate" }, 
        "coxinha": { nome: "Coxinha de Frango", preco: 8.00, foto: "../PRINCIPAL/foto/coxinha.png", desc: "Coxinha de frango bem recheada" },
        "fanta": { nome: "Fanta Laranja", preco: 6.00, foto: "../PRINCIPAL/foto/fanta.png", desc: "Lata 350ml" },
        "coca-cola": { nome: "Coca-Cola", preco: 7.00, foto: "../PRINCIPAL/foto/coca-cola.png", desc: "Lata 350ml" },
        "guarana": { nome: "Guaraná Zero", preco: 7.00, foto: "../PRINCIPAL/foto/guarana.png", desc: "Lata 350ml" }
    };

    // ==========================================
    // 3. RENDERIZADOR DINÂMICO DE FAVORITOS NO PERFIL
    // ==========================================
    function carregarFavoritosNoPerfil() {
        const containerFavoritos = document.getElementById("lista-favoritos-perfil");
        if (!containerFavoritos) return;

        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        containerFavoritos.innerHTML = ""; 

        if (favoritos.length === 0) {
            containerFavoritos.innerHTML = `<p class="content-header" style="border:none; text-align:center; color:var(--text-secondary);">Você ainda não favoritou nenhum item.</p>`;
            return;
        }

        favoritos.forEach(idProduto => {
            const produto = cardapioPrecos[idProduto];
            if (produto) {
                containerFavoritos.innerHTML += `
                    <div class="fav-profile-card" id="fav-${idProduto}">
                        <img src="${produto.foto}" alt="${produto.nome}">
                        <div class="fav-profile-info">
                            <h3>${produto.nome}</h3>
                            <span class="fav-profile-price">R$ ${produto.preco.toFixed(2)}</span>
                            <p>${produto.desc}</p>
                        </div>
                        <button class="btn-remove-fav" data-id="${idProduto}" title="Remover dos favoritos">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                `;
            }
        });

        const botoesRemover = containerFavoritos.querySelectorAll(".btn-remove-fav");
        botoesRemover.forEach(botao => {
            botao.addEventListener("click", () => {
                const idParaRemover = botao.dataset.id;
                removerFavoritoDoPerfil(idParaRemover);
            });
        });
    }

    function removerFavoritoDoPerfil(idProduto) {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        favoritos = favoritos.filter(id => id !== idProduto);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        carregarFavoritosNoPerfil();
    }

    carregarFavoritosNoPerfil();


    // ==========================================
    // 5. CONTROLE DO FORMULÁRIO DE PERFIL E INFORMAÇÕES DO USUÁRIO
    // ==========================================
    const formPerfil = document.getElementById('form-perfil');
    const btnFoto = document.getElementById('btn-foto');
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');
    const displayNomeHeader = document.getElementById('display-nome'); // Nome no Rosto (Topo)

    // Elementos dos Inputs do Formulário
    const inputUsername = document.getElementById('input-username');
    const inputFullname = document.getElementById('input-fullname');
    const inputCurso = document.getElementById('input-curso');
    const inputEmail = document.getElementById('input-email');
    const inputSenha = document.getElementById('input-senha');

    // --- CARREGAR DADOS DOS INPUTS SALVOS AO ABRIR A PÁGINA ---
    const token = localStorage.getItem("token");

if (token) {

    try {

        const res = await fetch(
            "http://localhost:5000/auth/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const user = await res.json();

        console.log("USUARIO:", user);

        if (displayNomeHeader) {
            displayNomeHeader.textContent = user.nickname;
        }

        if (inputUsername) {
            inputUsername.value = user.nickname;
        }

        if (inputEmail) {
            inputEmail.value = user.email;
        }

    } catch (err) {

        console.error("ERRO AO BUSCAR USUÁRIO:", err);

    }
}

    // --- SALVAR INFORMAÇÕES DO FORMULÁRIO ---
    if (formPerfil) {
        const inputs = formPerfil.querySelectorAll('input');
        let modoEdicao = false;

        formPerfil.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!modoEdicao) {
                // Entra em modo de edição e libera os campos
                modoEdicao = true;
                inputs.forEach(input => {
                    input.disabled = false;
                });
                if(btnFoto) {
                    btnFoto.disabled = false;
                    btnFoto.style.opacity = "1";
                    btnFoto.style.cursor = "pointer";
                }
                if(inputUsername) inputUsername.focus();
            } else {
                // Bloqueia e Salva os dados digitados
                modoEdicao = false;
                
                const novoUsername = inputUsername ? inputUsername.value : "";
                
                // 1. Atualiza o Rosto/Topo na hora com o novo Username
                if (displayNomeHeader && novoUsername) displayNomeHeader.textContent = novoUsername;
                
                // 2. Salva todas as informações de forma síncrona no LocalStorage
                
                // Desativa os campos novamente
                inputs.forEach(input => input.disabled = true);
                if(btnFoto) {
                    btnFoto.disabled = true;
                    btnFoto.style.opacity = "0.5";
                    btnFoto.style.cursor = "not-allowed";
                }
                alert('Informações atualizadas com sucesso!');
            }
        });
    }

    // Controle e upload da foto de perfil
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.addEventListener('load', function() {
                    photoPreview.setAttribute('src', this.result);
                    localStorage.setItem("fotoPerfil", this.result);
                });
                reader.readAsDataURL(file);
            }
        });
    }

    const fotoSalva = localStorage.getItem("fotoPerfil");
    if (fotoSalva && photoPreview) {
        photoPreview.setAttribute('src', fotoSalva);
    }
});
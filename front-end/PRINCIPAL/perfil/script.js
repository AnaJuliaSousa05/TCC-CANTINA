document.addEventListener("DOMContentLoaded", () => {
    // Busca na memória do navegador qual tema foi clicado na config
    const temaSalvo = localStorage.getItem("tema");

    // Se a pessoa clicou no modo branco, aplica ele aqui também!
    if (temaSalvo === "claro") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const formPerfil = document.getElementById('form-perfil');
    const btnAcao = document.getElementById('btn-acao');
    const btnFoto = document.getElementById('btn-foto');
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');
    
    // Seleciona todos os inputs do formulário
    const inputs = formPerfil.querySelectorAll('input');

    // Variável de controle: false significa modo de visualização (travado)
    let modoEdicao = false;

    formPerfil.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede a página de recarregar instantaneamente

        if (!modoEdicao) {
            // --- PASSO 1: ATIVAR MODO DE EDIÇÃO ---
            modoEdicao = true;

            // ALTERAÇÃO AQUI: Libera APENAS o input de nome e o de e-mail
            inputs.forEach(input => {
                if (input.id === 'input-nome' || input.id === 'input-email') {
                    input.disabled = false;
                }
            });

            // Libera o botão de alterar a foto e volta a opacidade normal
            btnFoto.disabled = false;
            btnFoto.style.opacity = "1";
            btnFoto.style.cursor = "pointer";

            // Foca automaticamente no campo Nome
            document.getElementById('input-nome').focus();

            // Altera o texto do botão principal
            btnAcao.textContent = "Salvar Alterações";
            btnAcao.style.backgroundColor = "#b36f1d"; 

        } else {
            // --- PASSO 2: SALVAR INFORMAÇÕES E VOLTAR A TRAVAR ---
            modoEdicao = false;

            // Atualiza o nome da sidebar em tempo real baseado no input
            const novoNome = document.getElementById('input-nome').value;
            document.getElementById('display-nome').textContent = novoNome;

            // Bloqueia todos os inputs novamente
            inputs.forEach(input => input.disabled = true);

            // Bloqueia o botão da foto de novo
            btnFoto.disabled = true;
            btnFoto.style.opacity = "0.5";
            btnFoto.style.cursor = "not-allowed";

            // Restaura o texto e estilo original do botão
            btnAcao.textContent = "Deseja alterar informações?";
            btnAcao.style.backgroundColor = "var(--accent)";

            // Feedback visual de sucesso
            alert('Informações atualizadas com sucesso!');
        }
    });

    // Visualização da imagem assim que o usuário escolhe o arquivo
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', function() {
                photoPreview.setAttribute('src', this.result);
                // Opcional: Se o usuário mudar a foto por aqui, também salva na memória
                localStorage.setItem("fotoPerfil", this.result);
            });
            reader.readAsDataURL(file);
        }
    });

    // ========================================================
    // ADICIONE ESTA PARTE AQUI PARA CARREGAR A FOTO AUTOMÁTICO
    // ========================================================
    const fotoSalva = localStorage.getItem("fotoPerfil");
    if (fotoSalva) {
        photoPreview.setAttribute('src', fotoSalva);
    }
}); 
// ==========================================
// MANTER O TEMA SELECIONADO (ADICIONE ISSO)
// ==========================================

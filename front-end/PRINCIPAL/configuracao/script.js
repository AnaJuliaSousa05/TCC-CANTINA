// =========================
// FOTO DE PERFIL
// =========================
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");

if (photoInput) {
    photoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                photoPreview.src = e.target.result;
                localStorage.setItem("fotoPerfil", e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
}

// =========================
// EDITAR INFORMAÇÕES (CORRIGIDO)
// =========================
const btnEditar = document.getElementById("btn-editar-info");
const displayNomeHeader = document.getElementById("display-nome"); 

const campos = [
    document.getElementById("input-username"),
    document.getElementById("input-email"),
    document.getElementById("input-senha")
];
let editando = false;

if (btnEditar) {
    btnEditar.addEventListener("click", async (e) => {
        e.preventDefault(); // Impede que o form recarregue a página do nada

        editando = !editando;

        campos.forEach(campo => {
            if (campo) campo.disabled = !editando;
        });

        if (editando) {
            btnEditar.innerHTML = "<i class='bx bx-save'></i> Salvar Informações";
        } else {
            const token = localStorage.getItem("token");
            const novoNickname = document.getElementById("input-username").value;

            try {
                const res = await fetch("http://localhost:5000/auth/perfil", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nickname: novoNickname,
                        email: document.getElementById("input-email").value,
                        password: document.getElementById("input-senha").value
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.msg);
                    editando = true; 
                    campos.forEach(campo => {
                        if (campo) campo.disabled = false;
                    });
                    return;
                }

                // Atualiza a tela em tempo real
                displayNomeHeader.textContent = novoNickname;
                
                // 🔥 CORREÇÃO 1: Atualiza o localStorage para a página Home não exibir o nome antigo!
                localStorage.setItem("nickname", novoNickname);

                alert("Perfil atualizado com sucesso!");
                
                // Limpa o campo de senha por segurança
                document.getElementById("input-senha").value = "";

            } catch (err) {
                console.error(err);
                alert("Erro ao salvar");
                editando = true;
                campos.forEach(campo => {
                    if (campo) campo.disabled = false;
                });
            }

            // Atualiza o texto do botão baseado no estado final
            btnEditar.innerHTML = editando 
                ? "<i class='bx bx-save'></i> Salvar Informações" 
                : "<i class='bx bx-edit-alt'></i> Alterar Informações";
        }
    });
}

// =========================
// TEMA CLARO / ESCURO
// =========================
const temaClaro = document.getElementById("theme-light");
const temaEscuro = document.getElementById("theme-dark");

if (temaClaro) {
    temaClaro.addEventListener("click", () => {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        temaClaro.classList.add("active");
        if (temaEscuro) temaEscuro.classList.remove("active");
        localStorage.setItem("tema", "claro");
    });
}

if (temaEscuro) {
    temaEscuro.addEventListener("click", () => {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        temaEscuro.classList.add("active");
        if (temaClaro) temaClaro.classList.remove("active");
        localStorage.setItem("tema", "escuro");
    });
}

// =========================
// CARREGAR DADOS AO ABRIR A PÁGINA
// =========================
window.addEventListener("load", async () => {
    const token = localStorage.getItem("token");

    // Aplica o tema salvo logo ao carregar a página
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "claro") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        if (temaClaro) temaClaro.classList.add("active");
        if (temaEscuro) temaEscuro.classList.remove("active");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        if (temaEscuro) temaEscuro.classList.add("active");
        if (temaClaro) temaClaro.classList.remove("active");
    }


  // Busca dados do usuário se logado
if (token) {
    try {
        const res = await fetch("http://localhost:5000/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const user = await res.json();
        
        console.log("USUÁRIO LOGADO:", user); 
        if (document.getElementById("input-username")) document.getElementById("input-username").value = user.nickname;
        if (document.getElementById("input-email")) document.getElementById("input-email").value = user.email;
        if (displayNomeHeader) displayNomeHeader.textContent = user.nickname;

        // ==========================================
        // ADICIONE ESSA LINHA AQUI DENTRO:
        // ==========================================
        const displayRole = document.querySelector(".badge-role"); 
        if (displayRole) displayRole.textContent = user.role || "Estudante";

    } catch (err) {
        console.error(err);
    }
}
});
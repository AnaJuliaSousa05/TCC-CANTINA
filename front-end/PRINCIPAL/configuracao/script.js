// =========================
// FOTO DE PERFIL (CONFIGURAÇÕES - CORRIGIDO)
// =========================
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");

// Função auxiliar para definir a chave correta baseada no usuário logado
function obterChaveFoto() {
    const usuarioLogado = localStorage.getItem("nickname") || "comum";
    return `fotoPerfil_${usuarioLogado}`;
}

if (photoInput) {
    photoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = 150;
                    canvas.height = 150;
                    
                    ctx.drawImage(img, 0, 0, 150, 150);
                    
                    const fotoCompactada = canvas.toDataURL('image/jpeg', 0.7);

                    if (photoPreview) {
                        photoPreview.src = fotoCompactada;
                    }
                    
                    // Salva com a chave padronizada
                    localStorage.setItem(obterChaveFoto(), fotoCompactada);
                };
            }
            reader.readAsDataURL(file);
        }
    });
}

// =========================
// EDITAR INFORMAÇÕES
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
        e.preventDefault(); 

        editando = !editando;

        campos.forEach(campo => {
            if (campo) campo.disabled = !editando;
        });

        if (editando) {
            btnEditar.innerHTML = "<i class='bx bx-save'></i> Salvar Informações";
        } else {
            const token = localStorage.getItem("token");
            const antigoNickname = localStorage.getItem("nickname"); // Guarda o nome antigo
            const novoNickname = document.getElementById("input-username").value;
            const novoEmail = document.getElementById("input-email").value;
            const senhaInput = document.getElementById("input-senha").value;

            const dadosParaAtualizar = {
                nickname: novoNickname,
                email: novoEmail
            };

            if (senhaInput && senhaInput.trim() !== "") {
                dadosParaAtualizar.password = senhaInput;
            }

            try {
                const res = await fetch("http://localhost:5000/auth/perfil", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(dadosParaAtualizar)
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

                // 🔥 CRUCIAL: Se o nickname mudou, migra a foto para a nova chave antes de atualizar o localStorage
                if (antigoNickname && antigoNickname !== novoNickname) {
                    const fotoAntiga = localStorage.getItem(`fotoPerfil_${antigoNickname}`);
                    if (fotoAntiga) {
                        localStorage.setItem(`fotoPerfil_${novoNickname}`, fotoAntiga);
                        localStorage.removeItem(`fotoPerfil_${antigoNickname}`);
                    }
                }

                displayNomeHeader.textContent = novoNickname;
                localStorage.setItem("nickname", novoNickname);

                alert("Perfil atualizado com sucesso!");
                document.getElementById("input-senha").value = "";

            } catch (err) {
                console.error(err);
                alert("Erro ao salvar");
                editando = true;
                campos.forEach(campo => {
                    if (campo) campo.disabled = false;
                });
            }

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

    if (token) {
        try {
            const res = await fetch("http://localhost:5000/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const user = await res.json();
                
                if (document.getElementById("input-username")) document.getElementById("input-username").value = user.nickname;
                if (document.getElementById("input-email")) document.getElementById("input-email").value = user.email;
                if (displayNomeHeader) displayNomeHeader.textContent = user.nickname;

                const displayRole = document.querySelector(".badge-role"); 
                if (displayRole) displayRole.textContent = user.role === "admin" ? "ADMINISTRADOR" : "ESTUDANTE";

                // 🔥 Atualiza o nickname no localStorage caso esteja dessincronizado
                localStorage.setItem("nickname", user.nickname);

                // Carrega a foto correta e atualizada do usuário atual
                const fotoSalva = localStorage.getItem(`fotoPerfil_${user.nickname}`);
                if (fotoSalva && photoPreview) {
                    photoPreview.src = fotoSalva;
                } else if (photoPreview) {
                    photoPreview.src = "../PRINCIPAL/foto/icon3.png";
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
});
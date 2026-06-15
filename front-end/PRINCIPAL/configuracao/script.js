// =========================
// FOTO DE PERFIL
// =========================
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");

if(photoInput){
    photoInput.addEventListener("change", function(){
        const file = this.files[0];
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

// =========================
// EDITAR INFORMAÇÕES (ATUALIZADO)
// =========================
const btnEditar = document.getElementById("btn-editar-info");
const displayNomeHeader = document.getElementById("display-nome"); // Tag do Rosto/Topo

const campos = [
    document.getElementById("input-username"),
    document.getElementById("input-fullname"),
    document.getElementById("input-curso"),
    document.getElementById("input-email"),
    document.getElementById("input-senha")
];

let editando = false;

if (btnEditar) {
    btnEditar.addEventListener("click", () => {
        editando = !editando;

        campos.forEach(campo => {
            if(campo) campo.disabled = !editando;
        });

        if(editando){
            btnEditar.innerHTML = "<i class='bx bx-save'></i> Salvar Informações";
            
            // Coloca o foco no primeiro input para melhorar a experiência do usuário
            if(campos[0]) campos[0].focus();
        } else {
            // Captura o valor digitado no campo username
            const novoUsername = document.getElementById("input-username").value;

            // 1. ATUALIZA NA HORA O ROSTO/TOPO DO PERFIL
            if (displayNomeHeader) {
                displayNomeHeader.textContent = novoUsername;
            }

            // 2. SALVA NO LOCALSTORAGE PARA A PÁGINA PRINCIPAL TAMBÉM CONSEGUIR LER
            localStorage.setItem("username", novoUsername);
            localStorage.setItem("fullname", document.getElementById("input-fullname").value);
            localStorage.setItem("curso", document.getElementById("input-curso").value);
            localStorage.setItem("email", document.getElementById("input-email").value);
            localStorage.setItem("senha", document.getElementById("input-senha").value);

            btnEditar.innerHTML = "<i class='bx bx-edit-alt'></i> Alterar Informações";
            alert("Informações salvas com sucesso!");
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
        if(temaEscuro) temaEscuro.classList.remove("active");
        localStorage.setItem("tema", "claro");
    });
}

if (temaEscuro) {
    temaEscuro.addEventListener("click", () => {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        temaEscuro.classList.add("active");
        if(temaClaro) temaClaro.classList.remove("active");
        localStorage.setItem("tema", "escuro");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "claro") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    }
});

// =========================
// CARREGAR DADOS AO ABRIR A PÁGINA
// =========================
window.addEventListener("load", () => {
    // Carrega a foto de perfil
    const foto = localStorage.getItem("fotoPerfil");
    if(foto && photoPreview){
        photoPreview.src = foto;
    }

    // Carrega o Nome do Usuário no Formulário E no Rosto/Cabeçalho do topo
    const usernameSalvo = localStorage.getItem("username");
    if(usernameSalvo){
        const inputUser = document.getElementById("input-username");
        if(inputUser) inputUser.value = usernameSalvo;
        
        // Garante que o rosto/topo exiba o nome correto assim que a página abrir
        if(displayNomeHeader) displayNomeHeader.textContent = usernameSalvo;
    }

    // Carrega as demais informações nos campos
    if(localStorage.getItem("fullname")){
        const inputFull = document.getElementById("input-fullname");
        if(inputFull) inputFull.value = localStorage.getItem("fullname");
    }

    if(localStorage.getItem("curso")){
        const inputCurso = document.getElementById("input-curso");
        if(inputCurso) inputCurso.value = localStorage.getItem("curso");
    }

    if(localStorage.getItem("email")){
        const inputEmail = document.getElementById("input-email");
        if(inputEmail) inputEmail.value = localStorage.getItem("email");
    }

    if(localStorage.getItem("senha")){
        const inputSenha = document.getElementById("input-senha");
        if(inputSenha) inputSenha.value = localStorage.getItem("senha");
    }

    // Alinha os botões ativos do layout de tema
    const tema = localStorage.getItem("tema");
    if(tema === "claro"){
        document.body.classList.add("light-theme");
        if(temaClaro) temaClaro.classList.add("active");
        if(temaEscuro) temaEscuro.classList.remove("active");
    } else {
        document.body.classList.add("dark-theme");
        if(temaEscuro) temaEscuro.classList.add("active");
        if(temaClaro) temaClaro.classList.remove("active");
    }
});
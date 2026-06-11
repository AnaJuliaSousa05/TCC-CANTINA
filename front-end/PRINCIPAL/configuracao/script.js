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

                localStorage.setItem(
                    "fotoPerfil",
                    e.target.result
                );

            }

            reader.readAsDataURL(file);

        }

    });

}


// =========================
// EDITAR INFORMAÇÕES
// =========================

const btnEditar =
document.getElementById("btn-editar-info");

const campos = [
    document.getElementById("input-username"),
    document.getElementById("input-fullname"),
    document.getElementById("input-curso"),
    document.getElementById("input-email"),
    document.getElementById("input-senha")
];

let editando = false;

btnEditar.addEventListener("click", () => {

    editando = !editando;

    campos.forEach(campo => {
        campo.disabled = !editando;
    });

    if(editando){

        btnEditar.innerHTML =
        "<i class='bx bx-save'></i> Salvar Informações";

    } else {

        localStorage.setItem(
            "username",
            document.getElementById("input-username").value
        );

        localStorage.setItem(
            "fullname",
            document.getElementById("input-fullname").value
        );

        localStorage.setItem(
            "curso",
            document.getElementById("input-curso").value
        );

        localStorage.setItem(
            "email",
            document.getElementById("input-email").value
        );

        localStorage.setItem(
            "senha",
            document.getElementById("input-senha").value
        );

        btnEditar.innerHTML =
        "<i class='bx bx-edit-alt'></i> Alterar Informações";

        alert("Informações salvas com sucesso!");

    }

});


// =========================
// TEMA CLARO / ESCURO
// =========================

const temaClaro = document.getElementById("theme-light");
const temaEscuro = document.getElementById("theme-dark");

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
// CARREGAR DADOS
// =========================

window.addEventListener("load", () => {

    const foto =
        localStorage.getItem("fotoPerfil");

    if(foto){

        photoPreview.src = foto;

    }

    if(localStorage.getItem("username")){

        document.getElementById(
            "input-username"
        ).value =
        localStorage.getItem("username");

    }

    if(localStorage.getItem("fullname")){

        document.getElementById(
            "input-fullname"
        ).value =
        localStorage.getItem("fullname");

    }

    if(localStorage.getItem("curso")){

        document.getElementById(
            "input-curso"
        ).value =
        localStorage.getItem("curso");

    }

    if(localStorage.getItem("email")){

        document.getElementById(
            "input-email"
        ).value =
        localStorage.getItem("email");

    }

    if(localStorage.getItem("senha")){

        document.getElementById(
            "input-senha"
        ).value =
        localStorage.getItem("senha");

    }

    const tema = localStorage.getItem("tema");

if(tema === "claro"){

    document.body.classList.add("light-theme");

    temaClaro.classList.add("active");
    temaEscuro.classList.remove("active");

}else{

    document.body.classList.add("dark-theme");

    temaEscuro.classList.add("active");
    temaClaro.classList.remove("active");

}

});

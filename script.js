const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");

photoInput.addEventListener("change", function(){

    const file = photoInput.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload = function(e){

            photoPreview.src = e.target.result;

            // salva a foto
            localStorage.setItem("fotoPerfil", e.target.result);

        }

        reader.readAsDataURL(file);

    }

});

// carrega a foto salva quando abrir a página
window.addEventListener("load", function(){

    const fotoSalva = localStorage.getItem("fotoPerfil");

    if(fotoSalva){

        photoPreview.src = fotoSalva;

    }

});

// =========================
// FAVORITAR
// =========================

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

        icone.style.color = "white";

    }

}


// =========================
// FILTROS
// =========================

const botoesFiltro = document.querySelectorAll(".filtro-bnt");

const itens = document.querySelectorAll(
    ".frito, .lanche, .doce, .bebidas"
);

botoesFiltro.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesFiltro.forEach(btn => {
            btn.classList.remove("active");
        });

        botao.classList.add("active");

        const categoria =
            botao.dataset.categoria;

        itens.forEach(item => {

            if(categoria === "todos"){

                item.style.display = "block";

            }

            else if(categoria === "salgados"){

                if(item.classList.contains("frito")){

                    item.style.display = "block";

                } else {

                    item.style.display = "none";

                }

            }

            else if(categoria === "lanches"){

                if(item.classList.contains("lanche")){

                    item.style.display = "block";

                } else {

                    item.style.display = "none";

                }

            }

            else if(categoria === "doces"){

                if(item.classList.contains("doce")){

                    item.style.display = "block";

                } else {

                    item.style.display = "none";

                }

            }

            else if(categoria === "bebidas"){

                if(item.classList.contains("bebidas")){

                    item.style.display = "block";

                } else {

                    item.style.display = "none";

                }

            }

        });

    });

});


// =========================
// FAVORITOS
// =========================

const botoesFavorito =
document.querySelectorAll(".btn-favorito");

botoesFavorito.forEach(botao => {

    botao.addEventListener("click", () => {

        const item =
        botao.closest(
            ".frito, .lanche, .doce, .bebidas"
        );

        const itemId = item.id;

        let favoritos =
            JSON.parse(
                localStorage.getItem("favoritos")
            ) || [];

        if(favoritos.includes(itemId)){

            favoritos =
                favoritos.filter(id => id !== itemId);

        } else {

            favoritos.push(itemId);

        }

        localStorage.setItem(
            "favoritos",
            JSON.stringify(favoritos)
        );

    });

});


// =========================
// FILTRO FAVORITOS
// =========================

const botaoFavoritos =
document.querySelector(
    '[data-categoria="favoritos"]'
);

botaoFavoritos.addEventListener("click", () => {

    botoesFiltro.forEach(btn => {
        btn.classList.remove("active");
    });

    botaoFavoritos.classList.add("active");

    const favoritos =
        JSON.parse(
            localStorage.getItem("favoritos")
        ) || [];

    itens.forEach(item => {

        if(
            favoritos.includes(item.id)
        ){

            item.style.display = "block";

        } else {

            item.style.display = "none";

        }

    });

});

// =========================
// CARREGAR FAVORITOS
// =========================

window.addEventListener("load", () => {

    const favoritos =
        JSON.parse(
            localStorage.getItem("favoritos")
        ) || [];

    const botoesFavorito =
        document.querySelectorAll(".btn-favorito");

    botoesFavorito.forEach(botao => {

        const item =
            botao.closest("[id]");

        if(
            favoritos.includes(item.id)
        ){

            botao.classList.add("active");

            const icone =
                botao.querySelector("i");

            icone.classList.remove("fa-regular");

            icone.classList.add("fa-solid");

            icone.style.color = "red";

        }

    });

});

;

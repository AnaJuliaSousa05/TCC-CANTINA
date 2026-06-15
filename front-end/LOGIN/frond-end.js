// ==========================================
// FUNÇÃO DE LOGIN E VALIDAÇÃO DE USUÁRIO
// ==========================================
function efetuarlLogin(event) {
    // Impede o formulário de recarregar a página antes da hora
    event.preventDefault(); 

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    // Validação básica do Front-end (Campos vazios)
    if (email === "" || senha === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // =========================================================================
    // EXPLICAÇÃO PARA O TCC (INTEGRAÇÃO FRONT / BACK):
    // Aqui você faria um 'fetch' enviando o email e senha para o seu Back-end.
    // Exemplo: fetch('http://localhost:3000/login', { method: 'POST', ... })
    // =========================================================================
    
    // SIMULAÇÃO DO BACK-END: Vamos fingir que o back-end validou com sucesso
    const respostaDoBackEnd = { autenticado: true }; 

    if (respostaDoBackEnd.autenticado) {
        // 1. O Front-end salva na memória que o usuário está validado
        localStorage.setItem("usuarioLogado", "true");
        localStorage.setItem("emailUsuario", email);

        // 2. O Front-end executa fisicamente a troca de página para a aba principal
        window.location.href = "../PRINCIPAL/index.html"; 
    } else {
        // Se o Back-end disser que os dados estão errados:
        alert("E-mail ou senha incorretos!");
    }
}
document.addEventListener('DOMContentLoaded', () => {

    // --- PROTEÇÃO DA TELA DE LOGIN ---
    // Se o usuário já tiver um token e tentar entrar na página de login/registro, ele é mandado de volta
    const tokenAtivo = localStorage.getItem("token");
    const roleAtivo = localStorage.getItem("role");
    
    // Verifica se estamos na página de login ou registro (ajuste o nome do arquivo se necessário)
    const naPaginaDeLogin = window.location.pathname.includes("login") || window.location.pathname.includes("INICIO");

    if (tokenAtivo && naPaginaDeLogin) {
        if (roleAtivo === "admin") {
            window.location.replace("/front-end/ADM/principal/index.html");
        } else {
            window.location.replace("/front-end/PRINCIPAL/index.html");
        }
        return; // Para a execução do resto do script
    }

    // --- EXIBIR DADOS DO USUÁRIO NA HOME ---
    const nomeUsuario = document.getElementById("nome-usuario-home");
    const cargoUsuario = document.getElementById("cargo-usuario");

    const nickname = localStorage.getItem("nickname");
    const role = localStorage.getItem("role");

    console.log("Nickname salvo:", nickname);
    console.log("Role salvo:", role);

    if (nomeUsuario) nomeUsuario.textContent = nickname;
    if (cargoUsuario) cargoUsuario.textContent = role;


    // --- LOGIN ---
    const formLogin = document.getElementById('LoginUsuarios');
      
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('emailLogin').value;
            const senha = document.getElementById('senhaLogin').value;

            try {
                const res = await fetch('http://localhost:5000/auth/login', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password: senha }),
                });
                 
                const data = await res.json();
                console.log("STATUS:", res.status);
                console.log("RES.OK:", res.ok);
                console.log("DADOS:", data);

                console.log("NICKNAME:", data.nickname);
                console.log("ROLE:", data.role);
                
                if (data.token) {
                    alert(data.msg || "Login feito com sucesso!");
                
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("nickname", data.nickname);
                    localStorage.setItem("role", data.role);
                
                    if (data.role === "admin") {
                        window.location.href = "/front-end/ADM/principal/index.html";
                    } else {
                        window.location.href = "/front-end/PRINCIPAL/index.html";
                    }

                } else {
                    alert(data.msg || "Erro no login");
                }

            } catch (erro) {
                console.error("ERRO LOGIN:", erro);
                alert("Erro ao conectar com o servidor");
            }
        });
    }


    // --- REGISTRO ---
    const formRegistro = document.getElementById('registrarUsuarios');

    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nicknameReg = document.getElementById('nickname').value;
            const emailReg = document.getElementById('email').value;
            const passwordReg = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            console.log("passei aquii no registro");
            
            if (passwordReg !== confirmPassword) {
                alert("As senhas não coincidem!");
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/auth/register', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nickname: nicknameReg, email: emailReg, password: passwordReg })
                });

                const data = await res.json();
               
                if (res.ok) {
                    alert("Conta criada com sucesso!");
                    window.location.href = "/front-end/INICIO/index.html";
                } else {
                    alert(data.msg || "Erro ao cadastrar");
                }

            } catch (err) {
                console.error("ERRO REGISTER:", err);
                alert("Erro ao cadastrar");
            }
        });
    }


    // --- DASHBOARD ---
    const btnDashboard = document.getElementById('btnDashboard');

    if (btnDashboard) {
        btnDashboard.addEventListener('click', async () => {
            try {
                const res = await fetch('http://localhost:5000/auth/dashboard', {
                    method: 'GET',
                });

                const text = await res.text();
                alert(text);

            } catch (err) {
                console.error("ERRO DASHBOARD:", err);
            }
        });
    }


    // --- LOGOUT ---
    const btnLogout = document.getElementById('btnLogout');

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                await fetch('http://localhost:5000/auth/logout', {
                    method: 'GET'
                });

                alert("Logout feito");

                // CRUCIAL: Limpa TODAS as credenciais do front-end
                localStorage.clear(); 

                // Redireciona substituindo o histórico para não conseguir clicar na seta "Voltar"
                window.location.replace("/login.html"); 

            } catch (err) {
                console.log(err);
                alert("Erro ao fazer logout");
            }
        });
    }

}); // Fim do DOMContentLoaded principal
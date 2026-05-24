document.addEventListener('DOMContentLoaded', () => {

    //login
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

                if (res.ok) {
                    alert(data.msg || "Login feito com sucesso!");
                    localStorage.setItem("token", data.token);
                    window.location.href = "/front-end/INICIO/index.html";

                } else {
                    alert(data.msg || "Erro no login");
                }

            } catch (erro) {
                console.error("ERRO LOGIN:", erro);
                alert("Erro ao conectar com o servidor");
            }
        });
    }

  //registro
    const formRegistro = document.getElementById('registrarUsuarios');

    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nickname = document.getElementById('nickname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            console.log("passei aquii no registro")
            if (password !== confirmPassword) {
                alert("As senhas não coincidem!");
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/auth/register', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nickname, email, password })
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


  //dashboard
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


//logout
    const btnLogout = document.getElementById('btnLogout');

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                await fetch('http://localhost:5000/auth/logout', {
                    method: 'GET'
                
                });

                alert("Logout feito");

                
                window.location.href = "/login.html";

            } catch (err) {
                console.log(err);
                alert("Erro ao fazer logout");
            }
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {

    // ======================
    // LOGIN
    // ======================
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
                    credentials: 'include'
                });

                const data = await res.json();

                alert(data.msg);

                if (res.ok) {
                    window.location.href = "/dashboard.html";
                }

            } catch (err) {
                console.error("ERRO LOGIN:", err);
                alert("Erro ao logar");
            }
        });
    }

    // ======================
    // REGISTRO
    // ======================
    const formRegistro = document.getElementById('registrarUsuarios');

    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nickname = document.getElementById('nickname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

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

                alert(data.msg);

                if (res.ok) formRegistro.reset();

            } catch (err) {
                console.error("ERRO REGISTER:", err);
                alert("Erro ao cadastrar");
            }
        });
    }

    // ======================
    // DASHBOARD TESTE (CORRIGIDO)
    // ======================
    const btnDashboard = document.getElementById('btnDashboard');

    if (btnDashboard) {
        btnDashboard.addEventListener('click', async () => {
            try {
                const res = await fetch('http://localhost:5000/auth/dashboard', {
                    method: 'GET',
                    credentials: 'include'
                });

                const text = await res.text();
                alert(text);

            } catch (err) {
                console.error(err);
            }
        });
    }

    // ======================
    // LOGOUT
    // ======================
    const btnLogout = document.getElementById('btnLogout');

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                await fetch('http://localhost:5000/auth/logout', {
                    method: 'GET',
                    credentials: 'include'
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
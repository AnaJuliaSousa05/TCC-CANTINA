document.addEventListener('DOMContentLoaded', () => {

    // LOGIN
    const formLogin = document.getElementById('LoginUsuarios');

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('emailLogin').value;
            const senha = document.getElementById('senhaLogin').value;

            try {
                const res = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password: senha }),
                    credentials: 'include'
                });

                const data = await res.json();

                alert(data.msg);

                if (data.msg === "Usuario logado com sucesso") {
                    window.location.href = "/dashboard.html"; // ou sua página
                }

            } catch (err) {
                console.error("ERRO LOGIN:", err);
                alert("Erro ao logar");
            }
        });
    }

    // REGISTRO
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
                const res = await fetch('http://127.0.0.1:5000/register', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nickname, email, password }),
                    credentials: 'include'
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

    // DASHBOARD TESTE
    const btnDashboard = document.getElementById('btnDashboard');

    if (btnDashboard) {
        btnDashboard.addEventListener('click', async () => {
            const res = await fetch('http://127.0.0.1:5000/dashboard', {
                method: 'GET',
                credentials: 'include'
            });

            const text = await res.text();
            alert(text);
        });
    }

    // LOGOUT
    const btnLogout = document.getElementById('btnLogout');

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await fetch('http://127.0.0.1:5000/logout', {
                method: 'GET',
                credentials: 'include'
            });

            alert("Logout feito");
            window.location.href = "/login.html";
        });
    }

});
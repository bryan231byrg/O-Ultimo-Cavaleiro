const formLogin = document.querySelector("#form-login");
const msgAlert = document.querySelector("#msgAlert");

formLogin.addEventListener("submit", (e) => {

    e.preventDefault();

    const dataForm = new FormData(formLogin);

    const dataEmail = dataForm.get("email");
    const dataSenha = dataForm.get("senha");

    const cadastrosBase = localStorage.getItem("cadastros");

    if (!cadastrosBase) {
        msgAlert.textContent = "Nenhum usuário cadastrado.";
        msgAlert.style.color = "red";
        return;
    }

    const users = JSON.parse(atob(cadastrosBase));

    const usuario = users.find(user =>
        user.email === dataEmail &&
        user.senha === dataSenha
    );

    if (usuario) {

        const token = Date.now();

        localStorage.setItem("token", token);
        
        window.location.href = "../index.html";

    } else {

        msgAlert.textContent = "E-mail ou senha incorretos.";
        msgAlert.style.color = "red";

    }

    formLogin.reset();

});
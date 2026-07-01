const formCadastro = document.querySelector("#form-cadastro");
const msgAlert = document.querySelector("#msgAlert");

// Recupera os cadastros salvos
const dados = localStorage.getItem("cadastros");

const cadastros = dados
    ? JSON.parse(atob(dados))
    : [];

formCadastro.addEventListener("submit", (e) => {

    e.preventDefault();

    const dataForm = new FormData(formCadastro);

    const usuario = {
        nome: dataForm.get("nome"),
        email: dataForm.get("email"),
        senha: dataForm.get("senha")
    };

    // Verifica se o e-mail já existe
    const existe = cadastros.some(cadastro => cadastro.email === usuario.email);

    if (existe) {

        msgAlert.textContent = "Este e-mail já está cadastrado.";

    } else {

        cadastros.push(usuario);

        const dataConvert = btoa(JSON.stringify(cadastros));

        localStorage.setItem("cadastros", dataConvert);

        msgAlert.textContent = "Cadastro realizado com sucesso!";

        window.location.href = "../pages/login.html";

    }

});
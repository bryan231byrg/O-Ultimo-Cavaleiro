const form = document.querySelector("#gameForm");

const token = localStorage.getItem("token");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const nome = formData.get("nome").trim();
    const arma = formData.get("arma");

    if (!token) {
        alert("Você precisa estar logado para iniciar o jogo.");
        window.location.href = "./pages/login.html";
        return;
    }

    if (!nome) {
        alert("Digite o nome do personagem.");
        return;
    }

    if (!arma) {
        alert("Escolha uma arma.");
        return;
    }

    localStorage.setItem("personagem", JSON.stringify({
        nome,
        arma,
        vida: 100,
    }));

    // Cria o token de acesso da Fase 1
    localStorage.setItem("TokenF1", "TokenF1");

    // Redireciona para a fase
    window.location.href = "./pages/fases/fase1.html";
});
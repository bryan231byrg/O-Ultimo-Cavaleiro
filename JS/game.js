/* =========================
   JOGADOR (LOCALSTORAGE)
========================= */
let jogador = JSON.parse(localStorage.getItem("personagem"));

if (!jogador) {
    window.location.href = window.location.origin + "/index.html";
}

/* garante campos básicos */
jogador.vida ??= 100;
jogador.nivel ??= 1;

/* =========================
   ARMA (BASE DO INDEX)
========================= */
const armas = {
    espada: { atk: 6, def: 4 },
    machado: { atk: 9, def: 1 },
    lanca: { atk: 4, def: 7 }
};

const armaBase = armas[jogador.arma] || armas.espada;

/* evolução por fase */
let bonusAtk = 2;
let bonusDef = 2;

/* =========================
   FASE
========================= */
function faseAtual() {
    return parseInt(localStorage.getItem("faseAtual") || "1");
}

function setFase(n) {
    localStorage.setItem("faseAtual", n);
}

/* =========================
   INIMIGO
========================= */
let inimigo = { nome: "", vida: 100 };

/* =========================
   ELEMENTOS UI
========================= */
const elNome = document.querySelector("#nomePersonagem");
const elVida = document.querySelector("#vidaPersonagem");
const elEnemyLife = document.querySelector("#enemyLife");
const elEnemyName = document.querySelector("#enemyName");

/* =========================
   SALVAR
========================= */
function salvar() {
    localStorage.setItem("personagem", JSON.stringify(jogador));
}

/* =========================
   HUD
========================= */
function atualizarHUD() {
    if (elNome) elNome.textContent = jogador.nome;
    if (elVida) elVida.textContent = jogador.vida;
    if (elEnemyLife) elEnemyLife.textContent = inimigo.vida;
    if (elEnemyName) elEnemyName.textContent = inimigo.nome;
}

/* =========================
   LOG
========================= */
function log(msg) {
    const box = document.querySelector("#logMensagens");
    if (!box) return;

    const p = document.createElement("p");
    p.textContent = msg;

    box.appendChild(p);

    if (box.children.length > 6) {
        box.removeChild(box.firstChild);
    }
}

/* =========================
   DANO DO JOGADOR (ESTÁVEL)
========================= */
function calcularDano() {
    const base = armaBase.atk + bonusAtk;

    const variacao = Math.floor(Math.random() * 3);
    const critico = Math.random() > 0.9;

    return critico ? (base + variacao) * 2 : base + variacao;
}

/* =========================
   DANO DO INIMIGO (ESCALÁVEL)
========================= */
function danoInimigo() {
    const fase = faseAtual();
    return Math.floor(Math.random() * (8 + fase * 3)) + 3;
}

/* =========================
   DANO NO JOGADOR (COM DEFESA)
========================= */
function tomarDano(valor) {
    const defesa = armaBase.def + bonusDef;

    const danoFinal = Math.max(1, valor - Math.floor(defesa / 2));

    jogador.vida -= danoFinal;

    log(`Você recebeu ${danoFinal} de dano`);

    if (jogador.vida <= 0) {
        jogador.vida = 0;
        salvar();
        atualizarHUD();
        gameOver();
        return;
    }

    salvar();
    atualizarHUD();
}

/* =========================
   ATAQUE JOGADOR
========================= */
function turnoJogador() {
    const dano = calcularDano();

    inimigo.vida -= dano;

    log(`Você atacou causando ${dano}`);

    if (inimigo.vida <= 0) {
        vencer();
        return;
    }

    atualizarHUD();

    setTimeout(turnoInimigo, 600);
}

/* =========================
   ATAQUE INIMIGO
========================= */
function turnoInimigo() {
    const dano = danoInimigo();

    log(`Inimigo atacou ${dano}`);

    tomarDano(dano);
}

/* =========================
   VITÓRIA (PROGRESSÃO)
========================= */
function vencer() {
    log("Inimigo derrotado!");

    /* cura leve */
    jogador.vida += 60;

    /* evolução da arma */
    bonusAtk += 6;
    bonusDef += 6;

    log("Sua arma evoluiu (+6 ATK / +6 DEF)");

    salvar();
    atualizarHUD();

    setTimeout(() => {
        let fase = faseAtual();
        fase++;
        setFase(fase);

        window.location.href =
            window.location.origin + "/pages/fases/fase" + fase + ".html";
    }, 1000);
}

/* =========================
   GAME OVER
========================= */
function gameOver() {
    alert("Você morreu...");

    localStorage.removeItem("personagem");
    localStorage.removeItem("faseAtual");

    window.location.href = window.location.origin + "/index.html";
}

/* =========================
   CONFIG FASE
========================= */
function configurarFase() {
    const fase = faseAtual();

    if (fase === 1) inimigo = { nome: "Goblin Explorador", vida: 60 };
    if (fase === 2) inimigo = { nome: "Soldado Caído", vida: 100 };
    if (fase === 3) inimigo = { nome: "Entidade do Caos", vida: 120 };

    atualizarHUD();
}

/* =========================
   INIT
========================= */
configurarFase();
atualizarHUD();

/* BOTÃO ATAQUE */
document.querySelector("#btnAtacar")?.addEventListener("click", turnoJogador);
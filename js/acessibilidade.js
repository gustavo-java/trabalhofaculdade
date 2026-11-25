
// ==========================================
// ELEMENTOS DO WIDGET
// ==========================================

const botaoAcessibilidade = document.getElementById("botaoAcessibilidade");
const painelAcessibilidade = document.getElementById("painelAcessibilidade");
const fecharAcessibilidade = document.getElementById("fecharAcessibilidade");
const mensagemAcessibilidade = document.getElementById("mensagemAcessibilidade");
const guiaLeitura = document.getElementById("guiaLeitura");
const seletorVoz = document.getElementById("seletorVoz");

let tamanhoTexto = 0;
let elementoAtual = null;
let temporizadorLeitura = null;

let vozesDisponiveis = [];
let vozSelecionada = null;


// ==========================================
// ABRIR E FECHAR O WIDGET
// ==========================================

botaoAcessibilidade.addEventListener("click", () => {
    const aberto = !painelAcessibilidade.hidden;

    painelAcessibilidade.hidden = aberto;
    botaoAcessibilidade.setAttribute("aria-expanded", String(!aberto));
});

fecharAcessibilidade.addEventListener("click", () => {
    painelAcessibilidade.hidden = true;
    botaoAcessibilidade.setAttribute("aria-expanded", "false");
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        painelAcessibilidade.hidden = true;
        botaoAcessibilidade.setAttribute("aria-expanded", "false");
    }
});


// ==========================================
// MENSAGENS DO WIDGET
// ==========================================

function mostrarMensagem(mensagem) {
    mensagemAcessibilidade.textContent = mensagem;
}


// ==========================================
// SELEÇÃO DE VOZ EM PORTUGUÊS
// ==========================================

function carregarVozes() {

    vozesDisponiveis = window.speechSynthesis.getVoices();

    const vozesPortugues = vozesDisponiveis.filter(voz =>
        voz.lang.toLowerCase().startsWith("pt")
    );

    seletorVoz.innerHTML = "";

    if (vozesPortugues.length === 0) {

        const opcao = document.createElement("option");

        opcao.value = "";
        opcao.textContent = "Nenhuma voz em português disponível";

        seletorVoz.appendChild(opcao);

        vozSelecionada = null;

        return;
    }

    vozesPortugues.forEach((voz, indice) => {

        const opcao = document.createElement("option");

        opcao.value = indice;
        opcao.textContent = `${voz.name} (${voz.lang})`;

        seletorVoz.appendChild(opcao);

    });

    // Prioriza uma voz brasileira quando disponível.

    const indiceBrasileiro = vozesPortugues.findIndex(voz =>
        voz.lang.toLowerCase() === "pt-br"
    );

    seletorVoz.value = String(
        indiceBrasileiro >= 0 ? indiceBrasileiro : 0
    );

    vozSelecionada = vozesPortugues[Number(seletorVoz.value)];

    seletorVoz.onchange = () => {

        vozSelecionada = vozesPortugues[Number(seletorVoz.value)];

        mostrarMensagem(`Voz selecionada: ${vozSelecionada.name}`);

    };
}

// O navegador pode carregar as vozes depois da página.

window.speechSynthesis.onvoiceschanged = carregarVozes;

carregarVozes();


// ==========================================
// CRIAR UMA LEITURA EM PORTUGUÊS
// ==========================================

function criarLeitura(texto) {

    if (!vozSelecionada) {

        mostrarMensagem("Nenhuma voz em português foi encontrada no dispositivo.");

        return null;
    }

    const leitura = new SpeechSynthesisUtterance(texto);

    leitura.voice = vozSelecionada;
    leitura.lang = vozSelecionada.lang;
    leitura.rate = 1;

    return leitura;
}


// ==========================================
// PARAR LEITURA
// ==========================================

function pararLeitura() {

    window.speechSynthesis.cancel();

    elementoAtual = null;

    clearTimeout(temporizadorLeitura);

}


// ==========================================
// LEITURA DA PÁGINA PELO CURSOR
// ==========================================

function lerPagina() {

    pararLeitura();

    if (!vozSelecionada) {
        mostrarMensagem("Nenhuma voz em português disponível.");
        return;
    }

    document.body.classList.add("leitura-cursor");

    mostrarMensagem("Passe o mouse sobre os textos para ouvir a leitura.");

    atualizarBotoes();

}


// ==========================================
// AUMENTAR E DIMINUIR TEXTO
// ==========================================

function alterarTamanhoTexto(valor) {

    tamanhoTexto += valor;

    if (tamanhoTexto > 4) {
        tamanhoTexto = 4;
    }

    if (tamanhoTexto < -2) {
        tamanhoTexto = -2;
    }

    const tamanho = 16 + tamanhoTexto * 2;

    document.documentElement.style.fontSize = `${tamanho}px`;

    mostrarMensagem(`Tamanho do texto: ${tamanho}px`);

}


// ==========================================
// CONTRASTE
// ==========================================

function alterarContraste(tipo) {

    document.body.classList.remove(
        "contraste-claro",
        "contraste-escuro"
    );

    if (tipo === "claro") {
        document.body.classList.add("contraste-claro");
    }

    if (tipo === "escuro") {
        document.body.classList.add("contraste-escuro");
    }

    atualizarBotoes();

}


// ==========================================
// ATUALIZAR ESTADO DOS BOTÕES
// ==========================================

function atualizarBotoes() {

    document.querySelectorAll("[data-acao]").forEach((botao) => {

        const acao = botao.dataset.acao;

        let ativo = false;

        switch (acao) {

            case "contraste-claro":
                ativo = document.body.classList.contains("contraste-claro");
                break;

            case "contraste-escuro":
                ativo = document.body.classList.contains("contraste-escuro");
                break;

            case "espacamento":
                ativo = document.body.classList.contains("texto-espacado");
                break;

            case "fonte-dislexia":
                ativo = document.body.classList.contains("fonte-simples");
                break;

            case "destacar-links":
                ativo = document.body.classList.contains("links-destacados");
                break;

            case "esconder-imagens":
                ativo = document.body.classList.contains("imagens-escondidas");
                break;

            case "guia-leitura":
                ativo = document.body.classList.contains("guia-ativo");
                break;

            case "pausar-animacoes":
                ativo = document.body.classList.contains("animacoes-pausadas");
                break;

            case "ler":
                ativo = document.body.classList.contains("leitura-cursor");
                break;

        }

        if (botao.hasAttribute("aria-pressed")) {
            botao.setAttribute("aria-pressed", String(ativo));
        }

    });

}


// ==========================================
// GUIA DE LEITURA
// ==========================================

function alternarGuiaLeitura() {

    document.body.classList.toggle("guia-ativo");

    const ativo = document.body.classList.contains("guia-ativo");

    guiaLeitura.hidden = !ativo;

    mostrarMensagem(
        ativo
            ? "Guia de leitura ativado."
            : "Guia de leitura desativado."
    );

    atualizarBotoes();

}

document.addEventListener("pointermove", (evento) => {

    if (!document.body.classList.contains("guia-ativo")) {
        return;
    }

    guiaLeitura.style.top = `${evento.clientY}px`;

});


// ==========================================
// LEITURA QUANDO O MOUSE PASSAR SOBRE O TEXTO
// ==========================================

document.addEventListener("mouseover", (evento) => {

    if (!document.body.classList.contains("leitura-cursor")) {
        return;
    }

    const elemento = evento.target.closest(
        "p, h1, h2, h3, h4, h5, li, label, a, button"
    );

    if (!elemento || elemento.closest(".acessibilidade-widget")) {
        return;
    }

    if (elementoAtual === elemento) {
        return;
    }

    elementoAtual = elemento;

    clearTimeout(temporizadorLeitura);

    window.speechSynthesis.cancel();

    temporizadorLeitura = setTimeout(() => {

        const texto = elemento.innerText.trim();

        if (!texto) {
            return;
        }

        const leitura = criarLeitura(texto);

        if (!leitura) {
            return;
        }

        window.speechSynthesis.speak(leitura);

    }, 300);

});


// ==========================================
// AÇÕES DOS BOTÕES
// ==========================================

document.querySelectorAll("[data-acao]").forEach((botao) => {

    botao.addEventListener("click", () => {

        const acao = botao.dataset.acao;

        switch (acao) {

            case "ler":
                lerPagina();
                break;

            case "parar-leitura":

                pararLeitura();

                document.body.classList.remove("leitura-cursor");

                mostrarMensagem("Leitura desativada.");

                atualizarBotoes();

                break;

            case "aumentar-texto":
                alterarTamanhoTexto(1);
                break;

            case "diminuir-texto":
                alterarTamanhoTexto(-1);
                break;

            case "contraste-claro":
                alterarContraste("claro");
                break;

            case "contraste-escuro":
                alterarContraste("escuro");
                break;

            case "espacamento":
                document.body.classList.toggle("texto-espacado");
                break;

            case "fonte-dislexia":
                document.body.classList.toggle("fonte-simples");
                break;

            case "destacar-links":
                document.body.classList.toggle("links-destacados");
                break;

            case "esconder-imagens":
                document.body.classList.toggle("imagens-escondidas");
                break;

            case "guia-leitura":
                alternarGuiaLeitura();
                return;

            case "pausar-animacoes":
                document.body.classList.toggle("animacoes-pausadas");
                break;

            case "restaurar":
                restaurarConfiguracoes();
                return;

        }

        atualizarBotoes();

    });

});


// ==========================================
// RESTAURAR CONFIGURAÇÕES
// ==========================================

function restaurarConfiguracoes() {

    pararLeitura();

    document.body.classList.remove(
        "contraste-claro",
        "contraste-escuro",
        "texto-espacado",
        "fonte-simples",
        "links-destacados",
        "imagens-escondidas",
        "guia-ativo",
        "animacoes-pausadas",
        "leitura-cursor"
    );

    document.documentElement.style.fontSize = "";

    guiaLeitura.hidden = true;

    atualizarBotoes();

    mostrarMensagem("Configurações restauradas.");

}

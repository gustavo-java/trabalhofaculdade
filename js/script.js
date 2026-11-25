
/* =================================
   AGENDAMENTO
================================= */

const formulario = document.getElementById("formAgendamento");

if (formulario) {

    const servico = document.getElementById("servico");

    // Campos dos outros serviços
    const campoData = document.getElementById("data");
    const campoHorario = document.getElementById("horario");
    const secaoDataHorario = document.getElementById("secaoDataHorario");

    // Campos da hospedagem
    const secaoHospedagem = document.getElementById("secaoHospedagem");
    const dataEntradaHospedagem = document.getElementById("dataEntradaHospedagem");
    const horarioEntradaHospedagem = document.getElementById("horarioEntradaHospedagem");
    const dataSaida = document.getElementById("dataSaida");
    const horarioSaida = document.getElementById("horarioSaida");
    const valorHospedagem = document.getElementById("valorHospedagem");

    // Campos da consulta
    const secaoConsulta = document.getElementById("secaoConsulta");
    const motivoConsulta = document.getElementById("motivoConsulta");

    // Transporte
    const teleBusca = document.getElementById("teleBusca");
    const levarLoja = document.getElementById("levarLoja");
    const avisoTransporte = document.getElementById("avisoTransporte");

    const valorDiaria = 67;


    // Obtém a data atual
    function obterDataAtual() {

        const hoje = new Date();

        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;

    }


    // Converte uma data em dias
    function converterDataParaDias(data) {

        const [ano, mes, dia] = data.split("-").map(Number);

        return Date.UTC(ano, mes - 1, dia) / 86400000;

    }


    // Calcula o dia seguinte
    function obterDiaSeguinte(data) {

        const dataEmDias = converterDataParaDias(data);

        const diaSeguinte = new Date(dataEmDias * 86400000);

        diaSeguinte.setUTCDate(diaSeguinte.getUTCDate() + 1);

        const ano = diaSeguinte.getUTCFullYear();
        const mes = String(diaSeguinte.getUTCMonth() + 1).padStart(2, "0");
        const dia = String(diaSeguinte.getUTCDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;

    }


    // Formata uma data para o padrão brasileiro
    function formatarData(data) {

        return data.split("-").reverse().join("/");

    }


    // Calcula o valor da hospedagem
    function calcularHospedagem() {

        if (!dataEntradaHospedagem.value || !dataSaida.value) {

            valorHospedagem.textContent =
                "Valor da hospedagem: R$ 0,00";

            return 0;

        }

        const entrada = converterDataParaDias(dataEntradaHospedagem.value);
        const saida = converterDataParaDias(dataSaida.value);

        const diarias = saida - entrada;

        if (diarias <= 0) {

            valorHospedagem.textContent =
                "A saída deve acontecer depois da entrada.";

            return 0;

        }

        const total = diarias * valorDiaria;

        valorHospedagem.textContent =
            `${diarias} diária(s) × R$ 67,00 = R$ ${total.toFixed(2).replace(".", ",")}`;

        return total;

    }


    // Atualiza os campos conforme o serviço escolhido
    function atualizarServico() {

        const servicoEscolhido = servico.value;

        const hospedagemSelecionada =
            servicoEscolhido === "Hospedagem";

        // Mostra ou esconde as seções
        secaoHospedagem.hidden = !hospedagemSelecionada;
        secaoDataHorario.hidden = hospedagemSelecionada;

        secaoConsulta.hidden =
            servicoEscolhido !== "Consulta Veterinária";

        // Campos obrigatórios da data e horário
        campoData.required = !hospedagemSelecionada;
        campoHorario.required = !hospedagemSelecionada;

        // Campos obrigatórios da hospedagem
        dataEntradaHospedagem.required = hospedagemSelecionada;
        horarioEntradaHospedagem.required = hospedagemSelecionada;
        dataSaida.required = hospedagemSelecionada;
        horarioSaida.required = hospedagemSelecionada;

        // Consulta veterinária
        motivoConsulta.required =
            servicoEscolhido === "Consulta Veterinária";

        // Tele-busca
        if (servicoEscolhido === "Consulta Veterinária") {

            teleBusca.disabled = true;
            teleBusca.checked = false;

            levarLoja.checked = true;

            avisoTransporte.textContent =
                "A tele-busca não está disponível para consultas veterinárias.";

        } else {

            teleBusca.disabled = false;

            avisoTransporte.textContent =
                "A tele-busca está disponível para este serviço.";

        }

        atualizarDatasHospedagem();

        calcularHospedagem();

    }


    // Atualiza as datas mínimas da hospedagem
    function atualizarDatasHospedagem() {

        const hoje = obterDataAtual();

        dataEntradaHospedagem.min = hoje;

        if (dataEntradaHospedagem.value) {

            dataSaida.min = obterDiaSeguinte(
                dataEntradaHospedagem.value
            );

            if (
                dataSaida.value &&
                dataSaida.value < dataSaida.min
            ) {

                dataSaida.value = "";

            }

        } else {

            dataSaida.min = hoje;

        }

    }


    // Eventos dos campos
    servico.addEventListener("change", atualizarServico);

    dataEntradaHospedagem.addEventListener("change", function () {

        atualizarDatasHospedagem();
        calcularHospedagem();

    });

    dataSaida.addEventListener("change", calcularHospedagem);


    // Envio do formulário
    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const nomeCliente =
            document.getElementById("nomeCliente").value;

        const nomePet =
            document.getElementById("nomePet").value;

        const servicoEscolhido = servico.value;

        const transporteSelecionado =
            document.querySelector('input[name="transporte"]:checked');

        const transporteEscolhido = transporteSelecionado.value;

        let data;
        let horario;

        // Seleciona os campos conforme o serviço
        if (servicoEscolhido === "Hospedagem") {

            data = dataEntradaHospedagem.value;
            horario = horarioEntradaHospedagem.value;

            if (
                !dataSaida.value ||
                dataSaida.value <= data
            ) {

                alert("A data de saída deve ser posterior à data de entrada.");

                return;

            }

            if (!horarioSaida.value) {

                alert("Informe o horário de saída.");

                return;

            }

        } else {

            data = campoData.value;
            horario = campoHorario.value;

        }


        // Mensagem inicial
        let mensagem =
            "Solicitação de agendamento realizada!\n\n" +
            "Cliente: " + nomeCliente + "\n" +
            "Pet: " + nomePet + "\n" +
            "Serviço: " + servicoEscolhido + "\n" +
            "Transporte: " + transporteEscolhido;


        // Informações da hospedagem
        if (servicoEscolhido === "Hospedagem") {

            const total = calcularHospedagem();

            mensagem +=
                "\n\nEntrada: " + formatarData(data) +
                " às " + horarioEntradaHospedagem.value +
                "\nSaída: " + formatarData(dataSaida.value) +
                " às " + horarioSaida.value +
                "\nValor total: R$ " +
                total.toFixed(2).replace(".", ",");

        } else {

            mensagem +=
                "\nData: " + formatarData(data) +
                "\nHorário: " + horario;

        }


        // Informações da consulta
        if (servicoEscolhido === "Consulta Veterinária") {

            mensagem +=
                "\nMotivo da consulta: " + motivoConsulta.value;

        }


        alert(mensagem);

        formulario.reset();

        atualizarServico();

        secaoConsulta.hidden = true;
        secaoHospedagem.hidden = true;

        motivoConsulta.required = false;

        teleBusca.disabled = false;

        avisoTransporte.textContent =
            "Selecione um serviço para verificar as opções de transporte.";

    });


    // Configuração inicial
    campoData.min = obterDataAtual();

    dataEntradaHospedagem.min = obterDataAtual();

    atualizarServico();

}


/* =================================
   RELÓGIO DA PÁGINA
================================= */

const relogio = document.getElementById("relogio");

if (relogio) {

    function atualizarRelogio() {

        const agora = new Date();

        relogio.textContent =
            agora.toLocaleTimeString("pt-BR");

    }

    atualizarRelogio();

    setInterval(atualizarRelogio, 1000);

}

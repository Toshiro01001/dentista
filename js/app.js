/* Nascente Odontologia: comportamento da página.
   Tudo roda no navegador. Nenhum pedido sai para a internet. */
(function () {
  "use strict";

  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------ */
  /* Menu no celular                                                     */
  /* ------------------------------------------------------------------ */
  var menuBotao = $("[data-menu]");
  var menu = $("#menu");
  if (menuBotao && menu) {
    menuBotao.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      menuBotao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("aberto");
        menuBotao.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Agendamento simulado                                                */
  /* ------------------------------------------------------------------ */
  var CHAVE = "nascente.agendamentos";
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var DIAS_SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  var HORARIOS_SEMANA = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  var HORARIOS_SABADO = ["08:00", "09:00", "10:00", "11:00"];

  var hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  var mesVisivel = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  var limiteMes = new Date(hoje.getFullYear(), hoje.getMonth() + 3, 1);
  var diaEscolhido = null;
  var horarioEscolhido = null;

  var calCorpo = $("#calendario-corpo");
  var calMes = $("#calendario-mes");
  var horariosBox = $("#horarios");
  var horariosDia = $("#horarios-dia");
  var agendaForm = $("#agenda-form");
  var agendaEscolha = $("#agenda-escolha");
  var agendaErro = $("#agenda-erro");
  var agendaConfirmacao = $("#agenda-confirmacao");
  var meusBox = $("#meus-horarios");
  var meusLista = $("#meus-horarios-lista");

  function doisDigitos(n) { return n < 10 ? "0" + n : String(n); }
  function chaveDia(d) { return d.getFullYear() + "-" + doisDigitos(d.getMonth() + 1) + "-" + doisDigitos(d.getDate()); }
  function dataLonga(d) { return DIAS_SEMANA[d.getDay()] + ", " + d.getDate() + " de " + MESES[d.getMonth()]; }
  function mesmoDia(a, b) { return a && b && a.getTime() === b.getTime(); }
  function maiuscula(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

  /* Hash simples e determinístico: o mesmo dia sempre tem os mesmos horários ocupados. */
  function hash(texto) {
    var h = 2166136261;
    for (var i = 0; i < texto.length; i++) {
      h ^= texto.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }
  function ocupado(dia, horario) {
    return hash(chaveDia(dia) + horario) % 10 < 4; /* cerca de 40% dos horários já tomados */
  }
  function diaAtende(d) { return d.getDay() !== 0 && d.getTime() >= hoje.getTime(); }

  function desenharCalendario() {
    if (!calCorpo) return;
    var ano = mesVisivel.getFullYear();
    var mes = mesVisivel.getMonth();
    calMes.textContent = maiuscula(MESES[mes]) + " de " + ano;
    $("[data-mes='-1']").disabled = mesVisivel.getTime() <= new Date(hoje.getFullYear(), hoje.getMonth(), 1).getTime();
    $("[data-mes='1']").disabled = mesVisivel.getTime() >= new Date(limiteMes.getFullYear(), limiteMes.getMonth() - 1, 1).getTime();

    calCorpo.textContent = "";
    var primeiro = new Date(ano, mes, 1);
    var total = new Date(ano, mes + 1, 0).getDate();
    var linha = document.createElement("tr");
    for (var v = 0; v < primeiro.getDay(); v++) {
      linha.appendChild(document.createElement("td"));
    }
    for (var dia = 1; dia <= total; dia++) {
      var data = new Date(ano, mes, dia);
      var td = document.createElement("td");
      var botao = document.createElement("button");
      botao.type = "button";
      botao.className = "dia";
      botao.textContent = String(dia);
      botao.setAttribute("aria-label", dataLonga(data));
      if (mesmoDia(data, hoje)) botao.classList.add("hoje");
      if (!diaAtende(data)) {
        botao.disabled = true;
      } else {
        botao.addEventListener("click", escolherDia.bind(null, data));
      }
      if (mesmoDia(data, diaEscolhido)) {
        botao.classList.add("escolhido");
        botao.setAttribute("aria-pressed", "true");
      }
      td.appendChild(botao);
      linha.appendChild(td);
      if (data.getDay() === 6) {
        calCorpo.appendChild(linha);
        linha = document.createElement("tr");
      }
    }
    if (linha.children.length) {
      while (linha.children.length < 7) linha.appendChild(document.createElement("td"));
      calCorpo.appendChild(linha);
    }
  }

  function escolherDia(data) {
    diaEscolhido = data;
    horarioEscolhido = null;
    agendaForm.hidden = true;
    agendaConfirmacao.hidden = true;
    agendaErro.textContent = "";
    desenharCalendario();
    horariosDia.textContent = maiuscula(dataLonga(data));
    horariosBox.textContent = "";
    var lista = data.getDay() === 6 ? HORARIOS_SABADO : HORARIOS_SEMANA;
    var livres = 0;
    lista.forEach(function (h) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "horario";
      b.textContent = h;
      if (ocupado(data, h)) {
        b.disabled = true;
        b.setAttribute("aria-label", h + ", ocupado");
      } else {
        livres++;
        b.addEventListener("click", escolherHorario.bind(null, h, b));
      }
      horariosBox.appendChild(b);
    });
    if (!livres) {
      var aviso = document.createElement("p");
      aviso.className = "legenda";
      aviso.textContent = "Nenhum horário livre neste dia. Tente outro.";
      horariosBox.appendChild(aviso);
    }
    if (window.innerWidth < 900) {
      horariosDia.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function escolherHorario(h, botao) {
    horarioEscolhido = h;
    $$(".horario", horariosBox).forEach(function (b) {
      b.classList.remove("escolhido");
      b.removeAttribute("aria-pressed");
    });
    botao.classList.add("escolhido");
    botao.setAttribute("aria-pressed", "true");
    agendaEscolha.textContent = "Você escolheu " + dataLonga(diaEscolhido) + ", às " + h + ".";
    agendaForm.hidden = false;
    agendaConfirmacao.hidden = true;
    $("#agenda-nome").focus({ preventScroll: false });
  }

  function lerGuardados() {
    try {
      var bruto = window.localStorage.getItem(CHAVE);
      var lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }
  function guardar(lista) {
    try { window.localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) { /* navegador sem armazenamento: segue sem guardar */ }
  }
  function desenharGuardados() {
    var lista = lerGuardados();
    if (!lista.length) { meusBox.hidden = true; return; }
    meusBox.hidden = false;
    meusLista.textContent = "";
    lista.forEach(function (item) {
      var li = document.createElement("li");
      var quando = document.createElement("span");
      quando.textContent = item.quando;
      var oque = document.createElement("span");
      oque.textContent = item.servico + " (" + item.nome + ")";
      li.appendChild(quando);
      li.appendChild(oque);
      meusLista.appendChild(li);
    });
  }

  if (agendaForm) {
    agendaForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var nome = $("#agenda-nome").value.trim();
      var servico = $("#agenda-servico").value;
      if (nome.length < 2) {
        agendaErro.textContent = "Escreva seu nome para confirmar.";
        $("#agenda-nome").focus();
        return;
      }
      if (!diaEscolhido || !horarioEscolhido) {
        agendaErro.textContent = "Escolha um dia e um horário antes.";
        return;
      }
      agendaErro.textContent = "";
      var quandoBaixo = dataLonga(diaEscolhido) + ", às " + horarioEscolhido;
      var quando = maiuscula(quandoBaixo);
      var lista = lerGuardados();
      lista.push({ quando: quando, nome: nome, servico: servico, data: chaveDia(diaEscolhido), hora: horarioEscolhido });
      guardar(lista);

      agendaConfirmacao.textContent = "";
      var t = document.createElement("h3");
      t.textContent = "Horário reservado na simulação";
      var p1 = document.createElement("p");
      p1.textContent = nome + ", anotamos " + servico.toLowerCase() + " para " + quandoBaixo + ".";
      var p2 = document.createElement("p");
      p2.textContent = "Num consultório de verdade, você receberia a confirmação por WhatsApp. Aqui nada foi enviado.";
      var p3 = document.createElement("p");
      p3.className = "legenda";
      p3.textContent = "Este horário ficou guardado só no seu navegador, na lista abaixo.";
      agendaConfirmacao.appendChild(t);
      agendaConfirmacao.appendChild(p1);
      agendaConfirmacao.appendChild(p2);
      agendaConfirmacao.appendChild(p3);
      agendaConfirmacao.hidden = false;
      agendaForm.hidden = true;
      agendaForm.reset();
      desenharGuardados();
      agendaConfirmacao.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    $$("[data-mes]").forEach(function (b) {
      b.addEventListener("click", function () {
        mesVisivel = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + Number(b.getAttribute("data-mes")), 1);
        desenharCalendario();
      });
    });

    var limpar = $("[data-limpar-horarios]");
    if (limpar) {
      limpar.addEventListener("click", function () {
        try { window.localStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
        desenharGuardados();
      });
    }

    desenharCalendario();
    desenharGuardados();
  }

  /* ------------------------------------------------------------------ */
  /* Simulador de tratamento                                             */
  /* ------------------------------------------------------------------ */
  var TRATAMENTOS = {
    limpeza: {
      min: 180, max: 260, porDente: false, complexidade: false,
      sessoes: function () { return 1; },
      duracao: function () { return "Mesmo dia"; },
      cadeira: "Cerca de 50 minutos",
      nota: "Inclui exame, radiografia e polimento. Sem contar a avaliação."
    },
    clareamento: {
      min: 900, max: 1400, porDente: false, complexidade: true,
      sessoes: function (n, c) { return c === "complexa" ? 3 : 2; },
      duracao: function (n, c) { return c === "complexa" ? "Cerca de 3 semanas" : "Cerca de 2 semanas"; },
      cadeira: "45 minutos por sessão",
      nota: "Em consultório, com gel dessensibilizante. A versão em casa com moldeira custa de 25% a 35% menos."
    },
    restauracao: {
      min: 250, max: 450, porDente: true, complexidade: true,
      sessoes: function (n) { return Math.ceil(n / 2); },
      duracao: function (n) { var s = Math.ceil(n / 2); return s === 1 ? "Mesmo dia" : "Cerca de " + s + " semanas"; },
      cadeira: "40 a 60 minutos por dente",
      nota: "Resina na cor do dente. Até dois dentes por sessão, com anestesia."
    },
    alinhadores: {
      min: 4500, max: 7000, porDente: false, complexidade: true,
      sessoes: function (n, c) { return c === "simples" ? 6 : c === "moderada" ? 9 : 14; },
      duracao: function (n, c) { return c === "simples" ? "6 a 8 meses" : c === "moderada" ? "10 a 14 meses" : "16 a 20 meses"; },
      cadeira: "20 minutos por consulta de acompanhamento",
      nota: "Inclui planejamento digital, todas as placas e a contenção final."
    },
    implante: {
      min: 3500, max: 6000, porDente: true, complexidade: true,
      sessoes: function (n) { return 3 + Math.ceil(n / 3); },
      duracao: function () { return "4 a 6 meses"; },
      cadeira: "60 a 90 minutos na cirurgia",
      nota: "Pino de titânio e coroa de cerâmica. Inclui tomografia e intervalo para cicatrização."
    },
    canal: {
      min: 800, max: 1500, porDente: true, complexidade: true,
      sessoes: function (n, c) { return n * (c === "complexa" ? 2 : 1); },
      duracao: function (n, c) { var s = n * (c === "complexa" ? 2 : 1); return s === 1 ? "Mesmo dia" : "Cerca de " + s + " semanas"; },
      cadeira: "60 a 90 minutos por sessão",
      nota: "Anestesia reforçada. Não inclui a restauração ou coroa depois do canal."
    }
  };
  var FATOR = { simples: 1, moderada: 1.25, complexa: 1.55 };

  var simForm = $("#simulador-form");
  if (simForm) {
    var simTrat = $("#sim-tratamento");
    var simDentes = $("#sim-dentes");
    var simDentesValor = $("#sim-dentes-valor");
    var simParcelas = $("#sim-parcelas");
    var simParcelasValor = $("#sim-parcelas-valor");
    var simValor = $("#sim-valor");
    var simParcela = $("#sim-parcela");
    var simSessoes = $("#sim-sessoes");
    var simDuracao = $("#sim-duracao");
    var simCadeira = $("#sim-cadeira");
    var simNota = $("#sim-nota");
    var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var moeda = function (v) {
      return "R$\u00a0" + Math.round(v).toLocaleString("pt-BR");
    };
    var complexidadeAtual = function () {
      var r = $("input[name='complexidade']:checked", simForm);
      return r ? r.value : "simples";
    };

    function calcular() {
      var t = TRATAMENTOS[simTrat.value] || TRATAMENTOS.limpeza;
      var n = t.porDente ? Number(simDentes.value) : 1;
      var c = t.complexidade ? complexidadeAtual() : "simples";
      var fator = t.complexidade ? FATOR[c] : 1;
      var parcelas = Number(simParcelas.value);

      if (t.porDente) simForm.removeAttribute("data-sem-dentes"); else simForm.setAttribute("data-sem-dentes", "");
      if (t.complexidade) simForm.removeAttribute("data-sem-complexidade"); else simForm.setAttribute("data-sem-complexidade", "");

      var min = t.min * n * fator;
      var max = t.max * n * fator;
      /* desconto por volume: a partir do terceiro dente, 10% a menos */
      if (t.porDente && n >= 3) { min *= 0.9; max *= 0.9; }

      simDentesValor.textContent = String(n);
      simParcelasValor.textContent = String(parcelas);
      simParcelasValor.parentNode.lastChild.textContent = parcelas === 1 ? " vez" : " vezes";

      var trocar = function () {
        simValor.textContent = "de " + moeda(min) + " a " + moeda(max);
        simParcela.textContent = parcelas === 1
          ? "à vista"
          : parcelas + " parcelas de " + moeda(min / parcelas) + " a " + moeda(max / parcelas) + ", sem juros";
        var s = t.sessoes(n, c);
        simSessoes.textContent = s === 1 ? "1 sessão" : s + " sessões";
        simDuracao.textContent = t.duracao(n, c);
        simCadeira.textContent = t.cadeira;
        simNota.textContent = t.nota;
        simValor.classList.remove("trocando");
      };
      if (reduzMovimento) { trocar(); return; }
      simValor.classList.add("trocando");
      window.setTimeout(trocar, 120);
    }

    simForm.addEventListener("input", calcular);
    simForm.addEventListener("change", calcular);

    /* Links "Simular X" da seção de serviços já selecionam o tratamento. */
    $$("[data-servico]").forEach(function (a) {
      a.addEventListener("click", function () {
        simTrat.value = a.getAttribute("data-servico");
        calcular();
      });
    });

    calcular();
  }

  /* ------------------------------------------------------------------ */
  /* Antes e depois                                                      */
  /* ------------------------------------------------------------------ */
  var CASOS = {
    clareamento: "Clareamento em consultório, duas sessões de 45 minutos com intervalo de uma semana.",
    alinhamento: "Alinhadores transparentes por 11 meses, com troca de placa a cada duas semanas.",
    restauracao: "Restauração em resina de um dente lascado e troca de uma restauração antiga escurecida."
  };
  var quadro = $(".comparador-quadro");
  var controle = $("#comparador-controle");
  var comparador = $("#painel-comparador");
  var comparadorTexto = $("#comparador-texto");
  if (quadro && controle) {
    var posicionar = function () {
      quadro.style.setProperty("--pos", controle.value + "%");
    };
    controle.addEventListener("input", posicionar);
    posicionar();

    var abas = $$(".caso-aba");
    var ativar = function (aba) {
      abas.forEach(function (b) {
        var ativa = b === aba;
        b.setAttribute("aria-selected", ativa ? "true" : "false");
        b.tabIndex = ativa ? 0 : -1;
      });
      var caso = aba.getAttribute("data-caso");
      comparador.setAttribute("data-caso", caso);
      comparador.setAttribute("aria-labelledby", aba.id);
      comparadorTexto.textContent = CASOS[caso] || "";
      controle.value = "50";
      posicionar();
    };
    abas.forEach(function (b, i) {
      b.addEventListener("click", function () { ativar(b); });
      b.addEventListener("keydown", function (ev) {
        var alvo = null;
        if (ev.key === "ArrowRight") alvo = abas[(i + 1) % abas.length];
        if (ev.key === "ArrowLeft") alvo = abas[(i - 1 + abas.length) % abas.length];
        if (alvo) { ev.preventDefault(); ativar(alvo); alvo.focus(); }
      });
    });
  }
})();

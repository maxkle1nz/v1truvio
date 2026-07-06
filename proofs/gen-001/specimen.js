// specimen.js — JS vanilla mínimo (sem libs).
// (1) rito de compra nível 3: clique → leitura de consequência → pausa deliberada → só então abre o link.
// (2) switcher de demonstração dos edge states — ferramenta separada, o template nasce sabendo dos estados.
'use strict';

(function () {
  var veredito = document.getElementById('veredito');
  var rito = document.getElementById('rito');
  var ritoConseq = document.getElementById('rito-consequencia');
  var ritoSair = document.getElementById('ritoSair');
  var ritoPausa = document.getElementById('ritoPausa');
  var ritoVoltar = document.getElementById('ritoVoltar');
  var ritoFundo = document.getElementById('ritoFundo');
  var btnCompra = document.getElementById('btnCompra');
  var ultimoFoco = null;
  var timer = null;

  // ---- Rito de compra (Stuart Hall: consequência ANTES da ação; Détournement: o link vira passagem) ----
  function abrirRito() {
    var preco = veredito.getAttribute('data-preco');
    var piso = parseInt(veredito.getAttribute('data-piso'), 10);
    var rota = veredito.getAttribute('data-rota');
    var link = veredito.getAttribute('data-link');
    var delta = parseInt(preco, 10) - piso;
    var deltaTxt = delta === 0 ? 'no seu piso histórico'
      : (delta > 0 ? '€' + delta + ' acima do seu piso' : '€' + Math.abs(delta) + ' abaixo do seu piso');

    ritoConseq.innerHTML =
      '<span class="v1t-num">€' + preco + '</span> ' + rota +
      ' · <span class="v1t-sub">' + deltaTxt + '</span>' +
      ' · <span class="v1t-sub">você sairá para o Google Flights para confirmar.</span>';

    var offline = (typeof navigator !== 'undefined' && navigator.onLine === false);
    rito.setAttribute('data-offline', offline ? 'true' : 'false');

    ritoSair.setAttribute('href', link);
    // pausa deliberada de meio-segundo — troca clique-reflexo por escolha (não é modal de senha)
    ritoSair.setAttribute('aria-disabled', 'true');
    ritoPausa.textContent = 'um instante…';
    if (timer) { clearTimeout(timer); }
    timer = setTimeout(function () {
      ritoSair.setAttribute('aria-disabled', 'false');
      ritoPausa.textContent = offline ? 'sem conexão' : 'pronto — saída consciente';
      try { ritoSair.focus(); } catch (e) {}
    }, 500);

    ultimoFoco = document.activeElement;
    rito.setAttribute('data-aberto', 'true');
    try { ritoVoltar.focus(); } catch (e) {}
  }

  function fecharRito() {
    if (timer) { clearTimeout(timer); timer = null; }
    rito.removeAttribute('data-aberto');
    if (ultimoFoco && ultimoFoco.focus) { try { ultimoFoco.focus(); } catch (e) {} }
  }

  if (btnCompra) {
    btnCompra.addEventListener('click', function (ev) {
      ev.preventDefault();
      abrirRito();
    });
  }
  if (ritoVoltar) { ritoVoltar.addEventListener('click', fecharRito); }
  if (ritoFundo) { ritoFundo.addEventListener('click', fecharRito); }
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && rito.getAttribute('data-aberto') === 'true') { fecharRito(); }
  });
  // saída consciente: quando o operador confirma, fecha o rito e deixa o link (target=_blank) abrir
  if (ritoSair) {
    ritoSair.addEventListener('click', function (ev) {
      if (ritoSair.getAttribute('aria-disabled') === 'true') { ev.preventDefault(); return; }
      setTimeout(fecharRito, 0);
    });
  }

  // ---- Switcher de demonstração dos edge states ----
  var etiqueta = document.getElementById('veredito-etiqueta');
  var precoEl = document.getElementById('veredito-preco');
  var tela = document.getElementById('tela');
  var nota = document.getElementById('notaEstado');
  var historico = document.getElementById('historico');
  var distancia = document.getElementById('distancia');
  var tendencia = document.getElementById('tendencia');
  var tendSeta = document.getElementById('tendencia-seta');
  var tendRotulo = document.getElementById('tendencia-rotulo');
  var tendNota = document.getElementById('tendencia-nota');
  var selo = document.getElementById('selo');
  var seloEstado = document.getElementById('selo-estado');

  // estado real de hoje, para restaurar
  var BASE = {
    veredito: 'em-alvo', etiqueta: 'Em alvo', preco: '€948', precoAttr: '948',
    historico: 'acima-do-piso', distancia: '+€36',
    tendencia: 'estavel', seta: '→', tendRotulo: 'Estável',
    tendNota: 'mercado agregado · +0,02 %/hora · não é a tendência desta rota específica',
    confianca: 'confiavel', seloEstado: 'Confiável',
    nota: null
  };

  function aplicarBase() {
    veredito.setAttribute('data-estado', BASE.veredito);
    etiqueta.textContent = BASE.etiqueta;
    precoEl.textContent = BASE.preco;
    veredito.setAttribute('data-preco', BASE.precoAttr);
    historico.setAttribute('data-estado', BASE.historico);
    distancia.textContent = BASE.distancia;
    tendencia.setAttribute('data-estado', BASE.tendencia);
    tendSeta.textContent = BASE.seta;
    tendRotulo.textContent = BASE.tendRotulo;
    tendNota.textContent = BASE.tendNota;
    selo.setAttribute('data-confianca', BASE.confianca);
    seloEstado.textContent = BASE.seloEstado;
    setNota(null);
  }

  function setNota(txt, tom) {
    if (!txt) { nota.setAttribute('hidden', ''); nota.textContent = ''; nota.removeAttribute('data-tom'); return; }
    nota.removeAttribute('hidden');
    nota.textContent = txt;
    if (tom) { nota.setAttribute('data-tom', tom); } else { nota.removeAttribute('data-tom'); }
  }

  var ESTADOS = {
    'em-alvo': function () { aplicarBase(); },

    'acima-do-alvo': function () {
      aplicarBase();
      veredito.setAttribute('data-estado', 'acima-do-alvo');
      etiqueta.textContent = 'Acima do alvo';
      precoEl.textContent = '€988';
      veredito.setAttribute('data-preco', '988');
      distancia.textContent = '+€76';
      setNota('Estado de demonstração: preço acima do alvo €960 — a fresta apaga, não é hora.');
    },

    'novo-piso': function () {
      aplicarBase();
      veredito.setAttribute('data-estado', 'novo-piso');
      etiqueta.textContent = 'Novo piso';
      precoEl.textContent = '€889';
      veredito.setAttribute('data-preco', '889');
      historico.setAttribute('data-estado', 'novo-piso');
      distancia.textContent = '−€23 do piso anterior';
      setNota('Estado de demonstração: preço abaixo da mínima histórica €912 — o achado raro que a bancada existe para pegar.');
    },

    'amostra-ruido': function () {
      aplicarBase();
      tendencia.setAttribute('data-estado', 'indefinida');
      tendSeta.textContent = '·';
      tendRotulo.textContent = 'Indefinida';
      tendNota.textContent = 'padrão ainda é ruído — sinal confiável em ~5-7 dias';
      selo.setAttribute('data-confianca', 'ruido');
      seloEstado.textContent = 'Ruído — amostra curta';
      setNota('Estado de demonstração: <48h de dados — o preço é real, mas a tendência e o piso ainda não têm sinal.');
    },

    'desatualizado': function () {
      aplicarBase();
      veredito.setAttribute('data-estado', 'acima-do-alvo');
      etiqueta.textContent = 'Sem leitura atual';
      selo.setAttribute('data-confianca', 'desatualizado');
      seloEstado.textContent = 'Desatualizado';
      tendencia.setAttribute('data-estado', 'indefinida');
      tendSeta.textContent = '·';
      tendRotulo.textContent = 'Indefinida';
      tendNota.textContent = 'a varredura falhou — tendência não confiável';
      setNota('Estado de demonstração: última leitura há 6h — a varredura falhou. O veredito fica neutro, nunca em alvo.', 'atencao');
    },

    'vazio': function () {
      aplicarBase();
      veredito.setAttribute('data-estado', 'sem-dado');
      etiqueta.textContent = 'Sem dado';
      precoEl.textContent = '— · —';
      veredito.setAttribute('data-preco', '0');
      selo.setAttribute('data-confianca', 'ruido');
      seloEstado.textContent = 'Ruído — primeira varredura';
      tendencia.setAttribute('data-estado', 'indefinida');
      tendSeta.textContent = '·';
      tendRotulo.textContent = 'Indefinida';
      tendNota.textContent = 'a bancada ainda não coletou';
      setNota('Estado de demonstração: primeira execução — a bancada ainda não coletou. Sem veredito falso.');
    },

    'offline': function () {
      aplicarBase();
      setNota('Estado de demonstração: sem rede — o relatório lê normal (arquivo local). Só o gesto de compra avisa que precisa de conexão.', 'atencao');
    }
  };

  var botoes = document.querySelectorAll('#demoBotoes .v1t-demo__botao');
  Array.prototype.forEach.call(botoes, function (b) {
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(botoes, function (o) { o.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var fn = ESTADOS[b.getAttribute('data-estado')];
      if (fn) { fn(); }
    });
  });
})();

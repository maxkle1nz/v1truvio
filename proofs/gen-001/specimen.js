// specimen.js — JS vanilla mínimo (sem libs).
// (1) rito de compra nível 3: clique → leitura de consequência → pausa deliberada → só então abre o link.
// (2) switcher de demonstração dos edge states — ferramenta separada; o template nasce sabendo dos estados.
//     Na assinatura formal os estados são GEOMETRIA: o pino re-crava em x(preço), o entalhe do piso
//     desloca no novo piso, a fenda sela acima do alvo, a régua nasce mínima no vazio.
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

  // ---- Rito de compra (Stuart Hall: consequência ANTES da ação; o link vira passagem) ----
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
  if (ritoSair) {
    ritoSair.addEventListener('click', function (ev) {
      if (ritoSair.getAttribute('aria-disabled') === 'true') { ev.preventDefault(); return; }
      setTimeout(fecharRito, 0);
    });
  }

  // ---- Switcher de demonstração dos edge states (a geometria segue o dado) ----
  var tela = document.getElementById('tela');
  var etiqueta = document.getElementById('veredito-etiqueta');
  var precoEl = document.getElementById('veredito-preco');
  var corredor = document.getElementById('veredito-corredor');
  var nota = document.getElementById('notaEstado');
  var entalhePiso = document.getElementById('entalhe-piso');
  var rotuloPiso = document.getElementById('rotulo-piso');
  var tendencia = document.getElementById('tendencia');
  var tendSeta = document.getElementById('tendencia-seta');
  var tendRotulo = document.getElementById('tendencia-rotulo');
  var tendNota = document.getElementById('tendencia-nota');
  var selo = document.getElementById('selo');
  var seloEstado = document.getElementById('selo-estado');

  // estado real de hoje (a tela provada), para restaurar
  var BASE = {
    vista: 'em-alvo', estado: 'em-alvo', etiqueta: 'Em alvo',
    preco: '€948', precoNum: '948',
    corredor: '<span class="v1t-num">+€36</span> do piso · <span class="v1t-num">€12</span> do alvo',
    piso: '912', pisoRotulo: 'piso <span class="v1t-num">€912</span>',
    tendencia: 'estavel', seta: '→', tendRotulo: 'Estável',
    tendNota: 'mercado agregado · +0,02 %/hora · não é a tendência desta rota',
    confianca: 'confiavel', seloEstado: 'Confiável'
  };

  function aplicar(cfg) {
    tela.setAttribute('data-vista', cfg.vista);
    veredito.setAttribute('data-estado', cfg.estado);
    veredito.style.setProperty('--preco', cfg.precoNum);
    veredito.setAttribute('data-preco', cfg.precoNum);
    etiqueta.textContent = cfg.etiqueta;
    precoEl.textContent = cfg.preco;
    corredor.innerHTML = cfg.corredor;
    entalhePiso.style.setProperty('--preco', cfg.piso);
    rotuloPiso.style.setProperty('--preco', cfg.piso);
    rotuloPiso.innerHTML = cfg.pisoRotulo;
    tendencia.setAttribute('data-estado', cfg.tendencia);
    tendSeta.textContent = cfg.seta;
    tendRotulo.textContent = cfg.tendRotulo;
    tendNota.textContent = cfg.tendNota;
    selo.setAttribute('data-confianca', cfg.confianca);
    seloEstado.textContent = cfg.seloEstado;
  }

  function setNota(txt, tom) {
    if (!txt) { nota.setAttribute('hidden', ''); nota.textContent = ''; nota.removeAttribute('data-tom'); return; }
    nota.removeAttribute('hidden');
    nota.textContent = txt;
    if (tom) { nota.setAttribute('data-tom', tom); } else { nota.removeAttribute('data-tom'); }
  }

  function clonar(over) {
    var cfg = {};
    for (var k in BASE) { cfg[k] = BASE[k]; }
    for (var j in over) { cfg[j] = over[j]; }
    return cfg;
  }

  var ESTADOS = {
    'em-alvo': function () { aplicar(BASE); setNota(null); },

    'acima-do-alvo': function () {
      aplicar(clonar({
        vista: 'acima-do-alvo', estado: 'acima-do-alvo', etiqueta: 'Acima do alvo',
        preco: '€988', precoNum: '988',
        corredor: '<span class="v1t-num">+€76</span> do piso · <span class="v1t-num">€28</span> além do alvo'
      }));
      setNota('Estado de demonstração: €988 > alvo €960 — a fenda SELA, o pino cruza para o lado caro, a placa recua (rasa, sem sombra).');
    },

    'novo-piso': function () {
      aplicar(clonar({
        vista: 'novo-piso', estado: 'novo-piso', etiqueta: 'Novo piso',
        preco: '€889', precoNum: '889',
        corredor: '<span class="v1t-num">−€23</span> do piso anterior · <span class="v1t-num">€71</span> do alvo',
        piso: '889', pisoRotulo: 'piso <span class="v1t-num">€889</span>'
      }));
      setNota('Estado de demonstração: €889 < mínima €912 — o entalhe do piso DESLOCA junto com o pino; a luz máxima derrama mais fundo.');
    },

    'amostra-ruido': function () {
      aplicar(clonar({
        tendencia: 'indefinida', seta: '·', tendRotulo: 'Indefinida',
        tendNota: 'padrão ainda é ruído — sinal confiável em ~5-7 dias',
        confianca: 'ruido', seloEstado: 'Ruído — amostra curta'
      }));
      setNota('Estado de demonstração: <48h de dados — o preço é real, mas tendência e piso ainda não têm sinal.');
    },

    'desatualizado': function () {
      aplicar(clonar({
        vista: 'desatualizado', estado: 'acima-do-alvo', etiqueta: 'Sem leitura atual',
        tendencia: 'indefinida', seta: '·', tendRotulo: 'Indefinida',
        tendNota: 'a varredura falhou — tendência não confiável',
        confianca: 'desatualizado', seloEstado: 'Desatualizado'
      }));
      setNota('Estado de demonstração: última leitura há 6h — a varredura falhou. Fenda selada, veredito neutro, pulso parado.', 'atencao');
    },

    'vazio': function () {
      aplicar(clonar({
        vista: 'vazio', estado: 'sem-dado', etiqueta: 'Sem dado',
        preco: '— · —', precoNum: '0',
        corredor: 'a bancada ainda não coletou — primeira varredura em curso',
        tendencia: 'indefinida', seta: '·', tendRotulo: 'Indefinida',
        tendNota: 'a bancada ainda não coletou',
        confianca: 'ruido', seloEstado: 'Ruído — primeira varredura'
      }));
      setNota('Estado de demonstração: primeira execução — a régua nasce só com a config (sem fantasma/piso), a placa não finge coordenada. Sem veredito falso.');
    },

    'offline': function () {
      aplicar(BASE);
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

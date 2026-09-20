/* ============================================================
   VIENA RESIDENCES — Sección "Disponibilidad"
   Módulo autocontenido, sin dependencias.
   Lee window.VIENA_DATA (assets/js/data.js) y pinta:
     · resumen de inventario
     · selector de nivel (torre)
     · filtros + orden + vista tarjetas/tabla
     · modal de detalle con esquema de pago
   Expone window.VienaAvailability = { seleccionar(id) }.
   ============================================================ */
(function () {
  'use strict';

  var DATA = window.VIENA_DATA;
  var section = document.getElementById('disponibilidad');
  if (!DATA || !section) return;

  var CFG = DATA.config || {};
  var UNIDADES = Array.isArray(DATA.unidades) ? DATA.unidades : [];
  var NIVELES = Array.isArray(DATA.niveles) ? DATA.niveles : [];

  var ESTADOS = {
    disponible: 'Disponible',
    apartado: 'Apartado',
    vendido: 'Vendido'
  };

  /* ---------- Utilidades ---------- */

  var fmtMoneda = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: CFG.moneda || 'MXN',
    maximumFractionDigits: 0
  });

  function money(n) { return fmtMoneda.format(Math.round(n)); }

  function m2(n) {
    return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(n) + ' m²';
  }

  function nivelLabel(id) {
    for (var i = 0; i < NIVELES.length; i++) {
      if (NIVELES[i].id === id) return NIVELES[i].label;
    }
    return 'Nivel ' + id;
  }

  function superficie(u) { return (u.interior || 0) + (u.terraza || 0); }

  /* Precio vigente: aplica descuento sólo a unidades disponibles. */
  function tieneDescuento(u) {
    return !!CFG.descuento && CFG.descuento > 0 && u.estado === 'disponible';
  }
  function precioVigente(u) {
    return tieneDescuento(u) ? u.precio * (1 - CFG.descuento) : u.precio;
  }

  function recamarasTexto(u) {
    var r = u.recamaras === 1 ? '1 recámara' : u.recamaras + ' recámaras';
    var b = u.banos === 1 ? '1 baño' : u.banos + ' baños';
    return r + ' · ' + b;
  }

  /* Versión corta para la tabla, donde el ancho de columna es escaso. */
  function recamarasCorto(u) {
    return u.recamaras + ' rec · ' + u.banos + (u.banos === 1 ? ' baño' : ' baños');
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function el(id) { return document.getElementById(id); }

  /* ---------- Estado de la interfaz ---------- */

  var state = {
    tipo: 'todas',      // 'todas' | '1' | '2' | '3'
    nivel: 'todos',     // 'todos' | <id de nivel>
    estado: 'todos',    // 'todos' | 'disponible' | 'apartado' | 'vendido'
    orden: 'nivel-asc',
    vista: 'tarjetas'   // 'tarjetas' | 'tabla'
  };

  var DEFAULTS = JSON.parse(JSON.stringify(state));

  function hayFiltros() {
    return state.tipo !== DEFAULTS.tipo ||
           state.nivel !== DEFAULTS.nivel ||
           state.estado !== DEFAULTS.estado ||
           state.orden !== DEFAULTS.orden;
  }

  /* ---------- Filtrado y orden ---------- */

  function filtrar() {
    return UNIDADES.filter(function (u) {
      if (state.tipo !== 'todas' && String(u.recamaras) !== state.tipo) return false;
      if (state.nivel !== 'todos' && String(u.nivel) !== String(state.nivel)) return false;
      if (state.estado !== 'todos' && u.estado !== state.estado) return false;
      return true;
    });
  }

  var ORDENES = {
    'nivel-asc':  function (a, b) { return a.nivel - b.nivel || String(a.id).localeCompare(String(b.id), 'es'); },
    'nivel-desc': function (a, b) { return b.nivel - a.nivel || String(a.id).localeCompare(String(b.id), 'es'); },
    'precio-asc':  function (a, b) { return precioVigente(a) - precioVigente(b); },
    'precio-desc': function (a, b) { return precioVigente(b) - precioVigente(a); },
    'sup-asc':  function (a, b) { return superficie(a) - superficie(b); },
    'sup-desc': function (a, b) { return superficie(b) - superficie(a); },
    'id-asc':  function (a, b) { return String(a.id).localeCompare(String(b.id), 'es'); },
    'id-desc': function (a, b) { return String(b.id).localeCompare(String(a.id), 'es'); }
  };

  function ordenar(lista) {
    var fn = ORDENES[state.orden] || ORDENES['nivel-asc'];
    return lista.slice().sort(fn);
  }

  /* ---------- Encabezado: etapa y promoción ---------- */

  function pintarEncabezado() {
    var etapa = el('av-etapa');
    if (etapa && CFG.etapa) etapa.textContent = CFG.etapa;

    var promo = el('av-promo');
    if (!promo) return;

    var partes = [];
    if (CFG.descuento > 0) partes.push(Math.round(CFG.descuento * 100) + '% de descuento');
    if (CFG.plan && CFG.plan.nombre) partes.push(CFG.plan.nombre);
    if (!partes.length) { promo.hidden = true; return; }

    promo.hidden = false;
    promo.innerHTML =
      '<span class="av-promo-title">' + esc(partes.join(' · ')) + '</span>' +
      '<span class="av-promo-sub">' +
        esc(CFG.entregaEstimada || 'Vigente durante la etapa actual de venta.') +
      '</span>';
  }

  /* ---------- Resumen ---------- */

  function pintarStats() {
    var cont = el('av-stats');
    if (!cont) return;

    var conteo = { disponible: 0, apartado: 0, vendido: 0 };
    UNIDADES.forEach(function (u) {
      if (conteo[u.estado] !== undefined) conteo[u.estado]++;
    });

    var filas = [
      { k: 'total', n: UNIDADES.length, l: 'Residencias' },
      { k: 'disponible', n: conteo.disponible, l: 'Disponibles' },
      { k: 'apartado', n: conteo.apartado, l: 'Apartadas' },
      { k: 'vendido', n: conteo.vendido, l: 'Vendidas' }
    ];

    cont.innerHTML = filas.map(function (f) {
      var dot = f.k === 'total' ? '' : '<i class="dot dot-' + f.k + '" aria-hidden="true"></i>';
      return '<li data-k="' + f.k + '">' +
               '<span class="av-stat-n">' + dot + f.n + '</span>' +
               '<span class="av-stat-l">' + f.l + '</span>' +
             '</li>';
    }).join('');
  }

  /* ---------- Torre ---------- */

  function pintarTorre() {
    var cont = el('av-tower');
    if (!cont) return;

    var html = '<button type="button" class="av-floor" data-nivel="todos" aria-pressed="' +
               (state.nivel === 'todos') + '">' +
                 '<span class="av-floor-label">Todos los niveles</span>' +
                 '<span class="av-floor-dots">' + String(UNIDADES.length) + '</span>' +
               '</button>';

    html += NIVELES.map(function (nv) {
      var unidades = UNIDADES.filter(function (u) { return u.nivel === nv.id; });
      if (!unidades.length) return '';
      var dots = unidades
        .slice()
        .sort(function (a, b) { return String(a.id).localeCompare(String(b.id), 'es'); })
        .map(function (u) {
          return '<i class="dot dot-' + u.estado + '" title="' +
                 esc(u.id + ' — ' + (ESTADOS[u.estado] || u.estado)) + '"></i>';
        }).join('');

      var disp = unidades.filter(function (u) { return u.estado === 'disponible'; }).length;
      var titulo = nv.label + ': ' + unidades.length + ' unidades, ' + disp + ' disponibles' +
                   (nv.nota ? ' — ' + nv.nota : '');

      return '<button type="button" class="av-floor" data-nivel="' + esc(nv.id) +
             '" aria-pressed="' + (String(state.nivel) === String(nv.id)) +
             '" title="' + esc(titulo) + '">' +
               '<span class="av-floor-label">' + esc(nv.label) + '</span>' +
               '<span class="av-floor-dots" aria-hidden="true">' + dots + '</span>' +
             '</button>';
    }).join('');

    cont.innerHTML = html;
  }

  function actualizarTorre() {
    var botones = el('av-tower');
    if (!botones) return;
    Array.prototype.forEach.call(botones.querySelectorAll('.av-floor'), function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.nivel === String(state.nivel)));
    });
  }

  /* ---------- Vista: tarjetas ---------- */

  function tarjeta(u) {
    var gone = u.estado !== 'disponible';
    var desc = tieneDescuento(u);

    var precioHTML;
    if (u.estado === 'vendido') {
      precioHTML = '<span class="uv-price-gone">Vendida</span>';
    } else if (u.estado === 'apartado') {
      precioHTML = '<span class="uv-price-gone">Apartada</span>';
    } else {
      precioHTML =
        (desc ? '<span class="uv-price-list">' + money(u.precio) + '</span>' : '') +
        '<span class="uv-price-now">' + money(precioVigente(u)) + '</span>' +
        (desc ? '<span class="uv-price-tag">Precio ' + esc(CFG.etapa || 'de etapa') + '</span>' : '');
    }

    var acciones =
      '<button type="button" class="btn btn-ghost btn-sm" data-detalle="' + esc(u.id) + '">Ver detalle</button>' +
      (u.estado === 'disponible'
        ? '<button type="button" class="btn btn-clay btn-sm" data-cotizar="' + esc(u.id) + '">Me interesa</button>'
        : '');

    return '' +
      '<article class="uv-card' + (gone ? ' is-gone' : '') + '">' +
        '<div class="uv-top">' +
          '<div>' +
            '<span class="uv-id">' + esc(u.id) + '</span>' +
            '<span class="uv-level">' + esc(nivelLabel(u.nivel)) + '</span>' +
          '</div>' +
          '<span class="pill pill-' + u.estado + '">' + esc(ESTADOS[u.estado] || u.estado) + '</span>' +
        '</div>' +
        '<p class="uv-type">' + esc(recamarasTexto(u)) + ' · ' + esc(u.vista || '') + '</p>' +
        '<ul class="uv-specs">' +
          '<li><span class="uv-spec-l">Interior</span><span class="uv-spec-v">' + m2(u.interior) + '</span></li>' +
          '<li><span class="uv-spec-l">Terraza</span><span class="uv-spec-v">' + m2(u.terraza) + '</span></li>' +
          '<li><span class="uv-spec-l">Total</span><span class="uv-spec-v">' + m2(superficie(u)) + '</span></li>' +
        '</ul>' +
        '<div class="uv-price">' + precioHTML + '</div>' +
        '<div class="uv-actions">' + acciones + '</div>' +
      '</article>';
  }

  function vistaTarjetas(lista) {
    return '<div class="av-grid">' + lista.map(tarjeta).join('') + '</div>';
  }

  /* ---------- Vista: tabla ---------- */

  var COLUMNAS = [
    { th: 'Unidad',   key: 'id',     cls: 'col-id' },
    { th: 'Nivel',    key: null,     cls: 'col-lvl' },
    { th: 'Tipo',     key: null,     cls: 'col-tipo' },
    { th: 'Interior', key: null,     cls: 'col-num' },
    { th: 'Terraza',  key: null,     cls: 'col-num' },
    { th: 'Total',    key: 'sup',    cls: 'col-num' },
    { th: 'Precio',   key: 'precio', cls: 'col-price' },
    { th: 'Estado',   key: null,     cls: '' },
    { th: '',         key: null,     cls: 'col-act' }
  ];

  function dirDe(key) {
    if (state.orden === key + '-asc') return 'asc';
    if (state.orden === key + '-desc') return 'desc';
    return '';
  }

  function vistaTabla(lista) {
    var head = COLUMNAS.map(function (c) {
      if (!c.key) return '<th scope="col" class="' + c.cls + '">' + esc(c.th) + '</th>';
      var dir = dirDe(c.key);
      return '<th scope="col" class="' + c.cls + '" aria-sort="' +
             (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') + '">' +
               '<button type="button" class="th-sort" data-sort="' + c.key + '" data-dir="' + dir + '">' +
                 esc(c.th) + '<span class="arrow" aria-hidden="true">▲</span>' +
               '</button>' +
             '</th>';
    }).join('');

    var body = lista.map(function (u) {
      var desc = tieneDescuento(u);
      var precio = u.estado === 'disponible'
        ? (desc ? '<s>' + money(u.precio) + '</s><br>' + money(precioVigente(u)) : money(precioVigente(u)))
        : '—';
      var accion = u.estado === 'disponible'
        ? '<button type="button" class="btn btn-clay btn-sm" data-cotizar="' + esc(u.id) + '">Cotizar</button>'
        : '<button type="button" class="btn btn-ghost btn-sm" data-detalle="' + esc(u.id) + '">Detalle</button>';

      return '<tr class="' + (u.estado === 'disponible' ? '' : 'is-gone') + '">' +
        '<td class="col-id" data-th="Unidad"><button type="button" class="link-btn" data-detalle="' + esc(u.id) + '">' + esc(u.id) + '</button></td>' +
        '<td class="col-lvl" data-th="Nivel">' + esc(nivelLabel(u.nivel)) + '</td>' +
        '<td class="col-tipo" data-th="Tipo">' + esc(recamarasCorto(u)) + '</td>' +
        '<td class="col-num" data-th="Interior">' + m2(u.interior) + '</td>' +
        '<td class="col-num" data-th="Terraza">' + m2(u.terraza) + '</td>' +
        '<td class="col-num" data-th="Total">' + m2(superficie(u)) + '</td>' +
        '<td class="col-price" data-th="Precio">' + precio + '</td>' +
        '<td data-th="Estado"><span class="pill pill-' + u.estado + '">' + esc(ESTADOS[u.estado] || u.estado) + '</span></td>' +
        '<td class="col-act">' + accion + '</td>' +
      '</tr>';
    }).join('');

    return '<div class="av-table-wrap">' +
      '<table class="av-table">' +
        '<caption>Inventario de Viena Residences.' + '<span class="av-hint"> Toca el encabezado de una columna para ordenar.</span></caption>' +
        '<thead><tr>' + head + '</tr></thead>' +
        '<tbody>' + body + '</tbody>' +
      '</table></div>';
  }

  /* ---------- Render principal ---------- */

  function render() {
    var lista = ordenar(filtrar());
    var cont = el('av-results');
    var count = el('av-count');
    var reset = el('av-reset');

    if (count) {
      var disp = lista.filter(function (u) { return u.estado === 'disponible'; }).length;
      count.innerHTML = lista.length === 0
        ? 'Ninguna unidad coincide con tu búsqueda'
        : '<b>' + lista.length + '</b> ' + (lista.length === 1 ? 'unidad' : 'unidades') +
          ' · <b>' + disp + '</b> ' + (disp === 1 ? 'disponible' : 'disponibles');
    }

    if (reset) reset.hidden = !hayFiltros();

    if (!cont) return;

    if (!lista.length) {
      cont.innerHTML =
        '<div class="av-empty">' +
          '<strong>Sin coincidencias</strong>' +
          '<p>Ajusta los filtros o <button type="button" class="link-btn" id="av-empty-reset">míralas todas</button>. ' +
          'Si buscas algo en particular, <a href="#contacto">escríbenos</a> y te avisamos cuando se libere.</p>' +
        '</div>';
      var b = el('av-empty-reset');
      if (b) b.addEventListener('click', limpiar);
      return;
    }

    cont.innerHTML = state.vista === 'tabla' ? vistaTabla(lista) : vistaTarjetas(lista);
  }

  function limpiar() {
    state.tipo = DEFAULTS.tipo;
    state.nivel = DEFAULTS.nivel;
    state.estado = DEFAULTS.estado;
    state.orden = DEFAULTS.orden;
    sincronizarControles();
    actualizarTorre();
    render();
  }

  function sincronizarControles() {
    Array.prototype.forEach.call(section.querySelectorAll('.chip[data-tipo]'), function (c) {
      var on = c.dataset.tipo === state.tipo;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', String(on));
    });
    var fe = el('f-estado'); if (fe) fe.value = state.estado;
    var fo = el('f-orden');  if (fo) fo.value = state.orden;
  }

  /* ---------- Modal de detalle ---------- */

  var modal = null;
  var ultimoFoco = null;

  function planPago(u) {
    var plan = CFG.plan || {};
    var total = precioVigente(u);
    var apartado = Math.min(plan.apartado || 0, total);
    var enganche = total * (plan.enganche || 0);
    var entrega = total * (plan.contraEntrega || 0);

    var filas = [];
    if (apartado > 0) filas.push(['Apartado', money(apartado)]);
    if (plan.enganche) {
      filas.push([
        'Enganche ' + Math.round(plan.enganche * 100) + '%' + (apartado > 0 ? ' (menos apartado)' : ''),
        money(Math.max(enganche - apartado, 0))
      ]);
    }
    if (plan.contraEntrega) {
      filas.push(['Contra entrega ' + Math.round(plan.contraEntrega * 100) + '%', money(entrega)]);
    }

    return '' +
      '<div class="uv-plan">' +
        '<h4>' + esc(plan.nombre || 'Esquema de pago') + '</h4>' +
        '<table class="uv-table"><tbody>' +
          filas.map(function (f) {
            return '<tr><th scope="row">' + esc(f[0]) + '</th><td>' + f[1] + '</td></tr>';
          }).join('') +
          '<tr class="is-total"><th scope="row">Total</th><td>' + money(total) + '</td></tr>' +
        '</tbody></table>' +
        '<p class="uv-plan-note">Cifras de referencia calculadas sobre el precio vigente. ' +
        'No incluyen gastos de escrituración, impuestos ni cuotas de mantenimiento. ' +
        'El esquema definitivo se formaliza en el contrato.</p>' +
      '</div>';
  }

  function contenidoModal(u) {
    var desc = tieneDescuento(u);

    var precioHTML = u.estado === 'disponible'
      ? '<tr' + (desc ? '' : ' class="is-total"') + '><th scope="row">Precio de lista</th><td>' + money(u.precio) + '</td></tr>' +
        (desc ? '<tr class="is-total"><th scope="row">Precio ' + esc(CFG.etapa || 'vigente') +
                ' (−' + Math.round(CFG.descuento * 100) + '%)</th><td>' + money(precioVigente(u)) + '</td></tr>' : '')
      : '';

    return '' +
      '<div class="uv-modal-head">' +
        '<span class="uv-modal-id">' + esc(u.id) + '</span>' +
        '<span class="pill pill-' + u.estado + '">' + esc(ESTADOS[u.estado] || u.estado) + '</span>' +
      '</div>' +
      '<p class="uv-modal-sub">' + esc(nivelLabel(u.nivel)) + ' · ' + esc(recamarasTexto(u)) +
        (u.vista ? ' · ' + esc(u.vista) : '') + '</p>' +

      '<table class="uv-table"><tbody>' +
        '<tr><th scope="row">Superficie interior</th><td>' + m2(u.interior) + '</td></tr>' +
        '<tr><th scope="row">Terraza</th><td>' + m2(u.terraza) + '</td></tr>' +
        '<tr' + (u.estado === 'disponible' ? '' : ' class="is-total"') + '><th scope="row">Superficie total</th><td>' + m2(superficie(u)) + '</td></tr>' +
        precioHTML +
      '</tbody></table>' +

      (u.estado === 'disponible' ? planPago(u) : '') +

      '<div class="uv-modal-actions">' +
        (u.estado === 'disponible'
          ? '<button type="button" class="btn btn-clay" data-cotizar="' + esc(u.id) + '">Me interesa esta unidad</button>'
          : '<a class="btn btn-clay" href="#contacto" data-cerrar-modal>Avísenme si se libera</a>') +
        '<button type="button" class="btn btn-ghost" data-cerrar-modal>Cerrar</button>' +
      '</div>';
  }

  function crearModal() {
    modal = document.createElement('div');
    modal.className = 'uv-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Detalle de la unidad');
    modal.innerHTML =
      '<div class="uv-modal-scrim" data-cerrar-modal></div>' +
      '<div class="uv-modal-panel">' +
        '<button type="button" class="uv-modal-close" data-cerrar-modal aria-label="Cerrar">✕</button>' +
        '<div class="uv-modal-body"></div>' +
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-cerrar-modal]')) cerrarModal();
    });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); cerrarModal(); return; }
      if (e.key !== 'Tab') return;
      var focusables = modal.querySelectorAll('button,[href],select,input,textarea');
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function abrirModal(id) {
    var u = UNIDADES.filter(function (x) { return String(x.id) === String(id); })[0];
    if (!u) return;
    if (!modal) crearModal();

    modal.querySelector('.uv-modal-body').innerHTML = contenidoModal(u);
    modal.setAttribute('aria-label', 'Unidad ' + u.id);
    modal.hidden = false;
    document.body.classList.add('uv-locked');
    ultimoFoco = document.activeElement;
    var close = modal.querySelector('.uv-modal-close');
    if (close) close.focus();
  }

  function cerrarModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('uv-locked');
    if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus();
    ultimoFoco = null;
  }

  /* ---------- Puente con el formulario de contacto ---------- */

  function cotizar(id) {
    cerrarModal();

    var campo = el('form-unidad');
    if (campo) {
      campo.value = id;
      campo.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (CFG.whatsapp) {
      var msg = 'Hola, me interesa la unidad ' + id + ' de Viena Residences. ¿Me comparten más información?';
      window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      return;
    }

    var destino = document.getElementById('contacto');
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(function () {
        var nombre = document.querySelector('#contact-form [name="nombre"]');
        if (nombre) nombre.focus({ preventScroll: true });
      }, 450);
    }
  }

  /* ---------- Eventos ---------- */

  section.addEventListener('click', function (e) {
    var t = e.target;

    var chip = t.closest('.chip[data-tipo]');
    if (chip) { state.tipo = chip.dataset.tipo; sincronizarControles(); render(); return; }

    var piso = t.closest('.av-floor[data-nivel]');
    if (piso) { state.nivel = piso.dataset.nivel; actualizarTorre(); render(); return; }

    var vista = t.closest('.view-btn[data-vista]');
    if (vista) {
      state.vista = vista.dataset.vista;
      Array.prototype.forEach.call(section.querySelectorAll('.view-btn'), function (b) {
        var on = b.dataset.vista === state.vista;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      render();
      return;
    }

    var sort = t.closest('.th-sort[data-sort]');
    if (sort) {
      var key = sort.dataset.sort;
      state.orden = state.orden === key + '-asc' ? key + '-desc' : key + '-asc';
      sincronizarControles();
      render();
      return;
    }

    var det = t.closest('[data-detalle]');
    if (det) { abrirModal(det.dataset.detalle); return; }

    var cot = t.closest('[data-cotizar]');
    if (cot) { cotizar(cot.dataset.cotizar); return; }

    if (t.closest('#av-reset')) { limpiar(); }
  });

  section.addEventListener('change', function (e) {
    if (e.target.id === 'f-estado') { state.estado = e.target.value; render(); }
    if (e.target.id === 'f-orden')  { state.orden = e.target.value; render(); }
  });

  /* ---------- Arranque ---------- */

  pintarEncabezado();
  pintarStats();
  pintarTorre();
  sincronizarControles();
  render();

  /* API mínima para el resto del sitio */
  window.VienaAvailability = {
    seleccionar: function (id) { abrirModal(id); },
    refrescar: function () { pintarStats(); pintarTorre(); render(); }
  };
})();

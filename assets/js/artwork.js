/* ============================================================
   VIENA RESIDENCES — Ilustraciones
   ------------------------------------------------------------
   Escenas de Puerto Vallarta dibujadas en SVG, con la misma
   paleta orgánica del sitio. Sirven de relleno mientras no haya
   fotografía: en cuanto una entrada de `galeria` (data.js) tiene
   `src`, se usa la foto y esto deja de dibujarse.
   ============================================================ */

window.VIENA_ARTE = (function () {
  'use strict';

  var C = {
    arena:   '#F4EEE4',
    arena2:  '#E8DFD1',
    arena3:  '#D8CAB4',
    barro:   '#B4714A',
    barro2:  '#98593A',
    barroCl: '#C68A62',
    olivo:   '#4A5745',
    olivo2:  '#3A4635',
    olivo3:  '#2F3A2C',
    mar:     '#6E8C86',
    mar2:    '#547A74',
    mar3:    '#3E5F5C',
    marCl:   '#9DB5AE'
  };

  /* Envoltura común. `k` hace únicos los ids de gradiente para que
     varias escenas puedan convivir en la misma página. */
  function lienzo(k, defs, cuerpo) {
    return '<svg class="art" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" ' +
           'role="presentation" focusable="false">' +
             '<defs>' + defs + '</defs>' + cuerpo +
           '</svg>';
  }

  function cielo(k, a, b, c) {
    return '<linearGradient id="c' + k + '" x1="0" y1="0" x2="0" y2="1">' +
             '<stop offset="0%" stop-color="' + a + '"/>' +
             '<stop offset="55%" stop-color="' + b + '"/>' +
             '<stop offset="100%" stop-color="' + c + '"/>' +
           '</linearGradient>';
  }

  /* Palmera: tronco curvo y hojas rellenas. x,y = base; s = escala.
     Las hojas van como fronda cerrada (ida por arriba, vuelta por abajo) en
     vez de un solo trazo: de otro modo la copa se ve escuálida. */
  function palmera(x, y, s, color, op) {
    var h = 105 * s;
    var cx = x + 2 * s, cy = y - h;
    var p = '<path d="M' + x + ' ' + y + ' q' + (-7 * s) + ' ' + (-h / 2) + ' ' + (2 * s) + ' ' + (-h) + '" ' +
            'stroke="' + color + '" stroke-width="' + (3.8 * s) + '" fill="none" stroke-linecap="round"/>';
    var hojas = [[-46, -8], [-36, -26], [-14, -38], [12, -38], [34, -26], [46, -6], [-28, 12], [28, 12]];
    for (var i = 0; i < hojas.length; i++) {
      var dx = hojas[i][0] * s, dy = hojas[i][1] * s;
      var tx = cx + dx, ty = cy + dy;
      var mx = cx + dx * 0.5, my = cy + dy * 0.5;
      p += '<path d="M' + cx + ' ' + cy +
             ' Q' + mx + ' ' + (my - 8 * s) + ' ' + tx + ' ' + ty +
             ' Q' + mx + ' ' + (my + 5 * s) + ' ' + cx + ' ' + cy + ' Z" fill="' + color + '"/>';
    }
    p += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (3 * s) + '" fill="' + color + '"/>';
    return '<g opacity="' + (op || 1) + '">' + p + '</g>';
  }

  /* Silueta de persona caminando. */
  function figura(x, y, s, color, op) {
    return '<g opacity="' + (op || 1) + '" fill="' + color + '">' +
      '<circle cx="' + x + '" cy="' + (y - 26 * s) + '" r="' + (4.2 * s) + '"/>' +
      '<path d="M' + (x - 4 * s) + ' ' + (y - 21 * s) + ' h' + (8 * s) + ' l' + (1.5 * s) + ' ' + (11 * s) +
        ' l' + (-4 * s) + ' ' + (10 * s) + ' h' + (-3 * s) + ' l' + (-1 * s) + ' ' + (-9 * s) +
        ' l' + (-3.5 * s) + ' ' + (9 * s) + ' h' + (-3 * s) + ' l' + (2 * s) + ' ' + (-10 * s) + ' z"/>' +
    '</g>';
  }

  /* Bandas de mar con crestas. */
  function mar(y, alto, a, b) {
    var s = '<rect x="0" y="' + y + '" width="400" height="' + alto + '" fill="' + a + '"/>';
    for (var i = 0; i < 5; i++) {
      var yy = y + 6 + i * (alto / 5.5);
      s += '<path d="M' + (-20 + i * 13) + ' ' + yy + ' q22 ' + (-4 - i) + ' 44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0 t44 0" ' +
           'stroke="' + b + '" stroke-width="1.3" fill="none" opacity="' + (0.5 - i * 0.07) + '"/>';
    }
    return s;
  }

  /* Sierra: tres crestas a distintas profundidades. */
  function sierra(y) {
    return '<path d="M0 ' + y + ' L48 ' + (y - 46) + ' L92 ' + (y - 16) + ' L140 ' + (y - 58) +
             ' L196 ' + (y - 12) + ' L244 ' + (y - 40) + ' L300 ' + (y - 8) + ' L348 ' + (y - 34) +
             ' L400 ' + (y - 4) + ' L400 ' + (y + 40) + ' L0 ' + (y + 40) + ' Z" fill="' + C.olivo + '" opacity=".26"/>' +
           '<path d="M0 ' + (y + 6) + ' L60 ' + (y - 22) + ' L118 ' + (y + 2) + ' L180 ' + (y - 28) +
             ' L250 ' + (y + 4) + ' L320 ' + (y - 18) + ' L400 ' + (y + 6) + ' L400 ' + (y + 44) +
             ' L0 ' + (y + 44) + ' Z" fill="' + C.olivo2 + '" opacity=".34"/>';
  }

  var arte = {};

  /* ---------- Playa al atardecer ---------- */
  arte.playa = function () {
    return lienzo('p',
      cielo('p', '#F7DDBB', '#EFB489', '#D98A64') +
      '<linearGradient id="rp" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="' + C.barroCl + '" stop-opacity=".55"/>' +
        '<stop offset="100%" stop-color="' + C.arena2 + '" stop-opacity="0"/></linearGradient>',
      '<rect width="400" height="400" fill="url(#cp)"/>' +
      '<circle cx="268" cy="196" r="34" fill="#F6C98F" opacity=".9"/>' +
      '<circle cx="268" cy="196" r="58" fill="#F6C98F" opacity=".22"/>' +
      sierra(204) +
      mar(228, 78, C.mar2, C.marCl) +
      '<g fill="#F6C98F" opacity=".42">' +
        '<rect x="256" y="240" width="24" height="3"   rx="1.5"/>' +
        '<rect x="248" y="251" width="40" height="3"   rx="1.5"/>' +
        '<rect x="259" y="262" width="18" height="2.5" rx="1.25"/>' +
        '<rect x="244" y="273" width="48" height="3"   rx="1.5"/>' +
        '<rect x="261" y="285" width="14" height="2.5" rx="1.25"/>' +
        '<rect x="250" y="296" width="36" height="2.5" rx="1.25"/>' +
      '</g>' +
      '<path d="M0 306 q100 -14 200 -2 t200 -6 v102 H0 Z" fill="' + C.arena2 + '"/>' +
      '<rect x="0" y="300" width="400" height="14" fill="url(#rp)"/>' +
      '<path d="M0 340 q120 -10 240 0 t160 -4" stroke="' + C.arena3 + '" stroke-width="2" fill="none" opacity=".7"/>' +
      palmera(346, 330, 1.25, C.olivo3, 0.9) +
      palmera(384, 352, 0.95, C.olivo3, 0.75) +
      figura(118, 318, 1, C.olivo3, 0.72) +
      figura(140, 322, 0.88, C.olivo3, 0.55)
    );
  };

  /* ---------- La bahía y la sierra ---------- */
  arte.bahia = function () {
    return lienzo('b',
      cielo('b', '#DCE9E6', '#EBEAE0', '#F4EEE4'),
      '<rect width="400" height="400" fill="url(#cb)"/>' +
      '<circle cx="92" cy="86" r="26" fill="#F2E3C8" opacity=".75"/>' +
      '<path d="M0 214 L54 152 L104 198 L158 130 L214 196 L268 148 L330 200 L400 156 L400 250 L0 250 Z" fill="' + C.olivo + '" opacity=".3"/>' +
      '<path d="M0 232 L70 186 L134 224 L200 180 L268 226 L340 192 L400 228 L400 262 L0 262 Z" fill="' + C.olivo2 + '" opacity=".42"/>' +
      mar(250, 150, C.mar, C.marCl) +
      '<g fill="' + C.olivo3 + '" opacity=".78">' +
        '<path d="M188 292 h40 l-6 12 h-28 z"/><path d="M208 292 V262 l22 26 z"/>' +
      '</g>' +
      '<g fill="' + C.olivo3 + '" opacity=".4">' +
        '<path d="M92 320 h26 l-4 8 h-18 z"/><path d="M105 320 v-20 l14 18 z"/>' +
      '</g>'
    );
  };

  /* ---------- Malecón al anochecer ---------- */
  arte.malecon = function () {
    return lienzo('m',
      cielo('m', '#8E9A8C', '#D8A77E', '#E9C79C'),
      '<rect width="400" height="400" fill="url(#cm)"/>' +
      '<circle cx="312" cy="168" r="22" fill="#F7DEB4" opacity=".85"/>' +
      sierra(190) +
      mar(214, 66, C.mar3, C.mar) +
      '<rect x="0" y="278" width="400" height="122" fill="' + C.arena2 + '"/>' +
      '<rect x="0" y="278" width="400" height="6" fill="' + C.arena3 + '"/>' +
      '<g stroke="' + C.olivo3 + '" stroke-width="2.4" opacity=".8">' +
        '<path d="M56 300 v-52"/><path d="M188 300 v-52"/><path d="M320 300 v-52"/>' +
      '</g>' +
      '<g fill="#F7DEB4" opacity=".9">' +
        '<circle cx="56" cy="244" r="6"/><circle cx="188" cy="244" r="6"/><circle cx="320" cy="244" r="6"/>' +
      '</g>' +
      '<g fill="#F7DEB4" opacity=".2">' +
        '<circle cx="56" cy="244" r="17"/><circle cx="188" cy="244" r="17"/><circle cx="320" cy="244" r="17"/>' +
      '</g>' +
      figura(108, 316, 1.18, C.olivo3, 0.85) +
      figura(134, 320, 1.05, C.olivo3, 0.7) +
      figura(244, 314, 1, C.olivo3, 0.6) +
      palmera(370, 330, 1.1, C.olivo3, 0.8)
    );
  };

  /* ---------- Versalles: calle y gastronomía ---------- */
  arte.versalles = function () {
    var luces = '';
    var px = [42, 92, 142, 192, 242, 292, 342];
    var py = [236, 242, 245, 244, 240, 233, 224];
    for (var i = 0; i < px.length; i++) {
      luces += '<circle cx="' + px[i] + '" cy="' + py[i] + '" r="3.6"/>';
    }
    return lienzo('v',
      cielo('v', '#EFD3AB', '#E3BC92', '#D2A47E'),
      '<rect width="400" height="400" fill="url(#cv)"/>' +
      /* fachadas de la cuadra */
      '<rect x="0"   y="104" width="118" height="192" fill="' + C.arena + '"/>' +
      '<rect x="118" y="138" width="150" height="158" fill="' + C.arena2 + '"/>' +
      '<rect x="268" y="92"  width="132" height="204" fill="' + C.arena + '"/>' +
      '<g fill="' + C.arena3 + '" opacity=".5">' +
        '<rect x="116" y="138" width="4" height="158"/><rect x="266" y="92" width="4" height="204"/>' +
      '</g>' +
      /* ventanas encendidas */
      '<g fill="#F7DEB4" opacity=".9">' +
        '<rect x="22"  y="136" width="26" height="32" rx="3"/><rect x="66"  y="136" width="26" height="32" rx="3"/>' +
        '<rect x="22"  y="188" width="26" height="32" rx="3"/><rect x="66"  y="188" width="26" height="32" rx="3"/>' +
        '<rect x="150" y="168" width="24" height="28" rx="3"/><rect x="196" y="168" width="24" height="28" rx="3"/>' +
        '<rect x="292" y="124" width="26" height="32" rx="3"/><rect x="338" y="124" width="26" height="32" rx="3"/>' +
        '<rect x="292" y="182" width="26" height="32" rx="3"/>' +
      '</g>' +
      /* toldos, ya apoyados en su fachada */
      '<path d="M4 250 h110 l-11 24 H15 Z" fill="' + C.barro + '"/>' +
      '<path d="M122 256 h142 l-11 24 H133 Z" fill="' + C.olivo + '" opacity=".85"/>' +
      '<path d="M272 246 h124 l-11 24 H283 Z" fill="' + C.barroCl + '"/>' +
      /* guirnalda de foquitos */
      '<path d="M8 224 q96 26 190 16 t194 -20" stroke="' + C.olivo3 + '" stroke-width="1" fill="none" opacity=".42"/>' +
      '<g fill="#F7DEB4">' + luces + '</g>' +
      '<g fill="#F7DEB4" opacity=".22">' + luces.replace(/r="3.6"/g, 'r="9"') + '</g>' +
      /* banqueta y terrazas */
      '<rect x="0" y="292" width="400" height="108" fill="' + C.arena2 + '"/>' +
      '<rect x="0" y="288" width="400" height="5" fill="' + C.arena3 + '"/>' +
      '<g fill="' + C.olivo3 + '" opacity=".74">' +
        '<ellipse cx="72" cy="300" rx="19" ry="5"/><rect x="70" y="300" width="4" height="20"/>' +
        '<rect x="54" y="318" width="36" height="3" rx="1.5"/>' +
        '<ellipse cx="206" cy="304" rx="19" ry="5"/><rect x="204" y="304" width="4" height="20"/>' +
        '<rect x="188" y="322" width="36" height="3" rx="1.5"/>' +
        '<ellipse cx="330" cy="299" rx="19" ry="5"/><rect x="328" y="299" width="4" height="20"/>' +
        '<rect x="312" y="317" width="36" height="3" rx="1.5"/>' +
      '</g>' +
      figura(140, 312, 1.05, C.olivo3, 0.6) +
      figura(266, 308, 0.95, C.olivo3, 0.45)
    );
  };

  /* ---------- Marina ---------- */
  arte.marina = function () {
    return lienzo('r',
      cielo('r', '#D9E7E4', '#EDE9DE', '#F4EEE4'),
      '<rect width="400" height="400" fill="url(#cr)"/>' +
      '<circle cx="320" cy="76" r="20" fill="#F2E3C8" opacity=".6"/>' +
      '<path d="M0 206 L70 176 L150 204 L226 178 L300 206 L400 182 L400 236 L0 236 Z" fill="' + C.olivo + '" opacity=".24"/>' +
      '<g stroke="' + C.olivo3 + '" stroke-width="1.8" opacity=".8" fill="none">' +
        '<path d="M70 254 v-84"/><path d="M118 254 v-64"/><path d="M166 254 v-96"/>' +
        '<path d="M232 254 v-72"/><path d="M280 254 v-58"/><path d="M328 254 v-88"/>' +
      '</g>' +
      '<g fill="' + C.arena + '" opacity=".95" stroke="' + C.olivo3 + '" stroke-width="1.2">' +
        '<path d="M166 166 l26 68 h-26 z"/><path d="M328 174 l24 60 h-24 z"/><path d="M70 178 l22 56 h-22 z"/>' +
      '</g>' +
      '<rect x="0" y="252" width="400" height="10" fill="' + C.arena3 + '"/>' +
      mar(262, 138, C.mar, C.marCl) +
      '<g stroke="' + C.arena + '" stroke-width="1.6" opacity=".35">' +
        '<path d="M70 262 v58"/><path d="M166 262 v72"/><path d="M328 262 v62"/>' +
      '</g>'
    );
  };

  /* ---------- Roof: alberca y horizonte ---------- */
  arte.terraza = function () {
    return lienzo('t',
      cielo('t', '#E7D6B8', '#F0E2C8', '#F6EEE0'),
      '<rect width="400" height="400" fill="url(#ct)"/>' +
      '<circle cx="86" cy="80" r="24" fill="#F6D7A8" opacity=".8"/>' +
      sierra(166) +
      mar(196, 44, C.mar2, C.marCl) +
      '<rect x="0" y="240" width="400" height="160" fill="' + C.arena2 + '"/>' +
      '<rect x="0" y="236" width="400" height="6" fill="' + C.arena3 + '"/>' +
      '<rect x="46" y="278" width="308" height="86" rx="10" fill="' + C.mar + '" opacity=".78"/>' +
      '<g stroke="' + C.marCl + '" stroke-width="1.6" fill="none" opacity=".65">' +
        '<path d="M62 300 q24 -6 48 0 t48 0 t48 0 t48 0 t48 0"/>' +
        '<path d="M62 322 q24 -6 48 0 t48 0 t48 0 t48 0 t48 0"/>' +
        '<path d="M62 344 q24 -6 48 0 t48 0 t48 0 t48 0 t48 0"/>' +
      '</g>' +
      '<g fill="' + C.arena + '" stroke="' + C.arena3 + '" stroke-width="1">' +
        '<path d="M60 268 h44 l-6 -16 h-32 z"/><path d="M118 268 h44 l-6 -16 h-32 z"/>' +
      '</g>' +
      palmera(366, 272, 1.15, C.olivo2, 0.85) +
      palmera(24, 276, 0.9, C.olivo2, 0.6)
    );
  };

  return arte;
})();

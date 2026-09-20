/* ============================================================
   VIENA RESIDENCES — Comportamiento general del sitio
   (navegación, scrollspy, formulario de contacto)
   ============================================================ */
(function () {
  'use strict';

  var CFG = (window.VIENA_DATA && window.VIENA_DATA.config) || {};

  /* ---------- Año del pie ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var abierto = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(abierto));
      toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Sombra del header al hacer scroll ---------- */
  var header = document.getElementById('site-header');
  if (header) {
    var marcarStuck = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    marcarStuck();
    window.addEventListener('scroll', marcarStuck, { passive: true });
  }

  /* ---------- Sección activa en la navegación ---------- */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var secciones = enlaces
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (secciones.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        enlaces.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entrada.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    secciones.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Contacto directo (sólo canales configurados) ---------- */
  var directo = document.getElementById('contact-direct');
  if (directo) {
    var items = [];
    if (CFG.whatsapp) {
      items.push('<li><a href="https://wa.me/' + CFG.whatsapp + '" target="_blank" rel="noopener">WhatsApp</a></li>');
    }
    if (CFG.telefono) {
      items.push('<li><a href="tel:' + CFG.telefono.replace(/[^\d+]/g, '') + '">' + CFG.telefono + '</a></li>');
    }
    if (CFG.email) {
      items.push('<li><a href="mailto:' + CFG.email + '">' + CFG.email + '</a></li>');
    }
    directo.innerHTML = items.join('');
    directo.hidden = items.length === 0;
  }

  /* ---------- Formulario ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  function mensaje(texto, clase) {
    if (!status) return;
    status.textContent = texto;
    status.className = 'form-status' + (clase ? ' ' + clase : '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nombre = form.elements.nombre;
      var email = form.elements.email;
      var invalido = null;

      [nombre, email].forEach(function (campo) {
        if (!campo) return;
        var ok = campo.value.trim() !== '' &&
                 (campo.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value.trim()));
        campo.setAttribute('aria-invalid', String(!ok));
        if (!ok && !invalido) invalido = campo;
      });

      if (invalido) {
        mensaje('Revisa tu nombre y tu correo electrónico para poder contactarte.', 'is-error');
        invalido.focus();
        return;
      }

      if (!CFG.formEndpoint) {
        mensaje('El formulario todavía no tiene un destino configurado. ' +
                'Define config.formEndpoint en assets/js/data.js para empezar a recibir solicitudes.', 'is-error');
        return;
      }

      var boton = form.querySelector('button[type="submit"]');
      if (boton) { boton.disabled = true; }
      mensaje('Enviando…');

      fetch(CFG.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          form.reset();
          mensaje('¡Gracias! Te contactamos muy pronto con la información.', 'is-ok');
        })
        .catch(function () {
          mensaje('No pudimos enviar tu solicitud. Inténtalo de nuevo en un momento.', 'is-error');
        })
        .then(function () {
          if (boton) boton.disabled = false;
        });
    });
  }
})();

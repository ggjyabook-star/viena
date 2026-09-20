/* ============================================================
   VIENA RESIDENCES — Fuente única de datos
   ------------------------------------------------------------
   Este es el ÚNICO archivo que hay que editar para actualizar
   el inventario, los precios y los datos de contacto.
   No hace falta tocar HTML, CSS ni el resto del JavaScript.
   ============================================================ */

window.VIENA_DATA = {

  /* ---------- Configuración general ---------- */
  config: {
    /* MODO DEMOSTRACIÓN.
       Mientras sea true, la sección de Disponibilidad muestra un aviso visible
       de que el inventario es de ejemplo. Cambiar a false SÓLO cuando las
       unidades de abajo sean las reales. Así el sitio nunca se publica por
       accidente presentando precios de ejemplo como disponibilidad real. */
    demo: true,

    /* Etapa comercial vigente. Se muestra en el encabezado de Disponibilidad. */
    etapa: 'Etapa 1 de ventas',

    /* Descuento vigente sobre precio de lista (0.15 = 15%).
       Poner 0 para desactivarlo en toda la sección. */
    descuento: 0.15,

    /* Esquema de pago. Debe sumar 1 (100%). */
    plan: {
      nombre: 'Plan 80-20',
      enganche: 0.20,          // 20% al firmar
      contraEntrega: 0.80,     // 80% a la entrega
      apartado: 50000          // Monto de apartado en MXN
    },

    moneda: 'MXN',
    entregaEstimada: 'Entrega estimada 2027',

    /* ---------- Contacto ----------
       Dejar vacío ('') cualquier canal que todavía no esté listo:
       la interfaz se adapta sola y manda al formulario de contacto.
       WhatsApp: formato internacional sin '+' ni espacios, p. ej. '5213221234567'. */
    whatsapp: '',
    telefono: '',
    email: '',

    /* Endpoint del formulario de contacto (Formspree, Basin, tu backend...).
       Mientras esté vacío, el formulario avisa en pantalla en vez de fallar en silencio. */
    formEndpoint: ''
  },

  /* ---------- Niveles del edificio ---------- */
  /* El orden de este arreglo define el orden de la torre (de abajo hacia arriba). */
  niveles: [
    { id: 1, label: 'Nivel 1', nota: 'Planta baja con jardín' },
    { id: 2, label: 'Nivel 2', nota: '' },
    { id: 3, label: 'Nivel 3', nota: '' },
    { id: 4, label: 'Nivel 4', nota: 'Vista al mar' },
    { id: 5, label: 'Penthouse', nota: 'Roof garden privado' }
  ],

  /* ---------- Inventario ----------
     estado: 'disponible' | 'apartado' | 'vendido'
     precio: precio de LISTA en MXN (el descuento se calcula solo)
     interior / terraza: metros cuadrados
     ============================================================
     DATOS DE EJEMPLO — reemplazar por el inventario real antes
     de publicar. La estructura ya es la definitiva.
     ============================================================ */
  unidades: [
    { id: '101',   nivel: 1, recamaras: 1, banos: 1,   interior: 58,  terraza: 22, vista: 'Jardín privado',    estado: 'vendido',    precio: 4450000 },
    { id: '102',   nivel: 1, recamaras: 2, banos: 2,   interior: 86,  terraza: 18, vista: 'Vista jardín',      estado: 'vendido',    precio: 6180000 },
    { id: '103',   nivel: 1, recamaras: 2, banos: 2,   interior: 82,  terraza: 16, vista: 'Vista jardín',      estado: 'vendido',    precio: 5980000 },

    { id: '201',   nivel: 2, recamaras: 1, banos: 1,   interior: 56,  terraza: 9,  vista: 'Vista ciudad',      estado: 'vendido',    precio: 4320000 },
    { id: '202',   nivel: 2, recamaras: 2, banos: 2,   interior: 88,  terraza: 12, vista: 'Vista sierra',      estado: 'vendido',    precio: 6320000 },
    { id: '203',   nivel: 2, recamaras: 2, banos: 2,   interior: 84,  terraza: 11, vista: 'Vista ciudad',      estado: 'apartado',   precio: 6150000 },

    { id: '301',   nivel: 3, recamaras: 1, banos: 1,   interior: 56,  terraza: 9,  vista: 'Vista sierra',      estado: 'vendido',    precio: 4480000 },
    { id: '302',   nivel: 3, recamaras: 2, banos: 2,   interior: 88,  terraza: 12, vista: 'Vista sierra',      estado: 'disponible', precio: 6540000 },
    { id: '303',   nivel: 3, recamaras: 2, banos: 2,   interior: 84,  terraza: 11, vista: 'Vista ciudad',      estado: 'apartado',   precio: 6360000 },

    { id: '401',   nivel: 4, recamaras: 1, banos: 1,   interior: 56,  terraza: 9,  vista: 'Vista mar parcial', estado: 'disponible', precio: 4690000 },
    { id: '402',   nivel: 4, recamaras: 2, banos: 2,   interior: 88,  terraza: 12, vista: 'Vista mar parcial', estado: 'disponible', precio: 6820000 },
    { id: '403',   nivel: 4, recamaras: 2, banos: 2,   interior: 84,  terraza: 11, vista: 'Vista sierra',      estado: 'apartado',   precio: 6580000 },

    { id: 'PH-01', nivel: 5, recamaras: 3, banos: 3.5, interior: 146, terraza: 62, vista: 'Vista mar y sierra', estado: 'disponible', precio: 11900000 }
  ]
};

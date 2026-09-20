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

    /* Fotografía de portada. Vacío = se dibuja la ilustración del edificio.
       Conviene horizontal y amplia (~2000px de ancho), porque el texto del
       hero se encima del lado izquierdo. */
    heroImagen: '',

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

  /* ---------- Galería de estilo de vida ----------
     Para poner una foto real, escribe su ruta en `src`:

        { src: 'assets/img/tules.jpg', alt: '...', titulo: 'Playa Los Tules', nota: 'A dos cuadras' }

     Mientras `src` esté vacío se dibuja la ilustración indicada en `arte`
     (ver assets/js/artwork.js). Así la página nunca se ve rota, y cambiar a
     fotografía es una línea por imagen.

     Para que se vean nítidas: ~1600px de ancho la grande y ~900px las demás,
     recortadas en cuadrado, comprimidas en JPG o WebP. El `alt` describe la
     foto para quien no la ve. */
  galeria: [
    { src: '', arte: 'playa',     titulo: 'Playa Los Tules',  nota: 'A dos cuadras',        alt: 'Atardecer en Playa Los Tules, con palmeras y la sierra al fondo.' },
    { src: '', arte: 'bahia',     titulo: 'Bahía de Banderas', nota: 'La sierra y el mar',  alt: 'La Sierra Madre bajando hasta la Bahía de Banderas.' },
    { src: '', arte: 'malecon',   titulo: 'Malecón',           nota: '12 minutos',          alt: 'Gente caminando por el malecón de Puerto Vallarta al anochecer.' },
    { src: '', arte: 'versalles', titulo: 'Versalles',         nota: 'Al salir de casa',    alt: 'Calle de Versalles con terrazas de restaurantes y luces colgantes.' },
    { src: '', arte: 'marina',    titulo: 'Marina Vallarta',   nota: '5 minutos',           alt: 'Mástiles de veleros en la Marina Vallarta.' }
  ],

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

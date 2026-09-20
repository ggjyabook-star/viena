# Viena Residences — sitio web

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni build) para el
desarrollo **Viena Residences**, Versalles, Puerto Vallarta.

El foco de este rediseño es la sección **Disponibilidad**.

---

## Cómo verlo

No hay que compilar nada. Basta con abrir `index.html`, o servir la carpeta:

```bash
npx http-server -p 8080 .
# luego abre http://127.0.0.1:8080
```

Para publicarlo, sube la carpeta completa a cualquier hosting estático
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, un bucket S3 o un hosting
tradicional por FTP).

---

## Orden de la página

Las secciones siguen la narrativa de compra, no el orden en que se escribieron:

| # | Sección | Qué responde |
|---|---|---|
| 1 | Hero | Qué es y por qué importa |
| 2 | El proyecto | Cómo está pensado |
| 3 | Ubicación | Dónde está y qué tiene cerca |
| 4 | Estilo de vida | Cómo se vive alrededor |
| 5 | Amenidades | Qué incluye |
| 6 | **Disponibilidad** | Qué hay y a qué precio |
| 7 | Cómo se compra | Qué sigue después de elegir |
| 8 | Inversión | Por qué conviene |
| 9 | Contacto | Con quién hablar |

Disponibilidad va después de las secciones que venden el proyecto y antes de las
que cierran la venta; lleva filetes arriba y abajo para marcarla como la pieza
central. Se llega a ella directo desde el menú y desde el botón del hero.

Las cifras de «Cómo se compra» (apartado, enganche, contra entrega, entrega
estimada) se leen de `config.plan` para que nunca se desfasen del desglose que
aparece en la ficha de cada unidad.

---

## Estructura

```
index.html                    Página completa
assets/css/site.css           Estilos generales (paleta, tipografía, secciones)
assets/css/availability.css   Estilos de la sección Disponibilidad
assets/js/data.js             ← inventario, precios y contacto (lo único que se edita a diario)
assets/js/artwork.js          Ilustraciones SVG (relleno mientras no hay fotos)
assets/js/availability.js     Lógica de la sección Disponibilidad
assets/js/site.js             Navegación, scrollspy y formulario
```

---

## Actualizar el inventario

Todo vive en **`assets/js/data.js`**. No hay que tocar HTML ni CSS.

### Cambiar el estado de una unidad

```js
{ id: '302', nivel: 3, recamaras: 2, banos: 2, interior: 88, terraza: 12,
  vista: 'Vista sierra', estado: 'disponible', precio: 6540000 },
```

`estado` acepta `'disponible'`, `'apartado'` o `'vendido'`. Al guardar, se
actualizan solos el contador del resumen, los puntos de color de la torre, los
filtros, la tabla y las tarjetas.

### Cambiar el descuento o el esquema de pago

```js
config: {
  demo: true,                 // aviso de "datos de ejemplo"; poner false con inventario real
  etapa: 'Etapa 1 de ventas',
  descuento: 0.15,            // 0 desactiva el descuento en toda la sección
  plan: {
    nombre: 'Plan 80-20',
    enganche: 0.20,           // 20% al firmar
    contraEntrega: 0.80,      // 80% a la entrega
    apartado: 50000           // monto de apartado en MXN
  }
}
```

El descuento se aplica **sólo a unidades disponibles**; las vendidas y
apartadas no muestran precio. El desglose de pagos del detalle se calcula a
partir de estos valores.

### Apagar el aviso de demostración

Mientras `config.demo` sea `true`, la sección muestra un aviso visible de que el
inventario es de ejemplo. Es una red de seguridad: evita que el sitio salga a
producción presentando precios de ejemplo como disponibilidad real. Cambiarlo a
`false` **sólo** cuando las unidades de `unidades` sean las reales.

### Poner fotografías

La sección **Estilo de vida** y la portada aceptan fotos sin tocar código. Mientras
no las haya, se dibujan ilustraciones (`assets/js/artwork.js`) para que la página
nunca se vea vacía, y aparece una nota que aclara que el entorno está dibujado.

Deja el archivo en `assets/img/` y escribe su ruta:

```js
galeria: [
  { src: 'assets/img/tules.jpg', arte: 'playa', titulo: 'Playa Los Tules',
    nota: 'A dos cuadras', alt: 'Atardecer en Playa Los Tules con palmeras.' },
  ...
]
```

Y para la portada:

```js
config: { heroImagen: 'assets/img/portada.jpg' }
```

Recomendaciones:

- **Recorte cuadrado** para la galería; la primera entrada es la grande del mosaico.
- **Tamaño**: ~1600 px de ancho la grande, ~900 px las demás, ~2000 px la portada.
- **Formato**: JPG o WebP comprimido. Las de la galería ya cargan en diferido
  (`loading="lazy"`), pero una foto de 6 MB igual se nota.
- **La portada va horizontal y con aire a la izquierda**, porque el texto del hero
  se encima de ese lado.
- **`alt` describe la foto** para quien no puede verla; no lo dejes vacío.

En cuanto todas las entradas tengan `src`, la nota de "ilustraciones de
referencia" desaparece sola.

### Conectar los canales de contacto

Los tres están vacíos a propósito. Al llenarlos aparecen solos en el sitio:

```js
whatsapp: '5213221234567',   // formato internacional, sin '+' ni espacios
telefono: '+52 322 123 4567',
email: 'ventas@vienaresidences.com',
formEndpoint: ''             // URL que recibe el formulario (Formspree, Basin, backend propio)
```

- Con `whatsapp` lleno, los botones **Cotizar / Me interesa** abren WhatsApp con
  un mensaje que ya trae el número de unidad. Vacío, llevan al formulario con la
  unidad precargada.
- Con `formEndpoint` vacío, el formulario avisa en pantalla en vez de fallar en
  silencio. Acepta cualquier endpoint que reciba `multipart/form-data` por POST.

---

## Qué trae la sección Disponibilidad

- **Resumen en vivo**: totales de residencias, disponibles, apartadas y vendidas,
  calculados desde los datos.
- **Selector de torre**: los niveles apilados de abajo hacia arriba, cada uno con
  un punto por unidad coloreado según su estado. Sirve como filtro y como mapa
  de ocupación de un vistazo.
- **Filtros**: recámaras, nivel, estado y seis criterios de orden.
- **Dos vistas**: tarjetas para explorar y tabla comparativa para escanear
  superficies y precios. Las columnas de la tabla se ordenan al tocar su
  encabezado y el orden queda sincronizado con el selector.
- **Detalle por unidad**: ventana con superficies, precio de lista, precio de
  etapa y el desglose del esquema de pago calculado.
- **Estado vacío** con salida: limpiar filtros o dejar sus datos.
- **Accesibilidad**: navegable por teclado, foco atrapado y `Esc` en la ventana de
  detalle, `aria-pressed` en los filtros, `aria-sort` en la tabla y conteo de
  resultados anunciado con `aria-live`.
- **Responsive**: en móvil la tabla se reordena en fichas etiquetadas, sin scroll
  horizontal.

### Reutilizar el módulo en otro sitio

La sección es autocontenida. Para trasplantarla basta con copiar:

1. el `<section id="disponibilidad">` de `index.html`;
2. `assets/css/availability.css`;
3. `assets/js/data.js` y `assets/js/availability.js`.

Sus selectores viven bajo `.av-` y `.uv-` para no chocar con estilos existentes,
y sólo depende de los tokens de color declarados en `:root` dentro de
`site.css`. Expone `window.VienaAvailability.seleccionar(id)` para abrir el
detalle de una unidad desde cualquier otro punto de la página, y
`window.VienaAvailability.refrescar()` para repintar tras cambiar los datos.

---

## Pendientes antes de publicar

- [ ] **Reemplazar el inventario de ejemplo** de `assets/js/data.js` por las
      unidades, superficies, vistas, estados y precios reales.
- [ ] Poner `config.demo` en `false` una vez cargado el inventario real, para
      que desaparezca el aviso de demostración.
- [ ] Llenar `whatsapp`, `telefono`, `email` y `formEndpoint`.
- [ ] Sustituir las ilustraciones por fotografía real: portada
      (`config.heroImagen`) y las cinco de `galeria`.
- [ ] Revisar el texto legal del pie y la nota al pie de Disponibilidad con quien
      lleve el tema comercial.

# Changelog - AI Webpage Analysis Frontend

## Últimas mejoras (Octubre 2025)

## 2025-10-19 — Mejoras en Historial, UI y correcciones

### ✅ Resumen rápido
- Historia: botón de eliminar por entrada, badges informativos (tolerancia, idioma, en caché, recuento de problemas) y normalización de timestamps.
- Visual: header de resultados centrado, meta (tolerancia/idioma/cached) centrada bajo la URL y timestamp alineado a la derecha.
- Loading: se eliminó el porcentaje determinista; ahora muestra una barra indeterminada animada cuando no hay un progreso real disponible.
- Sidebar: la imagen del logo rellena su contenedor correctamente.
- i18n: nuevas claves añadidas para acciones de historial (eliminar/confirmar), y se actualizaron cadenas relacionadas.

### 🛠️ Detalles técnicos
- feat(history): Añadido botón "Eliminar" por registro que llama a `deleteAnalysis(id)` con confirmación y actualización optimista de la UI.
- fix(history): Al obtener la lista se normalizan timestamps desde varios campos posibles (response.createdAtUtc, response.createdAt, createdAt, ts, etc.) y se guardan en `entry.ts` para mostrar la hora real de ejecución.
- fix(history/view): Al pulsar "Ver" se intenta obtener el registro completo con `getAnalysis(id)` para asegurar que `createdAtUtc` y metadatos vienen del backend.
- feat(history/ui): Se añadieron badges por fila: tolerancia, idioma, badge "en caché" y contador de problemas (issue count).
- fix(result/header): Ajustes CSS para centrar la URL y las badges; el timestamp queda a la derecha y ya no se sustituye por la hora actual al abrir el detalle.
- fix(loading): Loading screen acepta progreso externo y, por defecto, muestra una barra indeterminada animada (izquierda->derecha) sin porcentaje.
- ui(sidebar): El logo ahora usa `object-fit: cover` y rellena el contenedor de `.sidebar-logo`.
- layout(analysis): Se añadieron reglas `max-width`/`min-height` para el panel del formulario/resultados para evitar cambios de tamaño indeseados cuando se muestran resultados.
- i18n: Nuevas claves añadidas en `src/i18n/en.js` y `src/i18n/es.js` (`history.delete`, `history.confirmDelete`, y otras pequeñas actualizaciones).

### 📁 Archivos principales modificados hoy
- `src/components/History.jsx` — delete button, fetch full analysis on view, timestamp normalization, badges in rows
- `src/components/HistoryView.jsx` — UI tweaks
- `src/components/LoadingScreen.jsx` & `src/styles/LoadingScreen.css` — indeterminate loading bar and behavior
- `src/components/Result.jsx` & `src/styles/analysisview.css` — header centering and metadata layout
- `src/styles/sidebar.css` — logo sizing/fill
- `src/styles/analysisview.css` / `src/styles/historyview.css` — layout/width/height adjustments
- `src/i18n/en.js`, `src/i18n/es.js` — new translation keys
- `src/utils/api.js` — helpers used by history (list/get/delete)

### ✨ Nuevas funcionalidades

#### 🔍 Visor de imágenes en pantalla completa
- Botón "Fullscreen" en cada captura (desktop y mobile)
- Modal overlay con zoom completo de la imagen
- Cierre con botón X, botón "Close" o tecla ESC
- Animaciones suaves de entrada/salida
- Backdrop blur para mejor enfoque

#### 🎨 Mejoras de diseño y responsiveness

**Mejoras estéticas generales:**
- Diseño completamente renovado con gradientes modernos
- Paleta de colores profesional (azul cian + verde + oscuro)
- Sombras y efectos de profundidad
- Animaciones sutiles en hover y transiciones
- Badges y etiquetas coloridas para mejor jerarquía visual

**Responsive design:**
- Grid adaptativo que cambia a 1 columna en tablets (< 1024px)
- Imágenes y contenido optimizado para móviles
- Sidebar de historial se mueve arriba en pantallas pequeñas
- Textos con `clamp()` para escalar según viewport
- Padding y espaciado ajustado para pantallas pequeñas

**Formularios mejorados:**
- Mayor contraste en inputs y selects (background más claro)
- Options de select con fondo oscuro sólido (#151b2e) y texto claro (#e4e9f7)
- Mejor legibilidad de items no seleccionados
- Estados focus más visibles con glow effect

#### ⏳ Pantalla de carga entretenida

**Animaciones y elementos:**
- Círculos pulsantes concéntricos de fondo
- Icono de cerebro AI con animación de pulso
- SVG animado con nodos y conexiones
- Barra de progreso con efecto shimmer
- Carrusel de "fun facts" rotando cada 2.5s
- Partículas flotantes en el fondo
- Dots animados estilo loading

**Frases rotativas:**
- "🤖 AI is analyzing every pixel of your webpage..."
- "🔍 Scanning for broken links and accessibility issues..."
- "✨ Generating insights from visual elements..."
- Y 7 más...

#### 🎯 Componente de resultados mejorado

**Estructura visual:**
- Header con badges (URL, cached/live, timestamps)
- Secciones claramente divididas con iconos
- Lista de modificaciones con numeración y colores según severidad
- Screenshots con labels claros (🖥️ Desktop / 📱 Mobile)
- Botón de fullscreen que aparece en hover
- JSON colapsable en `<details>` tag

**Severidades con colores:**
- 🟢 Bajo/Low: verde (#4ade80)
- 🟡 Medio/Medium: amarillo (#fbbf24)
- 🔴 Alto/High: rojo (#ff6b6b)

### 📱 Breakpoints responsive

- Desktop: > 1200px (grid completo)
- Tablet: 1024px - 1200px (grid 1 columna)
- Mobile: < 768px (padding reducido, fuentes escaladas)

### 🎨 Variables CSS principales

```css
--bg-dark: #0a0e1a
--panel: #151b2e
--accent: #00d4ff (cian)
--success: #4ade80 (verde)
--danger: #ff6b6b (rojo)
--warning: #fbbf24 (amarillo)
```

### 🚀 Cómo probar

```powershell
cd c:\Users\User\Documents\testing\PF-Frontend-2
npm install
npm run dev
```

Luego abre http://localhost:5173/

### 📝 Archivos modificados/creados

**Nuevos:**
- `src/components/ImageViewer.jsx` - Visor fullscreen
- `src/components/ImageViewer.css` - Estilos del visor
- `src/components/LoadingScreen.jsx` - Pantalla de carga animada
- `src/components/LoadingScreen.css` - Animaciones y estilos

**Modificados:**
- `src/App.jsx` - Integración de LoadingScreen
- `src/App.css` - Diseño completo renovado + responsive
- `src/components/Result.jsx` - Visor de imágenes + mejoras visuales
- `index.html` - Título actualizado

### 🐛 Correcciones

- ✅ Contraste mejorado en select options
- ✅ Responsive en todas las pantallas
- ✅ Botones de fullscreen en screenshots
- ✅ Loading state con pantalla dedicada (no solo texto)

## 2025-10-19 — Internacionalización y limpieza de textos

### 🔤 Internacionalización (i18n)
- Extracción y sustitución de textos hard-coded en todos los componentes dentro de `src/components`.
- Se crearon/actualizaron claves en `src/i18n/en.js` y `src/i18n/es.js` para cubrir:
	- `app.*` (ya existentes) y nuevas subclaves: `app.severity.*`, `app.categoryLabels.*`.
	- `result.*` (etiquetas del panel de resultados, timestamps, badges, contadores, labels de selector, screenshots, etc.).
	- `form.*` (labels, placeholder, opciones de tolerance, etiquetas de categorías y hints).
	- `loading.*` (título, hechos/facts, porcentaje formateado).
	- `history.*` (mensajes vacíos, botones 'View' y 'Refresh').
	- `sidebar.backendLabel` para el pie del sidebar.

### 🧩 Cambios en componentes
- `src/components/Result.jsx`: traducción de títulos, badges, textos de estado, etiquetas de severidad y categorías, y etiquetas en la lista de modificaciones.
- `src/components/Form.jsx`: labels y opciones traducidas; categorías ahora leen sus etiquetas desde i18n.
- `src/components/LoadingScreen.jsx`: título y frases del carrusel movidas a i18n; porcentaje mostrado con la función de i18n.
- `src/components/ImageViewer.jsx`: etiquetas de botones y aria-labels internacionales.
- `src/components/History.jsx`: textos 'No cached requests yet', 'View' y 'Refresh' internacionalizados.
- `src/components/Sidebar.jsx`: pie con label 'Backend' extraído a i18n.
- `src/components/HistoryView.jsx`: ya internacionalizado parcialmente; ajustado para usar nuevas claves de severidad y categorías.

### ✅ Verificación
- ESLint: OK (sin errores tras los cambios).
- Build (Vite production): OK — build completo y artefactos generados.

### 🧭 Notas y recomendaciones
- Algunas etiquetas dinámicas usan fallback (`t(...) || fallback`) cuando la clave no existe, para evitar roturas si aparecen categorías o severities nuevas.
- `loading.facts` está referenciado por índices desde `LoadingScreen.jsx`. Si se prefiere, se puede convertir a claves numeradas (`loading.facts.0`) para mayor claridad.
- Si deseas, puedo hacer un barrido adicional fuera de `src/components` (p. ej. `public/index.html`, `README.md`) para completar la internacionalización.

---

## 2025-10-19 — Nuevas helpers en cliente API (GET / DELETE)

### 🔌 Nuevas funciones añadidas en `src/utils/api.js`
- `listAnalyses(params?)` — GET `/api/analysis` con query string opcional. Devuelve la lista/paginación según backend.
- `getAnalysis(id)` — GET `/api/analysis/{id}` para obtener un registro específico.
- `deleteAnalysis(id)` — DELETE `/api/analysis/{id}` para eliminar un registro.
- `deleteAllAnalyses()` — DELETE `/api/analysis` para eliminar todos los registros.

Todas las funciones reutilizan la misma constante `BASE` y comparten el manejador `handleResponse(res)` para normalizar errores y parseo JSON.

### ✅ Verificación
- ESLint: OK
- Build (Vite production): OK — build completado.

### 🧭 Uso rápido
- Listar: `const list = await listAnalyses({ page: 1, pageSize: 20 })`
- Obtener: `const item = await getAnalysis('abc123')`
- Borrar uno: `await deleteAnalysis('abc123')`
- Borrar todo: `await deleteAllAnalyses()`

---

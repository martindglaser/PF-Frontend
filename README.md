# Análisis de páginas web con IA

Aplicación web desarrollada para que equipos de **QA** puedan realizar análisis visuales y funcionales de páginas web utilizando **Inteligencia Artificial**.  
Este repositorio corresponde **solo al frontend** de la solución.

---

## 🧭 Objetivo del proyecto

Brindar a los testers una herramienta simple y unificada para:

- Ejecutar análisis sobre una URL dada.
- Recibir hallazgos categorizados (UI, textos, enlaces, formularios, responsividad, etc.).
- Consultar un historial de pruebas con filtros.
- Exportar resultados para documentarlos o compartirlos con otras áreas.

---

## 🖼️ Vista general de la app

La aplicación está compuesta principalmente por tres secciones:

1. **Dashboard – “Análisis de páginas web con IA”**
   - Formulario para crear un nuevo análisis:
     - Nombre del análisis.
     - Nombre del usuario.
     - URL a analizar.
     - Tolerancia (Bajo / Medio / Alto).
     - Idioma del reporte.
     - Selección de categorías a evaluar (UI/Estilos, Formularios, Enlaces, Imágenes/Recursos, Textos, Responsividad).
   - Botón **“Ejecutar análisis”** que envía la información al backend de IA.

2. **Historial de pruebas**
   - Listado paginado de análisis ejecutados.
   - Filtros por:
     - Título / Usuario / URL.
     - Rango de fechas.
   - Para cada análisis se visualiza:
     - Título, URL, usuario, idioma, tolerancia.
     - Cantidad de problemas encontrados.
     - Acciones para **ver detalles** o **eliminar** el registro.
   - Botón **“Exportar reporte”** que genera un archivo CSV/Excel utilizando la librería `xlsx`.

3. **Detalle del análisis**
   - Encabezado con resumen de la prueba:
     - URL analizada, usuario, idioma, tolerancia.
     - Indicador de estado tipo “semáforo”.
   - Sección **“Lo que la IA ve”** con una descripción general de la página.
   - Sección **“Problemas encontrados”**:
     - Hallazgos agrupados por categoría.
     - Severidad (Bajo / Medio / Crítico).
     - Descripción del problema.
     - Recomendación de mejora.
     - Selector/CSS afectado cuando corresponde.

---

## 🧱 Stack tecnológico

- [React](https://react.dev/) `^19.1.1`
- [React DOM](https://www.npmjs.com/package/react-dom) `^19.1.1`
- [Vite](https://vite.dev/) `^7.1.7`
- [xlsx](https://www.npmjs.com/package/xlsx) `^0.18.5` para exportar reportes.
- ESLint para reglas de calidad de código.

---

## 📂 Estructura del proyecto

Estructura simplificada del repositorio:

```bash
PF-FRONTEND/
├── public/
│   ├── app-icon.png
│   └── app-window-icon.png
├── src/
│   ├── assets/                 # Íconos e imágenes SVG
│   ├── components/             # Componentes principales de la UI
│   │   ├── AnalysisView.jsx    # Vista principal de análisis (form + resultado)
│   │   ├── Form.jsx            # Formulario para crear un nuevo análisis
│   │   ├── History.jsx         # Contenedor del historial
│   │   ├── HistoryView.jsx     # Lista de pruebas anteriores
│   │   ├── ImageViewer.jsx     # Visualización de capturas/imágenes
│   │   ├── LoadingScreen.jsx   # Pantalla de carga mientras corre la IA
│   │   ├── Result.jsx          # Resultados del análisis
│   │   ├── Sidebar.jsx         # Menú lateral de navegación
│   │   └── TrafficLight.jsx    # Componente de semáforo de estado
│   ├── i18n/
│   │   ├── en.js               # Traducciones en inglés
│   │   ├── es.js               # Traducciones en español
│   │   └── index.js            # Configuración de internacionalización
│   ├── styles/                 # Estilos CSS por vista/componente
│   │   ├── App.css
│   │   ├── analysisview.css
│   │   ├── historyview.css
│   │   ├── ImageViewer.css
│   │   ├── LoadingScreen.css
│   │   ├── sidebar.css
│   │   └── trafficLight.css
│   ├── utils/                  # Lógica auxiliar
│   │   ├── analysisLogic.js    # Procesamiento de datos de análisis
│   │   ├── api.js              # Cliente de comunicación con el backend
│   │   ├── cache.js            # Manejo de cache/localStorage
│   │   ├── exportCSV.js        # Exportación de resultados
│   │   ├── formatDate.js       # Formateo de fechas
│   │   └── input.js            # Utilidades para inputs/validaciones
│   ├── App.jsx                 # Componente raíz de la aplicación
│   └── main.jsx                # Punto de entrada de React/Vite
├── Dockerfile                  # Definición de imagen Docker para despliegue
├── index.html                  # Template HTML base de Vite
├── package.json
├── vite.config.js
└── README.md
```

---

## ✅ Requisitos

- [Node.js](https://nodejs.org/) **>= 18**
- npm (incluido con Node.js)

---

## 🔧 Instalación y puesta en marcha

1. **Clonar el repositorio**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd PF-FRONTEND
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar la URL del backend (si aplica)**

   En el archivo `src/utils/api.js` se centralizan las llamadas HTTP.  
   Ajustar la URL base del backend según el entorno:

   ```js
   // Ejemplo (puede variar según la implementación real)
   const API_BASE_URL = "http://localhost:5288"; // Backend
   ```

4. **Ejecutar en entorno de desarrollo**

   ```bash
   npm run dev
   ```

   Abrir el navegador en la URL que indique Vite (por defecto: `http://localhost:5173`).

5. **Generar build de producción**

   ```bash
   npm run build
   ```

   Se creará la carpeta `dist/` con los archivos estáticos optimizados.

6. **Previsualizar el build**

   ```bash
   npm run preview
   ```

   Sirve la carpeta `dist/` en un servidor local para validación final.

---

## 🧑‍💻 Scripts npm disponibles

Definidos en `package.json`:

- `npm run dev` – Inicia el servidor de desarrollo de Vite.
- `npm run build` – Compila el proyecto para producción.
- `npm run preview` – Previsualiza el build de producción.
- `npm run lint` – Ejecuta ESLint sobre el código fuente.

---

## 🌐 Internacionalización (i18n)

La aplicación soporta, al menos, los idiomas:

- Español (`src/i18n/es.js`)
- Inglés (`src/i18n/en.js`)

El módulo `src/i18n/index.js` orquesta las traducciones que se consumen desde los componentes. Actualmente la aplicación se entrega en español, pero la localización completa a inglés ya está desarrollada y los textos correspondientes están definidos, por lo que habilitar la interfaz en inglés solo requiere ajustar la configuración.

---

## 🔁 Flujo de trabajo típico para QA

1. Ingresar al **Dashboard** y completar:
   - Título del análisis.
   - Nombre del usuario QA.
   - URL de la página a analizar.
   - Tolerancia e idioma.
   - Categorías a evaluar.
2. Presionar **“Ejecutar análisis”**.
3. Esperar la respuesta (se muestra una **pantalla de carga**).
4. Revisar los resultados:
   - Resumen general.
   - Problemas por categoría con severidad y recomendaciones.
5. Acceder al **Historial de pruebas** para:
   - Ver pruebas anteriores.
   - Filtrar por fechas, usuario o URL.
   - Eliminar registros obsoletos.
   - Exportar reportes a CSV/Excel para documentación.

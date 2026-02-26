<p align="center">
            <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/websketch-vscode/readme.png"
           alt="WebSketch" width="340"></p>

<h1 align="center">WebSketch</h1>

<p align="center"><strong>Convierte cualquier página web en un árbol estructurado que los LLMs realmente pueden entender.</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcp-tool-shop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="Licencia: MIT"></a>
  <a href="https://mcp-tool-shop-org.github.io/websketch-vscode/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <strong>Español</strong> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <a href="#the-problem">El Problema</a> · <a href="#the-solution">La Solución</a> · <a href="#quick-start">Inicio Rápido</a> · <a href="#how-it-reads">Cómo se Lee</a> · <a href="#use-cases">Casos de Uso</a> · <a href="#ecosystem">Ecosistema</a>
</p>

---

## The Problem

Quieres que un LLM razone sobre una página web — su diseño, navegación, elementos interactivos, jerarquía de contenido. Tus opciones actuales se quedan cortas:

| Enfoque | Tokens | Qué pierdes |
|---------|--------|-------------|
| **Captura de pantalla** | 1,000+ (visión) | No puede leer texto pequeño, adivina el diseño, cero información de interactividad |
| **HTML sin procesar** | 50,000–500,000 | Se ahoga en una sopa de `div`, estilos inline, scripts, ruido SVG |
| **Extracción Readability** | 2,000–10,000 | Elimina toda la estructura — sin navegación, sin botones, sin formularios |
| **Volcado del DOM** | 10,000–100,000 | Nombres de clases, atributos data, artefactos de frameworks por todas partes |

El problema fundamental: **ninguno de estos habla el lenguaje de la UI**. Los LLMs no necesitan `<div class="sc-bdnxRM jJFqsI">` — necesitan `NAV`, `BUTTON`, `CARD`, `LIST`.

## The Solution

WebSketch captura la página en un **árbol semántico** usando 23 primitivas de UI. Un clic en VS Code, pega en cualquier LLM:

```
PAGE
├─ HEADER {sticky}
│  ├─ *LINK "Home"
│  ├─ *LINK "Products"
│  ├─ *LINK "Pricing"
│  └─ *INPUT <search> "Search..."
├─ SECTION <main>
│  ├─ TEXT <h1> "Welcome to Acme"
│  ├─ TEXT "Build faster with our platform..."
│  └─ *BUTTON "Get Started"
├─ LIST (3 items)
│  ├─ CARD
│  │  ├─ IMAGE "Feature icon"
│  │  └─ TEXT "Real-time sync across devices"
│  ├─ CARD
│  │  ├─ IMAGE "Feature icon"
│  │  └─ TEXT "99.9% uptime guarantee"
│  └─ CARD
│     ├─ IMAGE "Feature icon"
│     └─ TEXT "Enterprise-grade security"
└─ FOOTER
   ├─ NAV
   │  ├─ *LINK "Terms"
   │  ├─ *LINK "Privacy"
   │  └─ *LINK "Contact"
   └─ TEXT "© 2026 Acme Inc."
```

**200–800 tokens.** No 50,000. No una cuadrícula de píxeles. Un árbol limpio sobre el que cualquier modelo de texto puede razonar.

### Comparación Directa

| Métrica | WebSketch | HTML sin procesar | Captura de pantalla |
|---------|-----------|-------------------|---------------------|
| **Tokens** | 200–800 | 50,000+ | 1,000+ (visión) |
| **Estructura** | Árbol semántico completo | Caos de divs anidados | Cuadrícula de píxeles |
| **Contenido de texto** | Entrecomillado, etiquetado | Enterrado en markup | Dependiente de OCR |
| **Elementos interactivos** | Marcados con `*` | Ocultos en atributos | Invisibles |
| **Jerarquía de encabezados** | `<h1>` hasta `<h6>` | Perdida entre nombres de clases | Adivinada por tamaño |
| **Landmarks** | `<main>`, `<nav>`, `<search>` | Requiere experiencia en DOM | No disponible |
| **Funciona con** | Cualquier LLM de texto | Nada útil | Solo modelos de visión |

## Quick Start

1. Instala desde el [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode) o ejecuta:
   ```
   ext install mcp-tool-shop.websketch-vscode
   ```
2. Abre la Paleta de Comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Ejecuta **WebSketch: Capture URL**
4. Pega una URL y presiona Enter
5. Haz clic en **Copy for LLM** y pégalo en tu prompt

La pestaña LLM es la vista predeterminada. Un clic copia el árbol a tu portapapeles, listo para cualquier modelo.

## How It Reads

Cada línea del árbol es densa en información y parseable por máquinas:

```
├─ *BUTTON <search> {sticky} "Find products"
│    │       │         │         │
│    │       │         │         └─ Texto visible real
│    │       │         └─ Flags (sticky, scrollable)
│    │       └─ Pista semántica (search, main, h1, aside...)
│    └─ Interactivo (clicable/escribible)
│
└─ La estructura de árbol muestra la jerarquía padre-hijo
```

### La Gramática

| Símbolo | Significado | Ejemplo |
|---------|-------------|---------|
| Prefijo `*` | El usuario puede interactuar con él | `*LINK`, `*BUTTON`, `*INPUT` |
| `<semantic>` | Significado HTML5/ARIA preservado | `<h1>`, `<main>`, `<search>`, `<aside>` |
| `{flags}` | Comportamiento de diseño | `{sticky}`, `{scrollable}` |
| `"label"` | Contenido de texto visible | `"Sign up free"`, `"Search..."` |
| `(N items)` | Cantidad de elementos de lista | `LIST (12 items)` |
| Indentación | Jerarquía padre-hijo | `HEADER > NAV > LIST > LINK` |

### Los 23 Roles

| Categoría | Roles |
|-----------|-------|
| **Diseño** | `PAGE`, `HEADER`, `FOOTER`, `SECTION`, `NAV` |
| **Contenido** | `TEXT`, `IMAGE`, `ICON`, `CARD`, `LIST`, `TABLE` |
| **Interactivos** | `BUTTON`, `LINK`, `INPUT`, `CHECKBOX`, `RADIO`, `FORM` |
| **Superposiciones** | `MODAL`, `TOAST`, `DROPDOWN` |
| **Navegación** | `PAGINATION` |
| **Respaldo** | `UNKNOWN` |

Estos 23 roles son un vocabulario fijo — el mismo en cada sitio web. Los LLMs los aprenden una vez y pueden razonar sobre cualquier página.

## What Gets Captured

WebSketch no simplemente vuelca el DOM. Ejecuta un **clasificador de 5 niveles** sobre cada elemento visible:

| Nivel | Fuente | Ejemplo |
|-------|--------|---------|
| 1. **Rol ARIA** | `role="navigation"` | → `NAV` |
| 2. **Etiqueta HTML** | `<button>`, `<h1>` | → `BUTTON`, `TEXT <h1>` |
| 3. **Heurísticas de clases** | `.card`, `.modal`, `.toast` | → `CARD`, `MODAL`, `TOAST` |
| 4. **Análisis estructural** | 3+ hermanos del mismo rol | → `LIST` |
| 5. **Respaldo** | Elementos de solo texto | → `TEXT`, `SECTION`, `UNKNOWN` |

Luego limpia:

- **Recorrido transparente de tablas** — `TR`/`TD`/`TH`/`LI` se omiten, los hijos se promueven a la superficie
- **Poda de contenido vacío** — nodos vacíos, no interactivos e invisibles se eliminan
- **Colapso de wrappers** — wrappers `SECTION` de un solo hijo sin significado se eliminan
- **Poda en cascada** — cadenas de wrappers vacíos sin contenido se eliminan por completo
- **Extracción de etiquetas** — el texto visible se extrae de enlaces, botones, encabezados, imágenes e inputs

El resultado: un árbol limpio con el mínimo de nodos necesarios para entender la página.

## Use Cases

### Para Ingenieros de Prompts

**"Describe el diseño de esta página"** — Pega el árbol. El LLM ve la estructura exacta, encabezados y navegación sin ahogarse en HTML. Funciona con ChatGPT, Claude, Gemini, Llama — cualquier modelo de texto.

**"¿Qué puede hacer un usuario en esta página?"** — Cada elemento interactivo está marcado con `*`. Enlaces, botones, inputs, checkboxes — todos etiquetados con su texto visible. El LLM puede enumerar cada acción posible del usuario.

**"Compara estas dos páginas"** — Dos árboles lado a lado. El LLM puede hacer diff de estructura, detectar elementos faltantes, comparar patrones de navegación — todo en unos pocos cientos de tokens.

### Para Desarrolladores

**"Genera un plan de pruebas para esta UI"** — El árbol mapea directamente a objetivos de prueba. `*BUTTON "Submit"`, `*INPUT <email> "Enter email"`, `*LINK "Terms"` — cada uno es una interacción testeable con su etiqueta visible.

**"Construye algo que se vea como esto"** — El árbol semántico se aproxima a una jerarquía de componentes. `HEADER > NAV > LIST > LINK` mapea directamente a componentes React/Vue/Svelte. El LLM puede generar un scaffold de diseño equivalente.

**"Audita esta página para accesibilidad"** — Landmarks faltantes, inputs sin etiquetar, brechas en la jerarquía de encabezados — todo visible en el árbol. Las pistas semánticas como `<main>`, `<nav>`, `<search>` muestran qué roles ARIA están presentes (o ausentes).

### Para Agentes de IA

**Integración MCP** — Usa [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) para darle a tu agente de IA la capacidad de capturar y razonar sobre cualquier página web como parte de su cadena de herramientas.

**Monitoreo automatizado** — Usa [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) para capturar páginas de forma programada, hacer diff de los árboles y detectar cambios estructurales.

## Four Views

| Pestaña | Qué muestra | Ideal para |
|---------|-------------|------------|
| **LLM** (predeterminada) | Árbol semántico indentado con etiquetas, semántica y flags | Pegar en prompts de LLM |
| **ASCII** | Wireframe con caracteres de dibujo y diseño espacial | Comprensión visual del diseño |
| **Tree** | Árbol colapsable con badges de rol codificados por color | Depuración de capturas |
| **JSON** | IR completo `WebSketchCapture` con resaltado de sintaxis | Uso programático y pipelines |

## Commands

| Comando | Descripción |
|---------|-------------|
| `WebSketch: Capture URL` | Solicita una URL, captura y muestra el resultado |
| `WebSketch: Capture URL from Clipboard` | Captura cualquier URL que esté en tu portapapeles |
| `WebSketch: Copy LLM Tree to Clipboard` | Copia el árbol — pégalo directamente en ChatGPT, Claude, etc. |
| `WebSketch: Export LLM Tree` | Guarda como `.md` para bibliotecas de prompts o documentación |
| `WebSketch: Export Capture as JSON` | Captura completa del IR con bboxes, hashes y metadatos |
| `WebSketch: Export ASCII Wireframe` | Vista de diseño con caracteres de dibujo |

## Settings

| Configuración | Predeterminado | Descripción |
|---------------|----------------|-------------|
| `websketch.chromePath` | Detección automática | Ruta al ejecutable de Chrome o Edge |
| `websketch.viewportWidth` | `1280` | Ancho del viewport en píxeles |
| `websketch.viewportHeight` | `800` | Alto del viewport en píxeles |
| `websketch.timeout` | `30000` | Tiempo de espera de navegación (ms) |
| `websketch.waitAfterLoad` | `1000` | Espera adicional para renderizado JS (ms) |

## Ecosystem

WebSketch es una familia de herramientas construidas sobre una gramática compartida:

| Paquete | Qué hace |
|---------|----------|
| [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | IR central — gramática, validación, renderizado, diffing, fingerprinting |
| **websketch-vscode** | Extensión de VS Code — captura páginas desde tu editor (este repositorio) |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | Captura y renderizado por línea de comandos |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Extensión de Chrome para captura en el navegador |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | Servidor MCP para integración con agentes LLM |

Todas las herramientas producen el mismo IR `WebSketchCapture`, por lo que las salidas son intercambiables entre pipelines.

## Requirements

- VS Code 1.85+
- Chrome o Edge instalado en tu sistema

Sin navegador incluido. Sin descarga de 200MB. WebSketch usa `puppeteer-core` con el navegador que ya tengas instalado.

## License

Licencia MIT — consulta [LICENSE](LICENSE) para más detalles.

> Parte de [MCP Tool Shop](https://mcptoolshop.com)

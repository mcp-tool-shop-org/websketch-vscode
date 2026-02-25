<p align="center"><img src="logo.png" alt="WebSketch" width="340"></p>

<h1 align="center">WebSketch</h1>

<p align="center"><strong>Trasforma qualsiasi pagina web in un albero strutturato che gli LLM possono davvero comprendere.</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcp-tool-shop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="Licenza: MIT"></a>
  <a href="https://mcp-tool-shop-org.github.io/websketch-vscode/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <strong>Italiano</strong> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <a href="#the-problem">Il Problema</a> · <a href="#the-solution">La Soluzione</a> · <a href="#quick-start">Avvio Rapido</a> · <a href="#how-it-reads">Come si Legge</a> · <a href="#use-cases">Casi d'Uso</a> · <a href="#ecosystem">Ecosistema</a>
</p>

---

## The Problem

Vuoi che un LLM ragioni su una pagina web: il suo layout, la navigazione, gli elementi interattivi, la gerarchia dei contenuti. Le opzioni attuali sono tutte insufficienti:

| Approccio | Token | Cosa perdi |
|-----------|-------|------------|
| **Screenshot** | 1.000+ (visione) | Non legge il testo piccolo, indovina il layout, zero informazioni sull'interattivita |
| **HTML grezzo** | 50.000-500.000 | Annegato in una zuppa di `div`, stili inline, script, rumore SVG |
| **Estrazione Readability** | 2.000-10.000 | Elimina tutta la struttura: niente nav, niente pulsanti, niente form |
| **Dump del DOM** | 10.000-100.000 | Nomi di classi, attributi data, artefatti dei framework ovunque |

Il problema di fondo: **nessuno di questi parla il linguaggio della UI**. Gli LLM non hanno bisogno di `<div class="sc-bdnxRM jJFqsI">` -- hanno bisogno di `NAV`, `BUTTON`, `CARD`, `LIST`.

## The Solution

WebSketch cattura la pagina in un **albero semantico** utilizzando 23 primitive UI. Un clic in VS Code, incolla in qualsiasi LLM:

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

**200-800 token.** Non 50.000. Non una griglia di pixel. Un albero pulito su cui qualsiasi modello testuale puo ragionare.

### Confronto Diretto

| Metrica | WebSketch | HTML grezzo | Screenshot |
|---------|-----------|-------------|------------|
| **Token** | 200-800 | 50.000+ | 1.000+ (visione) |
| **Struttura** | Albero semantico completo | Caos di div annidati | Griglia di pixel |
| **Contenuto testuale** | Tra virgolette, etichettato | Sepolto nel markup | Dipendente dall'OCR |
| **Elementi interattivi** | Contrassegnati con `*` | Nascosti negli attributi | Invisibili |
| **Gerarchia intestazioni** | Da `<h1>` a `<h6>` | Persa nei nomi delle classi | Indovinata dalla dimensione |
| **Landmark** | `<main>`, `<nav>`, `<search>` | Richiede competenza DOM | Non disponibili |
| **Funziona con** | Qualsiasi LLM testuale | Niente di utile | Solo modelli con visione |

## Quick Start

1. Installa dal [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode) oppure esegui:
   ```
   ext install mcp-tool-shop.websketch-vscode
   ```
2. Apri il Riquadro Comandi (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Esegui **WebSketch: Capture URL**
4. Incolla un URL e premi Invio
5. Clicca su **Copy for LLM** e incolla nel tuo prompt

La scheda LLM e la vista predefinita. Un clic copia l'albero negli appunti, pronto per qualsiasi modello.

## How It Reads

Ogni riga dell'albero e densa di informazioni e analizzabile dalla macchina:

```
├─ *BUTTON <search> {sticky} "Find products"
│    │       │         │         │
│    │       │         │         └─ Testo visibile effettivo
│    │       │         └─ Flag (sticky, scrollable)
│    │       └─ Indizio semantico (search, main, h1, aside...)
│    └─ Interattivo (cliccabile/digitabile)
│
└─ La struttura ad albero mostra l'annidamento genitore-figlio
```

### La Grammatica

| Simbolo | Significato | Esempio |
|---------|-------------|---------|
| Prefisso `*` | L'utente puo interagirci | `*LINK`, `*BUTTON`, `*INPUT` |
| `<semantic>` | Significato HTML5/ARIA preservato | `<h1>`, `<main>`, `<search>`, `<aside>` |
| `{flags}` | Comportamento del layout | `{sticky}`, `{scrollable}` |
| `"label"` | Contenuto testuale visibile | `"Sign up free"`, `"Search..."` |
| `(N items)` | Conteggio elementi della lista | `LIST (12 items)` |
| Indentazione | Gerarchia genitore-figlio | `HEADER > NAV > LIST > LINK` |

### I 23 Ruoli

| Categoria | Ruoli |
|-----------|-------|
| **Layout** | `PAGE`, `HEADER`, `FOOTER`, `SECTION`, `NAV` |
| **Contenuto** | `TEXT`, `IMAGE`, `ICON`, `CARD`, `LIST`, `TABLE` |
| **Interattivi** | `BUTTON`, `LINK`, `INPUT`, `CHECKBOX`, `RADIO`, `FORM` |
| **Overlay** | `MODAL`, `TOAST`, `DROPDOWN` |
| **Navigazione** | `PAGINATION` |
| **Fallback** | `UNKNOWN` |

Questi 23 ruoli sono un vocabolario fisso, identico su ogni sito web. Gli LLM li imparano una volta e possono ragionare su qualsiasi pagina.

## What Gets Captured

WebSketch non fa un semplice dump del DOM. Esegue un **classificatore a 5 livelli** su ogni elemento visibile:

| Livello | Origine | Esempio |
|---------|---------|---------|
| 1. **Ruolo ARIA** | `role="navigation"` | → `NAV` |
| 2. **Tag HTML** | `<button>`, `<h1>` | → `BUTTON`, `TEXT <h1>` |
| 3. **Euristiche sulle classi** | `.card`, `.modal`, `.toast` | → `CARD`, `MODAL`, `TOAST` |
| 4. **Analisi strutturale** | 3+ fratelli con lo stesso ruolo | → `LIST` |
| 5. **Fallback** | Elementi di solo testo | → `TEXT`, `SECTION`, `UNKNOWN` |

Poi effettua la pulizia:

- **Attraversamento trasparente delle tabelle** -- `TR`/`TD`/`TH`/`LI` vengono saltati, i figli promossi in superficie
- **Potatura a contenuto zero** -- nodi vuoti, non interattivi e invisibili eliminati
- **Collasso dei wrapper** -- wrapper `SECTION` senza significato con un solo figlio rimossi
- **Potatura a cascata** -- catene di wrapper vuoti senza contenuto eliminate del tutto
- **Estrazione delle etichette** -- testo visibile estratto da link, pulsanti, intestazioni, immagini, input

Il risultato: un albero pulito con il numero minimo di nodi necessari per comprendere la pagina.

## Use Cases

### Per i Prompt Engineer

**"Descrivi il layout di questa pagina"** -- Incolla l'albero. L'LLM vede la struttura esatta, le intestazioni e la navigazione senza annegare nell'HTML. Funziona con ChatGPT, Claude, Gemini, Llama -- qualsiasi modello testuale.

**"Cosa puo fare un utente su questa pagina?"** -- Ogni elemento interattivo e contrassegnato con `*`. Link, pulsanti, input, checkbox -- tutti etichettati con il testo visibile. L'LLM puo enumerare ogni possibile azione dell'utente.

**"Confronta queste due pagine"** -- Due alberi affiancati. L'LLM puo confrontare le strutture, individuare elementi mancanti, comparare i pattern di navigazione -- il tutto in poche centinaia di token.

### Per gli Sviluppatori

**"Genera un piano di test per questa UI"** -- L'albero si mappa direttamente su obiettivi di test. `*BUTTON "Submit"`, `*INPUT <email> "Enter email"`, `*LINK "Terms"` -- ciascuno e un'interazione testabile con la sua etichetta visibile.

**"Costruisci qualcosa che assomigli a questo"** -- L'albero semantico e vicino a una gerarchia di componenti. `HEADER > NAV > LIST > LINK` si mappa direttamente su componenti React/Vue/Svelte. L'LLM puo generare uno scaffold con un layout corrispondente.

**"Verifica l'accessibilita di questa pagina"** -- Landmark mancanti, input senza etichetta, lacune nella gerarchia delle intestazioni -- tutto visibile nell'albero. Gli indizi semantici come `<main>`, `<nav>`, `<search>` mostrano quali ruoli ARIA sono presenti (o assenti).

### Per gli Agenti IA

**Integrazione MCP** -- Usa [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) per dare al tuo agente IA la capacita di catturare e ragionare su qualsiasi pagina web come parte della sua catena di strumenti.

**Monitoraggio automatizzato** -- Usa [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) per catturare pagine a intervalli regolari, confrontare gli alberi e rilevare cambiamenti strutturali.

## Four Views

| Scheda | Cosa mostra | Ideale per |
|--------|-------------|------------|
| **LLM** (predefinita) | Albero semantico indentato con etichette, semantiche, flag | Incollare nei prompt LLM |
| **ASCII** | Wireframe con box-drawing e layout spaziale | Comprensione visiva del layout |
| **Tree** | Albero espandibile con badge ruolo colorati | Debug delle catture |
| **JSON** | IR `WebSketchCapture` completa con evidenziazione della sintassi | Uso programmatico e pipeline |

## Commands

| Comando | Descrizione |
|---------|-------------|
| `WebSketch: Capture URL` | Richiede un URL, cattura e visualizza |
| `WebSketch: Capture URL from Clipboard` | Cattura qualsiasi URL presente negli appunti |
| `WebSketch: Copy LLM Tree to Clipboard` | Copia l'albero -- incolla direttamente in ChatGPT, Claude, ecc. |
| `WebSketch: Export LLM Tree` | Salva come `.md` per librerie di prompt o documentazione |
| `WebSketch: Export Capture as JSON` | Cattura IR completa con bounding box, hash, metadati |
| `WebSketch: Export ASCII Wireframe` | Vista layout con box-drawing |

## Settings

| Impostazione | Predefinito | Descrizione |
|--------------|-------------|-------------|
| `websketch.chromePath` | Rilevamento automatico | Percorso dell'eseguibile Chrome o Edge |
| `websketch.viewportWidth` | `1280` | Larghezza del viewport in pixel |
| `websketch.viewportHeight` | `800` | Altezza del viewport in pixel |
| `websketch.timeout` | `30000` | Timeout di navigazione (ms) |
| `websketch.waitAfterLoad` | `1000` | Attesa aggiuntiva per il rendering JS (ms) |

## Ecosystem

WebSketch e una famiglia di strumenti costruiti su una grammatica condivisa:

| Pacchetto | Cosa fa |
|-----------|---------|
| [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | IR core -- grammatica, validazione, rendering, diffing, fingerprinting |
| **websketch-vscode** | Estensione VS Code -- cattura pagine dal tuo editor (questo repository) |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | Cattura e rendering da riga di comando |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Estensione Chrome per la cattura nel browser |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | Server MCP per l'integrazione con agenti LLM |

Tutti gli strumenti producono la stessa IR `WebSketchCapture`, quindi gli output sono intercambiabili tra le pipeline.

## Requirements

- VS Code 1.85+
- Chrome o Edge installato sul tuo sistema

Nessun browser incluso. Nessun download da 200 MB. WebSketch usa `puppeteer-core` con qualsiasi browser tu abbia gia installato.

## License

Licenza MIT -- vedi [LICENSE](LICENSE) per i dettagli.

> Parte di [MCP Tool Shop](https://mcptoolshop.com)

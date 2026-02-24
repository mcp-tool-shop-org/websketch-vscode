<p align="center"><img src="logo.png" alt="WebSketch" width="340"></p>

<p align="center"><strong>Turn any web page into a structured tree that LLMs can actually understand.</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcptoolshop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcptoolshop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

---

## The Problem

You want an LLM to reason about a web page. Your options are bad:

| Approach | Tokens | Accuracy | Works with |
|----------|--------|----------|------------|
| **Screenshot** | 1,000+ (vision) | Guesses layout, can't read small text | GPT-4V, Claude 3 |
| **Raw HTML** | 50,000-500,000 | Drowns in `div` soup, classes, scripts | Nothing, really |
| **Readability extract** | 2,000-10,000 | Loses all structure, nav, interactive elements | Text models only |

## The Solution

WebSketch captures the page into a **semantic tree** using 23 UI primitives. One click, paste into any LLM:

```
PAGE
├─ HEADER {sticky}
│  ├─ *LINK "Home"
│  ├─ *LINK "Products"
│  └─ *INPUT <search> "Search..."
├─ SECTION <main>
│  ├─ TEXT <h1> "Welcome to Acme"
│  ├─ TEXT "Build faster with our platform..."
│  └─ *BUTTON "Get Started"
├─ LIST (3 items)
│  ├─ CARD
│  │  ├─ IMAGE "Feature icon"
│  │  └─ TEXT "Real-time sync across devices"
│  ├─ CARD ...
│  └─ CARD ...
└─ FOOTER
   ├─ *LINK "Terms"
   └─ TEXT "© 2026 Acme Inc."
```

| Metric | WebSketch | Raw HTML | Screenshot |
|--------|-----------|----------|------------|
| **Tokens** | 200-800 | 50,000+ | 1,000+ (vision) |
| **Structure** | Full semantic tree | Nested div chaos | Pixel grid |
| **Text content** | Quoted, labeled | Buried in markup | OCR-dependent |
| **Interactive elements** | Marked with `*` | Hidden in attributes | Invisible |
| **Heading hierarchy** | `<h1>` through `<h6>` | Lost in class names | Guessed from size |
| **Landmarks** | `<main>`, `<nav>`, `<footer>` | Requires DOM expertise | Not available |
| **Works with** | Any text LLM | Nothing useful | Vision models only |

## How It Reads

Every line in the tree tells you something:

```
├─ *BUTTON <search> {sticky} "Find products"
│    │       │         │         │
│    │       │         │         └─ Actual visible text
│    │       │         └─ Flags (sticky, scrollable)
│    │       └─ Semantic hint (search, main, h1, aside...)
│    └─ Interactive (clickable/typeable)
│
└─ Tree structure shows parent-child nesting
```

- `*` means the user can interact with it (links, buttons, inputs, checkboxes)
- `<semantic>` preserves meaning that raw role names lose (`TEXT <h1>` vs just `TEXT`)
- `{flags}` surface layout behavior (sticky headers, scrollable containers)
- `"labels"` give the LLM the actual text content, not hashes or placeholders

## Quick Start

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **WebSketch: Capture URL**
3. Paste a URL and hit Enter
4. Click **Copy for LLM** and paste into your prompt

The LLM tab is the default view. One click copies the tree to your clipboard, ready for any model.

## What Gets Captured

WebSketch doesn't just dump the DOM. It runs a 5-tier classifier on every visible element:

1. **ARIA role** &rarr; `role="navigation"` becomes `NAV`
2. **HTML tag** &rarr; `<button>` becomes `BUTTON`, `<h1>` becomes `TEXT <h1>`
3. **Class heuristics** &rarr; `.card`, `.modal`, `.toast` detected
4. **Structural analysis** &rarr; 3+ same-role siblings become `LIST`
5. **Fallback** &rarr; text-only elements become `TEXT`, containers become `SECTION`

Then it cleans up:
- **Transparent table traversal** &mdash; `TR`/`TD`/`TH`/`LI` are skipped, children promoted
- **Zero-content pruning** &mdash; empty, non-interactive, invisible nodes dropped
- **Wrapper collapsing** &mdash; meaningless single-child `SECTION` wrappers removed
- **Empty node filtering** &mdash; `UNKNOWN` and empty `SECTION` noise eliminated from LLM output

The result: a clean tree with the minimum nodes needed to understand the page.

## Commands

| Command | Description |
|---------|-------------|
| `WebSketch: Capture URL` | Prompt for URL, capture, and display |
| `WebSketch: Capture URL from Clipboard` | Capture whatever URL is on your clipboard |
| `WebSketch: Copy LLM Tree to Clipboard` | Copy the tree &mdash; paste straight into ChatGPT, Claude, etc. |
| `WebSketch: Export LLM Tree` | Save as `.md` for prompt libraries or docs |
| `WebSketch: Export Capture as JSON` | Full IR capture with bboxes, hashes, metadata |
| `WebSketch: Export ASCII Wireframe` | Box-drawing layout view |

## Four Views

| Tab | What it shows | Best for |
|-----|---------------|----------|
| **LLM** (default) | Indented semantic tree with labels | Pasting into LLM prompts |
| **ASCII** | Box-drawing wireframe | Visual layout understanding |
| **Tree** | Collapsible node tree with color-coded roles | Debugging captures |
| **JSON** | Full `WebSketchCapture` with syntax highlighting | Programmatic use |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `websketch.chromePath` | Auto-detect | Path to Chrome or Edge executable |
| `websketch.viewportWidth` | `1280` | Viewport width (px) |
| `websketch.viewportHeight` | `800` | Viewport height (px) |
| `websketch.timeout` | `30000` | Navigation timeout (ms) |
| `websketch.waitAfterLoad` | `1000` | Extra wait for JS rendering (ms) |

## Use Cases

**"Describe this page's layout"** &mdash; Paste the tree. The LLM sees exact structure, headings, and navigation without drowning in HTML.

**"What can a user do on this page?"** &mdash; Every interactive element is marked with `*`. Links, buttons, inputs, checkboxes &mdash; all labeled with their visible text.

**"Compare these two pages"** &mdash; Two trees side by side. The LLM can diff structure, spot missing elements, compare navigation patterns.

**"Generate a test plan for this UI"** &mdash; The tree maps directly to test targets. `*BUTTON "Submit"`, `*INPUT <email> "Enter email"`, `*LINK "Terms"` &mdash; each is a testable interaction.

**"Build something that looks like this"** &mdash; The semantic tree is close to a component hierarchy. `HEADER > NAV > LIST > LINK` maps directly to React/Vue/Svelte components.

## Ecosystem

| Package | Role |
|---------|------|
| [websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | Core IR grammar, rendering, diffing, fingerprinting |
| **websketch-vscode** | VS Code extension &mdash; capture pages from your editor (this repo) |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | Command-line capture and rendering |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Chrome extension for in-browser capture |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | MCP server for LLM agent integration |

## Requirements

- VS Code 1.85+
- Chrome or Edge installed on your system

## License

MIT License &mdash; see [LICENSE](LICENSE) for details.

> Part of [MCP Tool Shop](https://mcptoolshop.com)

<p align="center"><img src="logo.png" alt="WebSketch" width="340"></p>

<p align="center"><strong>Capture any web page as a grammar-based intermediate representation — right from VS Code.</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcptoolshop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcptoolshop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

---

## What It Does

Enter a URL, get a structured representation of the page's UI in seconds. WebSketch uses your system Chrome or Edge to load the page, walks the DOM, and compiles it into a fixed vocabulary of **23 semantic primitives** (`BUTTON`, `NAV`, `CARD`, `LIST`, `INPUT`, ...).

The result is displayed in a side panel with three views:

| Tab | Output |
|-----|--------|
| **ASCII** | Box-drawing wireframe — paste directly into LLM prompts |
| **Tree** | Collapsible node tree with color-coded roles |
| **JSON** | Full `WebSketchCapture` object with syntax highlighting |

## Why

LLMs can reason about UI structure when it's expressed as text, but raw HTML is too noisy and screenshots require vision models. WebSketch bridges the gap: a lightweight, deterministic, grammar-based IR that any language model can parse.

## Quick Start

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Run **WebSketch: Capture URL**
3. Paste a URL and hit Enter
4. View the result in the side panel

## Commands

| Command | Description |
|---------|-------------|
| `WebSketch: Capture URL` | Prompt for URL, capture, and display |
| `WebSketch: Capture URL from Clipboard` | Capture whatever URL is on your clipboard |
| `WebSketch: Export Capture as JSON` | Save the current capture as a `.json` file |
| `WebSketch: Export ASCII Wireframe` | Save the ASCII view as a `.txt` file |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `websketch.chromePath` | Auto-detect | Path to Chrome or Edge executable |
| `websketch.viewportWidth` | `1280` | Viewport width (px) |
| `websketch.viewportHeight` | `800` | Viewport height (px) |
| `websketch.timeout` | `30000` | Navigation timeout (ms) |
| `websketch.waitAfterLoad` | `1000` | Extra wait for JS rendering (ms) |

## How It Works

1. **Browser discovery** — finds Chrome or Edge on your system (Windows, macOS, Linux)
2. **Headless capture** — launches a headless browser via `puppeteer-core` (no 200MB download)
3. **DOM walk** — injects a classifier that maps every visible element through five tiers:
   - ARIA role &rarr; HTML tag &rarr; class heuristics &rarr; structural analysis &rarr; fallback
4. **Transparent table traversal** — `TR`/`TD`/`TH` are skipped; their children are promoted
5. **Zero-content pruning** — empty, non-interactive, invisible nodes are dropped
6. **Repeated sibling detection** — 3+ children with the same role become a `LIST`
7. **Compilation** — raw output is validated and compiled to `WebSketchCapture` via [`@mcptoolshop/websketch-ir`](https://github.com/mcp-tool-shop-org/websketch-ir)

## Ecosystem

| Package | Role |
|---------|------|
| [websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | Core IR grammar, ASCII rendering, diffing, fingerprinting |
| **websketch-vscode** | VS Code extension — capture pages from your editor (this repo) |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | Command-line capture and rendering |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Chrome extension for in-browser capture |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | MCP server for LLM agent integration |

## Requirements

- VS Code 1.85+
- Chrome or Edge installed on your system

## License

MIT License — see [LICENSE](LICENSE) for details.

> Part of [MCP Tool Shop](https://mcptoolshop.com)

<p align="center"><img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/websketch-vscode/readme.png" alt="WebSketch" width="340"></p>

<h1 align="center">WebSketch</h1>

<p align="center"><strong>Transforme qualquer página web em uma árvore estruturada que LLMs realmente conseguem entender.</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcp-tool-shop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="Licença: MIT"></a>
  <a href="https://mcp-tool-shop-org.github.io/websketch-vscode/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <strong>Português</strong>
</p>

<p align="center">
  <a href="#the-problem">O Problema</a> · <a href="#the-solution">A Solução</a> · <a href="#quick-start">Início Rápido</a> · <a href="#how-it-reads">Como Funciona a Leitura</a> · <a href="#use-cases">Casos de Uso</a> · <a href="#ecosystem">Ecossistema</a>
</p>

---

## O Problema

Você quer que um LLM analise uma página web — seu layout, navegação, elementos interativos, hierarquia de conteúdo. Suas opções atuais ficam aquém:

| Abordagem | Tokens | O que você perde |
|-----------|--------|------------------|
| **Screenshot** | 1.000+ (visão) | Não lê texto pequeno, adivinha o layout, zero informação de interatividade |
| **HTML bruto** | 50.000–500.000 | Afoga em sopa de `div`, estilos inline, scripts, ruído de SVG |
| **Extração de legibilidade** | 2.000–10.000 | Remove toda a estrutura — sem nav, sem botões, sem formulários |
| **Dump do DOM** | 10.000–100.000 | Nomes de classes, atributos data, artefatos de framework por toda parte |

O problema central: **nenhuma dessas opções fala a linguagem da UI**. LLMs não precisam de `<div class="sc-bdnxRM jJFqsI">` — eles precisam de `NAV`, `BUTTON`, `CARD`, `LIST`.

## A Solução

O WebSketch captura a página em uma **árvore semântica** usando 23 primitivas de UI. Um clique no VS Code, cole em qualquer LLM:

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

**200–800 tokens.** Não 50.000. Não uma grade de pixels. Uma árvore limpa sobre a qual qualquer modelo de texto pode raciocinar.

### Comparação Direta

| Métrica | WebSketch | HTML Bruto | Screenshot |
|---------|-----------|------------|------------|
| **Tokens** | 200–800 | 50.000+ | 1.000+ (visão) |
| **Estrutura** | Árvore semântica completa | Caos de divs aninhadas | Grade de pixels |
| **Conteúdo de texto** | Entre aspas, rotulado | Enterrado na marcação | Dependente de OCR |
| **Elementos interativos** | Marcados com `*` | Ocultos em atributos | Invisíveis |
| **Hierarquia de títulos** | `<h1>` até `<h6>` | Perdida em nomes de classes | Adivinhada pelo tamanho |
| **Landmarks** | `<main>`, `<nav>`, `<search>` | Requer expertise em DOM | Não disponível |
| **Funciona com** | Qualquer LLM de texto | Nada útil | Apenas modelos de visão |

## Início Rápido

1. Instale pelo [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode) ou execute:
   ```
   ext install mcp-tool-shop.websketch-vscode
   ```
2. Abra a Paleta de Comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Execute **WebSketch: Capture URL**
4. Cole uma URL e pressione Enter
5. Clique em **Copy for LLM** e cole no seu prompt

A aba LLM é a visualização padrão. Um clique copia a árvore para a área de transferência, pronta para qualquer modelo.

## Como Funciona a Leitura

Cada linha da árvore é densa em informação e interpretável por máquina:

```
├─ *BUTTON <search> {sticky} "Find products"
│    │       │         │         │
│    │       │         │         └─ Texto visível real
│    │       │         └─ Flags (sticky, scrollable)
│    │       └─ Dica semântica (search, main, h1, aside...)
│    └─ Interativo (clicável/digitável)
│
└─ Estrutura de árvore mostra aninhamento pai-filho
```

### A Gramática

| Símbolo | Significado | Exemplo |
|---------|-------------|---------|
| Prefixo `*` | O usuário pode interagir | `*LINK`, `*BUTTON`, `*INPUT` |
| `<semântico>` | Significado HTML5/ARIA preservado | `<h1>`, `<main>`, `<search>`, `<aside>` |
| `{flags}` | Comportamento de layout | `{sticky}`, `{scrollable}` |
| `"rótulo"` | Conteúdo de texto visível | `"Sign up free"`, `"Search..."` |
| `(N items)` | Contagem de itens da lista | `LIST (12 items)` |
| Indentação | Hierarquia pai-filho | `HEADER > NAV > LIST > LINK` |

### Os 23 Papéis

| Categoria | Papéis |
|-----------|--------|
| **Layout** | `PAGE`, `HEADER`, `FOOTER`, `SECTION`, `NAV` |
| **Conteúdo** | `TEXT`, `IMAGE`, `ICON`, `CARD`, `LIST`, `TABLE` |
| **Interativo** | `BUTTON`, `LINK`, `INPUT`, `CHECKBOX`, `RADIO`, `FORM` |
| **Sobreposições** | `MODAL`, `TOAST`, `DROPDOWN` |
| **Navegação** | `PAGINATION` |
| **Fallback** | `UNKNOWN` |

Esses 23 papéis são um vocabulário fixo — o mesmo em qualquer site. LLMs os aprendem uma vez e podem raciocinar sobre qualquer página.

## O Que É Capturado

O WebSketch não faz apenas um dump do DOM. Ele executa um **classificador de 5 camadas** em cada elemento visível:

| Camada | Fonte | Exemplo |
|--------|-------|---------|
| 1. **ARIA role** | `role="navigation"` | → `NAV` |
| 2. **Tag HTML** | `<button>`, `<h1>` | → `BUTTON`, `TEXT <h1>` |
| 3. **Heurísticas de classe** | `.card`, `.modal`, `.toast` | → `CARD`, `MODAL`, `TOAST` |
| 4. **Análise estrutural** | 3+ irmãos com mesmo papel | → `LIST` |
| 5. **Fallback** | Elementos somente texto | → `TEXT`, `SECTION`, `UNKNOWN` |

Em seguida, faz a limpeza:

- **Travessia transparente de tabelas** — `TR`/`TD`/`TH`/`LI` são ignorados, filhos promovidos à superfície
- **Poda de conteúdo vazio** — nós vazios, não interativos e invisíveis são descartados
- **Colapso de wrappers** — wrappers `SECTION` sem significado com filho único são removidos
- **Poda em cascata** — cadeias de wrappers vazios sem conteúdo são eliminadas por completo
- **Extração de rótulos** — texto visível extraído de links, botões, títulos, imagens, inputs

O resultado: uma árvore limpa com o mínimo de nós necessários para entender a página.

## Casos de Uso

### Para Engenheiros de Prompt

**"Descreva o layout desta página"** — Cole a árvore. O LLM vê a estrutura exata, títulos e navegação sem se afogar em HTML. Funciona com ChatGPT, Claude, Gemini, Llama — qualquer modelo de texto.

**"O que um usuário pode fazer nesta página?"** — Todo elemento interativo é marcado com `*`. Links, botões, inputs, checkboxes — todos rotulados com seu texto visível. O LLM pode enumerar cada ação possível do usuário.

**"Compare estas duas páginas"** — Duas árvores lado a lado. O LLM pode comparar estruturas, identificar elementos ausentes, comparar padrões de navegação — tudo em algumas centenas de tokens.

### Para Desenvolvedores

**"Gere um plano de testes para esta UI"** — A árvore mapeia diretamente para alvos de teste. `*BUTTON "Submit"`, `*INPUT <email> "Enter email"`, `*LINK "Terms"` — cada um é uma interação testável com seu rótulo visível.

**"Construa algo parecido com isto"** — A árvore semântica é próxima de uma hierarquia de componentes. `HEADER > NAV > LIST > LINK` mapeia diretamente para componentes React/Vue/Svelte. O LLM pode criar um layout correspondente.

**"Audite esta página quanto à acessibilidade"** — Landmarks ausentes, inputs sem rótulo, lacunas na hierarquia de títulos — tudo visível na árvore. Dicas semânticas como `<main>`, `<nav>`, `<search>` mostram quais papéis ARIA estão presentes (ou ausentes).

### Para Agentes de IA

**Integração MCP** — Use [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) para dar ao seu agente de IA a capacidade de capturar e raciocinar sobre qualquer página web como parte da sua cadeia de ferramentas.

**Monitoramento automatizado** — Use [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) para capturar páginas em um cronograma, comparar as árvores e detectar mudanças estruturais.

## Quatro Visualizações

| Aba | O que mostra | Melhor para |
|-----|--------------|-------------|
| **LLM** (padrão) | Árvore semântica indentada com rótulos, semântica, flags | Colar em prompts de LLM |
| **ASCII** | Wireframe com desenho de caixa e layout espacial | Entender o layout visual |
| **Tree** | Árvore de nós recolhível com emblemas de papel coloridos | Depurar capturas |
| **JSON** | IR completo `WebSketchCapture` com destaque de sintaxe | Uso programático e pipelines |

## Comandos

| Comando | Descrição |
|---------|-----------|
| `WebSketch: Capture URL` | Solicita uma URL, captura e exibe |
| `WebSketch: Capture URL from Clipboard` | Captura a URL que está na sua área de transferência |
| `WebSketch: Copy LLM Tree to Clipboard` | Copia a árvore — cole diretamente no ChatGPT, Claude, etc. |
| `WebSketch: Export LLM Tree` | Salva como `.md` para bibliotecas de prompt ou documentação |
| `WebSketch: Export Capture as JSON` | Captura IR completa com bboxes, hashes, metadados |
| `WebSketch: Export ASCII Wireframe` | Visualização de layout com desenho de caixa |

## Configurações

| Configuração | Padrão | Descrição |
|--------------|--------|-----------|
| `websketch.chromePath` | Detecção automática | Caminho para o executável do Chrome ou Edge |
| `websketch.viewportWidth` | `1280` | Largura da viewport em pixels |
| `websketch.viewportHeight` | `800` | Altura da viewport em pixels |
| `websketch.timeout` | `30000` | Tempo limite de navegação (ms) |
| `websketch.waitAfterLoad` | `1000` | Espera extra para renderização JS (ms) |

## Ecossistema

O WebSketch é uma família de ferramentas construída sobre uma gramática compartilhada:

| Pacote | O que faz |
|--------|-----------|
| [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | IR principal — gramática, validação, renderização, diffing, fingerprinting |
| **websketch-vscode** | Extensão VS Code — capture páginas do seu editor (este repositório) |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | Captura e renderização via linha de comando |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Extensão Chrome para captura no navegador |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | Servidor MCP para integração com agentes LLM |

Todas as ferramentas produzem o mesmo IR `WebSketchCapture`, então as saídas são intercambiáveis entre pipelines.

## Requisitos

- VS Code 1.85+
- Chrome ou Edge instalado no seu sistema

Sem navegador embutido. Sem download de 200MB. O WebSketch usa `puppeteer-core` com o navegador que você já tem.

## Licença

Licença MIT — veja [LICENSE](LICENSE) para detalhes.

> Parte do [MCP Tool Shop](https://mcptoolshop.com)

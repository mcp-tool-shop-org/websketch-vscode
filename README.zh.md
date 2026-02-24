<p align="center"><img src="logo.png" alt="WebSketch" width="340"></p>

<h1 align="center">WebSketch</h1>

<p align="center"><strong>将任何网页转化为 LLM 能真正理解的结构化语义树。</strong></p>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <strong>中文</strong> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcptoolshop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcptoolshop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

<p align="center">
  <a href="#the-problem">问题所在</a> · <a href="#the-solution">解决方案</a> · <a href="#quick-start">快速开始</a> · <a href="#how-it-reads">解读方式</a> · <a href="#use-cases">使用场景</a> · <a href="#ecosystem">生态系统</a>
</p>

---

## The Problem

你想让 LLM 理解一个网页——它的布局、导航、交互元素和内容层级。但现有的方案都不够理想：

| 方案 | Token 数 | 丢失了什么 |
|------|----------|-----------|
| **截图** | 1,000+（视觉模型） | 无法识别小字，只能猜测布局，完全没有交互信息 |
| **原始 HTML** | 50,000–500,000 | 淹没在 `div` 汤中，内联样式、脚本、SVG 噪声满天飞 |
| **可读性提取** | 2,000–10,000 | 所有结构被剥离——没有导航、没有按钮、没有表单 |
| **DOM 转储** | 10,000–100,000 | 到处都是类名、data 属性和框架产物 |

核心问题在于：**这些方案都不是用 UI 的语言在说话**。LLM 不需要 `<div class="sc-bdnxRM jJFqsI">` ——它需要的是 `NAV`、`BUTTON`、`CARD`、`LIST`。

## The Solution

WebSketch 使用 23 个 UI 语义原语将页面捕获为一棵**语义树**。在 VS Code 中一键操作，粘贴到任意 LLM：

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

**200–800 个 token。** 不是 50,000，也不是像素网格。一棵干净的语义树，任何文本模型都能理解。

### 正面对比

| 指标 | WebSketch | 原始 HTML | 截图 |
|------|-----------|----------|------|
| **Token 数** | 200–800 | 50,000+ | 1,000+（视觉模型） |
| **结构** | 完整语义树 | 嵌套 div 混乱 | 像素网格 |
| **文本内容** | 带引号、带标签 | 埋在标记中 | 依赖 OCR |
| **交互元素** | 用 `*` 标记 | 隐藏在属性中 | 不可见 |
| **标题层级** | `<h1>` 到 `<h6>` | 消失在类名中 | 根据字号猜测 |
| **地标元素** | `<main>`、`<nav>`、`<search>` | 需要 DOM 专业知识 | 无法获取 |
| **适用于** | 任何文本 LLM | 几乎无用 | 仅限视觉模型 |

## Quick Start

1. 从 [VS Code 扩展市场](https://marketplace.visualstudio.com/items?itemName=mcptoolshop.websketch-vscode) 安装，或运行：
   ```
   ext install mcptoolshop.websketch-vscode
   ```
2. 打开命令面板（`Ctrl+Shift+P` / `Cmd+Shift+P`）
3. 运行 **WebSketch: Capture URL**
4. 粘贴 URL 并按 Enter
5. 点击 **Copy for LLM**，将内容粘贴到你的提示词中

LLM 标签页是默认视图。一键即可将语义树复制到剪贴板，可直接用于任何模型。

## How It Reads

语义树中的每一行都是信息密集且机器可解析的：

```
├─ *BUTTON <search> {sticky} "Find products"
│    │       │         │         │
│    │       │         │         └─ 实际可见文本
│    │       │         └─ 标记（sticky、scrollable）
│    │       └─ 语义提示（search、main、h1、aside……）
│    └─ 可交互（可点击/可输入）
│
└─ 树形结构展示父子嵌套关系
```

### 语法规则

| 符号 | 含义 | 示例 |
|------|------|------|
| `*` 前缀 | 用户可以与之交互 | `*LINK`、`*BUTTON`、`*INPUT` |
| `<semantic>` | 保留 HTML5/ARIA 语义 | `<h1>`、`<main>`、`<search>`、`<aside>` |
| `{flags}` | 布局行为 | `{sticky}`、`{scrollable}` |
| `"label"` | 可见文本内容 | `"Sign up free"`、`"Search..."` |
| `(N items)` | 列表项数量 | `LIST (12 items)` |
| 缩进 | 父子层级关系 | `HEADER > NAV > LIST > LINK` |

### 23 个角色

| 类别 | 角色 |
|------|------|
| **布局** | `PAGE`、`HEADER`、`FOOTER`、`SECTION`、`NAV` |
| **内容** | `TEXT`、`IMAGE`、`ICON`、`CARD`、`LIST`、`TABLE` |
| **交互** | `BUTTON`、`LINK`、`INPUT`、`CHECKBOX`、`RADIO`、`FORM` |
| **浮层** | `MODAL`、`TOAST`、`DROPDOWN` |
| **导航** | `PAGINATION` |
| **兜底** | `UNKNOWN` |

这 23 个角色是一个固定词汇表——在所有网站上都保持一致。LLM 只需学习一次，就能理解任何页面。

## What Gets Captured

WebSketch 不是简单地转储 DOM。它对每个可见元素运行一个 **5 级分类器**：

| 层级 | 来源 | 示例 |
|------|------|------|
| 1. **ARIA 角色** | `role="navigation"` | → `NAV` |
| 2. **HTML 标签** | `<button>`、`<h1>` | → `BUTTON`、`TEXT <h1>` |
| 3. **类名启发式** | `.card`、`.modal`、`.toast` | → `CARD`、`MODAL`、`TOAST` |
| 4. **结构分析** | 3 个以上同角色兄弟节点 | → `LIST` |
| 5. **兜底规则** | 纯文本元素 | → `TEXT`、`SECTION`、`UNKNOWN` |

然后进行清理：

- **透明表格遍历** —— 跳过 `TR`/`TD`/`TH`/`LI`，将子节点提升到表面
- **零内容修剪** —— 删除空的、非交互的、不可见的节点
- **包装器折叠** —— 移除无意义的单子节点 `SECTION` 包装器
- **级联修剪** —— 彻底消除没有内容的空壳包装器链
- **标签提取** —— 从链接、按钮、标题、图片、输入框中提取可见文本

最终结果：一棵干净的语义树，包含理解页面所需的最少节点。

## Use Cases

### 面向提示词工程师

**"描述这个页面的布局"** —— 粘贴语义树。LLM 能看到精确的结构、标题和导航，不会被 HTML 淹没。适用于 ChatGPT、Claude、Gemini、Llama——任何文本模型。

**"用户在这个页面上能做什么？"** —— 每个交互元素都用 `*` 标记。链接、按钮、输入框、复选框——都带有可见文本标签。LLM 可以列举用户所有可能的操作。

**"比较这两个页面"** —— 两棵语义树并排放置。LLM 可以比较结构差异、发现缺失元素、对比导航模式——只需几百个 token。

### 面向开发者

**"为这个 UI 生成测试计划"** —— 语义树直接映射到测试目标。`*BUTTON "Submit"`、`*INPUT <email> "Enter email"`、`*LINK "Terms"` ——每一个都是带有可见标签的可测试交互。

**"构建一个看起来像这样的页面"** —— 语义树接近于组件层级结构。`HEADER > NAV > LIST > LINK` 可以直接映射到 React/Vue/Svelte 组件。LLM 可以快速搭建匹配的布局。

**"审查这个页面的无障碍性"** —— 缺失的地标元素、未标注的输入框、标题层级断裂——这些在语义树中一目了然。`<main>`、`<nav>`、`<search>` 等语义提示清楚地展示了哪些 ARIA 角色存在（或缺失）。

### 面向 AI 智能体

**MCP 集成** —— 使用 [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) 赋予你的 AI 智能体捕获和理解任意网页的能力，将其作为工具链的一部分。

**自动化监控** —— 使用 [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) 按计划捕获页面、比较语义树差异，检测结构变化。

## Four Views

| 标签页 | 显示内容 | 最适合 |
|--------|---------|--------|
| **LLM**（默认） | 带标签、语义和标记的缩进语义树 | 粘贴到 LLM 提示词中 |
| **ASCII** | 使用制表符的线框布局 | 理解视觉布局 |
| **Tree** | 可折叠的节点树，带彩色角色标签 | 调试捕获结果 |
| **JSON** | 完整的 `WebSketchCapture` IR，带语法高亮 | 编程使用和流水线集成 |

## Commands

| 命令 | 描述 |
|------|------|
| `WebSketch: Capture URL` | 输入 URL，捕获页面并显示结果 |
| `WebSketch: Capture URL from Clipboard` | 捕获剪贴板中的 URL |
| `WebSketch: Copy LLM Tree to Clipboard` | 复制语义树——可直接粘贴到 ChatGPT、Claude 等 |
| `WebSketch: Export LLM Tree` | 保存为 `.md` 文件，用于提示词库或文档 |
| `WebSketch: Export Capture as JSON` | 完整 IR 捕获，包含边界框、哈希值和元数据 |
| `WebSketch: Export ASCII Wireframe` | 制表符绘制的布局视图 |

## Settings

| 设置项 | 默认值 | 描述 |
|--------|--------|------|
| `websketch.chromePath` | 自动检测 | Chrome 或 Edge 可执行文件的路径 |
| `websketch.viewportWidth` | `1280` | 视口宽度（像素） |
| `websketch.viewportHeight` | `800` | 视口高度（像素） |
| `websketch.timeout` | `30000` | 导航超时时间（毫秒） |
| `websketch.waitAfterLoad` | `1000` | JS 渲染的额外等待时间（毫秒） |

## Ecosystem

WebSketch 是一个基于共享语法构建的工具家族：

| 包 | 功能 |
|----|------|
| [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | 核心 IR——语法、验证、渲染、差异比较、指纹识别 |
| **websketch-vscode** | VS Code 扩展——在编辑器中捕获页面（即本仓库） |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | 命令行捕获与渲染 |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Chrome 扩展，用于浏览器内捕获 |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | MCP 服务器，用于 LLM 智能体集成 |

所有工具都生成相同的 `WebSketchCapture` IR，因此输出可在不同流水线之间互换使用。

## Requirements

- VS Code 1.85+
- 系统中已安装 Chrome 或 Edge

无需捆绑浏览器，无需 200MB 下载。WebSketch 使用 `puppeteer-core`，直接调用你已有的浏览器。

## License

MIT 许可证——详见 [LICENSE](LICENSE)。

> 隶属于 [MCP Tool Shop](https://mcptoolshop.com)

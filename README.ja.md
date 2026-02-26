<p align="center">
            <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/websketch-vscode/readme.png"
           alt="WebSketch" width="340"></p>

<h1 align="center">WebSketch</h1>

<p align="center"><strong>あらゆるWebページを、LLMが本当に理解できる構造化ツリーに変換。</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcp-tool-shop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://mcp-tool-shop-org.github.io/websketch-vscode/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <strong>日本語</strong> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <a href="#the-problem">課題</a> · <a href="#the-solution">解決策</a> · <a href="#quick-start">クイックスタート</a> · <a href="#how-it-reads">読み方</a> · <a href="#use-cases">ユースケース</a> · <a href="#ecosystem">エコシステム</a>
</p>

---

## The Problem

LLMにWebページのレイアウト、ナビゲーション、インタラクティブ要素、コンテンツ階層を推論させたい。しかし、現在の選択肢はどれも不十分です：

| アプローチ | トークン数 | 失われるもの |
|----------|--------|---------------|
| **スクリーンショット** | 1,000以上（ビジョン） | 小さな文字が読めない、レイアウトは推測、インタラクション情報はゼロ |
| **生のHTML** | 50,000〜500,000 | `div`の海に溺れ、インラインスタイル、スクリプト、SVGノイズだらけ |
| **Readability抽出** | 2,000〜10,000 | 構造がすべて失われる — ナビもボタンもフォームもなし |
| **DOMダンプ** | 10,000〜100,000 | クラス名、data属性、フレームワーク固有の記述があちこちに |

根本的な問題：**どれもUIの言語を話していない**ということです。LLMに必要なのは `<div class="sc-bdnxRM jJFqsI">` ではなく、`NAV`、`BUTTON`、`CARD`、`LIST` です。

## The Solution

WebSketchは23のUIプリミティブを使ってページを**セマンティックツリー**にキャプチャします。VS Codeでワンクリック、あとは任意のLLMに貼り付けるだけ：

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

**200〜800トークン。** 50,000ではありません。ピクセルグリッドでもありません。どんなテキストモデルでも推論できるクリーンなツリーです。

### 直接比較

| 指標 | WebSketch | 生のHTML | スクリーンショット |
|--------|-----------|----------|------------|
| **トークン数** | 200〜800 | 50,000以上 | 1,000以上（ビジョン） |
| **構造** | 完全なセマンティックツリー | ネストされたdivの混沌 | ピクセルグリッド |
| **テキストコンテンツ** | 引用符付き、ラベル付き | マークアップに埋もれている | OCR依存 |
| **インタラクティブ要素** | `*` でマーク | 属性の中に隠れている | 見えない |
| **見出し階層** | `<h1>` から `<h6>` まで | クラス名に埋没 | サイズから推測 |
| **ランドマーク** | `<main>`、`<nav>`、`<search>` | DOM知識が必要 | 利用不可 |
| **対応モデル** | あらゆるテキストLLM | 実用的なものなし | ビジョンモデルのみ |

## Quick Start

1. [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode)からインストール、または以下を実行：
   ```
   ext install mcp-tool-shop.websketch-vscode
   ```
2. コマンドパレットを開く（`Ctrl+Shift+P` / `Cmd+Shift+P`）
3. **WebSketch: Capture URL** を実行
4. URLを貼り付けてEnterを押す
5. **Copy for LLM** をクリックしてプロンプトに貼り付け

LLMタブがデフォルトビューです。ワンクリックでツリーがクリップボードにコピーされ、どのモデルにもすぐに使えます。

## How It Reads

ツリーの各行は情報密度が高く、機械解析可能です：

```
├─ *BUTTON <search> {sticky} "Find products"
│    │       │         │         │
│    │       │         │         └─ 実際に表示されるテキスト
│    │       │         └─ フラグ（sticky、scrollable）
│    │       └─ セマンティックヒント（search、main、h1、aside...）
│    └─ インタラクティブ（クリック/入力可能）
│
└─ ツリー構造が親子のネストを表現
```

### 文法

| 記号 | 意味 | 例 |
|--------|---------|---------|
| `*` プレフィックス | ユーザーが操作できる要素 | `*LINK`、`*BUTTON`、`*INPUT` |
| `<semantic>` | HTML5/ARIAの意味を保持 | `<h1>`、`<main>`、`<search>`、`<aside>` |
| `{flags}` | レイアウトの振る舞い | `{sticky}`、`{scrollable}` |
| `"label"` | 表示テキスト | `"Sign up free"`、`"Search..."` |
| `(N items)` | リストのアイテム数 | `LIST (12 items)` |
| インデント | 親子の階層関係 | `HEADER > NAV > LIST > LINK` |

### 23のロール

| カテゴリ | ロール |
|----------|-------|
| **レイアウト** | `PAGE`、`HEADER`、`FOOTER`、`SECTION`、`NAV` |
| **コンテンツ** | `TEXT`、`IMAGE`、`ICON`、`CARD`、`LIST`、`TABLE` |
| **インタラクティブ** | `BUTTON`、`LINK`、`INPUT`、`CHECKBOX`、`RADIO`、`FORM` |
| **オーバーレイ** | `MODAL`、`TOAST`、`DROPDOWN` |
| **ナビゲーション** | `PAGINATION` |
| **フォールバック** | `UNKNOWN` |

この23のロールは固定の語彙であり、あらゆるWebサイトで共通です。LLMは一度学習すれば、どんなページでも推論できます。

## What Gets Captured

WebSketchは単にDOMをダンプするのではなく、すべての可視要素に対して**5段階の分類器**を実行します：

| 段階 | ソース | 例 |
|------|--------|---------|
| 1. **ARIAロール** | `role="navigation"` | → `NAV` |
| 2. **HTMLタグ** | `<button>`、`<h1>` | → `BUTTON`、`TEXT <h1>` |
| 3. **クラスヒューリスティクス** | `.card`、`.modal`、`.toast` | → `CARD`、`MODAL`、`TOAST` |
| 4. **構造解析** | 同一ロールの兄弟要素が3つ以上 | → `LIST` |
| 5. **フォールバック** | テキストのみの要素 | → `TEXT`、`SECTION`、`UNKNOWN` |

その後、クリーンアップを行います：

- **テーブルの透過的走査** — `TR`/`TD`/`TH`/`LI` はスキップされ、子要素が表面に昇格
- **空コンテンツの刈り込み** — 空で、非インタラクティブで、不可視のノードを除去
- **ラッパーの折りたたみ** — 意味のない単一子要素の `SECTION` ラッパーを除去
- **カスケード刈り込み** — コンテンツのない空のラッパーチェーンを完全に除去
- **ラベル抽出** — リンク、ボタン、見出し、画像、入力フィールドから表示テキストを取得

結果：ページを理解するために必要な最小限のノードで構成されたクリーンなツリーが得られます。

## Use Cases

### プロンプトエンジニア向け

**「このページのレイアウトを説明して」** — ツリーを貼り付けるだけ。LLMはHTMLに溺れることなく、正確な構造、見出し、ナビゲーションを把握できます。ChatGPT、Claude、Gemini、Llama — あらゆるテキストモデルで動作します。

**「このページでユーザーは何ができる？」** — すべてのインタラクティブ要素は `*` でマークされています。リンク、ボタン、入力フィールド、チェックボックス — すべてが表示テキスト付きでラベリングされています。LLMはユーザーが取りうるすべてのアクションを列挙できます。

**「この2つのページを比較して」** — 2つのツリーを並べるだけ。LLMは構造の差分、欠落要素の発見、ナビゲーションパターンの比較を、わずか数百トークンで行えます。

### 開発者向け

**「このUIのテスト計画を生成して」** — ツリーはテスト対象に直接マッピングされます。`*BUTTON "Submit"`、`*INPUT <email> "Enter email"`、`*LINK "Terms"` — それぞれが表示ラベル付きのテスト可能なインタラクションです。

**「こんな感じのものを作って」** — セマンティックツリーはコンポーネント階層に近い構造です。`HEADER > NAV > LIST > LINK` はReact/Vue/Svelteコンポーネントに直接マッピングできます。LLMは一致するレイアウトをスキャフォールドできます。

**「このページのアクセシビリティを監査して」** — ランドマークの欠如、ラベルのない入力フィールド、見出し階層の欠落 — すべてがツリーで確認できます。`<main>`、`<nav>`、`<search>` などのセマンティックヒントが、ARIAロールの存在（または欠如）を示します。

### AIエージェント向け

**MCP統合** — [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp)を使用すると、AIエージェントにツールチェーンの一部として任意のWebページをキャプチャ・推論する能力を付与できます。

**自動モニタリング** — [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli)を使用すると、スケジュールに従ってページをキャプチャし、ツリーの差分を取り、構造的な変更を検出できます。

## Four Views

| タブ | 表示内容 | 最適な用途 |
|-----|---------------|----------|
| **LLM**（デフォルト） | ラベル、セマンティクス、フラグ付きのインデントされたセマンティックツリー | LLMプロンプトへの貼り付け |
| **ASCII** | 罫線描画によるワイヤーフレームと空間レイアウト | 視覚的なレイアウト理解 |
| **Tree** | 色分けされたロールバッジ付きの折りたたみ可能なノードツリー | キャプチャのデバッグ |
| **JSON** | シンタックスハイライト付きの完全な `WebSketchCapture` IR | プログラムからの利用やパイプライン |

## Commands

| コマンド | 説明 |
|---------|-------------|
| `WebSketch: Capture URL` | URLを入力してキャプチャ・表示 |
| `WebSketch: Capture URL from Clipboard` | クリップボードのURLをキャプチャ |
| `WebSketch: Copy LLM Tree to Clipboard` | ツリーをコピー — ChatGPTやClaudeなどにそのまま貼り付け |
| `WebSketch: Export LLM Tree` | プロンプトライブラリやドキュメント用に `.md` として保存 |
| `WebSketch: Export Capture as JSON` | バウンディングボックス、ハッシュ、メタデータを含む完全なIRキャプチャ |
| `WebSketch: Export ASCII Wireframe` | 罫線描画によるレイアウトビュー |

## Settings

| 設定 | デフォルト値 | 説明 |
|---------|---------|-------------|
| `websketch.chromePath` | 自動検出 | ChromeまたはEdgeの実行ファイルパス |
| `websketch.viewportWidth` | `1280` | ビューポートの幅（ピクセル） |
| `websketch.viewportHeight` | `800` | ビューポートの高さ（ピクセル） |
| `websketch.timeout` | `30000` | ナビゲーションのタイムアウト（ミリ秒） |
| `websketch.waitAfterLoad` | `1000` | JS描画完了までの追加待機時間（ミリ秒） |

## Ecosystem

WebSketchは共通の文法に基づいて構築されたツールファミリーです：

| パッケージ | 機能 |
|---------|-------------|
| [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | コアIR — 文法、バリデーション、レンダリング、差分、フィンガープリンティング |
| **websketch-vscode** | VS Code拡張機能 — エディタからページをキャプチャ（このリポジトリ） |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | コマンドラインでのキャプチャとレンダリング |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | ブラウザ内キャプチャ用Chrome拡張機能 |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | LLMエージェント統合用MCPサーバー |

すべてのツールは同じ `WebSketchCapture` IRを生成するため、パイプライン間で出力を相互に利用できます。

## Requirements

- VS Code 1.85以上
- ChromeまたはEdgeがシステムにインストールされていること

ブラウザは同梱されません。200MBのダウンロードもありません。WebSketchは `puppeteer-core` を使い、既にインストールされているブラウザをそのまま利用します。

## License

MITライセンス — 詳細は[LICENSE](LICENSE)をご覧ください。

> [MCP Tool Shop](https://mcptoolshop.com)の一部です

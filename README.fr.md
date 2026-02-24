<p align="center"><img src="logo.png" alt="WebSketch" width="340"></p>

<h1 align="center">WebSketch</h1>

<p align="center"><strong>Transformez n'importe quelle page web en un arbre structuré que les LLM peuvent réellement comprendre.</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcptoolshop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcptoolshop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="Licence : MIT"></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <strong>Français</strong> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <a href="#the-problem">Le problème</a> · <a href="#the-solution">La solution</a> · <a href="#quick-start">Démarrage rapide</a> · <a href="#how-it-reads">Comment lire l'arbre</a> · <a href="#use-cases">Cas d'utilisation</a> · <a href="#ecosystem">Écosystème</a>
</p>

---

## Le problème

Vous voulez qu'un LLM raisonne sur une page web — sa mise en page, sa navigation, ses éléments interactifs, sa hiérarchie de contenu. Les options actuelles sont toutes insuffisantes :

| Approche | Tokens | Ce que vous perdez |
|----------|--------|--------------------|
| **Capture d'écran** | 1 000+ (vision) | Ne peut pas lire le texte petit, devine la mise en page, aucune info sur l'interactivité |
| **HTML brut** | 50 000–500 000 | Noyé dans une soupe de `div`, styles en ligne, scripts, bruit SVG |
| **Extraction Readability** | 2 000–10 000 | Supprime toute structure — pas de nav, pas de boutons, pas de formulaires |
| **Dump du DOM** | 10 000–100 000 | Noms de classes, attributs data, artefacts de frameworks partout |

Le problème fondamental : **aucune de ces approches ne parle le langage de l'interface utilisateur**. Les LLM n'ont pas besoin de `<div class="sc-bdnxRM jJFqsI">` — ils ont besoin de `NAV`, `BUTTON`, `CARD`, `LIST`.

## La solution

WebSketch capture la page sous forme d'un **arbre sémantique** utilisant 23 primitives d'interface. Un clic dans VS Code, collez dans n'importe quel LLM :

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

**200 à 800 tokens.** Pas 50 000. Pas une grille de pixels. Un arbre propre que n'importe quel modèle textuel peut analyser.

### Comparaison directe

| Métrique | WebSketch | HTML brut | Capture d'écran |
|----------|-----------|-----------|-----------------|
| **Tokens** | 200–800 | 50 000+ | 1 000+ (vision) |
| **Structure** | Arbre sémantique complet | Chaos de div imbriquées | Grille de pixels |
| **Contenu textuel** | Entre guillemets, étiqueté | Enfoui dans le balisage | Dépend de l'OCR |
| **Éléments interactifs** | Marqués avec `*` | Cachés dans les attributs | Invisibles |
| **Hiérarchie des titres** | `<h1>` à `<h6>` | Perdue dans les noms de classes | Devinée d'après la taille |
| **Points de repère** | `<main>`, `<nav>`, `<search>` | Nécessite une expertise DOM | Non disponible |
| **Compatible avec** | Tout LLM textuel | Rien d'utile | Modèles de vision uniquement |

## Démarrage rapide

1. Installez depuis le [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mcptoolshop.websketch-vscode) ou exécutez :
   ```
   ext install mcptoolshop.websketch-vscode
   ```
2. Ouvrez la palette de commandes (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Exécutez **WebSketch: Capture URL**
4. Collez une URL et appuyez sur Entrée
5. Cliquez sur **Copy for LLM** et collez dans votre prompt

L'onglet LLM est la vue par défaut. Un seul clic copie l'arbre dans votre presse-papiers, prêt pour n'importe quel modèle.

## Comment lire l'arbre

Chaque ligne de l'arbre est dense en information et analysable par la machine :

```
├─ *BUTTON <search> {sticky} "Find products"
│    │       │         │         │
│    │       │         │         └─ Texte visible réel
│    │       │         └─ Drapeaux (sticky, scrollable)
│    │       └─ Indice sémantique (search, main, h1, aside...)
│    └─ Interactif (cliquable/saisissable)
│
└─ La structure en arbre montre l'imbrication parent-enfant
```

### La grammaire

| Symbole | Signification | Exemple |
|---------|---------------|---------|
| Préfixe `*` | L'utilisateur peut interagir avec | `*LINK`, `*BUTTON`, `*INPUT` |
| `<semantic>` | Sens HTML5/ARIA préservé | `<h1>`, `<main>`, `<search>`, `<aside>` |
| `{flags}` | Comportement de mise en page | `{sticky}`, `{scrollable}` |
| `"label"` | Contenu textuel visible | `"Sign up free"`, `"Search..."` |
| `(N items)` | Nombre d'éléments de liste | `LIST (12 items)` |
| Indentation | Hiérarchie parent-enfant | `HEADER > NAV > LIST > LINK` |

### Les 23 rôles

| Catégorie | Rôles |
|-----------|-------|
| **Mise en page** | `PAGE`, `HEADER`, `FOOTER`, `SECTION`, `NAV` |
| **Contenu** | `TEXT`, `IMAGE`, `ICON`, `CARD`, `LIST`, `TABLE` |
| **Interactif** | `BUTTON`, `LINK`, `INPUT`, `CHECKBOX`, `RADIO`, `FORM` |
| **Superpositions** | `MODAL`, `TOAST`, `DROPDOWN` |
| **Navigation** | `PAGINATION` |
| **Secours** | `UNKNOWN` |

Ces 23 rôles forment un vocabulaire fixe — identique sur tous les sites web. Les LLM les apprennent une seule fois et peuvent raisonner sur n'importe quelle page.

## Ce qui est capturé

WebSketch ne se contente pas de vider le DOM. Il exécute un **classificateur à 5 niveaux** sur chaque élément visible :

| Niveau | Source | Exemple |
|--------|--------|---------|
| 1. **Rôle ARIA** | `role="navigation"` | → `NAV` |
| 2. **Balise HTML** | `<button>`, `<h1>` | → `BUTTON`, `TEXT <h1>` |
| 3. **Heuristiques de classes** | `.card`, `.modal`, `.toast` | → `CARD`, `MODAL`, `TOAST` |
| 4. **Analyse structurelle** | 3+ frères de même rôle | → `LIST` |
| 5. **Secours** | Éléments texte uniquement | → `TEXT`, `SECTION`, `UNKNOWN` |

Ensuite, il nettoie :

- **Traversée transparente des tableaux** — `TR`/`TD`/`TH`/`LI` sont ignorés, les enfants sont remontés à la surface
- **Élagage du contenu vide** — les nœuds vides, non interactifs ou invisibles sont supprimés
- **Réduction des wrappers** — les wrappers `SECTION` à enfant unique sans signification sont supprimés
- **Élagage en cascade** — les chaînes de wrappers creux sans contenu sont entièrement éliminées
- **Extraction des libellés** — le texte visible est extrait des liens, boutons, titres, images et champs de saisie

Le résultat : un arbre propre avec le nombre minimum de nœuds nécessaires pour comprendre la page.

## Cas d'utilisation

### Pour les ingénieurs de prompts

**« Décris la mise en page de cette page »** — Collez l'arbre. Le LLM voit la structure exacte, les titres et la navigation sans se noyer dans le HTML. Fonctionne avec ChatGPT, Claude, Gemini, Llama — n'importe quel modèle textuel.

**« Que peut faire un utilisateur sur cette page ? »** — Chaque élément interactif est marqué avec `*`. Liens, boutons, champs de saisie, cases à cocher — tous étiquetés avec leur texte visible. Le LLM peut énumérer chaque action possible de l'utilisateur.

**« Compare ces deux pages »** — Deux arbres côte à côte. Le LLM peut comparer les structures, repérer les éléments manquants, analyser les schémas de navigation — le tout en quelques centaines de tokens.

### Pour les développeurs

**« Génère un plan de test pour cette interface »** — L'arbre correspond directement aux cibles de test. `*BUTTON "Submit"`, `*INPUT <email> "Enter email"`, `*LINK "Terms"` — chacun est une interaction testable avec son libellé visible.

**« Construis quelque chose qui ressemble à ça »** — L'arbre sémantique est proche d'une hiérarchie de composants. `HEADER > NAV > LIST > LINK` correspond directement aux composants React/Vue/Svelte. Le LLM peut échafauder une mise en page correspondante.

**« Audite l'accessibilité de cette page »** — Points de repère manquants, champs non étiquetés, lacunes dans la hiérarchie des titres — tout est visible dans l'arbre. Les indices sémantiques comme `<main>`, `<nav>`, `<search>` montrent quels rôles ARIA sont présents (ou absents).

### Pour les agents IA

**Intégration MCP** — Utilisez [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) pour donner à votre agent IA la capacité de capturer et d'analyser n'importe quelle page web dans sa chaîne d'outils.

**Surveillance automatisée** — Utilisez [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) pour capturer des pages selon un calendrier, comparer les arbres et détecter les changements structurels.

## Quatre vues

| Onglet | Ce qu'il affiche | Idéal pour |
|--------|------------------|------------|
| **LLM** (par défaut) | Arbre sémantique indenté avec libellés, sémantique, drapeaux | Coller dans les prompts LLM |
| **ASCII** | Wireframe en dessin de boîtes avec disposition spatiale | Compréhension visuelle de la mise en page |
| **Tree** | Arbre dépliable avec badges de rôles colorés | Débogage des captures |
| **JSON** | IR `WebSketchCapture` complet avec coloration syntaxique | Utilisation programmatique et pipelines |

## Commandes

| Commande | Description |
|----------|-------------|
| `WebSketch: Capture URL` | Demande une URL, capture et affiche le résultat |
| `WebSketch: Capture URL from Clipboard` | Capture l'URL présente dans votre presse-papiers |
| `WebSketch: Copy LLM Tree to Clipboard` | Copie l'arbre — à coller directement dans ChatGPT, Claude, etc. |
| `WebSketch: Export LLM Tree` | Enregistrer en `.md` pour les bibliothèques de prompts ou la documentation |
| `WebSketch: Export Capture as JSON` | Capture IR complète avec bboxes, hachages, métadonnées |
| `WebSketch: Export ASCII Wireframe` | Vue en dessin de boîtes de la mise en page |

## Paramètres

| Paramètre | Par défaut | Description |
|-----------|------------|-------------|
| `websketch.chromePath` | Détection auto | Chemin vers l'exécutable Chrome ou Edge |
| `websketch.viewportWidth` | `1280` | Largeur de la fenêtre d'affichage en pixels |
| `websketch.viewportHeight` | `800` | Hauteur de la fenêtre d'affichage en pixels |
| `websketch.timeout` | `30000` | Délai d'attente de navigation (ms) |
| `websketch.waitAfterLoad` | `1000` | Attente supplémentaire pour le rendu JS (ms) |

## Écosystème

WebSketch est une famille d'outils construits sur une grammaire commune :

| Paquet | Ce qu'il fait |
|--------|---------------|
| [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | IR central — grammaire, validation, rendu, comparaison, empreinte |
| **websketch-vscode** | Extension VS Code — capturez des pages depuis votre éditeur (ce dépôt) |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | Capture et rendu en ligne de commande |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Extension Chrome pour la capture dans le navigateur |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | Serveur MCP pour l'intégration avec les agents LLM |

Tous les outils produisent la même IR `WebSketchCapture`, les sorties sont donc interchangeables entre les pipelines.

## Prérequis

- VS Code 1.85+
- Chrome ou Edge installé sur votre système

Pas de navigateur embarqué. Pas de téléchargement de 200 Mo. WebSketch utilise `puppeteer-core` avec le navigateur que vous avez déjà.

## Licence

Licence MIT — voir [LICENSE](LICENSE) pour les détails.

> Fait partie de [MCP Tool Shop](https://mcptoolshop.com)

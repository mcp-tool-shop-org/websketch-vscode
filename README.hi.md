<p align="center"><img src="logo.png" alt="WebSketch" width="340"></p>

<h1 align="center">WebSketch</h1>

<p align="center"><strong>किसी भी वेब पेज को एक संरचित ट्री में बदलें जिसे LLM वास्तव में समझ सकें।</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-vscode/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode"><img src="https://img.shields.io/visual-studio-marketplace/v/mcp-tool-shop.websketch-vscode.svg" alt="Marketplace"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://mcp-tool-shop-org.github.io/websketch-vscode/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <strong>हिन्दी</strong> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português</a>
</p>

<p align="center">
  <a href="#the-problem">समस्या</a> · <a href="#the-solution">समाधान</a> · <a href="#quick-start">त्वरित शुरुआत</a> · <a href="#how-it-reads">कैसे पढ़ें</a> · <a href="#use-cases">उपयोग के मामले</a> · <a href="#ecosystem">इकोसिस्टम</a>
</p>

---

## The Problem

आप चाहते हैं कि एक LLM किसी वेब पेज के बारे में तर्क करे — उसका लेआउट, नेविगेशन, इंटरैक्टिव तत्व, कंटेंट पदानुक्रम। आपके वर्तमान विकल्प सभी अपर्याप्त हैं:

| दृष्टिकोण | टोकन | क्या खोते हैं |
|----------|--------|---------------|
| **स्क्रीनशॉट** | 1,000+ (विज़न) | छोटा टेक्स्ट नहीं पढ़ सकता, लेआउट का अनुमान लगाता है, इंटरैक्टिविटी की जानकारी शून्य |
| **कच्चा HTML** | 50,000–500,000 | `div` के जंजाल, इनलाइन स्टाइल, स्क्रिप्ट, SVG शोर में डूब जाता है |
| **Readability एक्सट्रैक्ट** | 2,000–10,000 | सारी संरचना हटा देता है — कोई नेव नहीं, कोई बटन नहीं, कोई फॉर्म नहीं |
| **DOM डंप** | 10,000–100,000 | क्लास नाम, डेटा एट्रिब्यूट, फ्रेमवर्क आर्टिफैक्ट हर जगह |

मूल समस्या: **इनमें से कोई भी UI की भाषा नहीं बोलता**। LLM को `<div class="sc-bdnxRM jJFqsI">` की ज़रूरत नहीं है — उन्हें `NAV`, `BUTTON`, `CARD`, `LIST` चाहिए।

## The Solution

WebSketch पेज को 23 UI प्रिमिटिव का उपयोग करके एक **सिमेंटिक ट्री** में कैप्चर करता है। VS Code में एक क्लिक, किसी भी LLM में पेस्ट करें:

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

**200–800 टोकन।** 50,000 नहीं। पिक्सेल ग्रिड नहीं। एक साफ़ ट्री जिस पर कोई भी टेक्स्ट मॉडल तर्क कर सके।

### आमने-सामने तुलना

| मापदंड | WebSketch | कच्चा HTML | स्क्रीनशॉट |
|--------|-----------|----------|------------|
| **टोकन** | 200–800 | 50,000+ | 1,000+ (विज़न) |
| **संरचना** | पूर्ण सिमेंटिक ट्री | नेस्टेड div अराजकता | पिक्सेल ग्रिड |
| **टेक्स्ट कंटेंट** | उद्धृत, लेबल किया हुआ | मार्कअप में दबा हुआ | OCR पर निर्भर |
| **इंटरैक्टिव तत्व** | `*` से चिह्नित | एट्रिब्यूट में छिपा हुआ | अदृश्य |
| **हेडिंग पदानुक्रम** | `<h1>` से `<h6>` तक | क्लास नामों में खोया हुआ | आकार से अनुमानित |
| **लैंडमार्क** | `<main>`, `<nav>`, `<search>` | DOM विशेषज्ञता आवश्यक | उपलब्ध नहीं |
| **के साथ काम करता है** | कोई भी टेक्स्ट LLM | कुछ भी उपयोगी नहीं | केवल विज़न मॉडल |

## Quick Start

1. [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mcp-tool-shop.websketch-vscode) से इंस्टॉल करें या चलाएँ:
   ```
   ext install mcp-tool-shop.websketch-vscode
   ```
2. कमांड पैलेट खोलें (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. **WebSketch: Capture URL** चलाएँ
4. एक URL पेस्ट करें और Enter दबाएँ
5. **Copy for LLM** पर क्लिक करें और अपने प्रॉम्प्ट में पेस्ट करें

LLM टैब डिफ़ॉल्ट व्यू है। एक क्लिक में ट्री आपके क्लिपबोर्ड पर कॉपी हो जाता है, किसी भी मॉडल के लिए तैयार।

## How It Reads

ट्री की हर पंक्ति सूचना-सघन और मशीन-पारसेबल है:

```
├─ *BUTTON <search> {sticky} "Find products"
│    │       │         │         │
│    │       │         │         └─ वास्तविक दृश्य टेक्स्ट
│    │       │         └─ फ्लैग (sticky, scrollable)
│    │       └─ सिमेंटिक संकेत (search, main, h1, aside...)
│    └─ इंटरैक्टिव (क्लिक/टाइप करने योग्य)
│
└─ ट्री संरचना पैरेंट-चाइल्ड नेस्टिंग दिखाती है
```

### व्याकरण

| प्रतीक | अर्थ | उदाहरण |
|--------|---------|---------|
| `*` उपसर्ग | उपयोगकर्ता इससे इंटरैक्ट कर सकता है | `*LINK`, `*BUTTON`, `*INPUT` |
| `<semantic>` | HTML5/ARIA अर्थ संरक्षित | `<h1>`, `<main>`, `<search>`, `<aside>` |
| `{flags}` | लेआउट व्यवहार | `{sticky}`, `{scrollable}` |
| `"label"` | दृश्य टेक्स्ट कंटेंट | `"Sign up free"`, `"Search..."` |
| `(N items)` | सूची आइटम संख्या | `LIST (12 items)` |
| इंडेंटेशन | पैरेंट-चाइल्ड पदानुक्रम | `HEADER > NAV > LIST > LINK` |

### 23 रोल

| श्रेणी | रोल |
|----------|-------|
| **लेआउट** | `PAGE`, `HEADER`, `FOOTER`, `SECTION`, `NAV` |
| **कंटेंट** | `TEXT`, `IMAGE`, `ICON`, `CARD`, `LIST`, `TABLE` |
| **इंटरैक्टिव** | `BUTTON`, `LINK`, `INPUT`, `CHECKBOX`, `RADIO`, `FORM` |
| **ओवरले** | `MODAL`, `TOAST`, `DROPDOWN` |
| **नेविगेशन** | `PAGINATION` |
| **फ़ॉलबैक** | `UNKNOWN` |

ये 23 रोल एक निश्चित शब्दावली हैं — हर वेबसाइट पर समान। LLM इन्हें एक बार सीखते हैं और किसी भी पेज के बारे में तर्क कर सकते हैं।

## What Gets Captured

WebSketch केवल DOM डंप नहीं करता। यह हर दृश्य तत्व पर एक **5-स्तरीय क्लासिफायर** चलाता है:

| स्तर | स्रोत | उदाहरण |
|------|--------|---------|
| 1. **ARIA रोल** | `role="navigation"` | → `NAV` |
| 2. **HTML टैग** | `<button>`, `<h1>` | → `BUTTON`, `TEXT <h1>` |
| 3. **क्लास ह्यूरिस्टिक्स** | `.card`, `.modal`, `.toast` | → `CARD`, `MODAL`, `TOAST` |
| 4. **संरचनात्मक विश्लेषण** | 3+ समान-रोल सिबलिंग | → `LIST` |
| 5. **फ़ॉलबैक** | केवल-टेक्स्ट तत्व | → `TEXT`, `SECTION`, `UNKNOWN` |

फिर यह सफ़ाई करता है:

- **पारदर्शी टेबल ट्रैवर्सल** — `TR`/`TD`/`TH`/`LI` को छोड़ दिया जाता है, चिल्ड्रन को सतह पर प्रमोट किया जाता है
- **शून्य-कंटेंट प्रूनिंग** — खाली, गैर-इंटरैक्टिव, अदृश्य नोड हटा दिए जाते हैं
- **रैपर कोलैप्सिंग** — अर्थहीन सिंगल-चाइल्ड `SECTION` रैपर हटा दिए जाते हैं
- **कैस्केडिंग प्रून** — बिना कंटेंट वाली खोखली रैपर श्रृंखलाएँ पूरी तरह समाप्त कर दी जाती हैं
- **लेबल एक्सट्रैक्शन** — लिंक, बटन, हेडिंग, इमेज, इनपुट से दृश्य टेक्स्ट निकाला जाता है

परिणाम: पेज को समझने के लिए न्यूनतम आवश्यक नोड वाला एक साफ़ ट्री।

## Use Cases

### प्रॉम्प्ट इंजीनियरों के लिए

**"इस पेज का लेआउट बताओ"** — ट्री पेस्ट करें। LLM HTML में डूबे बिना सटीक संरचना, हेडिंग और नेविगेशन देखता है। ChatGPT, Claude, Gemini, Llama के साथ काम करता है — कोई भी टेक्स्ट मॉडल।

**"उपयोगकर्ता इस पेज पर क्या कर सकता है?"** — हर इंटरैक्टिव तत्व `*` से चिह्नित है। लिंक, बटन, इनपुट, चेकबॉक्स — सभी अपने दृश्य टेक्स्ट के साथ लेबल किए हुए। LLM हर संभव उपयोगकर्ता कार्रवाई सूचीबद्ध कर सकता है।

**"इन दो पेजों की तुलना करो"** — दो ट्री साथ-साथ। LLM संरचना में अंतर ढूँढ सकता है, गायब तत्व पहचान सकता है, नेविगेशन पैटर्न की तुलना कर सकता है — सब कुछ कुछ सौ टोकन में।

### डेवलपर्स के लिए

**"इस UI के लिए टेस्ट प्लान बनाओ"** — ट्री सीधे टेस्ट टारगेट पर मैप होता है। `*BUTTON "Submit"`, `*INPUT <email> "Enter email"`, `*LINK "Terms"` — प्रत्येक एक परीक्षण योग्य इंटरैक्शन है जिसका दृश्य लेबल है।

**"ऐसा कुछ बनाओ जो इस जैसा दिखे"** — सिमेंटिक ट्री एक कंपोनेंट पदानुक्रम के करीब है। `HEADER > NAV > LIST > LINK` सीधे React/Vue/Svelte कंपोनेंट पर मैप होता है। LLM एक मिलता-जुलता लेआउट स्कैफ़ोल्ड कर सकता है।

**"इस पेज का एक्सेसिबिलिटी ऑडिट करो"** — गायब लैंडमार्क, बिना लेबल वाले इनपुट, हेडिंग पदानुक्रम में अंतराल — सब ट्री में दिखाई देता है। `<main>`, `<nav>`, `<search>` जैसे सिमेंटिक संकेत दिखाते हैं कि कौन से ARIA रोल मौजूद हैं (या अनुपस्थित)।

### AI एजेंट के लिए

**MCP इंटीग्रेशन** — अपने AI एजेंट को किसी भी वेब पेज को कैप्चर करने और उसके बारे में तर्क करने की क्षमता देने के लिए [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) का उपयोग करें।

**स्वचालित निगरानी** — शेड्यूल पर पेज कैप्चर करने, ट्री में अंतर ढूँढने और संरचनात्मक परिवर्तनों का पता लगाने के लिए [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) का उपयोग करें।

## Four Views

| टैब | क्या दिखाता है | सर्वोत्तम उपयोग |
|-----|---------------|----------|
| **LLM** (डिफ़ॉल्ट) | लेबल, सिमेंटिक्स, फ्लैग के साथ इंडेंटेड सिमेंटिक ट्री | LLM प्रॉम्प्ट में पेस्ट करने के लिए |
| **ASCII** | स्थानिक लेआउट के साथ बॉक्स-ड्रॉइंग वायरफ्रेम | विज़ुअल लेआउट समझने के लिए |
| **Tree** | कलर-कोडेड रोल बैज के साथ कोलैप्सिबल नोड ट्री | कैप्चर डीबग करने के लिए |
| **JSON** | सिंटैक्स हाइलाइटिंग के साथ पूर्ण `WebSketchCapture` IR | प्रोग्रामेटिक उपयोग और पाइपलाइन के लिए |

## Commands

| कमांड | विवरण |
|---------|-------------|
| `WebSketch: Capture URL` | URL के लिए प्रॉम्प्ट करें, कैप्चर करें और प्रदर्शित करें |
| `WebSketch: Capture URL from Clipboard` | आपके क्लिपबोर्ड पर जो भी URL है उसे कैप्चर करें |
| `WebSketch: Copy LLM Tree to Clipboard` | ट्री कॉपी करें — सीधे ChatGPT, Claude आदि में पेस्ट करें |
| `WebSketch: Export LLM Tree` | प्रॉम्प्ट लाइब्रेरी या डॉक्स के लिए `.md` के रूप में सेव करें |
| `WebSketch: Export Capture as JSON` | bboxes, हैश, मेटाडेटा के साथ पूर्ण IR कैप्चर |
| `WebSketch: Export ASCII Wireframe` | बॉक्स-ड्रॉइंग लेआउट व्यू |

## Settings

| सेटिंग | डिफ़ॉल्ट | विवरण |
|---------|---------|-------------|
| `websketch.chromePath` | ऑटो-डिटेक्ट | Chrome या Edge एक्जीक्यूटेबल का पथ |
| `websketch.viewportWidth` | `1280` | व्यूपोर्ट चौड़ाई पिक्सेल में |
| `websketch.viewportHeight` | `800` | व्यूपोर्ट ऊँचाई पिक्सेल में |
| `websketch.timeout` | `30000` | नेविगेशन टाइमआउट (ms) |
| `websketch.waitAfterLoad` | `1000` | JS रेंडरिंग के लिए अतिरिक्त प्रतीक्षा (ms) |

## Ecosystem

WebSketch एक साझा व्याकरण पर निर्मित उपकरणों का परिवार है:

| पैकेज | क्या करता है |
|---------|-------------|
| [@mcptoolshop/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir) | कोर IR — व्याकरण, वैलिडेशन, रेंडरिंग, डिफ़िंग, फिंगरप्रिंटिंग |
| **websketch-vscode** | VS Code एक्सटेंशन — अपने एडिटर से पेज कैप्चर करें (यह रेपो) |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | कमांड-लाइन कैप्चर और रेंडरिंग |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | इन-ब्राउज़र कैप्चर के लिए Chrome एक्सटेंशन |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | LLM एजेंट इंटीग्रेशन के लिए MCP सर्वर |

सभी उपकरण समान `WebSketchCapture` IR उत्पन्न करते हैं, इसलिए आउटपुट पाइपलाइनों के बीच विनिमेय हैं।

## Requirements

- VS Code 1.85+
- आपके सिस्टम पर Chrome या Edge इंस्टॉल होना चाहिए

कोई बंडल्ड ब्राउज़र नहीं। कोई 200MB डाउनलोड नहीं। WebSketch आपके पास पहले से मौजूद ब्राउज़र के साथ `puppeteer-core` का उपयोग करता है।

## License

MIT लाइसेंस — विवरण के लिए [LICENSE](LICENSE) देखें।

> [MCP Tool Shop](https://mcptoolshop.com) का हिस्सा

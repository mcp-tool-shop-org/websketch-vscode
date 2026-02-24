/**
 * DOM Walker — injected into the browser page via page.evaluate().
 *
 * This function runs entirely in the browser context. It walks the DOM,
 * classifies elements into UIRole primitives, extracts bounding boxes,
 * and returns a serializable tree conforming to the UINode shape.
 *
 * It must be self-contained: no imports, no external references.
 */

export interface RawNode {
  id: string;
  role: string;
  bbox: [number, number, number, number];
  interactive: boolean;
  visible: boolean;
  enabled?: boolean;
  focusable?: boolean;
  semantic?: string;
  text?: { hash: string; len: number; kind: string };
  flags?: { sticky?: boolean; scrollable?: boolean; repeated?: boolean };
  z?: number;
  children?: RawNode[];
}

export interface RawCapture {
  url: string;
  timestamp_ms: number;
  viewport: { w_px: number; h_px: number };
  root: RawNode;
}

/**
 * Returns the DOM walker function body as a string.
 * This is evaluated inside the browser via page.evaluate().
 */
export function getDomWalkerScript(): string {
  // The function is defined here as a real function, then .toString()'d
  // so we get type checking during development.
  const walkerFn = function (): RawCapture {
    const MAX_DEPTH = 8;
    const MAX_CHILDREN = 200;
    const MAX_NODES = 10000;
    let nodeCount = 0;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // --- djb2 hash (matches websketch-ir hashSync) ---
    function djb2(str: string): string {
      let hash = 5381;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
      }
      return (hash >>> 0).toString(16).padStart(8, '0');
    }

    // --- Text normalization ---
    function normalizeText(text: string): string {
      return text.replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();
    }

    function classifyText(text: string): string {
      if (!text) { return 'none'; }
      if (text.length <= 20) { return 'short'; }
      if (text.length <= 150) { return 'sentence'; }
      return 'paragraph';
    }

    function createTextSignal(rawText: string): { hash: string; len: number; kind: string } | undefined {
      const normalized = normalizeText(rawText);
      if (!normalized || !/[a-z0-9]/i.test(normalized)) { return undefined; }
      return {
        hash: djb2(normalized),
        len: normalized.length,
        kind: classifyText(normalized),
      };
    }

    // --- ARIA role mapping ---
    const ARIA_MAP: Record<string, string> = {
      navigation: 'NAV', banner: 'HEADER', contentinfo: 'FOOTER',
      dialog: 'MODAL', alertdialog: 'MODAL', alert: 'TOAST', status: 'TOAST',
      form: 'FORM', search: 'FORM', table: 'TABLE', grid: 'TABLE',
      treegrid: 'TABLE', listbox: 'LIST', list: 'LIST', menu: 'DROPDOWN',
      menubar: 'NAV', checkbox: 'CHECKBOX', radio: 'RADIO',
      button: 'BUTTON', link: 'LINK', textbox: 'INPUT', searchbox: 'INPUT',
      combobox: 'INPUT', spinbutton: 'INPUT', slider: 'INPUT',
      img: 'IMAGE', figure: 'IMAGE',
      tab: 'BUTTON', tablist: 'NAV', tabpanel: 'SECTION',
      region: 'SECTION', main: 'SECTION', complementary: 'SECTION',
      article: 'SECTION',
    };

    // --- Tag mapping ---
    const TAG_MAP: Record<string, string> = {
      NAV: 'NAV', HEADER: 'HEADER', FOOTER: 'FOOTER',
      MAIN: 'SECTION', ARTICLE: 'SECTION', SECTION: 'SECTION', ASIDE: 'SECTION',
      FORM: 'FORM', TABLE: 'TABLE', THEAD: 'TABLE', TBODY: 'TABLE', TFOOT: 'TABLE',
      UL: 'LIST', OL: 'LIST', DL: 'LIST',
      BUTTON: 'BUTTON', A: 'LINK',
      IMG: 'IMAGE', SVG: 'IMAGE', PICTURE: 'IMAGE', VIDEO: 'IMAGE', CANVAS: 'IMAGE',
      DIALOG: 'MODAL', SELECT: 'DROPDOWN',
      H1: 'TEXT', H2: 'TEXT', H3: 'TEXT', H4: 'TEXT', H5: 'TEXT', H6: 'TEXT',
      P: 'TEXT', LABEL: 'TEXT', SPAN: 'TEXT', BLOCKQUOTE: 'TEXT', PRE: 'TEXT',
      CODE: 'TEXT', EM: 'TEXT', STRONG: 'TEXT', SMALL: 'TEXT',
    };

    // --- Class heuristics ---
    const CLASS_PATTERNS: Array<[RegExp, string]> = [
      [/\b(card|tile|product)\b/i, 'CARD'],
      [/\b(modal|dialog|overlay|lightbox)\b/i, 'MODAL'],
      [/\b(toast|notification|snackbar|alert)\b/i, 'TOAST'],
      [/\b(nav|navbar|menu|sidebar)\b/i, 'NAV'],
      [/\b(pagination|pager)\b/i, 'PAGINATION'],
      [/\b(dropdown|popover|popup)\b/i, 'DROPDOWN'],
      [/\b(btn|button)\b/i, 'BUTTON'],
      [/\b(icon|fa-|material-icons|lucide)\b/i, 'ICON'],
    ];

    // --- Semantic extraction ---
    function extractSemantic(el: Element): string | undefined {
      const ariaLabel = el.getAttribute('aria-label') ?? '';
      const id = el.id ?? '';
      const testId = el.getAttribute('data-testid') ?? '';
      const name = el.getAttribute('name') ?? '';
      const combined = `${ariaLabel} ${id} ${testId} ${name}`.toLowerCase();

      const keywords: Record<string, string> = {
        search: 'search', login: 'login', signup: 'signup', register: 'register',
        cart: 'cart', checkout: 'checkout', submit: 'submit', cancel: 'cancel',
        close: 'close', menu: 'menu', logo: 'logo', hero: 'hero',
        footer: 'footer', header: 'header', sidebar: 'sidebar',
        primary: 'primary_cta', cta: 'cta',
      };

      for (const [kw, semantic] of Object.entries(keywords)) {
        if (combined.includes(kw)) { return semantic; }
      }

      // Input type as semantic
      if (el.tagName === 'INPUT') {
        const type = (el as HTMLInputElement).type;
        if (['email', 'password', 'search', 'tel', 'url'].includes(type)) {
          return type;
        }
      }

      return undefined;
    }

    // --- Visibility check ---
    function isVisible(el: Element): boolean {
      const style = window.getComputedStyle(el);
      if (style.display === 'none') { return false; }
      if (style.visibility === 'hidden') { return false; }
      if (parseFloat(style.opacity) === 0) { return false; }
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) { return false; }
      return true;
    }

    // --- Interactivity check ---
    function isInteractive(el: Element): boolean {
      const tag = el.tagName;
      if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) { return true; }
      if (el.hasAttribute('tabindex') && el.getAttribute('tabindex') !== '-1') { return true; }
      if (el.hasAttribute('onclick') || el.hasAttribute('role')) {
        const role = el.getAttribute('role');
        if (role && ['button', 'link', 'checkbox', 'radio', 'textbox', 'tab', 'menuitem'].includes(role)) {
          return true;
        }
      }
      if (el.getAttribute('contenteditable') === 'true') { return true; }
      return false;
    }

    // --- Classify element ---
    function classify(el: Element): string {
      // Tier 1: ARIA role
      const ariaRole = el.getAttribute('role');
      if (ariaRole && ARIA_MAP[ariaRole]) {
        return ARIA_MAP[ariaRole];
      }

      // Tier 2: HTML tag
      const tag = el.tagName;
      if (tag === 'INPUT') {
        const type = (el as HTMLInputElement).type;
        if (type === 'checkbox') { return 'CHECKBOX'; }
        if (type === 'radio') { return 'RADIO'; }
        if (['submit', 'button', 'reset'].includes(type)) { return 'BUTTON'; }
        return 'INPUT';
      }
      if (tag === 'TEXTAREA') { return 'INPUT'; }
      if (TAG_MAP[tag]) { return TAG_MAP[tag]; }

      // Tier 3: Class heuristics
      const className = el.className?.toString?.() ?? '';
      for (const [pattern, role] of CLASS_PATTERNS) {
        if (pattern.test(className)) { return role; }
      }

      // Tier 4: Structural fallback
      const directText = Array.from(el.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => (n.textContent ?? '').trim())
        .filter(Boolean)
        .join(' ');

      if (directText && el.children.length === 0) { return 'TEXT'; }
      if (el.children.length > 0) { return 'SECTION'; }
      return 'UNKNOWN';
    }

    // --- Get direct text content (not descendants) ---
    function getDirectText(el: Element): string {
      return Array.from(el.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => (n.textContent ?? '').trim())
        .filter(Boolean)
        .join(' ');
    }

    // --- Walk the DOM ---
    function walkElement(el: Element, depth: number, parentPath: string): RawNode | null {
      if (nodeCount >= MAX_NODES) { return null; }
      if (depth > MAX_DEPTH) { return null; }

      const visible = isVisible(el);
      if (!visible) { return null; }

      nodeCount++;

      const rect = el.getBoundingClientRect();
      const bbox: [number, number, number, number] = [
        Math.round((rect.left / vw) * 1000) / 1000,
        Math.round((rect.top / vh) * 1000) / 1000,
        Math.round((rect.width / vw) * 1000) / 1000,
        Math.round((rect.height / vh) * 1000) / 1000,
      ];

      const role = classify(el);
      const interactive = isInteractive(el);
      const semantic = extractSemantic(el);
      const directText = getDirectText(el);
      const textSignal = createTextSignal(directText);

      const style = window.getComputedStyle(el);
      const sticky = style.position === 'fixed' || style.position === 'sticky';
      const scrollable = style.overflow === 'auto' || style.overflow === 'scroll'
        || style.overflowY === 'auto' || style.overflowY === 'scroll';

      const enabled = !((el as HTMLInputElement).disabled) && el.getAttribute('aria-disabled') !== 'true';
      const focusable = interactive && enabled && el.getAttribute('tabindex') !== '-1';

      const nodeId = `${parentPath}/${djb2(role + bbox.join(','))}`;

      // Walk children
      const rawChildren: RawNode[] = [];
      const childElements = Array.from(el.children);
      const limit = Math.min(childElements.length, MAX_CHILDREN);

      for (let i = 0; i < limit; i++) {
        const child = walkElement(childElements[i], depth + 1, nodeId);
        if (child) { rawChildren.push(child); }
      }

      // Collapse wrapper: single child, no text, same-ish bbox
      if (rawChildren.length === 1 && !textSignal && role === 'SECTION') {
        const child = rawChildren[0];
        const bboxClose = Math.abs(bbox[0] - child.bbox[0]) < 0.005
          && Math.abs(bbox[1] - child.bbox[1]) < 0.005
          && Math.abs(bbox[2] - child.bbox[2]) < 0.005
          && Math.abs(bbox[3] - child.bbox[3]) < 0.005;
        if (bboxClose) {
          // Inherit parent's bbox but keep child's role/content
          child.bbox = bbox;
          return child;
        }
      }

      const node: RawNode = { id: nodeId, role, bbox, interactive, visible };
      if (!enabled) { node.enabled = false; }
      if (focusable) { node.focusable = true; }
      if (semantic) { node.semantic = semantic; }
      if (textSignal) { node.text = textSignal; }
      if (sticky || scrollable) {
        node.flags = {};
        if (sticky) { node.flags.sticky = true; }
        if (scrollable) { node.flags.scrollable = true; }
      }
      if (rawChildren.length > 0) { node.children = rawChildren; }

      return node;
    }

    // --- Root capture ---
    const body = document.body;
    if (!body) {
      return {
        url: window.location.href,
        timestamp_ms: Date.now(),
        viewport: { w_px: vw, h_px: vh },
        root: { id: 'page_root', role: 'PAGE', bbox: [0, 0, 1, 1], interactive: false, visible: true },
      };
    }

    const rootChildren: RawNode[] = [];
    for (const child of Array.from(body.children)) {
      const node = walkElement(child, 1, '/page_root');
      if (node) { rootChildren.push(node); }
    }

    const root: RawNode = {
      id: 'page_root',
      role: 'PAGE',
      bbox: [0, 0, 1, 1],
      interactive: false,
      visible: true,
      children: rootChildren.length > 0 ? rootChildren : undefined,
    };

    return {
      url: window.location.href,
      timestamp_ms: Date.now(),
      viewport: { w_px: vw, h_px: vh },
      root,
    };
  };

  // Extract the function body and return it as an evaluable expression
  const fnStr = walkerFn.toString();
  return `(${fnStr})()`;
}

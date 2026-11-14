// Writes the plain-HTML copy of the home page into index.html, for bots and browsers without JavaScript
// (link previews, some crawlers), and the FAQ as structured data for Google.
//
//   node tools/prerender.mjs            (needs Google Chrome; pass --chrome <path> if it isn't found)
//
// Run it after changing the page's text, then commit index.html. It opens the real page in headless
// Chrome, waits for it to render, and copies the text content (headings, paragraphs, links, reviews,
// prices, every FAQ answer) between the STATIC-FALLBACK and FAQ-JSONLD markers in index.html.
// Visitors with JavaScript never see that copy: index.html removes it as soon as the page starts.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const INDEX = join(ROOT, 'index.html');
const SITE_PORT = 8097, CDP_PORT = 9333;
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const CHROME = arg('--chrome') || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(p => existsSync(p));
if (!CHROME) throw new Error('Chrome not found; pass --chrome <path>');

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Runs inside the rendered page: returns { html, faq }.
function extract() {
  const root = document.getElementById('dc-root');
  const KEEP = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'A', 'UL', 'OL', 'LI', 'B', 'STRONG', 'HEADER', 'FOOTER', 'SECTION', 'NAV']);
  const SKIP = new Set(['SCRIPT', 'STYLE', 'SVG', 'IFRAME', 'VIDEO', 'AUDIO', 'CANVAS', 'INPUT', 'BUTTON', 'FORM', 'NOSCRIPT']);
  const BLOCK = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'UL', 'OL', 'LI', 'SECTION', 'HEADER', 'FOOTER', 'NAV', 'DIV']);
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const seen = new Set();
  const textOf = el => el.textContent.replace(/\s+/g, ' ').trim();
  const reviews = document.getElementById('reviews');
  const hidden = (el, inline) => el.getAttribute('aria-hidden') === 'true' || el.id === 'trial-modal' || el.getAttribute('role') === 'dialog' ||
    getComputedStyle(el).display === 'none' || getComputedStyle(el).visibility === 'hidden' ||
    // Left-to-right blocks are the decorative Premiere timeline demos, not page text (the reviewers'
    // @handles inside the reviews strip are the exception). Inline left-to-right text (numbers) stays,
    // except a ticking clock, which would be frozen at the moment of the snapshot.
    (el.getAttribute('dir') === 'ltr' && (inline ? /\d\d:\d\d:\d\d/.test(el.textContent) : !(reviews && reviews.contains(el) && el.closest('[dir=rtl]'))));
  const hasBlock = el => [...el.children].some(c => BLOCK.has(c.tagName) || hasBlock(c));
  const kids = (el, inline) => [...el.childNodes].map(c => walk(c, inline) + (inline && c.nodeType === 1 ? ' ' : '')).join('');
  // inline: inside a heading, paragraph, link or bold text, where only text (and inline tags) belongs.
  function walk(el, inline) {
    if (el.nodeType === 3) return esc(el.textContent.replace(/\s+/g, ' '));
    if (el.nodeType !== 1 || SKIP.has(el.tagName) || hidden(el, inline)) return '';
    if (el.id === 'faq') return '';  // written from the full FAQ data below
    const tag = el.tagName;
    if (tag === 'IMG') return el.alt && !inline ? '<img src="' + esc(el.getAttribute('src') || '') + '" alt="' + esc(el.alt) + '">\n' : '';
    if (!KEEP.has(tag)) {
      if (inline) return kids(el, true);
      // A div/span holding only text becomes one paragraph (card text, prices, names).
      if (!hasBlock(el) && !el.querySelector('a,img')) {
        const t = textOf(el);
        if (!t || t.length < 2 || seen.has(t)) return '';   // the reviews strip repeats its cards
        seen.add(t);
        return '<p>' + kids(el, true).replace(/\s+/g, ' ').trim() + '</p>\n';
      }
      return kids(el, false);
    }
    if (/^H[1-4]$|^P$|^LI$/.test(tag)) {
      const t = textOf(el);
      if (!t || (tag !== 'H1' && tag !== 'H2' && seen.has(t))) return '';
      seen.add(t);
    }
    const isInline = /^(H[1-4]|P|LI|A|B|STRONG)$/.test(tag);
    const inner = kids(el, inline || isInline).replace(isInline ? /\s+/g : /^$/, ' ').trim();
    if (!inner) return '';
    if (tag === 'A') {
      const href = el.getAttribute('href') || '';
      const out = /^(https?:|\/|#|[\w.-]+\.html)/.test(href) && !/\{\{/.test(href) ? '<a href="' + esc(href) + '">' + inner + '</a>' : inner;
      return inline ? out : '<p>' + out + '</p>\n';
    }
    const t = tag.toLowerCase();
    return '<' + t + '>' + inner + '</' + t + '>' + (BLOCK.has(tag) ? '\n' : '');
  }
  let html = walk(root, false);
  const faq = (window.__COEDIT_FAQ || []).map(([q, a]) => ({ q, a }));
  html += '<section id="faq">\n<h2>שאלות נפוצות</h2>\n' + faq.map(f => '<h3>' + esc(f.q) + '</h3>\n<p>' + esc(f.a) + '</p>\n').join('') + '</section>\n';
  html = html.replace(/<(p|b|section)>\s*<\/\1>\n?/g, '').replace(/^[ \t]+/gm, '').replace(/\n{2,}/g, '\n');
  return { html, faq };
}

async function main() {
  const site = spawn(process.execPath, [join(ROOT, 'tools', 'serve.mjs'), String(SITE_PORT)], { stdio: 'ignore' });
  const profile = mkdtempSync(join(tmpdir(), 'coedit-prerender-'));
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + profile, '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
  try {
    let target;
    for (let i = 0; i < 50 && !target; i++) {
      await sleep(200);
      try { target = (await (await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list')).json()).find(t => t.type === 'page'); } catch {}
    }
    if (!target) throw new Error('Chrome did not start');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
    let id = 0; const waiting = new Map();
    ws.onmessage = m => { const d = JSON.parse(m.data); if (waiting.has(d.id)) { waiting.get(d.id)(d); waiting.delete(d.id); } };
    const send = (method, params = {}) => new Promise(r => { const n = ++id; waiting.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

    // ?prerender=1: no visitor-specific content (the COFRAMES deadline) in the copy for bots.
    await send('Page.navigate', { url: 'http://127.0.0.1:' + SITE_PORT + '/?prerender=1' });
    // Wait for the page to render (support.js fetches React and Babel, then draws #dc-root).
    let ready = false;
    for (let i = 0; i < 120 && !ready; i++) {
      await sleep(500);
      const r = await send('Runtime.evaluate', { expression: '!!(document.querySelector("#dc-root h1") && window.__COEDIT_FAQ)', returnByValue: true });
      ready = r.result && r.result.result && r.result.result.value === true;
    }
    if (!ready) throw new Error('the page did not render within 60 s');
    await sleep(1500);
    const r = await send('Runtime.evaluate', { expression: '(' + extract.toString() + ')()', returnByValue: true });
    if (r.result.exceptionDetails) throw new Error('extract failed: ' + JSON.stringify(r.result.exceptionDetails));
    const { html, faq } = r.result.result.value;
    ws.close();

    const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })
      .replace(/</g, '\\u003c');
    let page = readFileSync(INDEX, 'utf8');
    const put = (name, body) => {
      const re = new RegExp('(<!-- ' + name + ':START[^>]*-->)[\\s\\S]*?(<!-- ' + name + ':END -->)');
      if (!re.test(page)) throw new Error('marker ' + name + ' missing in index.html');
      page = page.replace(re, (m, a, b) => a + '\n' + body + '\n' + b);
    };
    put('FAQ-JSONLD', '<script type="application/ld+json">' + jsonld + '</script>');
    put('STATIC-FALLBACK', '<div id="static-fallback" dir="rtl" lang="he">\n' + html.trim() + '\n</div>');
    writeFileSync(INDEX, page);
    console.log('index.html updated: static copy ' + (html.length / 1024).toFixed(1) + ' KB, ' + faq.length + ' FAQ entries');
  } finally {
    chrome.kill(); site.kill();
    await sleep(500);
    try { rmSync(profile, { recursive: true, force: true }); } catch {}
  }
}
main().catch(e => { console.error(e.message || e); process.exit(1); });

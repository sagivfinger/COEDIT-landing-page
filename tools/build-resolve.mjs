// Builds resolve.dc.html, the DaVinci Resolve landing page, from the main page.
//
//   node tools/build-resolve.mjs
//
// The pricing section, the FAQ list, the trial popup, the footer and the page logic are taken from
// index.html as they are, so the two pages always show the same prices, plans and trial flow; only the
// Resolve parts are swapped in: tools/resolve-sections.tpl (hero to testimonials), the Resolve FAQ,
// the popup's install step, and the head (noindex, no link from anywhere). Settings and placeholders:
// site-config.js → resolve. Run it again after changing the main page's pricing or trial popup.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const main = readFileSync(join(ROOT, 'index.html'), 'utf8');
const sections = readFileSync(join(ROOT, 'tools', 'resolve-sections.tpl'), 'utf8');

// Searched from the live template (<x-dc>) on: the static copy for bots above it has look-alike sections.
const X = main.indexOf('<x-dc>');
const cut = (from, to, what) => {
  const a = main.indexOf(from, X), b = main.indexOf(to, a + 1);
  if (a < 0 || b < 0) throw new Error('index.html changed: cannot find ' + what);
  return main.slice(a, b);
};
const once = (s, from, to, what) => {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error('index.html changed: ' + what + ' (found ' + n + ')');
  return s.replace(from, () => to);
};

// ── head ──
let head = main.slice(0, main.indexOf('<body>'));
head = head.replace(/<title>[\s\S]*?<meta name="twitter:image"[^>]*>\n/, () =>
`<title>COEDIT ל-DaVinci Resolve | חיתוך, כתוביות בעברית וזומים</title>
<!-- A hidden draft until launch: not linked from anywhere, not in any sitemap, and never indexed. -->
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="חיתוך טייקים ושתיקות, כתוביות מעוצבות בעברית וזומים אוטומטיים, ישר בתוך DaVinci Resolve.">
<link rel="canonical" href="https://getcoedit.com/resolve">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="COEDIT">
<meta property="og:locale" content="he_IL">
<meta property="og:url" content="https://getcoedit.com/resolve">
<meta property="og:title" content="הפלאגין שעורכי דווינצ'י חיכו לו | COEDIT">
<meta property="og:description" content="חיתוך טייקים ושתיקות, כתוביות מעוצבות בעברית וזומים אוטומטיים, ישר בתוך DaVinci Resolve.">
<!-- ✏️ og:image: a Resolve share image (not the main page's, which shows Premiere). -->
<meta name="twitter:card" content="summary_large_image">
`);
if (!head.includes('noindex')) throw new Error('index.html changed: the head block was not replaced');
// The panel's ?pack= links never come here, and the main page's FAQ data is not this page's.
head = head.replace(/<script>\n\/\/ The COEDIT panel's "buy minutes"[\s\S]*?<\/script>\n/, '');
head = head.replace(/<!-- FAQ-JSONLD:START[\s\S]*?<!-- FAQ-JSONLD:END -->\n/, '');
// This page is "resolve": the nav's buttons stay here, and every Plausible event says so.
head = once(head, '<script src="./site-attribution.js"></script>\n',
  `<script src="./site-attribution.js"></script>
<script>window.COEDIT_PAGE = 'resolve'; (window.COEDIT_ATTR_PROPS = window.COEDIT_ATTR_PROPS || {}).page = 'resolve';</script>
`, 'the site-attribution.js line');

// ── body: helmet and nav, the Resolve sections, then the main page's pricing, FAQ, popup, footer ──
const top = cut('<x-dc>', '<header style=', 'the page start');
const pricing = once(cut('<section id="pricing"', '<section id="faq"', 'the pricing section'),
  'עובד בתוך Premiere Pro ו-After Effects', 'עובד ב-DaVinci Resolve, ב-Premiere Pro וב-After Effects', 'the plan card line');
const faq = cut('<section id="faq"', '</section>', 'the FAQ section') + '</section>\n\n';
let popup = cut('<sc-if value="{{ trialOpen }}"', '<footer style=', 'the trial popup');
const g1 = popup.indexOf('<sc-if value="{{ guideMode }}"'), g2 = popup.lastIndexOf('</sc-if>\n  </div>\n</div>');
if (g1 < 0 || g2 < 0) throw new Error('index.html changed: the install step');
// ✏️ The popup's install step for Resolve: on the pre-launch list (install method and download).
popup = popup.slice(0, g1) + `<sc-if value="{{ guideMode }}" hint-placeholder-val="{{ false }}">
    <div style="display:flex;flex-direction:column;gap:10px;padding-left:40px">
      <span style="font-size:13px;font-weight:800;color:#e2504a;letter-spacing:.02em">התקנה ב-DaVinci Resolve</span>
      <h2 id="trial-title" style="margin:0;font-size:clamp(24px,3.4vw,32px);font-weight:900;line-height:1.15">מתקינים את COEDIT</h2>
      <div style="border:2px dashed #6b5a1e;border-radius:12px;background:#1c1a10;color:#e8d27a;padding:18px;font-size:15px;line-height:1.7">✏️ מדריך ההתקנה ל-DaVinci Resolve והורדה: יושלם לפני ההשקה, לפי הגרסאות שייתמכו.</div>
      <span style="font-size:14px;color:#aaa">משהו לא ברור? <a href="contact/">כתבו לנו</a>.</span>
    </div>
    ` + popup.slice(g2);
const bottom = cut('<footer style=', '<script type="text/x-dc" data-dc-script>', 'the footer');

// ── the page logic: the main page's, with the Resolve parts ──
let script = main.slice(main.indexOf('<script type="text/x-dc" data-dc-script>'));
script = once(script, 'class Component extends DCLogic {', `// ── The DaVinci Resolve page (site-config.js resolve) ──
const R = CFG.resolve || {};
const R_DRAFT = !R.launched;
// A slot: its content, or (in the draft only) a marked placeholder.
const R_TODO = '✏️ יושלם לפני ההשקה, לפי הגרסאות שייתמכו.';
class Component extends DCLogic {
  resolveVals() {
    const req = (R.requirements || {}), reqText = req.text || (R_DRAFT ? '✏️ דרישות מערכת (גרסאות נתמכות, Windows/Mac): ' + R_TODO.slice(3) : '');
    const hv = R.heroVideo || {}, yt = /^[\\w-]{6,20}$/.test(hv.youtube || '') ? hv.youtube : '';
    const shots = R.screenshots || {};
    const feat = (key, eyebrow, title, text) => ({ eyebrow, title, text, shot: shots[key] || '', hasShot: !!shots[key], ph: !shots[key] && R_DRAFT });
    const gallery = (R.gallery || []).filter(v => v && v.src);
    const quotes = (R.testimonials || []).filter(q => q && q.name && q.quote).map(q => ({ ...q, role: q.role || '', handle: q.handle || '',
      av: q.photo ? 'center/cover no-repeat url(' + q.photo + ')' : 'repeating-linear-gradient(135deg,#2a2a2a 0 4px,#1c1c1c 4px 8px)' }));
    return {
      rDraft: R_DRAFT,
      rReqHero: !!reqText && (req.placement || 'hero') === 'hero', rReqSection: !!reqText && req.placement === 'section',
      rReqText: reqText, rReqColor: req.text ? '#cfcfcf' : '#e8d27a',
      rHeroYt: !!yt, rHeroYtSrc: yt ? 'https://www.youtube-nocookie.com/embed/' + yt + '?autoplay=1&mute=1&loop=1&playlist=' + yt + '&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3' : '',
      rHeroMp4: !yt && !!hv.src, rHeroSrc: hv.src || '', rHeroPoster: hv.poster || '', rHeroPh: !yt && !hv.src && R_DRAFT,
      // ✏️ Draft copy for review.
      rFeatures: [
        feat('smartCuts', 'SMART CUTS', 'טייקים חכמים', 'COEDIT מזהה טייקים חוזרים והתחלות שווא, ומשאיר את הגרסה הטובה. אתם רואים כל חיתוך בתצוגה מקדימה ומאשרים לפני שמשהו זז.'),
        feat('silentCuts', 'SILENT CUTS', 'חיתוך שתיקות', 'השתיקות והעצירות הארוכות נחתכות בלחיצה, על הטיימליין שלכם בדווינצ\\'י.'),
        feat('captions', 'כתוביות', 'כתוביות מעוצבות בעברית', 'תמלול בעברית וכתוביות מימין לשמאל, עם סגנונות מוכנים. בודקים, מתקנים מילה אם צריך, ומאשרים.'),
        feat('zooms', 'זומים', 'זומים אוטומטיים', 'זומים על הרגעים החזקים בסרטון, בלי לגעת בקיפריימים.'),
      ],
      rGallery: gallery, rGalleryHas: gallery.length > 0, rGalleryPh: !gallery.length && R_DRAFT,
      rQuotes: quotes, rQuotesHas: quotes.length > 0, rQuotesPh: !quotes.length && R_DRAFT,
    };
  }`, 'the Component class');
// The Resolve FAQ instead of the main page's.
const fa = script.indexOf('    const faqData = ['), fb = script.indexOf('    W().__COEDIT_FAQ = faqData;');
if (fa < 0 || fb < 0) throw new Error('index.html changed: the FAQ data');
script = script.slice(0, fa) + `    // ✏️ Draft answers for review. The ones that depend on the launch version come from site-config.js.
    // Sources for the built-in captions answer (checked 2026-11-14): Blackmagic's DaVinci Resolve 18.5
    // release ("subtitles from audio in Studio"), the Resolve 20 New Features Guide (transcription and
    // extra languages incl. Hebrew, "Studio Version Only"; AI Animated Subtitles "Studio Version Only").
    // The Resolve 21 guide does not say which features are Studio only: ✏️ verify on the launch version.
    const rFaq = (k) => (R.faq || {})[k] || (R_DRAFT ? R_TODO : '');
    const faqData = [
      ['זה עובד בגרסה החינמית?', rFaq('free')],
      ['באיזו גרסה של דווינצ\\'י זה עובד?', rFaq('versions')],
      ['איך מתקינים?', rFaq('install')],
      ['יש לי כבר מנוי לפרימייר, זה עובד גם בדווינצ\\'י?', 'כן. מנוי COEDIT אחד עובד ב-Premiere Pro, ב-After Effects וב-DaVinci Resolve, עם אותו מפתח. לא צריך מנוי נוסף.'],
      ['מה ההבדל מהכתוביות האוטומטיות של דווינצ\\'י עצמו?', 'בגרסת Studio (בתשלום) של דווינצ\\'י יש תמלול וכתוביות אוטומטיות, ומגרסה 20 גם עברית, דרך חבילת שפות שחלק מהשפות בה עדיין בבטא. לפי Blackmagic, הכלים האלה שייכים לגרסת Studio. COEDIT נבנה לעברית מההתחלה: כתוביות מימין לשמאל עם עיצובים מוכנים, ואתם בודקים ומאשרים לפני שהן נכנסות לטיימליין. ובאותו פאנל, עם אותו מנוי, גם חיתוך טייקים ושתיקות וזומים אוטומטיים.'],
    ].filter(([, a]) => a);
` + script.slice(fb);
// Signups and events from this page say so.
script = once(script, "const source = [this._trialSource || 'hero',", "const source = ['resolve-' + (this._trialSource || 'hero'),", 'the signup source');
script = once(script, 'JSON.stringify({ email, source, audience: attr.for || null, utm })', "JSON.stringify({ email, source, audience: attr.for || null, utm, page: 'resolve' })", 'the signup body');
// COFRAMES works only in Premiere Pro and After Effects.
script = once(script, '.concat(OFFER_LINE ? [{ t: OFFER_LINE, c: \'#fff\' }] : [])', '.concat(OFFER_LINE && R.showCoframesGift ? [{ t: OFFER_LINE, c: \'#fff\' }] : [])', 'the offer line');
script = once(script, '      tiers, packs, faqs,\n', '      tiers, packs, faqs,\n      ...this.resolveVals(),\n', 'the page values');
// The main page's hero video and still are Premiere footage: not even referenced here.
script = script.split("'wZPgfeMTX3k'").join("''").split("'assets/hero-poster.jpg'").join("''");

const page = head + '<body>\n' + top + sections + pricing + faq + popup + bottom + script;
for (const bad of ['assets/coedit-panel.png', 'youtube-nocookie.com/embed/wZPgfeMTX3k', 'assets/hero-poster.jpg', 'STATIC-FALLBACK'])
  if (page.includes(bad)) throw new Error('Premiere material or main-page-only content leaked into the Resolve page: ' + bad);
writeFileSync(join(ROOT, 'resolve.dc.html'), page);
console.log('resolve.dc.html written (' + Math.round(page.length / 1024) + ' KB)');

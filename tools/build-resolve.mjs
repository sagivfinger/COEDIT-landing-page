// Builds resolve.dc.html, the DaVinci Resolve landing page: THE MAIN PAGE, with its copy adapted.
//
//   node tools/build-resolve.mjs
//
// Every section of index.html is kept as it is (reviews, features, gallery, how it works, pricing,
// FAQ, COFRAMES, trial popup); only what is about Premiere Pro or After Effects is rewritten for
// DaVinci Resolve, and two slots become Resolve placeholders: the hero video and the popup's
// install step (the panel screenshot stays: the panel looks the same in Resolve). Each rewrite must find its text exactly once, so a change on the main
// page stops this build instead of slipping through. Settings: site-config.js → resolve.
// Run it again after any change to index.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
// Line endings normalised: git may check the page out with Windows ones.
const main = readFileSync(join(ROOT, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const once = (s, from, to, what) => {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error('index.html changed: ' + what + ' (found ' + n + ' times)');
  return s.replace(from, () => to);
};
const between = (s, from, to, what) => {
  const a = s.indexOf(from), b = a < 0 ? -1 : s.indexOf(to, a + from.length);
  if (a < 0 || b < 0 || s.indexOf(from, a + 1) >= 0) throw new Error('index.html changed: ' + what);
  return [a, b + to.length];
};
const PLACEHOLDER = 'border:2px dashed #6b5a1e;border-radius:10px;background:#1c1a10;color:#e8d27a;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;font-size:16px;line-height:1.6';
// The DaVinci Resolve app icon (the image has white corners: the radius clips them, as the icon's own).
const DV_BADGE = '<img src="assets/davinci-resolve.png" alt="" aria-hidden="true" width="20" height="20" style="width:20px;height:20px;flex:none;border-radius:22%;display:inline-block">';

// ✏️ The answer for Studio users: a draft, factual, every claim from the Blackmagic guide cited below.
const R_CAPTIONS_ANSWER = 'ב-DaVinci Resolve Studio יש תמלול וכתוביות אוטומטיות, ומגרסה 20 גם עברית, דרך חבילת שפות שלפי Blackmagic חלק מהשפות בה עדיין בבטא. '
  + 'COEDIT בא מכיוון אחר: התמלול שלו מכוון לעברית מההתחלה, הכתוביות יוצאות בעיצובים מוכנים מימין לשמאל, ואתם בודקים ומאשרים אותן לפני שהן נכנסות לטיימליין. '
  + 'הוא גם מזהה לבד טייקים חוזרים ומשאיר את הטוב, בלי תסריט מראש, וחותך שתיקות ומוסיף זומים, הכל מאותו פאנל.';

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
head = head.replace(/<script>\n\/\/ The COEDIT panel's "buy minutes"[\s\S]*?<\/script>\n/, '');
head = head.replace(/<!-- FAQ-JSONLD:START[\s\S]*?<!-- FAQ-JSONLD:END -->\n/, '');
// This page is "resolve" (set before site-attribution.js, which keeps it for the visit): the nav's
// buttons stay here, signups and orders say so, and every Plausible event carries page=resolve.
head = once(head, '<script src="./site-attribution.js"></script>\n',
  `<script>window.COEDIT_PAGE = 'resolve';</script>
<script src="./site-attribution.js"></script>
<script>(window.COEDIT_ATTR_PROPS = window.COEDIT_ATTR_PROPS || {}).page = 'resolve';</script>
`, 'the site-attribution.js line');

// ── the page: the main page's template, its copy adapted ──
let page = main.slice(main.indexOf('<x-dc>'), main.indexOf('<script type="text/x-dc" data-dc-script>'));
const T = (from, to, what) => { page = once(page, from, to, what); };

T('<dc-import name="SiteNav" style="position:relative;z-index:40;display:block" hint-size="100%,66px"></dc-import>\n',
  `<dc-import name="SiteNav" style="position:relative;z-index:40;display:block" hint-size="100%,66px"></dc-import>
<sc-if value="{{ rDraft }}" hint-placeholder-val="{{ true }}">
<div style="background:#2a2410;border-bottom:1px solid #6b5a1e;color:#f0dc8a;text-align:center;font-size:14px;font-weight:700;padding:10px 16px">טיוטה · הדף לא פורסם ולא מקושר מאף מקום · ✏️ מסמן תוכן שעוד צריך להשלים</div>
</sc-if>
`, 'the nav');
// Hero: the headline, the subheadline, the button, the compatibility line, and the requirements box.
T('letter-spacing:-.02em">{{ h1a }}<br><span style="color:#e2504a">{{ h1b }}</span></h1>',
  'letter-spacing:-.02em">הפלאגין שעורכי <span style="color:#e2504a">דווינצ\'י</span> חיכו לו</h1>', 'the headline');
T('text-wrap:pretty">{{ heroSub }}</p>',
  'text-wrap:pretty">חיתוך טייקים ושתיקות, כתוביות מעוצבות בעברית וזומים אוטומטיים, ישר בתוך DaVinci Resolve.</p>', 'the subheadline');
{
  const h = page.indexOf('<header'), end = page.indexOf('</header>');
  const a = page.indexOf('>נסו בחינם עכשיו!</a>', h);
  if (a < 0 || a > end) throw new Error('index.html changed: the hero button');
  page = page.slice(0, a) + '>התחילו בחינם</a>' + page.slice(a + '>נסו בחינם עכשיו!</a>'.length);
  const hero = page.slice(h);
  const [b0, b1] = between(hero, '<span style="display:inline-flex;gap:4px">', 'תואם Premiere Pro ו-After Effects', 'the hero compatibility line');
  page = page.slice(0, h + b0) + DV_BADGE + 'עובד בתוך DaVinci Resolve' + page.slice(h + b1);
}
T('\n\n    </div>\n    <div data-px="-0.08" onClick="{{ heroVideoPlay }}"',
  `
      <!-- Requirements, right under the button (site-config.js resolve.requirements, placement 'hero'). -->
      <sc-if value="{{ rReqHero }}" hint-placeholder-val="{{ true }}">
        <div style="align-self:stretch;max-width:560px;background:#1a1a1a;border:1px solid #3a2a2a;border-radius:12px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start"><span aria-hidden="true" style="flex:none;font-size:18px">ⓘ</span><div style="display:flex;flex-direction:column;gap:4px"><b style="font-size:15px;color:#fff">דרישות מערכת</b><span style="font-size:14px;line-height:1.6;color:{{ rReqColor }}">{{ rReqText }}</span></div></div>
      </sc-if>
    </div>
    <div data-px="-0.08" onClick="{{ heroVideoPlay }}"`, 'the hero layout');
{
  const [a, b] = between(page, '<sc-if value="{{ heroVideoOn }}"', '</iframe></sc-if>', 'the hero video');
  page = page.slice(0, a)
    + '<sc-if value="{{ rHeroYt }}" hint-placeholder-val="{{ false }}"><iframe src="{{ rHeroYtSrc }}" title="COEDIT ב-DaVinci Resolve" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture" frameborder="0" style="position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none"></iframe></sc-if>'
    + '<sc-if value="{{ rHeroMp4 }}" hint-placeholder-val="{{ false }}"><video src="{{ rHeroSrc }}" poster="{{ rHeroPoster }}" autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></sc-if>'
    + '<sc-if value="{{ rHeroPh }}" hint-placeholder-val="{{ true }}"><div style="position:absolute;inset:14px;' + PLACEHOLDER + '">✏️ סרטון דמו חדש של COEDIT בתוך DaVinci Resolve</div></sc-if>'
    + page.slice(b);
}
T(' {{ heroPosterBg }}', '', 'the hero still');
// The panel screenshot: the COEDIT panel looks the same in DaVinci Resolve as in Premiere Pro, so the
// main page's image stays; only its description names the app.
T('alt="פאנל COEDIT בתוך Premiere Pro"', 'alt="פאנל COEDIT"', 'the panel screenshot');
// Premiere's words for things, in Resolve's.
T('אורך הרצף: ', 'אורך הטיימליין: ', 'the timeline demo label');
T('מוכנות לייצוא כקובץ MOGRT או SRT.', 'מוכנות לטיימליין של דווינצ\'י, וגם כקובץ SRT.', 'the captions feature line');
T('ישירות בתוך Premiere ו-After Effects', 'ישירות בתוך DaVinci Resolve', 'the "why" card title');
T('על הרצף או הקומפוזיציה שלכם.', 'על הטיימליין שלכם.', 'the "why" card text');
T('בפרמייר MOGRT לעריכה ב-Essential Graphics, באפטר שכבת טקסט עם אותן תבניות, ותמיד גם SRT סטנדרטי.',
  'הכתוביות נכנסות לטיימליין של דווינצ\'י וניתנות לעריכה, ותמיד גם SRT סטנדרטי.', 'the editable captions card');
T('עובד בתוך Premiere Pro ו-After Effects</span>', 'עובד ב-DaVinci Resolve, ב-Premiere Pro וב-After Effects</span>', 'the plan card line');
// The trial popup: the requirements line, then the install step for Resolve.
{
  const m = page.indexOf('id="trial-modal"');
  if (m < 0) throw new Error('index.html changed: the trial popup');
  // From the Pr badge to the end of the Ae one (both start with the same span).
  const a = page.indexOf('<span style="display:inline-flex;align-items:center;gap:7px"><span aria-hidden="true"', m);
  const tail = 'After Effects 2026 ומעלה</span>', b = page.indexOf(tail, a) + tail.length;
  if (a < 0 || b < tail.length || page.indexOf(tail, b) >= 0 || !page.slice(a, b).includes('Premiere Pro ב-Windows וב-Mac'))
    throw new Error('index.html changed: the popup requirements');
  page = page.slice(0, a) + '<span style="display:inline-flex;align-items:center;gap:7px">' + DV_BADGE + '<span style="color:{{ rReqColor }}">{{ rReqShort }}</span></span>' + page.slice(b);
  const [g0, g1] = between(page, '<sc-if value="{{ guideMode }}"', '</sc-if>\n  </div>\n</div>\n</sc-if>', 'the install step');
  page = page.slice(0, g0) + `<sc-if value="{{ guideMode }}" hint-placeholder-val="{{ false }}">
    <div style="display:flex;flex-direction:column;gap:10px;padding-left:40px">
      <span style="font-size:13px;font-weight:800;color:#e2504a;letter-spacing:.02em">התקנה ב-DaVinci Resolve</span>
      <h2 id="trial-title" style="margin:0;font-size:clamp(24px,3.4vw,32px);font-weight:900;line-height:1.15">מתקינים את COEDIT</h2>
      <div style="border:2px dashed #6b5a1e;border-radius:12px;background:#1c1a10;color:#e8d27a;padding:18px;font-size:15px;line-height:1.7">✏️ מדריך ההתקנה ל-DaVinci Resolve והורדה: יושלם לפני ההשקה, לפי הגרסאות שייתמכו.</div>
      <span style="font-size:14px;color:#aaa">משהו לא ברור? <a href="contact/">כתבו לנו</a>.</span>
    </div>
    </sc-if>
  </div>
</div>
</sc-if>` + page.slice(g1);
}

// ── the page logic: the main page's, with the Resolve parts ──
let script = main.slice(main.indexOf('<script type="text/x-dc" data-dc-script>'));
const S = (from, to, what) => { script = once(script, from, to, what); };
S('class Component extends DCLogic {', `// ── The DaVinci Resolve page (site-config.js resolve) ──
const R = CFG.resolve || {};
const R_DRAFT = !R.launched;
const R_TODO = '✏️ יושלם לפני ההשקה, לפי הגרסאות שייתמכו.';
class Component extends DCLogic {
  resolveVals() {
    const req = (R.requirements || {});
    const reqText = req.text || (R_DRAFT ? '✏️ דרישות מערכת (גרסאות DaVinci Resolve נתמכות, Windows/Mac): ' + R_TODO.slice(3) : '');
    const hv = R.heroVideo || {}, yt = /^[\\w-]{6,20}$/.test(hv.youtube || '') ? hv.youtube : '';
    return {
      rDraft: R_DRAFT,
      rReqHero: !!reqText && (req.placement || 'hero') === 'hero', rReqText: reqText, rReqColor: req.text ? '#cfcfcf' : '#e8d27a',
      rReqShort: req.short || (R_DRAFT ? '✏️ גרסאות DaVinci Resolve נתמכות' : 'DaVinci Resolve'),
      rHeroYt: !!yt, rHeroYtSrc: yt ? 'https://www.youtube-nocookie.com/embed/' + yt + '?autoplay=1&mute=1&loop=1&playlist=' + yt + '&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3' : '',
      rHeroMp4: !yt && !!hv.src, rHeroSrc: hv.src || '', rHeroPoster: hv.poster || '', rHeroPh: !yt && !hv.src,
    };
  }`, 'the Component class');
S('      tiers, packs, faqs,\n', '      tiers, packs, faqs,\n      ...this.resolveVals(),\n', 'the page values');
// Premiere's words in the page logic.
S("נכנסים ישר לרצף.", "נכנסים ישר לטיימליין.", 'the how-it-works step');
S("{ t: 'ייצוא MOGRT או SRT', c: '#bbb' }", "{ t: 'כתוביות שניתנות לעריכה + SRT', c: '#bbb' }", 'the plan includes');
// The FAQ: the Resolve questions first, then the main page's general ones.
{
  const fa = script.indexOf('    const faqData = ['), fb = script.indexOf('    W().__COEDIT_FAQ = faqData;');
  if (fa < 0 || fb < 0) throw new Error('index.html changed: the FAQ data');
  const mainFaq = script.slice(fa, fb);
  const keep = q => {
    const start = mainFaq.indexOf("['" + q + "',");
    const stop = start < 0 ? -1 : mainFaq.indexOf("']", start);     // the last entry ends "']]"
    if (start < 0 || stop < 0) throw new Error('index.html changed: FAQ ' + q);
    return '      ' + mainFaq.slice(start, stop + 2) + ',';
  };
  script = script.slice(0, fa) + `    // ✏️ Draft answers for review. The ones that depend on the launch version come from site-config.js.
    const rFaq = (k) => (R.faq || {})[k] || (R_DRAFT ? R_TODO : '');
    const faqData = [
      ['זה עובד בגרסה החינמית?', rFaq('free')],
      ['באיזו גרסה של דווינצ\\'י זה עובד?', rFaq('versions')],
      ['איך מתקינים?', rFaq('install')],
      ['יש לי כבר מנוי לפרימייר, זה עובד גם בדווינצ\\'י?', 'כן. מנוי COEDIT אחד עובד ב-Premiere Pro, ב-After Effects וב-DaVinci Resolve, עם אותו מפתח. לא צריך מנוי נוסף.'],
      // ✏️ Draft for review, for Studio users. Sources: Blackmagic, DaVinci Resolve 20 New Features
      // Guide: "Improved Transcription Quality and Support for Additional Languages (Studio Version
      // Only)", the extended language download lists Hebrew and says "some of these languages are
      // still in beta" (pp. 35-36); "AI IntelliScript (Studio Version Only)" picks the best take by
      // matching a script you supply (p. 24). https://documents.blackmagicdesign.com/SupportNotes/
      // DaVinci_Resolve_20_New_Features_Guide.pdf . The DaVinci Resolve 21 guide does not say which of
      // these are Studio only, nor whether Hebrew is still beta: ✏️ verify both on 21.
      ['מה ההבדל מהכתוביות האוטומטיות של דווינצ\\'י עצמו?', ${JSON.stringify(R_CAPTIONS_ANSWER)}],
${keep('זה מתאים גם למי שרק מתחיל לערוך?')}
${keep('האם החיתוכים מתבצעים בלי שאראה אותם?')}
${keep('זה עובד בעברית?')}
${keep('מה ההבדל בין כתוביות וזומים לבין Smart Cuts?')}
${keep('אפשר לבטל?')}
${keep('מה קורה כשנגמרות לי הדקות?')}
${keep('מה זה COFRAMES?')}
    ].filter(([, a]) => a);
` + script.slice(fb);
}
S("const source = [this._trialSource || 'hero',", "const source = ['resolve-' + (this._trialSource || 'hero'),", 'the signup source');
S('JSON.stringify({ email, source, audience: attr.for || null, utm, offer_token: offerToken })', "JSON.stringify({ email, source, audience: attr.for || null, utm, offer_token: offerToken, page: 'resolve' })", 'the signup body');
script = script.split("'wZPgfeMTX3k'").join("''").split("'assets/hero-poster.jpg'").join("''");

const out = head + '<body>\n' + page + script;
for (const bad of ['wZPgfeMTX3k', 'assets/hero-poster.jpg', 'STATIC-FALLBACK', 'Window → Extensions', 'ZXP Installer'])
  if (out.includes(bad)) throw new Error('Premiere material or main-page-only content leaked into the Resolve page: ' + bad);
writeFileSync(join(ROOT, 'resolve.dc.html'), out);
console.log('resolve.dc.html written (' + Math.round(out.length / 1024) + ' KB)');

// ═══════════════════════════════════════════════════════════════════════════════════════════
//  COEDIT site settings — the one file to edit for marketing text, the launch offer,
//  social proof and audience pages. Every page loads it (index.html, store.dc.html, info.dc.html).
//
//  ✏️ TODO marks a placeholder for the owner. The rule everywhere: an EMPTY value ('' / null / [])
//  hides whatever depends on it, so nothing unconfirmed ever appears on the live site.
//  Never put a number here that isn't real (user counts, prices, ratings).
// ═══════════════════════════════════════════════════════════════════════════════════════════
window.COEDIT_CONFIG = {

  // ── Hero: the Hebrew captions line (shown under the subheadline) ──────────────────────────
  // Approved options:  א 'כתוביות בעברית, מימין לשמאל, מתוזמנות מילה במילה'
  //                    ב 'עברית אמיתית: כתוביות מימין לשמאל, עם תזמון לכל מילה'
  //                    ג 'כל מילה בזמן שלה. כתוביות בעברית, מימין לשמאל'
  heroCaptionsLine: 'כתוביות בעברית, מימין לשמאל, מתוזמנות מילה במילה',

  // ── Hero: social proof (replaces the old star rating) ─────────────────────────────────────
  socialProof: {
    // ✏️ TODO the real number of editors using COEDIT, e.g. 120. null = not shown.
    userCount: null,
    // Shown after the number: "120+ עורכים כבר עובדים עם COEDIT".
    userCountText: 'עורכים כבר עובדים עם COEDIT',
    // The real reviewers' photos (assets/reviews, the same people as the reviews strip).
    showReviewerFaces: true,
    // Shown next to the photos when there's no user count. Must stay true without a number.
    facesText: 'עורכי וידאו ממליצים על COEDIT',
  },

  // ── The COFRAMES gift: each visitor's own 72 hours (site-offer.js) ───────────────────────
  // Every visitor gets their own deadline, 72 hours from their first visit or trial signup; the site,
  // the emails and the checkout all use it, and once it passes the offer disappears for that visitor.
  // {deadline} is replaced by that visitor's deadline ("16.11 בשעה 21:30"). text '' hides the offer on
  // the site; the one switch that ends it everywhere is COEDIT_COFRAMES_OFFER=0 in COEDIT Cloud.
  offer: {
    // The full sentence (hero, "למה COEDIT", COFRAMES section, pricing, FAQ).
    text: 'COFRAMES במתנה עם כל מנוי שנרכש עד {deadline}',
    // The short form (cart line, small labels).
    short: 'מתנה עד {deadline}',
    // The countdown bar at the top: "🎁 <bar> · נשארו לכם 71:59:12".
    bar: 'COFRAMES במתנה עם כל מנוי',
    // The visitor's window, in hours (the Cloud's COEDIT_COFRAMES_OFFER_HOURS decides what is granted).
    personalHours: 72,
    // ✏️ TODO what COFRAMES is worth on its own, in shekels, e.g. 149 → "שווה ₪149". null = not shown.
    anchorPrice: null,
  },

  // ── FAQ: "למה לא להשתמש בכלים המובנים של פרימייר או בפלאגינים אחרים?" ──────────────────────
  // ✏️ TODO the draft answer is in index.html (faqData). Read it, then set true to show it on the site.
  faqDraftApproved: false,

  // ── The DaVinci Resolve page: getcoedit.com/resolve (resolve.dc.html) ──────────────────────
  // THE MAIN PAGE with its copy adapted to DaVinci Resolve: same sections, reviews, gallery, pricing
  // and trial popup. Built by tools/build-resolve.mjs (run it again after any change to index.html).
  // A HIDDEN DRAFT until launched: noindex, linked from nowhere, and a "טיוטה" strip on top; while
  // launched is false the empty slots below show a marked ✏️ placeholder.
  resolve: {
    launched: false,                    // ✏️ launching is a separate approval
    // ✏️ The hero video: the new demo INSIDE DaVinci Resolve. A YouTube id, or an mp4 under assets/.
    heroVideo: { youtube: '', src: '', poster: '' },
    // ✏️ System requirements (supported editions, versions, Windows/Mac), shown right under the hero's
    // button ('hero'), before anyone signs up. "short" is the one-liner in the trial popup.
    // Never say it works on the free edition unless that is confirmed for the launch version.
    requirements: { placement: 'hero', text: '', short: '' },
    // ✏️ FAQ answers that depend on the launch version (the others are in the page).
    faq: { free: '', versions: '', install: '' },
    // The COFRAMES gift shows here as on the main page (note: COFRAMES works in Premiere Pro and
    // After Effects, not in DaVinci Resolve). false hides it on this page only.
    showCoframesGift: true,
  },

  // ── Subscription plans: monthly price in ₪ incl. VAT, minutes per month ────────────────────
  // ⚠ MUST MATCH the Cloud's plans (cloud/app/billing/plans.py PLANS). Yearly = 20% off, computed
  // by the pages. Read by the main page, the Resolve page, the store and the cart drawer.
  plans: [
    { name: 'NOOB',   who: 'למי שרק מתחיל',              monthly: 99,  captions: 30,  cuts: 90 },
    { name: 'PRO',    who: 'לעורכים שעובדים על זה כל יום', monthly: 179, captions: 90,  cuts: 300, recommended: true },
    { name: 'HACKER', who: 'לאולפנים ועורכים בנפח גבוה',   monthly: 349, captions: 500, cuts: 1000 },
  ],

  // ── Credit packs: [credits, price in ₪ incl. VAT], per category, smallest first ────────────
  // ⚠ MUST MATCH the Cloud's price list (cloud/app/billing/plans.py CREDIT_PACKS): the Cloud refuses
  // to fulfil an order whose pack or price isn't on its list. Change both together, never one.
  // The largest pack in each list gets the "הכי משתלם" badge.
  creditPacks: {
    cz:   [[30, 59], [100, 169], [250, 349]],   // כתוביות וזומים  (Cloud: cz30, cz100, cz250)
    cuts: [[60, 39], [200, 109], [500, 229]],   // חיתוכים          (Cloud: ed60, ed200, ed500)
  },

  // ── Audience pages: getcoedit.com/?for=<key> ──────────────────────────────────────────────
  // Each audience changes the hero, which feature comes first, the gallery and the recommended
  // plan. Any field left '' or [] falls back to the normal page.
  // ready: false → the audience is NOT live yet: ?for=<key> shows the normal page and its card
  // stays out of the "למי זה מתאים" section. Preview it anyway with ?for=<key>&preview=1.
  audiences: {
    podcast: {
      ready: false,
      card: { icon: '🎙️', title: 'פודקאסטים', text: '✏️ TODO משפט קצר: מה COEDIT עושה לפודקאסטרים' },
      h1: ['✏️ TODO כותרת לפודקאסט,', '✏️ TODO שורה שנייה (באדום)'],
      sub: '✏️ TODO תת כותרת לפודקאסטרים',
      heroVideo: '',              // ✏️ TODO YouTube video id (the part after watch?v=). '' = the normal video.
      featuresFirst: 'cuts',      // 'cuts' = Smart Cuts first, 'captions' = captions and zooms first
      gallery: [],                // ✏️ TODO which "סרטונים אמיתיים" videos to show, e.g. [1, 4, 6] (edit-1.mp4 …). [] = all
      recommendedPlan: 'PRO',     // 'NOOB' | 'PRO' | 'HACKER'
    },
    shorts: {
      ready: false,
      card: { icon: '📱', title: 'שורטס ורילס', text: '✏️ TODO משפט קצר: מה COEDIT עושה ליוצרי שורטס' },
      h1: ['✏️ TODO כותרת לשורטס,', '✏️ TODO שורה שנייה (באדום)'],
      sub: '✏️ TODO תת כותרת ליוצרי שורטס',
      heroVideo: '',
      featuresFirst: 'captions',
      gallery: [],
      recommendedPlan: 'PRO',
    },
    youtube: {
      ready: false,
      card: { icon: '▶️', title: 'יוטיוב', text: '✏️ TODO משפט קצר: מה COEDIT עושה ליוטיוברים' },
      h1: ['✏️ TODO כותרת ליוטיוב,', '✏️ TODO שורה שנייה (באדום)'],
      sub: '✏️ TODO תת כותרת ליוטיוברים',
      heroVideo: '',
      featuresFirst: 'cuts',
      gallery: [],
      recommendedPlan: 'PRO',
    },
  },

  // ── "למי זה מתאים" section (after "זו הדרך הישנה") ────────────────────────────────────────
  // It shows one card per audience with ready: true, and is hidden while none is ready.
  whoFor: {
    eyebrow: 'למי זה מתאים',
    title: 'COEDIT בנוי לסוג התוכן שלכם',
  },
};

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

  // ── The COFRAMES launch offer: the same wording on every page ─────────────────────────────
  offer: {
    // The full sentence (hero, "למה COEDIT", COFRAMES section, pricing, FAQ, offer bar).
    text: 'COFRAMES במתנה עם כל מנוי בתקופת ההשקה',
    // The short form (cart line, small labels).
    short: 'מתנת השקה',
    // ✏️ TODO what COFRAMES is worth on its own, in shekels, e.g. 149 → "שווה ₪149". null = not shown.
    anchorPrice: null,
    // When the launch offer ends (Israel time). The countdown bar at the top counts down to it
    // and disappears once it passes. '' = no countdown. To extend the offer, move this date.
    endsAt: '2026-11-11T13:00:00+02:00',
  },

  // ── FAQ: "למה לא להשתמש בכלים המובנים של פרימייר או בפלאגינים אחרים?" ──────────────────────
  // ✏️ TODO the draft answer is in index.html (faqData). Read it, then set true to show it on the site.
  faqDraftApproved: false,

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

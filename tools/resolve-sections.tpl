<!-- The DaVinci Resolve page's own sections (hero to testimonials). tools/build-resolve.mjs puts them
     between the shared nav and the main page's pricing section. ✏️ All copy is a draft for review. -->
<sc-if value="{{ rDraft }}" hint-placeholder-val="{{ true }}">
<div style="background:#2a2410;border-bottom:1px solid #6b5a1e;color:#f0dc8a;text-align:center;font-size:14px;font-weight:700;padding:10px 16px">טיוטה · הדף לא פורסם ולא מקושר מאף מקום · ✏️ מסמן תוכן שעוד צריך להשלים</div>
</sc-if>

<header style="position:relative;overflow:hidden;padding:clamp(48px,8vw,90px) 24px clamp(56px,9vw,100px);background:linear-gradient(180deg,#1a0f0f,#121212 70%)">
  <div data-px="0.5" style="position:absolute;inset:-10% -10% auto;height:90%;background:radial-gradient(ellipse 50% 55% at 30% 40%,rgba(217,58,53,.28),transparent 70%);pointer-events:none"></div>
  <div data-px="0.1" style="position:relative;max-width:1400px;margin:0 auto;display:flex;flex-wrap:wrap;gap:48px;align-items:center">
    <div style="flex:1 1 360px;min-width:0;display:flex;flex-direction:column;gap:22px">
      <span style="display:inline-flex;align-items:center;gap:10px;align-self:flex-start;font-size:14px;font-weight:700;color:#ddd"><span aria-hidden="true" style="width:22px;height:22px;flex:none;border-radius:50%;background:conic-gradient(#e64b3c 0 33%,#f2b134 0 66%,#3a8ee6 0);display:inline-block"></span>DaVinci Resolve</span>
      <h1 style="margin:0;font-size:clamp(40px,5.2vw,72px);font-weight:900;line-height:1.05;letter-spacing:-.02em">הפלאגין שעורכי <span style="color:#e2504a">דווינצ'י</span> חיכו לו</h1>
      <p style="margin:0;font-size:19px;line-height:1.6;color:#bbb;max-width:540px;text-wrap:pretty">חיתוך טייקים ושתיקות, כתוביות מעוצבות בעברית וזומים אוטומטיים, ישר בתוך DaVinci Resolve.</p>
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
        <a href="#trial" onClick="{{ ctaTrial }}" style="background:linear-gradient(180deg,#e2504a,#c42e2a);color:#fff;font-weight:800;font-size:18px;padding:17px 38px;border-radius:9px;box-shadow:0 0 34px rgba(220,60,55,.4);transition:transform .2s ease,box-shadow .2s ease" style-hover="transform:translateY(-2px);box-shadow:0 0 36px rgba(220,60,55,.6)">התחילו בחינם</a>
      </div>
      <!-- Requirements, right under the button (resolve.requirements.placement = 'hero'). -->
      <sc-if value="{{ rReqHero }}" hint-placeholder-val="{{ true }}">
        <div style="align-self:stretch;max-width:560px;background:#1a1a1a;border:1px solid #3a2a2a;border-radius:12px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start"><span aria-hidden="true" style="flex:none;font-size:18px">ⓘ</span><div style="display:flex;flex-direction:column;gap:4px"><b style="font-size:15px;color:#fff">דרישות מערכת</b><span style="font-size:14px;line-height:1.6;color:{{ rReqColor }}">{{ rReqText }}</span></div></div>
      </sc-if>
    </div>
    <div data-px="-0.08" style="position:relative;flex:1.6 1 560px;min-width:0;aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:1px solid #3a2222;background:#0c0c0c;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 60px rgba(217,58,53,.12)">
      <sc-if value="{{ rHeroYt }}" hint-placeholder-val="{{ false }}"><iframe src="{{ rHeroYtSrc }}" title="COEDIT ב-DaVinci Resolve" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture" frameborder="0" style="position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none"></iframe></sc-if>
      <sc-if value="{{ rHeroMp4 }}" hint-placeholder-val="{{ false }}"><video src="{{ rHeroSrc }}" poster="{{ rHeroPoster }}" autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video></sc-if>
      <sc-if value="{{ rHeroPh }}" hint-placeholder-val="{{ true }}"><div style="position:absolute;inset:14px;border:2px dashed #6b5a1e;border-radius:10px;background:#1c1a10;color:#e8d27a;display:flex;align-items:center;justify-content:center;text-align:center;padding:20px;font-size:16px;line-height:1.6">✏️ סרטון לפני/אחרי של COEDIT בתוך הממשק של DaVinci Resolve<br>(לא צילומי Premiere)</div></sc-if>
    </div>
  </div>
</header>

<section style="padding:clamp(64px,10vw,110px) 24px;background:#151515;border-top:1px solid #1f1f1f">
  <div style="max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:22px;text-align:center;align-items:center">
    <span style="font-family:Heebo,sans-serif;font-size:12px;letter-spacing:.3em;color:#d93a35">מכירים את זה?</span>
    <h2 style="margin:0;font-size:clamp(30px,4vw,50px);font-weight:900;line-height:1.12;text-wrap:balance">דווינצ'י מעולה לעריכה. <span style="color:#e2504a">לעברית, פחות.</span></h2>
    <p style="margin:0;font-size:18px;line-height:1.75;color:#a5a5a5;text-wrap:pretty">כתוביות בעברית מקלידים ומתזמנים ביד, שורה אחרי שורה, ומתקנים כל מילה שנהפכה. טייקים חוזרים ושתיקות מנקים בטיימליין, קליפ אחרי קליפ. וכל הערב הולך על עבודה שאף אחד לא רואה בסרטון הסופי.</p>
    <a href="#trial" onClick="{{ ctaTrial }}" style="background:linear-gradient(180deg,#e2504a,#c42e2a);color:#fff;font-weight:800;font-size:18px;padding:17px 38px;border-radius:9px;box-shadow:0 0 34px rgba(220,60,55,.4)">התחילו בחינם</a>
  </div>
</section>

<section style="padding:clamp(64px,10vw,110px) 24px">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:44px">
    <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px">
      <span style="font-family:Heebo,sans-serif;font-size:12px;letter-spacing:.3em;color:#d93a35">מה COEDIT עושה בדווינצ'י</span>
      <h2 style="margin:0;font-size:clamp(30px,4vw,50px);font-weight:900;line-height:1.12;text-wrap:balance">ארבעה כלים. <span style="color:#e2504a">פאנל אחד.</span></h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:18px">
      <sc-for list="{{ rFeatures }}" as="f" hint-placeholder-count="4">
        <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:14px;overflow:hidden;display:flex;flex-direction:column">
          <div style="position:relative;aspect-ratio:16/9;background:#0c0c0c">
            <sc-if value="{{ f.hasShot }}" hint-placeholder-val="{{ false }}"><img src="{{ f.shot }}" alt="{{ f.title }} ב-DaVinci Resolve" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></sc-if>
            <sc-if value="{{ f.ph }}" hint-placeholder-val="{{ true }}"><div style="position:absolute;inset:12px;border:2px dashed #6b5a1e;border-radius:10px;background:#1c1a10;color:#e8d27a;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;font-size:14px;line-height:1.6"><span>✏️ צילום מסך מ-DaVinci Resolve: {{ f.title }}</span></div></sc-if>
          </div>
          <div style="padding:22px 24px 26px;display:flex;flex-direction:column;gap:8px">
            <span style="font-size:12px;letter-spacing:.2em;color:#d93a35">{{ f.eyebrow }}</span>
            <b style="font-size:21px;color:#fff">{{ f.title }}</b>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#999;text-wrap:pretty">{{ f.text }}</p>
          </div>
        </div>
      </sc-for>
    </div>
  </div>
</section>

<section style="padding:clamp(56px,9vw,96px) 24px;background:#151515;border-top:1px solid #1f1f1f">
  <div style="max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:18px;text-align:center;align-items:center">
    <div aria-hidden="true" style="display:flex;gap:8px"><span style="width:34px;height:34px;border-radius:50%;background:conic-gradient(#e64b3c 0 33%,#f2b134 0 66%,#3a8ee6 0);display:inline-block"></span><span style="width:34px;height:34px;border-radius:8px;background:#00005b;border:1.5px solid #9999ff;color:#9999ff;font-size:14px;font-weight:800;display:inline-flex;align-items:center;justify-content:center">Pr</span><span style="width:34px;height:34px;border-radius:8px;background:#00005b;border:1.5px solid #9999ff;color:#9999ff;font-size:14px;font-weight:800;display:inline-flex;align-items:center;justify-content:center">Ae</span></div>
    <h2 style="margin:0;font-size:clamp(28px,3.6vw,44px);font-weight:900;line-height:1.15;text-wrap:balance">עובדים גם בפרימייר או באפטר? <span style="color:#e2504a">אותו מנוי עובד בכולן.</span></h2>
    <p style="margin:0;font-size:18px;line-height:1.7;color:#a5a5a5">מנוי COEDIT אחד ומפתח אחד, ב-DaVinci Resolve, ב-Premiere Pro וב-After Effects.</p>
  </div>
</section>

<!-- Requirements as their own block (resolve.requirements.placement = 'section'). -->
<sc-if value="{{ rReqSection }}" hint-placeholder-val="{{ false }}">
<section id="requirements" style="padding:clamp(56px,9vw,90px) 24px">
  <div style="max-width:820px;margin:0 auto;background:#1a1a1a;border:1px solid #3a2a2a;border-radius:14px;padding:28px;display:flex;flex-direction:column;gap:10px">
    <h2 style="margin:0;font-size:clamp(24px,3vw,34px);font-weight:900">דרישות מערכת והתקנה</h2>
    <p style="margin:0;font-size:16px;line-height:1.7;color:{{ rReqColor }}">{{ rReqText }}</p>
  </div>
</section>
</sc-if>

<section id="reviews" style="padding:clamp(64px,10vw,110px) 24px;background:#151515;border-top:1px solid #1f1f1f">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:36px">
    <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px">
      <span style="font-family:Heebo,sans-serif;font-size:12px;letter-spacing:.3em;color:#d93a35">נערך עם COEDIT</span>
      <h2 style="margin:0;font-size:clamp(30px,4vw,50px);font-weight:900;line-height:1.12;text-wrap:balance">סרטונים אמיתיים. <span style="color:#e2504a">עורכי דווינצ'י אמיתיים.</span></h2>
    </div>
    <sc-if value="{{ rGalleryHas }}" hint-placeholder-val="{{ false }}">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px">
        <sc-for list="{{ rGallery }}" as="v" hint-placeholder-count="3"><video src="{{ v.src }}" poster="{{ v.poster }}" controls playsinline preload="none" style="width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:12px;background:#000;border:1px solid #2a2a2a"></video></sc-for>
      </div>
    </sc-if>
    <sc-if value="{{ rGalleryPh }}" hint-placeholder-val="{{ true }}"><div style="border:2px dashed #6b5a1e;border-radius:12px;background:#1c1a10;color:#e8d27a;text-align:center;padding:28px;font-size:15px;line-height:1.6">✏️ סרטונים שנערכו עם COEDIT בתוך DaVinci Resolve</div></sc-if>
    <sc-if value="{{ rQuotesHas }}" hint-placeholder-val="{{ false }}">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px">
        <sc-for list="{{ rQuotes }}" as="q" hint-placeholder-count="3">
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:12px">
            <div style="display:flex;gap:12px;align-items:center"><span style="width:52px;height:52px;flex:none;border-radius:50%;background:{{ q.av }}"></span><div style="display:flex;flex-direction:column"><b style="color:#fff">{{ q.name }}</b><span style="font-size:13px;color:#888">{{ q.role }}</span><span dir="ltr" style="font-size:12px;color:#777;text-align:right">{{ q.handle }}</span></div></div>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#ccc">{{ q.quote }}</p>
          </div>
        </sc-for>
      </div>
    </sc-if>
    <sc-if value="{{ rQuotesPh }}" hint-placeholder-val="{{ true }}"><div style="border:2px dashed #6b5a1e;border-radius:12px;background:#1c1a10;color:#e8d27a;text-align:center;padding:28px;font-size:15px;line-height:1.6">✏️ המלצות של עורכי DaVinci Resolve בלבד: שם, תפקיד, ציטוט, תמונה ואישור</div></sc-if>
  </div>
</section>


// The COFRAMES gift: this visitor's own deadline, 72 hours from their first visit (or trial signup).
//
// On the first page view COEDIT Cloud hands out a SIGNED start time (POST /offer/start); it is kept in
// this browser and sent back with the trial signup and the checkout, so the deadline the visitor sees
// is the one the Cloud enforces when they pay. Every page shows window.COEDIT_OFFER:
//   { active, deadline (ms), token, local }
// and re-renders on the 'coedit-offer' event. Once the deadline passes (or the Cloud says the offer is
// switched off), active is false and the pages stop showing the offer. If the Cloud can't be reached,
// a first-visit time kept here is used for the countdown only (local: true): it grants nothing.
// site-config.js offer.text '' hides the offer on the site; COEDIT_COFRAMES_OFFER=0 in the Cloud ends
// it everywhere.
(function () {
  var KEY = 'coedit-offer';
  var API = 'https://coedit-cloud.fly.dev/api/v1/offer/start';
  var cfg = ((window.COEDIT_CONFIG || {}).offer) || {};
  var hours = cfg.personalHours || 72;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
  // The static copy for bots is rendered without any personal deadline (tools/prerender.mjs).
  var prerender = /[?&]prerender=1\b/.test(location.search);

  function publish(o) {
    var now = Date.now();
    o.active = !!(cfg.text && !prerender && o.enabled !== false && o.deadline && now < o.deadline);
    window.COEDIT_OFFER = o;
    try { window.dispatchEvent(new CustomEvent('coedit-offer')); } catch (e) {}
  }
  function keep(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  // What we already know, right away (the Cloud's answer refines it a moment later).
  if (!saved.first) { saved.first = Date.now(); keep(saved); }
  publish({ enabled: saved.enabled, deadline: saved.deadline || saved.first + hours * 3600e3, token: saved.token || null, local: !saved.token });

  if (prerender || !cfg.text) return;
  try {
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: saved.token || null }) })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (j) {
        if (j.enabled === false) { saved.enabled = false; keep(saved); publish({ enabled: false, deadline: 0, token: null }); return; }
        saved.enabled = true; saved.token = j.token; saved.deadline = j.deadline * 1000; keep(saved);
        publish({ enabled: true, deadline: saved.deadline, token: saved.token, local: false });
      })
      .catch(function () { /* the Cloud is unreachable: keep the local countdown, grant nothing */ });
  } catch (e) {}

  // The deadline in words, Israel time: "16.11, 21:30".
  window.COEDIT_OFFER_DEADLINE_TEXT = function (ms) {
    try {
      var d = new Date(ms);
      var day = new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric' }).format(d);
      var time = new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
      return day + ' בשעה ' + time;
    } catch (e) { return ''; }
  };
})();

// Where this visitor came from, kept for the whole visit (this tab, every page of the site):
// ?for=<audience> and the utm_* tags of the link they arrived by. A later link that carries its
// own tags replaces them. The pages read window.COEDIT_ATTR to tag Plausible events and the
// free-trial signup, so each signup shows which audience and campaign brought it.
(function () {
  var KEYS = ['for', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('coedit-attr') || '{}') || {}; } catch (e) {}
  try {
    var q = new URLSearchParams(location.search), fresh = {}, any = false;
    KEYS.forEach(function (k) {
      var v = (q.get(k) || '').trim().slice(0, 100);
      if (v) { fresh[k] = v; any = true; }
    });
    // New campaign tags replace the old set; a bare ?for= only updates the audience.
    if (any) saved = KEYS.some(function (k) { return k !== 'for' && fresh[k]; }) ? Object.assign({ for: saved.for }, fresh) : Object.assign(saved, fresh);
    if (!saved.for) delete saved.for;
    sessionStorage.setItem('coedit-attr', JSON.stringify(saved));
  } catch (e) {}
  window.COEDIT_ATTR = saved;
  // The same, as Plausible custom properties (each page passes them to plausible.init, so every
  // pageview and event carries them). Only the ones that are set.
  var props = {}, map = { audience: 'for', campaign: 'utm_campaign', campaign_source: 'utm_source' };
  for (var p in map) if (saved[map[p]]) props[p] = saved[map[p]];
  window.COEDIT_ATTR_PROPS = props;
})();

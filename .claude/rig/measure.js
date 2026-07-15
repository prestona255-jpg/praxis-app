// ── PRAXIS DW RIG · measurement harness ──────────────────────────────────────
// Installs window.rig. Paste into the Browser pane's javascript_tool, once per
// page load (a reload wipes it; re-paste). ES5 on purpose — it runs in the same
// pane as the ES3 client and must never be the thing that breaks.
//
// Extracted at DW batch 4 (2026-07-14) under the rig-efficiency law.
//
// ── The gates it measures (docs/studio/praxis-desktop-canon.md) ──────────────
//   D1 composition — rig.occ(sel): primary content ≥60% of viewport @1920.
//                    Occupancy = [leftmost-leaf … rightmost-leaf] / clientWidth,
//                    the D0 metric. KNOWN ARTIFACT (D0 §"Envelope metric"): a
//                    left-pinned leaf (a breadcrumb at x=32) skews the span —
//                    always eyeball rig.occ().left/right against the real
//                    centered column before believing a number.
//   D2 measure     — rig.ch(sel): prose ≤72ch at 1280/1440/1920.
//   D3 scroll      — rig.hscroll(): scrollWidth == clientWidth.
//   D4 pointer     — rig.pointer(sel): cursor on interactive descendants.
//   D5 density     — rig.body(): body font-size unchanged at 1920.
//   D6 focus       — rig.rings(sels): CSSOM proof the rule EXISTS and matches.
//                    ⚠ THIS IS A MATCH TEST, NOT A LOOK. It cannot see a
//                    deformed pill (that is the DW-RING-RADIUS lesson —
//                    computed styles never prove a look). getComputedStyle
//                    returns the IDLE state; :focus-visible is unreadable that
//                    way, so CSSOM declarations are the only honest instrument.
//   guard bands    — rig.fingerprint(): layout checksum at 390/1024. Compare
//                    before/after; a match proves ≤1199 undisturbed WITHOUT a
//                    full stash re-measure (the DW-3 method).
//
// ── Rig facts (do not relearn) ───────────────────────────────────────────────
//   * IntersectionObserver and rAF DO NOT FIRE in this headless pane. Any
//     surface relying on them renders unmounted. Use synchronous scroll idiom.
//   * clientWidth runs ~15px under nominal when a scrollbar is present
//     (1280→1265, 1440→1425, 1920→1905). ALWAYS divide by clientWidth.
//   * Screenshots are proven dead here (30s timeout). Geometry is the evidence.
//   * rig.bustCss() re-fetches the stylesheet WITHOUT a reload — this is how you
//     iterate CSS on ONE port. A fresh port is only needed when JS changes.
//
// ── WHY the cache-bust actually works (verified at DW batch 4, read sw.js) ────
//   sw.js calls self.clients.claim() on activate (:98), so the SW controls the
//   page even right after you unregister-and-reload — index.html:123 re-registers
//   on every load. You cannot simply "turn it off".
//   It does not matter, because its fetch handler (:101-123) is CACHE-FIRST via
//   caches.match(event.request) — and caches.match's ignoreSearch option
//   DEFAULTS TO FALSE. So `components.css?v=<rand>` is a DIFFERENT cache key,
//   misses, and falls through to the network. That is the mechanism the
//   cache-bust idiom rides on; it is not folklore.
//   COROLLARY: a plain reload after a CSS edit serves the STALE precached file.
//   After ANY css edit -> rig.bustCss(). After any JS edit -> FRESH PORT (a new
//   origin has an empty cache). And never trust the swap: assert the new rule is
//   live in CSSOM (rig.rings) or via a computed value before you measure.
//
// ── ⚠ "FRESH PORT" IS A LIE (cost DW-4 a confused gate; do not repeat) ───────
//   A port you have not used THIS session is NOT a fresh origin. The Browser
//   pane's profile PERSISTS across sessions, and a service worker registered on
//   http://localhost:<port> by an EARLIER session survives there — with its
//   caches. DW-4 started "fresh" :8791, and a **praxis-v3.206** SW from a prior
//   session claimed the page and served a STALE views.js: the edit was on disk,
//   the server served it (curl proved it), and the browser still ran the old one.
//   The cache NAME is the tell — `caches.keys()` returning an OLD praxis-v* is
//   proof you are on someone else's origin.
//   THE RULE: on every port, FIRST unregister + clear caches, RELOAD, and then
//   ASSERT YOUR EDIT IS LIVE before you measure anything:
//       String(someEditedFn).indexOf('<your new token>') !== -1     // JS
//       rig.rings(['<your new selector>'])                          // CSS
//   A gate measured on unverified bytes is fiction. Assert, then measure.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var rig = {};

  function vis(el) {
    if (!el || !el.getBoundingClientRect) { return false; }
    var r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) { return false; }
    var cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') { return false; }
    return true;
  }

  // leaf = an element with visible text and no element child that also has text
  function leaves(root) {
    var out = [], all = root.querySelectorAll('*'), i, el, txt, hasElemChild, j, c;
    for (i = 0; i < all.length; i++) {
      el = all[i];
      if (!vis(el)) { continue; }
      txt = (el.textContent || '').replace(/\s+/g, '');
      if (!txt) { continue; }
      hasElemChild = false;
      for (j = 0; j < el.children.length; j++) {
        c = el.children[j];
        if (vis(c) && (c.textContent || '').replace(/\s+/g, '')) { hasElemChild = true; break; }
      }
      if (!hasElemChild) { out.push(el); }
    }
    return out;
  }

  rig.vp = function () {
    var se = document.scrollingElement || document.documentElement;
    return { cw: se.clientWidth, iw: window.innerWidth, dpr: window.devicePixelRatio };
  };

  // D1 — occupancy of the text span within the viewport
  rig.occ = function (sel) {
    var root = document.querySelector(sel);
    if (!root) { return { err: 'no root for ' + sel }; }
    var ls = leaves(root), i, r, min = Infinity, max = -Infinity, minEl = '', maxEl = '';
    for (i = 0; i < ls.length; i++) {
      r = ls[i].getBoundingClientRect();
      if (r.left < min) { min = r.left; minEl = ls[i].className || ls[i].tagName; }
      if (r.right > max) { max = r.right; maxEl = ls[i].className || ls[i].tagName; }
    }
    var se = document.scrollingElement || document.documentElement;
    var cw = se.clientWidth;
    if (!ls.length) { return { err: 'no text leaves under ' + sel }; }
    return {
      leaves: ls.length,
      left: +min.toFixed(1), right: +max.toFixed(1),
      span: +(max - min).toFixed(1),
      cw: cw,
      occPct: +(((max - min) / cw) * 100).toFixed(1),
      leftEl: String(minEl).slice(0, 60), rightEl: String(maxEl).slice(0, 60)
    };
  };

  // D2 — reading measure in ch. ch = content width / advance width of '0'
  // in that element's own resolved font (canvas-measured, not guessed).
  var _cvs = null;
  function zeroW(cs) {
    if (!_cvs) { _cvs = document.createElement('canvas'); }
    var ctx = _cvs.getContext('2d');
    ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' / ' + cs.lineHeight + ' ' + cs.fontFamily;
    return ctx.measureText('0').width;
  }
  rig.chOf = function (el) {
    if (!el) { return null; }
    var cs = getComputedStyle(el);
    var r = el.getBoundingClientRect();
    var pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    var bd = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    var content = r.width - pad - bd;
    var z = zeroW(cs);
    return {
      cls: String(el.className || el.tagName).slice(0, 60),
      px: +content.toFixed(1),
      font: cs.fontSize + ' ' + cs.fontFamily.split(',')[0],
      ch: z > 0 ? +(content / z).toFixed(1) : null
    };
  };
  rig.ch = function (sel) {
    var el = document.querySelector(sel);
    return el ? rig.chOf(el) : { err: 'no el for ' + sel };
  };
  // widest PROSE leaf under root — the D2 check. minChars filters out chrome
  // (labels, eyebrows) so the number reflects genuine prose, not a nav link.
  rig.widestProse = function (sel, minChars) {
    minChars = minChars || 60;
    var root = document.querySelector(sel);
    if (!root) { return { err: 'no root' }; }
    var ls = leaves(root), i, m, best = null;
    for (i = 0; i < ls.length; i++) {
      if ((ls[i].textContent || '').trim().length < minChars) { continue; }
      m = rig.chOf(ls[i]);
      if (m && m.ch !== null && (!best || m.ch > best.ch)) { best = m; }
    }
    return best || { note: 'no prose leaf >= ' + minChars + ' chars' };
  };

  // D3 — horizontal document scroll
  rig.hscroll = function () {
    var se = document.scrollingElement || document.documentElement;
    return { scrollWidth: se.scrollWidth, clientWidth: se.clientWidth, overflow: se.scrollWidth - se.clientWidth };
  };
  // which elements stick out past the viewport (D3 forensics)
  rig.overflowers = function () {
    var se = document.scrollingElement || document.documentElement;
    var cw = se.clientWidth, all = document.querySelectorAll('*'), i, r, out = [];
    for (i = 0; i < all.length; i++) {
      if (!vis(all[i])) { continue; }
      r = all[i].getBoundingClientRect();
      if (r.right > cw + 1) {
        out.push({ cls: String(all[i].className || all[i].tagName).slice(0, 50), right: +r.right.toFixed(1), over: +(r.right - cw).toFixed(1) });
      }
    }
    return out.slice(0, 20);
  };

  // D4 — pointer affordance
  rig.pointer = function (sel) {
    var root = document.querySelector(sel) || document;
    var q = 'a,button,input,select,textarea,[role="button"],[tabindex]:not([tabindex="-1"]),[onclick]';
    var els = root.querySelectorAll(q), i, cs, ok = 0, bad = [];
    for (i = 0; i < els.length; i++) {
      if (!vis(els[i])) { continue; }
      cs = getComputedStyle(els[i]);
      if (cs.cursor === 'pointer' || cs.cursor === 'text' || els[i].tagName === 'INPUT' || els[i].tagName === 'TEXTAREA') { ok++; }
      else { bad.push({ cls: String(els[i].className || els[i].tagName).slice(0, 50), cursor: cs.cursor }); }
    }
    return { ok: ok, bad: bad.slice(0, 12), total: ok + bad.length };
  };

  // D5 — density
  rig.body = function () {
    var cs = getComputedStyle(document.body);
    return { fontSize: cs.fontSize, fontFamily: cs.fontFamily.split(',')[0] };
  };

  // D6 — CSSOM ring proof. Returns, per selector, the matching rules and their
  // declarations. ⚠ match test only — see the header note.
  rig.rings = function (sels) {
    var out = [], i, j, k, sheet, rules, rule, sel;
    for (i = 0; i < sels.length; i++) {
      sel = sels[i];
      var hits = [];
      for (j = 0; j < document.styleSheets.length; j++) {
        sheet = document.styleSheets[j];
        try { rules = sheet.cssRules; } catch (e) { continue; }
        if (!rules) { continue; }
        (function walk(rs, media) {
          for (k = 0; k < rs.length; k++) {
            rule = rs[k];
            if (rule.type === 4 && rule.cssRules) { walk(rule.cssRules, rule.conditionText || rule.media.mediaText); continue; }
            if (rule.selectorText && rule.selectorText.indexOf(sel) !== -1) {
              hits.push({ sel: rule.selectorText.slice(0, 120), media: media || 'base', css: rule.style.cssText.slice(0, 200) });
            }
          }
        })(rules, null);
      }
      out.push({ probe: sel, hits: hits });
    }
    return out;
  };

  // ── rig.ringProbe(selectors) — READ :focus-visible FOR REAL ────────────────
  // Supersedes the "you cannot read :focus-visible, use CSSOM declarations"
  // workaround. You CAN read it, and the difference is the whole DW-RING-RADIUS
  // lesson: a CSSOM match-test proves a rule MATCHES and can never see that the
  // pill DEFORMED. This reads the computed truth.
  //
  // HOW: :focus-visible is a heuristic on the last interaction MODALITY.
  //   * el.focus()                  -> does NOT match (mouse/script modality)
  //   * el.focus({focusVisible:true}) -> ALSO does not match in this Chrome
  //     (the option is accepted, so it looks like it worked — it does not)
  //   * ONE REAL Tab keypress through the pane's `computer` tool (trusted
  //     input) flips the modality to keyboard — and IT PERSISTS. Every
  //     programmatic .focus() afterwards matches :focus-visible.
  // So: press Tab ONCE per page load via the computer tool, then sweep with
  // this as many elements as you like.
  //
  // PROTOCOL for a ring gate:
  //   1. computer {action:'key', text:'Tab'}   (once — arms the modality)
  //   2. rig.ringProbe(['.a-pill', '.another'])
  //   3. assert fv===true on every row (else the modality is not armed and the
  //      radius reading is MEANINGLESS — this is the trap), then assert
  //      radius === the element's base radius.
  // To prove a ring DEFECT is real rather than theoretical, insertRule() the
  // suspect declaration into the live CSSOM, re-probe, deleteRule(). DW-4
  // reproduced 999px -> 6px that way, then proved the removal fixed it.
  rig.ringProbe = function (sels) {
    var out = [], i, j, els, el, cs;
    for (i = 0; i < sels.length; i++) {
      els = document.querySelectorAll(sels[i]);
      if (!els.length) { out.push({ sel: sels[i], present: false }); continue; }
      for (j = 0; j < els.length; j++) {
        el = els[j];
        if (!vis(el)) { continue; }
        el.focus();
        cs = getComputedStyle(el);
        out.push({
          sel: sels[i], present: true,
          cls: String(el.className).slice(0, 44),
          fv: el.matches(':focus-visible'),
          radius: cs.borderRadius,
          outlineWidth: cs.outlineWidth,
          outlineColor: cs.outlineColor,
          outlineOffset: cs.outlineOffset
        });
        break; // one representative per selector
      }
    }
    return out;
  };

  // resolved base radius of a live element (the honest half of the ring check)
  rig.radius = function (sel) {
    var el = document.querySelector(sel);
    if (!el) { return { err: 'no el ' + sel }; }
    var cs = getComputedStyle(el);
    return { cls: String(el.className).slice(0, 60), borderRadius: cs.borderRadius };
  };

  // guard band — layout fingerprint. djb2 over the visible-element geometry.
  // Compare before/after an edit at 390 + 1024: identical => provably inert.
  //
  // TWO hashes, and the difference matters:
  //   djb2     — tag + className + rect. The strict one.
  //   djb2geom — tag + rect ONLY. The GEOMETRY one.
  // If a stage adds a MODIFIER CLASS in JS (the DW-2 `.home-composed` /
  // DW-4 `.artifact-read` idiom), the class string lands at EVERY width even
  // though its CSS is >=1200-only — so `djb2` legitimately changes at 390/1024
  // while nothing moved. That is not a guard-band failure; reporting it as one
  // would be as dishonest as ignoring a real shift. In that case `djb2geom`
  // MUST still match, and node counts must match — that is the real proof.
  // Report both, and say which one moved and why.
  rig.fingerprint = function () {
    var all = document.querySelectorAll('*'), i, r, el, sig = [], geo = [];
    for (i = 0; i < all.length; i++) {
      el = all[i];
      if (!vis(el)) { continue; }
      r = el.getBoundingClientRect();
      var box = Math.round(r.x) + ',' + Math.round(r.y) + ',' + Math.round(r.width) + ',' + Math.round(r.height);
      sig.push(String(el.tagName) + '|' + String(el.className).replace(/\s+/g, ' ') + '|' + box);
      geo.push(String(el.tagName) + '|' + box);
    }
    function djb2(s) {
      var h = 5381, i2, c;
      for (i2 = 0; i2 < s.length; i2++) { c = s.charCodeAt(i2); h = ((h << 5) + h + c) & 0xffffffff; }
      return (h >>> 0).toString(16);
    }
    var s = sig.join('\n'), g = geo.join('\n');
    var se = document.scrollingElement || document.documentElement;
    return { nodes: sig.length, len: s.length, djb2: djb2(s), djb2geom: djb2(g), geolen: g.length,
             cw: se.clientWidth, mq1200: matchMedia('(min-width:1200px)').matches };
  };

  // ── rig.proveInert(token, cond) — THE guard-band instrument ────────────────
  // The strongest inertness proof available, and it beats a cross-load hash.
  //
  // WHY NOT cross-load hashes: comparing a fingerprint taken before an edit
  // against one taken after (on another port / another session) is polluted by
  // async cover-image loads and by dpr differing per pane (DW-3 hit the first,
  // DW-4 the second: baseline dpr 1.0 vs 1.5 changed sub-pixel rects, so the
  // hash moved while nothing did). You end up arguing about noise.
  //
  // INSTEAD, prove it WITHIN ONE LOAD: at 390/1024, fingerprint, DELETE your
  // own >=1200 block out of the live CSSOM, fingerprint again. If the two are
  // bit-identical, your block provably contributes nothing at that width —
  // there is no baseline to drift, no noise to explain away.
  //
  //   rig.proveInert('yumi-sees-page')  ->  {identical:true, verdict:'...'}
  //
  // Call rig.bustCss() afterwards to restore the deleted rule.
  // (For a stage that also adds a MODIFIER CLASS in JS, pair this with the
  // class-toggle check — see rig.fingerprint's note on djb2 vs djb2geom.)
  rig.proveInert = function (token, cond) {
    cond = cond || '1200';
    var before = rig.fingerprint(), found = null, j, k, rs, r;
    for (j = 0; j < document.styleSheets.length; j++) {
      try { rs = document.styleSheets[j].cssRules; } catch (e) { continue; }
      if (!rs) { continue; }
      for (k = 0; k < rs.length; k++) {
        r = rs[k];
        if (r.type === 4 && r.conditionText && r.conditionText.indexOf(cond) !== -1 &&
            r.cssText.indexOf(token) !== -1) {
          found = { sheet: j, idx: k, cond: r.conditionText, nRules: r.cssRules.length };
          document.styleSheets[j].deleteRule(k);
          break;
        }
      }
      if (found) { break; }
    }
    if (!found) { return { err: 'no @media(' + cond + ') block mentioning "' + token + '"' }; }
    var after = rig.fingerprint();
    return {
      deletedBlock: found, before: before, after: after,
      identical: before.djb2 === after.djb2,
      geomIdentical: before.djb2geom === after.djb2geom,
      verdict: (before.djb2 === after.djb2)
        ? 'PROVABLY INERT at cw=' + before.cw + ' (deleting the block changes nothing)'
        : 'BLOCK IS ACTIVE at cw=' + before.cw + ' — FAIL',
      note: 'call rig.bustCss() to restore the deleted rule'
    };
  };

  // iterate CSS on ONE port: re-fetch the stylesheet with a cache-bust query.
  // Returns a promise-ish; poll rig.bustDone. Preserves rig + seed + state.
  rig.bustCss = function (file) {
    file = file || 'components.css';
    var links = document.querySelectorAll('link[rel="stylesheet"]'), i, l, href;
    rig.bustDone = false;
    for (i = 0; i < links.length; i++) {
      l = links[i];
      href = l.getAttribute('href') || '';
      if (href.indexOf(file) !== -1) {
        l.setAttribute('href', href.split('?')[0] + '?v=' + Math.random().toString(36).slice(2));
        rig.bustDone = true;
        return { swapped: href.split('?')[0], file: file };
      }
    }
    return { err: 'no stylesheet link matching ' + file };
  };

  window.rig = rig;
  return 'rig installed: ' + Object.keys(rig).join(',');
})()

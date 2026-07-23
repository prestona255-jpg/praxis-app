// =====================================================================
// room-field.js -- R-ARC ROOM-3: the Room's spatial FIELD (recomposed).
// Gathered evidence as draggable cards on the workshop's own ground.
// Positions are a thinking aid ONLY -- T11: never interpreted, never Yumi's.
//
// RD-2 THE LENGTHENING PAGE: bounded to the column's width, growing in height
// with content -- NO inner scroll on any axis (the page scrolls; the field
// rides it). Height = lowest card + a card-height of breathing room, over a
// modest minimum; it lengthens live under a dragging hand (RD-2a), relaxes on
// release -- no ratchet. RD-3: unplaced cards settle row-major into the first
// open patch (never overlapping/moving a placed card) with deterministic
// jitter; an empty field is one line of ink. RD-5: tap/click = the card's door
// (the CALLER routes by kind); drag = arrange; press-hold = drag on touch.
// Coords normalized 0..1 (x across width track, y against a FIXED reference:
// constant divisor). onMove only at drag-end (no load write). P1 motion-free. ES3.
// =====================================================================

'use strict';

(function () {

  var CARD_W = 150;     // logical card width (px); CSS caps it at 100% of a narrow column
  var GAP = 14;         // gutter between settled cards
  var Y_TRACK = 1400;   // FIXED vertical reference for normalized y (constant divisor)
  var EST_H = 140;      // slot height for the collision-avoiding spawn scan
  var MIN_H = 180;      // modest empty / short-field minimum (a bare desk spends no scroll on void)
  var BREATH = 120;     // a card-height of breathing room below the lowest card
  var HOLD_MS = 350;    // touch press-hold before a drag engages
  var TAP_PX = 6;       // under this movement, a release is a tap

  // cards: [{ id, kindLine, body }] · layout: { id: {x,y} } ·
  // onMove(id, x, y) fired at drag-end with normalized coords ·
  // onTap(id, cardEl) optional -- default lifts/unlifts the card.
  function createRoomField(mountEl, opts) {
    if (!mountEl) { return null; }
    opts = opts || {};
    var cards = opts.cards || [];
    var layout = opts.layout || {};

    var pane = document.createElement('div');
    pane.className = 'rf-pane';
    var canvas = document.createElement('div');
    canvas.className = 'rf-canvas';
    pane.appendChild(canvas);
    mountEl.appendChild(pane);

    function clamp01(v) { if (v < 0) { return 0; } if (v > 1) { return 1; } return v; }

    // RD-3 empty state: quiet ground, one line of ink -- no furniture in the void.
    if (!cards.length) {
      var empty = document.createElement('div');
      empty.className = 'rf-empty';
      empty.textContent = 'Notes you gather will land here';
      canvas.appendChild(empty);
      canvas.style.height = String(MIN_H) + 'px';
      return { destroy: function () { if (pane.parentNode) { pane.parentNode.removeChild(pane); } }, pane: pane, canvas: canvas, count: 0, relayout: function () {} };
    }

    var made = [], occupied = [];
    function paneWidth() { var w = canvas.clientWidth || pane.clientWidth || 0; return w > 0 ? w : 280; }
    function xTrack() { var t = paneWidth() - CARD_W; return t > 0 ? t : 1; }
    function cols() { var c = Math.floor((paneWidth() + GAP) / (CARD_W + GAP)); return c > 0 ? c : 1; }
    function jit(i, salt) { return ((i * salt) % 11) - 5; }  // deterministic organic jitter (ES3, no randomness)
    function placedPos(pos) { return { l: Math.round(clamp01(pos.x) * xTrack()), t: Math.round(clamp01(pos.y) * Y_TRACK) }; }
    function overlaps(l, t) {
      var r = l + CARD_W, b = t + EST_H, k;
      for (k = 0; k < occupied.length; k = k + 1) {
        var o = occupied[k];
        if (!(r <= o.l || l >= o.l + CARD_W || b <= o.t || t >= o.t + EST_H)) { return true; }
      }
      return false;
    }
    // RD-3 spawn: the first open patch, row-major (left->right, then down).
    function spawnPos() {
      var nc = cols(), colStep = CARD_W + GAP, rowStep = EST_H + GAP, r = 0, c;
      while (r < 400) {
        for (c = 0; c < nc; c = c + 1) { var l = c * colStep, t = r * rowStep; if (!overlaps(l, t)) { return { l: l, t: t }; } }
        r = r + 1;
      }
      return { l: 0, t: 0 };
    }
    function fieldHeight() {
      var max = MIN_H, k;
      for (k = 0; k < made.length; k = k + 1) {
        var bottom = (parseInt(made[k].el.style.top, 10) || 0) + made[k].el.offsetHeight;
        if (bottom + BREATH > max) { max = bottom + BREATH; }
      }
      return max;
    }
    function relax() { canvas.style.height = String(fieldHeight()) + 'px'; }  // no ratchet -- settles to content

    // (Re-)place every card against the CURRENT column width, then relax. Re-run
    // via relayout() post-attach (build runs detached: clientWidth 0). RD-3
    // pre-seed: placed cards load first so a spawn avoids them.
    function layoutAll() {
      occupied = [];
      var s, p;
      for (s = 0; s < cards.length; s = s + 1) { p = layout[cards[s].id]; if (p) { occupied.push(placedPos(p)); } }
      var k, m, pos;
      for (k = 0; k < made.length; k = k + 1) {
        m = made[k];
        if (layout[m.id]) { pos = placedPos(layout[m.id]); }
        else { var sp = spawnPos(); occupied.push({ l: sp.l, t: sp.t }); pos = { l: sp.l + jit(k, 37), t: sp.t + jit(k, 53) }; if (pos.l < 0) { pos.l = 0; } if (pos.l > xTrack()) { pos.l = xTrack(); } if (pos.t < 0) { pos.t = 0; } }  // clamp BOTH sides: RD-2 "never off-frame horizontally"
        m.el.style.left = String(pos.l) + 'px'; m.el.style.top = String(pos.t) + 'px';
      }
      relax();
    }

    var i;
    for (i = 0; i < cards.length; i = i + 1) {
      (function (card, idx) {
        var el = document.createElement('div');
        el.className = 'rf-card';
        el.setAttribute('data-rf-id', card.id);
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', (card.opens ? 'Open: ' : '') + (card.kindLine || 'note'));
        var kl = document.createElement('div');
        kl.className = 'rf-kind';
        kl.textContent = card.kindLine || '';
        el.appendChild(kl);
        var bd = document.createElement('div');
        bd.className = 'rf-body';
        bd.textContent = card.body || '';
        el.appendChild(bd);

        // ---- drag / tap ------------------------------------------------
        var dragging = false, held = false, holdTimer = null;
        var startX = 0, startY = 0, origL = 0, origT = 0, moved = 0, grewTo = 0;

        // DR-1 (L4) THE ORIGIN GHOST. The drag law asks for "the origin slot dims".
        // This surface is FREE PLACEMENT -- there are no slots -- but the origin is
        // still well defined: it is where the card was picked up from. So the slot
        // becomes a faint outline left behind at the pickup point, which reads as
        // "this came from here" and disappears on release. (The law's companion
        // clause, "valid targets brighten on approach", was STRUCK by Preston at
        // the B2 Stage-0 ruling: with free placement there is no target to brighten,
        // so implementing it would have been decoration pretending to be feedback.)
        var originGhost = null;
        var settleGen = 0;   // see the settle block in end(): rapid re-drag guard
        function showOrigin() {
          if (originGhost || !canvas) { return; }
          originGhost = document.createElement('div');
          originGhost.className = 'rf-origin';
          originGhost.style.left = String(origL) + 'px';
          originGhost.style.top = String(origT) + 'px';
          originGhost.style.width = String(el.offsetWidth) + 'px';
          originGhost.style.height = String(el.offsetHeight) + 'px';
          canvas.appendChild(originGhost);
        }
        function hideOrigin() {
          if (originGhost && originGhost.parentNode) {
            originGhost.parentNode.removeChild(originGhost);
          }
          originGhost = null;
        }

        function pointOf(e) {
          if (e.touches && e.touches.length) { return { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
          if (e.changedTouches && e.changedTouches.length) { return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }; }
          return { x: e.clientX, y: e.clientY };
        }
        // G5 (ARC STANDARD S3): the last pointer position, so a drag that ends
        // OUTSIDE the field (across the edge, over the prose) can be handled by
        // the caller as a WEAVE rather than a move. Updated on every move.
        var lastClientX = 0, lastClientY = 0;
        function begin(e, isTouch) {
          var p = pointOf(e);
          startX = p.x; startY = p.y;
          lastClientX = p.x; lastClientY = p.y;
          origL = parseInt(el.style.left, 10) || 0;
          origT = parseInt(el.style.top, 10) || 0;
          moved = 0; grewTo = parseInt(canvas.style.height, 10) || MIN_H;
          if (isTouch) {
            held = false;
            holdTimer = setTimeout(function () {
              held = true; dragging = true;
              el.className = 'rf-card rf-dragging';
              showOrigin();   // DR-1: the ghost appears only once the hold engages
            }, HOLD_MS);
          } else {
            dragging = true;
            el.className = el.className.indexOf('rf-lifted') !== -1 ? 'rf-card rf-lifted rf-dragging' : 'rf-card rf-dragging';
            showOrigin();
          }
        }
        function move(e, isTouch) {
          var p = pointOf(e);
          lastClientX = p.x; lastClientY = p.y;
          var dx = p.x - startX, dy = p.y - startY;
          var adx = dx < 0 ? -dx : dx, ady = dy < 0 ? -dy : dy;
          if (adx + ady > moved) { moved = adx + ady; }
          if (isTouch && !held) {
            // moving before the hold engages = the user is panning; yield.
            if (moved > TAP_PX && holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
            return;
          }
          if (!dragging) { return; }
          if (e.preventDefault) { e.preventDefault(); }  // no pan while dragging
          var nl = origL + dx, nt = origT + dy;
          var maxL = xTrack();
          if (nl < 0) { nl = 0; } if (nl > maxL) { nl = maxL; }
          if (nt < 0) { nt = 0; } if (nt > Y_TRACK) { nt = Y_TRACK; }
          el.style.left = String(nl) + 'px';
          el.style.top = String(nt) + 'px';
          // RD-2a: ground lengthens live under the hand (grow-only), page follows past the fold.
          var need = nt + el.offsetHeight + BREATH;
          if (need > grewTo) { grewTo = need; canvas.style.height = String(need) + 'px'; }
          var vh = window.innerHeight || 800;
          if (p.y > vh - 64) { window.scrollBy(0, 14); } else if (p.y < 90) { window.scrollBy(0, -14); }
        }
        function end() {
          if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
          var wasDrag = dragging && moved > TAP_PX;
          dragging = false; held = false;
          el.className = el.className.replace(/ ?rf-dragging/, '');
          hideOrigin();
          if (wasDrag) {
            // DR-1 SETTLE: a brief overshoot as the card lands. The class carries
            // --ease-emphasis (which overshoots past 1 before settling); it is
            // removed once the transition has run so the card returns to its
            // resting transition profile. Reduced-motion neutralises this in CSS,
            // not here, so the class may be applied unconditionally.
            //
            // settleGen guards the RAPID RE-DRAG race (red-team): pick up and drop
            // the same card twice inside 340ms and drag #1's stale timeout would
            // otherwise fire during drag #2's settle and strip the class mid-flight,
            // cutting the second overshoot short. Each drop takes a generation; a
            // timeout only clears the class if it is still the newest one.
            settleGen = settleGen + 1;
            var myGen = settleGen;
            el.className = el.className + ' rf-settle';
            setTimeout(function () {
              if (myGen !== settleGen) { return; }
              el.className = el.className.replace(/ ?rf-settle/, '');
            }, 340);
            // G5 DRAG ACROSS THE EDGE: if the drop landed outside the field and
            // the caller consumes it (a weave into the prose), it is NOT a move —
            // the card returns to where it was and no position is written. onDropAt
            // returns true when it wove. Only then do we skip the arrange write.
            var wove = false;
            if (typeof opts.onDropAt === 'function') {
              wove = (opts.onDropAt(card.id, lastClientX, lastClientY, el) === true);
            }
            if (wove) {
              el.style.left = String(origL) + 'px';
              el.style.top = String(origT) + 'px';
              relax();
              return;
            }
            var nx = (parseInt(el.style.left, 10) || 0) / xTrack();
            var ny = (parseInt(el.style.top, 10) || 0) / Y_TRACK;
            if (typeof opts.onMove === 'function') { opts.onMove(card.id, clamp01(nx), clamp01(ny)); }
            relax();
          } else if (moved <= TAP_PX) {
            if (typeof opts.onTap === 'function') { opts.onTap(card.id, el); }
            else {
              // default tap: lift (expand) / unlift -- own-state, honest.
              if (el.className.indexOf('rf-lifted') !== -1) { el.className = 'rf-card'; }
              else { el.className = 'rf-card rf-lifted'; }
            }
          }
        }
        function onMouseDown(e) {
          begin(e, false);
          function mm(ev) {
            // unmounted mid-drag: drop the stale pair, no write
            if (!document.contains(el)) { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); dragging = false; return; }
            move(ev, false);
          }
          function mu() {
            document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu);
            if (!document.contains(el)) { dragging = false; return; }
            end();
          }
          document.addEventListener('mousemove', mm);
          document.addEventListener('mouseup', mu);
          if (e.preventDefault) { e.preventDefault(); }  // no text selection
        }
        function onTouchStart(e) { begin(e, true); }
        function onTouchMove(e) { move(e, true); }
        function onTouchEnd() { end(); }
        function onTouchCancel() {
          // system cancel: full reset, no write
          if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
          dragging = false; held = false;
          el.className = el.className.replace(/ ?rf-dragging/, '');
          hideOrigin();   // DR-1: the ghost must not survive a system cancel
        }

        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('touchstart', onTouchStart);
        el.addEventListener('touchmove', onTouchMove);
        el.addEventListener('touchend', onTouchEnd);
        el.addEventListener('touchcancel', onTouchCancel);
        // P2 keyboard: the card is a button -- Enter/Space fires its door.
        el.addEventListener('keydown', function (ke) {
          if (!(ke.key === 'Enter' || ke.key === ' ' || ke.keyCode === 13 || ke.keyCode === 32)) { return; }
          if (ke.preventDefault) { ke.preventDefault(); }
          if (typeof opts.onTap === 'function') { opts.onTap(card.id, el); }
          else { el.className = (el.className.indexOf('rf-lifted') !== -1) ? 'rf-card' : 'rf-card rf-lifted'; }
        });
        canvas.appendChild(el);
        made.push({ el: el, id: card.id });
      })(cards[i], i);
    }

    layoutAll();  // initial placement (caller re-runs post-attach)

    function destroy() {
      if (pane.parentNode) { pane.parentNode.removeChild(pane); }
    }
    return { destroy: destroy, pane: pane, canvas: canvas, count: made.length, relayout: layoutAll };
  }

  window.createRoomField = createRoomField;

}());

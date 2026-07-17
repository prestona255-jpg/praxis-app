// =====================================================================
// room-field.js -- R-ARC ROOM-1: the Room's spatial FIELD.
// Gathered evidence as draggable cards on an open canvas. The reader
// arranges freely; positions are a thinking aid ONLY -- T11 (ratified
// 2026-07-17): never interpreted, never clustered, never Yumi's.
//
// Pure display + interaction: the CALLER passes cards + layout and owns
// persistence via onMove; this file reads no globals. Native 2-axis
// overflow scroll = the M1-lite pan. Mouse drags immediately; touch after
// a 350ms press-hold (a move before the hold yields to native pan). Tap
// (under 6px) toggles the lifted state. ES3; textContent for all text.
// Loads after /js/recognition.js. ONE global: createRoomField.
// =====================================================================

'use strict';

(function () {

  var FIELD_W = 1200;   // logical canvas px
  var FIELD_H = 900;
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

    // deterministic grid default for unplaced cards (no randomness)
    function defaultPos(i) {
      return { x: 0.06 + (i % 3) * 0.32, y: 0.05 + Math.floor(i / 3) * 0.24 };
    }

    function place(el, x, y) {
      el.style.left = String(Math.round(clamp01(x) * (FIELD_W - 240))) + 'px';
      el.style.top = String(Math.round(clamp01(y) * (FIELD_H - 120))) + 'px';
    }

    var i, made = [];
    for (i = 0; i < cards.length; i = i + 1) {
      (function (card, idx) {
        var el = document.createElement('div');
        el.className = 'rf-card';
        var kl = document.createElement('div');
        kl.className = 'rf-kind';
        kl.textContent = card.kindLine || '';
        el.appendChild(kl);
        var bd = document.createElement('div');
        bd.className = 'rf-body';
        bd.textContent = card.body || '';
        el.appendChild(bd);
        var pos = layout[card.id] || defaultPos(idx);
        place(el, pos.x, pos.y);
        el.setAttribute('data-rf-id', card.id);

        // ---- drag / tap ------------------------------------------------
        var dragging = false, held = false, holdTimer = null;
        var startX = 0, startY = 0, origL = 0, origT = 0, moved = 0;

        function pointOf(e) {
          if (e.touches && e.touches.length) { return { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
          return { x: e.clientX, y: e.clientY };
        }
        function begin(e, isTouch) {
          var p = pointOf(e);
          startX = p.x; startY = p.y;
          origL = parseInt(el.style.left, 10) || 0;
          origT = parseInt(el.style.top, 10) || 0;
          moved = 0;
          if (isTouch) {
            held = false;
            holdTimer = setTimeout(function () { held = true; dragging = true; el.className = 'rf-card rf-dragging'; }, HOLD_MS);
          } else {
            dragging = true;
            el.className = el.className.indexOf('rf-lifted') !== -1 ? 'rf-card rf-lifted rf-dragging' : 'rf-card rf-dragging';
          }
        }
        function move(e, isTouch) {
          var p = pointOf(e);
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
          if (nl < 0) { nl = 0; } if (nl > FIELD_W - 240) { nl = FIELD_W - 240; }
          if (nt < 0) { nt = 0; } if (nt > FIELD_H - 120) { nt = FIELD_H - 120; }
          el.style.left = String(nl) + 'px';
          el.style.top = String(nt) + 'px';
        }
        function end() {
          if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
          var wasDrag = dragging && moved > TAP_PX;
          dragging = false; held = false;
          el.className = el.className.replace(/ ?rf-dragging/, '');
          if (wasDrag) {
            var nx = (parseInt(el.style.left, 10) || 0) / (FIELD_W - 240);
            var ny = (parseInt(el.style.top, 10) || 0) / (FIELD_H - 120);
            if (typeof opts.onMove === 'function') { opts.onMove(card.id, clamp01(nx), clamp01(ny)); }
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
        }

        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('touchstart', onTouchStart);
        el.addEventListener('touchmove', onTouchMove);
        el.addEventListener('touchend', onTouchEnd);
        el.addEventListener('touchcancel', onTouchCancel);
        canvas.appendChild(el);
        made.push({ el: el, id: card.id });
      })(cards[i], i);
    }

    function destroy() {
      if (pane.parentNode) { pane.parentNode.removeChild(pane); }
    }
    return { destroy: destroy, pane: pane, canvas: canvas, count: made.length };
  }

  window.createRoomField = createRoomField;

}());

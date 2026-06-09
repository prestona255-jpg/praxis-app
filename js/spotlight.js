// =====================================================================
// spotlight.js -- Praxis global search (Cmd/Ctrl+K)
//
// Batch 4B: an overlay spotlight reconciled from the mockup's global
// search. Self-contained, mirrors yumi-ui.js: builds DOM once and
// appends to document.body, role="dialog", open/close via class toggle,
// a module-scoped document keydown for Cmd/Ctrl+K, self-init on
// DOMContentLoaded, and a window.Spotlight export. Reads `state` only
// and navigates via location.hash (the existing hashchange listener in
// app.js routes). No dependency on views.js. ⌘K fires regardless of
// focus (looser than ⌘J's input guard); onYumiKeydown is left intact.
// =====================================================================

'use strict';

var SPOTLIGHT_PANEL_ID = 'spotlight';
var SPOTLIGHT_INPUT_ID = 'spotlight-input';
var SPOTLIGHT_GROUP_CAP = 5;

var spotlightPanelEl    = null;
var spotlightInputEl    = null;
var spotlightResultsEl  = null;
var spotlightBackdropEl = null;
var spotlightTriggerEl  = null;   // element to restore focus to on close
var spotlightRows       = [];     // flat [{ el, route }] of rendered rows
var spotlightActiveIndex = -1;

function isSpotlightOpen() {
  return spotlightPanelEl
    ? spotlightPanelEl.classList.contains('spotlight-open')
    : false;
}

// ---- search ----------------------------------------------------------

function spotlightNorm(s) {
  return (typeof s === 'string') ? s.toLowerCase() : '';
}

function spotlightMatch(haystack, needle) {
  return spotlightNorm(haystack).indexOf(needle) !== -1;
}

// Build the grouped result model for a query. Returns an array of
// groups: { head: '...', items: [{ label, type, route }] }. Four groups
// in the mockup's order; each capped at SPOTLIGHT_GROUP_CAP.
function spotlightSearch(query) {
  var q = spotlightNorm(query).replace(/^\s+|\s+$/g, '');
  var groups = [];
  if (q === '') { return groups; }

  // Group 1 -- Sub-theories & ideas (header [+ body]).
  var ideaItems = [];
  var stMap = state.subTheories || {};
  var stk;
  for (stk in stMap) {
    if (Object.prototype.hasOwnProperty.call(stMap, stk)) {
      var st = stMap[stk];
      if (!st) { continue; }
      if (ideaItems.length >= SPOTLIGHT_GROUP_CAP) { break; }
      var stHit = spotlightMatch(st.header, q) ||
        spotlightMatch(st.bodyPublic, q) ||
        spotlightMatch(st.bodyIntellectual, q);
      if (stHit) {
        ideaItems.push({
          label: st.header || 'Untitled sub-theory',
          type:  'idea',
          route: '#subtheory/' + stk,
          // Stage 2: this sub-theory's constellation hue (same id->color
          // source as the mark). Guarded -- neutral fallback if the
          // constellation module did not load. Only idea chips carry a tint.
          tint:  (typeof window.stColorForId === 'function')
            ? window.stColorForId(stk) : null
        });
      }
    }
  }
  if (ideaItems.length) {
    groups.push({ head: 'Sub-theories & ideas', items: ideaItems });
  }

  // Group 2 -- Books (title).
  var bookItems = [];
  var bkMap = state.books || {};
  var bk;
  for (bk in bkMap) {
    if (Object.prototype.hasOwnProperty.call(bkMap, bk)) {
      var book = bkMap[bk];
      if (!book) { continue; }
      if (bookItems.length >= SPOTLIGHT_GROUP_CAP) { break; }
      if (spotlightMatch(book.title, q)) {
        bookItems.push({
          label: book.title || 'Untitled',
          type:  'book',
          route: '#book/' + bk
        });
      }
    }
  }
  if (bookItems.length) {
    groups.push({ head: 'Books', items: bookItems });
  }

  // Group 3 -- Authors (deduped case-insensitively, first-seen display
  // casing, count = that author's book count).
  var authorOrder   = [];
  var authorDisplay = {};
  var authorCount   = {};
  var bk2;
  for (bk2 in bkMap) {
    if (Object.prototype.hasOwnProperty.call(bkMap, bk2)) {
      var b2 = bkMap[bk2];
      if (!b2 || typeof b2.author !== 'string' || b2.author === '') {
        continue;
      }
      var akey = b2.author.toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(authorCount, akey)) {
        authorCount[akey]   = 0;
        authorDisplay[akey] = b2.author;
        authorOrder.push(akey);
      }
      authorCount[akey] = authorCount[akey] + 1;
    }
  }
  var authorItems = [];
  var ai;
  for (ai = 0; ai < authorOrder.length; ai++) {
    if (authorItems.length >= SPOTLIGHT_GROUP_CAP) { break; }
    var ak = authorOrder[ai];
    if (spotlightMatch(authorDisplay[ak], q)) {
      authorItems.push({
        label: authorDisplay[ak],
        type:  'author · ' + authorCount[ak],
        route: '#books'
      });
    }
  }
  if (authorItems.length) {
    groups.push({ head: 'Authors', items: authorItems });
  }

  // Group 4 -- Arcs & notes (arcs.title + notebookEntries). Shared cap
  // across both sources; arcs fill first, then notes.
  var arcNoteItems = [];
  var arcMap = state.arcs || {};
  var ark;
  for (ark in arcMap) {
    if (Object.prototype.hasOwnProperty.call(arcMap, ark)) {
      var arc = arcMap[ark];
      if (!arc) { continue; }
      if (arcNoteItems.length >= SPOTLIGHT_GROUP_CAP) { break; }
      if (spotlightMatch(arc.title, q)) {
        arcNoteItems.push({
          label: arc.title || 'Untitled arc',
          type:  'arc',
          route: '#arc/' + ark
        });
      }
    }
  }
  var enMap = state.notebookEntries || {};
  var enk;
  for (enk in enMap) {
    if (Object.prototype.hasOwnProperty.call(enMap, enk)) {
      var en = enMap[enk];
      if (!en) { continue; }
      if (arcNoteItems.length >= SPOTLIGHT_GROUP_CAP) { break; }
      if (spotlightMatch(en.title, q) || spotlightMatch(en.body, q)) {
        var enLabel = en.title || en.body || 'Note';
        if (enLabel.length > 60) {
          enLabel = enLabel.substring(0, 57) + '...';
        }
        arcNoteItems.push({
          label: enLabel,
          type:  (en.register === 'marginalia') ? 'marginalia' : 'note',
          route: '#notebook'
        });
      }
    }
  }
  if (arcNoteItems.length) {
    groups.push({ head: 'Arcs & notes', items: arcNoteItems });
  }

  return groups;
}

// ---- render ----------------------------------------------------------

function spotlightSetActive(idx) {
  var k;
  for (k = 0; k < spotlightRows.length; k++) {
    if (k === idx) {
      spotlightRows[k].el.classList.add('spotlight-item-active');
    } else {
      spotlightRows[k].el.classList.remove('spotlight-item-active');
    }
  }
  spotlightActiveIndex = idx;
  if (idx >= 0 && spotlightRows[idx] && spotlightRows[idx].el.scrollIntoView) {
    spotlightRows[idx].el.scrollIntoView({ block: 'nearest' });
  }
}

function spotlightRender(query) {
  if (!spotlightResultsEl) { return; }
  spotlightResultsEl.innerHTML = '';
  spotlightRows = [];
  spotlightActiveIndex = -1;

  var groups = spotlightSearch(query);
  var gi, ii;
  for (gi = 0; gi < groups.length; gi++) {
    var group = groups[gi];

    var groupEl = document.createElement('div');
    groupEl.className = 'spotlight-group';

    var headEl = document.createElement('div');
    headEl.className = 'spotlight-group-head';
    headEl.textContent = group.head;
    groupEl.appendChild(headEl);

    for (ii = 0; ii < group.items.length; ii++) {
      var item = group.items[ii];

      var rowEl = document.createElement('div');
      rowEl.className = 'spotlight-item';
      rowEl.setAttribute('role', 'option');

      var icon = document.createElement('span');
      icon.className = 'spotlight-item-icon';
      icon.setAttribute('aria-hidden', 'true');
      // Stage 2: idea chips take their sub-theory hue as a LIT radial (pale
      // --surface-2 core -> the hue), echoing the mark halo. Tokens only.
      // Books / authors / arcs&notes have no tint -> neutral CSS default.
      if (item.tint) {
        icon.style.background =
          'radial-gradient(circle, var(--surface-2), ' + item.tint + ' 80%)';
      }
      rowEl.appendChild(icon);

      var labelEl = document.createElement('b');
      labelEl.className = 'spotlight-item-label';
      labelEl.textContent = item.label;
      rowEl.appendChild(labelEl);

      var typeEl = document.createElement('span');
      typeEl.className = 'spotlight-item-type';
      typeEl.textContent = item.type;
      rowEl.appendChild(typeEl);

      spotlightWireRow(rowEl, item.route);

      groupEl.appendChild(rowEl);
      spotlightRows.push({ el: rowEl, route: item.route });
    }

    spotlightResultsEl.appendChild(groupEl);
  }

  if (spotlightRows.length > 0) {
    spotlightSetActive(0);
  }
}

// Parked so the click closure captures this row's route, not the loop's
// last value.
function spotlightWireRow(rowEl, route) {
  rowEl.addEventListener('click', function() {
    spotlightSelectRoute(route);
  });
}

// ---- open / close ----------------------------------------------------

function buildSpotlight() {
  var backdrop = document.createElement('div');
  backdrop.className = 'spotlight-backdrop';
  backdrop.addEventListener('click', closeSpotlight);

  var panel = document.createElement('div');
  panel.id = SPOTLIGHT_PANEL_ID;
  panel.className = 'spotlight-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Search');

  var inRow = document.createElement('div');
  inRow.className = 'spotlight-input-row';

  var glyph = document.createElement('span');
  glyph.className = 'spotlight-input-glyph';
  glyph.setAttribute('aria-hidden', 'true');
  glyph.textContent = '⌕';
  inRow.appendChild(glyph);

  var label = document.createElement('label');
  label.setAttribute('for', SPOTLIGHT_INPUT_ID);
  label.className = 'spotlight-visually-hidden';
  label.textContent = 'Search books, authors, ideas';
  inRow.appendChild(label);

  var input = document.createElement('input');
  input.id = SPOTLIGHT_INPUT_ID;
  input.type = 'text';
  input.className = 'spotlight-input';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('placeholder', 'Search books, authors, ideas...');
  input.addEventListener('input', function() {
    spotlightRender(input.value);
  });
  inRow.appendChild(input);
  spotlightInputEl = input;

  var kbd = document.createElement('span');
  kbd.className = 'spotlight-input-kbd';
  kbd.setAttribute('aria-hidden', 'true');
  kbd.textContent = 'esc';
  inRow.appendChild(kbd);

  panel.appendChild(inRow);

  var results = document.createElement('div');
  results.className = 'spotlight-results';
  panel.appendChild(results);
  spotlightResultsEl = results;

  // Local keydown intercepts ONLY arrows / enter / escape; every other
  // key flows to the input so typing works normally.
  panel.addEventListener('keydown', onSpotlightLocalKeydown);

  document.body.appendChild(backdrop);
  document.body.appendChild(panel);

  spotlightBackdropEl = backdrop;
  spotlightPanelEl = panel;
}

function openSpotlight(triggerEl) {
  if (!spotlightPanelEl) { buildSpotlight(); }
  spotlightTriggerEl = triggerEl || null;
  spotlightPanelEl.classList.add('spotlight-open');
  spotlightBackdropEl.classList.add('spotlight-backdrop-open');
  if (spotlightInputEl) {
    spotlightInputEl.value = '';
    spotlightInputEl.focus();
  }
  spotlightRender('');
}

function closeSpotlight() {
  if (spotlightPanelEl) {
    spotlightPanelEl.classList.remove('spotlight-open');
  }
  if (spotlightBackdropEl) {
    spotlightBackdropEl.classList.remove('spotlight-backdrop-open');
  }
  if (spotlightTriggerEl && spotlightTriggerEl.focus) {
    spotlightTriggerEl.focus();
  }
  spotlightTriggerEl = null;
}

function toggleSpotlight(triggerEl) {
  if (isSpotlightOpen()) {
    closeSpotlight();
  } else {
    openSpotlight(triggerEl);
  }
}

function spotlightSelectRoute(route) {
  closeSpotlight();
  if (typeof route === 'string' && route.length > 0) {
    location.hash = route;
  }
}

// ---- keyboard --------------------------------------------------------

function onSpotlightLocalKeydown(e) {
  var key = e.key || '';
  if (key === 'ArrowDown') {
    e.preventDefault();
    if (spotlightRows.length === 0) { return; }
    var nd = spotlightActiveIndex + 1;
    if (nd >= spotlightRows.length) { nd = 0; }
    spotlightSetActive(nd);
  } else if (key === 'ArrowUp') {
    e.preventDefault();
    if (spotlightRows.length === 0) { return; }
    var nu = spotlightActiveIndex - 1;
    if (nu < 0) { nu = spotlightRows.length - 1; }
    spotlightSetActive(nu);
  } else if (key === 'Enter') {
    e.preventDefault();
    if (spotlightActiveIndex >= 0 && spotlightRows[spotlightActiveIndex]) {
      spotlightSelectRoute(spotlightRows[spotlightActiveIndex].route);
    }
  } else if (key === 'Escape' || key === 'Esc') {
    e.preventDefault();
    closeSpotlight();
  }
}

// Module-scoped ⌘K / Ctrl+K. Fires regardless of focus (the discovery
// promise of the nav pill's "⌘K" hint). Independent of onYumiKeydown
// (⌘J) -- different key, no collision.
function onSpotlightKeydown(e) {
  if (!(e.metaKey || e.ctrlKey)) { return; }
  var key = (e.key || '').toLowerCase();
  if (key !== 'k') { return; }
  e.preventDefault();
  if (isSpotlightOpen()) {
    closeSpotlight();
  } else {
    openSpotlight(document.activeElement);
  }
}

// ---- init ------------------------------------------------------------

function initSpotlight() {
  buildSpotlight();
  document.addEventListener('keydown', onSpotlightKeydown);

  // Wire the inert nav search pill: click opens the overlay. blur the
  // static input first so focus lands in the overlay input, not the
  // pill. No nav markup change -- pure JS binding.
  var pill = document.querySelector('.app-nav-search');
  if (pill) {
    pill.addEventListener('click', function(e) {
      e.preventDefault();
      var staticInput = pill.querySelector('.app-nav-search-input');
      if (staticInput && staticInput.blur) { staticInput.blur(); }
      openSpotlight(staticInput || pill);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpotlight);
} else {
  initSpotlight();
}

window.Spotlight = {
  open:   openSpotlight,
  close:  closeSpotlight,
  toggle: toggleSpotlight,
  isOpen: isSpotlightOpen,
  search: spotlightSearch
};

console.log('spotlight.js loaded');

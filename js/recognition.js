// =====================================================================
// recognition.js -- R-ARC S6b: deterministic in-text book recognition.
// An own-library index + a prose scanner -- instant, private, no model
// call, no network. F-C: display decisions live elsewhere; this module
// is pure text -> matches.
//
// Load position: after /js/state.js (index.html:52). Call-time deps
// only -- state, getCurrentUser -- read at call time, never cached.
//
// ES3 only: var/function, string concat, for-loops only -- no modern
// declaration/arrow/template syntax, no Array.prototype iterators.
// =====================================================================

'use strict';

(function () {

  // Mirrors normTitle (import-capture.js:166) / titleToId
  // (yumi-brain.js:897) -- single-source hoist is named debt (r-arc-s6b.md).
  function norm(s) {
    if (typeof s !== 'string') { return ''; }
    return s.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '');
  }

  // Split an author string on ';', '&', and the word ' and ' -- NEVER
  // comma ("hooks, bell" inversion is F-F territory).
  function splitAuthors(author) {
    if (typeof author !== 'string') { return []; }
    var s = author.split('&').join(';');
    s = s.split(' and ').join(';');
    var parts = s.split(';');
    var out = [], i, p;
    for (i = 0; i < parts.length; i = i + 1) {
      p = parts[i].replace(/^\s+|\s+$/g, '');
      if (p !== '') { out.push(p); }
    }
    return out;
  }

  // Current user's deduped library, exactly as matchBook resolves it
  // (import-capture.js:191-198) -> { term, kind, bookIds[] }, deduped by
  // normalized term (a string shared by both title and author keeps TWO
  // entries). Term floor: normalized length >= 4 -- a deterministic
  // guard against short common-word bombs, e.g. "it" (r-arc-s6b.md).
  function buildIndex() {
    var user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    if (!user || !user.uid) { return { terms: [] }; }
    var ids = (state.userBooks && state.userBooks[user.uid] && state.userBooks[user.uid].bookIds)
      ? state.userBooks[user.uid].bookIds : null;
    if (!ids || !ids.length) { return { terms: [] }; }

    var byKey = {}, order = [];
    function addTerm(raw, kind, bid) {
      var nt = norm(raw);
      if (nt.length < 4) { return; }
      var key = kind + '::' + nt;
      var entry = byKey[key];
      if (!entry) {
        entry = { term: nt, kind: kind, bookIds: [] };
        byKey[key] = entry;
        order.push(key);
      }
      var j, already = false;
      for (j = 0; j < entry.bookIds.length; j = j + 1) {
        if (entry.bookIds[j] === bid) { already = true; break; }
      }
      if (!already) { entry.bookIds.push(bid); }
    }

    var i, k, bid, book, authors;
    for (i = 0; i < ids.length; i = i + 1) {
      bid = ids[i];
      book = state.books ? state.books[bid] : null;
      if (!book) { continue; }
      addTerm(book.title, 'title', bid);
      authors = splitAuthors(book.author);
      for (k = 0; k < authors.length; k = k + 1) { addTerm(authors[k], 'author', bid); }
    }

    var terms = [];
    for (i = 0; i < order.length; i = i + 1) { terms.push(byKey[order[i]]); }
    terms.sort(function (a, b) { return b.term.length - a.term.length; });
    return { terms: terms };
  }

  // Normalized haystack built char-by-char (norm()-identical) with
  // map[n] = the raw index behind normalized position n -- normalization
  // is length-changing, so offsets map back, never recompute. Longest-
  // term-first + occupancy = non-overlapping longest-match-wins, raw offsets.
  function scan(index, text) {
    if (typeof text !== 'string') { text = ''; }
    var terms = (index && index.terms) ? index.terms : [];
    if (!terms.length) { return []; }

    var haystack = '', map = [];
    var pending = false, pendingRaw = -1;
    var i, c, lower, lc;
    for (i = 0; i < text.length; i = i + 1) {
      // Lowercase FIRST then classify each RESULTING char (norm()'s own
      // order; toLowerCase can be multi-char) -- keeps map[] in lockstep.
      lower = text.charAt(i).toLowerCase();
      for (c = 0; c < lower.length; c = c + 1) {
        lc = lower.charAt(c);
        if (/\w/.test(lc)) {
          if (pending) {
            if (haystack.length > 0) { haystack = haystack + ' '; map.push(pendingRaw); }
            pending = false;
          }
          haystack = haystack + lc;
          map.push(i);
        } else if (!pending) {
          pending = true;
          pendingRaw = i;
        }
      }
    }
    // trailing pending run dropped.

    var results = [], taken = [];
    var t, term, len, h, valid, k, ov;
    for (t = 0; t < terms.length; t = t + 1) {
      term = terms[t].term;
      len = term.length;
      if (len === 0 || len > haystack.length) { continue; }
      h = haystack.indexOf(term);
      while (h !== -1) {
        valid = (h === 0 || haystack.charAt(h - 1) === ' ') &&
          (h + len === haystack.length || haystack.charAt(h + len) === ' ');
        if (valid) {
          ov = false;
          for (k = 0; k < taken.length; k = k + 1) {
            if (h < taken[k][1] && (h + len) > taken[k][0]) { ov = true; break; }
          }
          if (!ov) {
            taken.push([h, h + len]);
            results.push({
              start: map[h],
              end: map[h + len - 1] + 1,
              kind: terms[t].kind,
              bookIds: terms[t].bookIds,
              term: term
            });
          }
        }
        h = haystack.indexOf(term, h + 1);
      }
    }

    results.sort(function (a, b) { return a.start - b.start; });
    return results;
  }

  window.PraxisRecognition = { norm: norm, buildIndex: buildIndex, scan: scan };

}());

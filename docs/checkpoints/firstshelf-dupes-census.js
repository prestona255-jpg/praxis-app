/* ============================================================================
   R-FIRSTSHELF-DUPES -- STAGE 1 SHELF CENSUS  (READ-ONLY)
   ----------------------------------------------------------------------------
   Paste this whole block into the console on https://praxis-reading.netlify.app
   while signed in, press Enter, then copy the printed report back.

   IT DOES NOT WRITE ANYTHING. No assignment to any `state.*` path, no saveState,
   no mark*Dirty, no localStorage write, no network call. It reads `state` and
   prints. You can run it as many times as you like; it cannot change your shelf.

   It carries its OWN copy of the tier functions so it does not depend on the
   deployed bundle having them. (Written when the live bundle was v3.283 and did
   not; the tiers shipped at v3.284. The carried copies are kept so an older
   bundle can still be censused -- they are not a claim about what is deployed
   today. Verify the live CACHE_VERSION yourself before reading anything into a
   disagreement.)

   YOU MUST BE SIGNED IN. This census binds to getCurrentUser().uid ONLY. It has
   no fallback and will not guess a uid from the store -- see the note at the
   "who" section below for the two-account run that cost two weeks.
   ============================================================================ */
(function praxisDupeCensus() {
  'use strict';

  // ---- identity (verbatim copies of the shipped functions) -----------------
  function resolverNormalize(s) {
    if (typeof s !== 'string') { return ''; }
    var t = s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ');
    return t.replace(/^\s+|\s+$/g, '');
  }
  function identityTitleKey(title) {
    return resolverNormalize(title || '').replace(/^(a|an|the) /, '');
  }
  function identitySurnameKey(author) {
    var a = ('' + (author || '')).split(/[;,]/)[0];
    var prev = null;
    while (prev !== a) {
      prev = a;
      a = a.replace(/[\s.]*\b(ph\s*\.?\s*d|ed\s*\.?\s*d|m\s*\.?\s*d|jr)\s*\.?\s*$/i, '');
    }
    var n = resolverNormalize(a);
    if (n === '') { return ''; }
    var toks = n.split(' ');
    return toks[toks.length - 1];
  }
  function isbnKey13(raw) {
    var s = ('' + (raw || '')).toUpperCase().replace(/[^0-9X]/g, '');
    if (/^[0-9]{13}$/.test(s)) { return s; }
    if (!/^[0-9]{9}[0-9X]$/.test(s)) { return ''; }
    var core = '978' + s.substring(0, 9);
    var sum = 0, i;
    for (i = 0; i < 12; i++) { sum = sum + (core.charCodeAt(i) - 48) * ((i % 2) ? 3 : 1); }
    return core + ((10 - (sum % 10)) % 10);
  }
  function bookIdentityKey(title, author) {
    return 'ta:' + identityTitleKey(title) + '|' + identitySurnameKey(author);
  }
  function bookIdentityTier(a, b) {
    if (!a || !b) { return 'none'; }
    var ia = isbnKey13(a.isbn), ib = isbnKey13(b.isbn);
    if (ia !== '' && ia === ib) { return 'exact'; }
    var ka = bookIdentityKey(a.title, a.author), kb = bookIdentityKey(b.title, b.author);
    if (ka === 'ta:|' || kb === 'ta:|') { return 'none'; }
    if (ka === kb) { return 'probable'; }
    var ta = identityTitleKey(a.title), tb = identityTitleKey(b.title);
    if (ta === '' || ta !== tb) { return 'none'; }
    var sa = identitySurnameKey(a.author), sb = identitySurnameKey(b.author);
    if (sa === '' || sb === '') { return 'none'; }
    if (sa.length !== sb.length && (sa.indexOf(sb) === 0 || sb.indexOf(sa) === 0)) { return 'near-miss'; }
    return 'none';
  }

  // ---- who / what ----------------------------------------------------------
  var out = [];
  function P(s) { out.push(s); }

  if (typeof state === 'undefined' || !state || !state.books) {
    console.log('CENSUS ABORT -- no `state` on this page. Are you signed in on the app?');
    return;
  }
  // ---- who: the SIGNED-IN account, and nothing else ------------------------
  // There was a sole-key fallback here: when getCurrentUser() yielded nothing it
  // took the only key of state.userBooks. That silently bound the 2026-08-29 run
  // to whichever account happened to be in the store, and a two-account browser
  // profile then read as a 192-vs-148 data-integrity defect for two weeks. It
  // printed a uid and nobody compared it to the signed-in one.
  // REMOVED 2026-09-03. This census binds to getCurrentUser().uid ONLY and never
  // guesses. (CLAUDE.md, "CONFIRM THE UID BEFORE ANY CROSS-SURFACE OR
  // CROSS-SESSION COMPARISON".)
  var signedInUid = null;
  try {
    if (typeof getCurrentUser === 'function' && getCurrentUser()) {
      signedInUid = getCurrentUser().uid || null;
    }
  } catch (e) { signedInUid = null; }

  if (!signedInUid) {
    console.log('CENSUS ABORT -- no signed-in user on this page.');
    console.log('Sign in on the app, then run this again. This census binds to the');
    console.log('signed-in account ONLY; it will not guess a uid from the store.');
    return;
  }

  var uid = signedInUid;

  var storeUids = [], k;
  for (k in (state.userBooks || {})) {
    if (state.userBooks.hasOwnProperty(k)) { storeUids.push(k); }
  }
  var boundInStore = false, si;
  for (si = 0; si < storeUids.length; si++) {
    if (storeUids[si] === uid) { boundInStore = true; }
  }

  var ids = (state.userBooks[uid] && state.userBooks[uid].bookIds) ? state.userBooks[uid].bookIds : [];
  P('R-FIRSTSHELF-DUPES -- SHELF CENSUS (read-only)');
  P('bound uid:     ' + uid);
  P('signed-in uid: ' + signedInUid);
  P('uid check: MATCH -- bound to the signed-in account (no fallback exists)');
  P('accounts in this browser store: ' + storeUids.length + '  [' + storeUids.join(', ') + ']');
  if (storeUids.length > 1) {
    P('  ** This browser holds more than one account. Every number below is for');
    P('  ** ' + uid + ' ONLY. A count that disagrees with another session is the');
    P('  ** other account, not a defect, until this uid is compared to that one.');
  }
  if (!boundInStore) {
    P('  ** The signed-in uid has NO record in this browser store. The shelf reads');
    P('  ** as empty here; that is a local-store fact, not a claim about the cloud.');
  }
  P('total records on the shelf: ' + ids.length);
  P('');

  // ---- attachment census per record ----------------------------------------
  // The 7 id-keyed collections deleteBook scrubs, plus the reader-authored fields
  // that live ON the record (the ones the current merge would destroy -- T8).
  function attachmentsOf(id) {
    var a = [], j, kk, n;
    n = 0;
    var am = state.arcs || {};
    for (kk in am) {
      if (!am.hasOwnProperty(kk) || !am[kk] || !am[kk].bookIds) { continue; }
      for (j = 0; j < am[kk].bookIds.length; j++) {
        var ent = am[kk].bookIds[j], eid = (ent && ent.id) ? ent.id : ent;
        if (eid === id) { n++; }
      }
    }
    if (n) { a.push('arcs:' + n); }
    n = 0;
    var sm = state.subTheories || {};
    for (kk in sm) {
      if (!sm.hasOwnProperty(kk) || !sm[kk] || !sm[kk].evidence) { continue; }
      for (j = 0; j < sm[kk].evidence.length; j++) {
        var ev = sm[kk].evidence[j];
        if (ev && ev.kind === 'book' && ev.refId === id) { n++; }
      }
    }
    if (n) { a.push('subtheory-evidence:' + n); }
    n = 0;
    var em = state.notebookEntries || {};
    for (kk in em) {
      if (!em.hasOwnProperty(kk) || !em[kk] || !em[kk].bookIds) { continue; }
      for (j = 0; j < em[kk].bookIds.length; j++) { if (em[kk].bookIds[j] === id) { n++; } }
    }
    if (n) { a.push('notebook-entries:' + n); }
    n = 0;
    var tm = state.userThemes || {};
    for (kk in tm) {
      if (!tm.hasOwnProperty(kk) || !tm[kk] || !tm[kk].bookIds) { continue; }
      for (j = 0; j < tm[kk].bookIds.length; j++) { if (tm[kk].bookIds[j] === id) { n++; } }
    }
    if (n) { a.push('themes:' + n); }
    if (state.bookArtifacts && state.bookArtifacts[uid + ':' + id]) {
      var art = state.bookArtifacts[uid + ':' + id];
      var blen = (art && typeof art.body === 'string') ? art.body.length : 0;
      a.push('ARTIFACT(' + blen + ' chars)');
    }
    var b = state.books[id] || {};
    if (b.valueMarks && b.valueMarks.length) {
      var whys = 0;
      for (j = 0; j < b.valueMarks.length; j++) {
        if (b.valueMarks[j] && typeof b.valueMarks[j].why === 'string' && b.valueMarks[j].why.replace(/^\s+|\s+$/g, '') !== '') { whys++; }
      }
      a.push('valueMarks:' + b.valueMarks.length + (whys ? (' (' + whys + ' with authored why)') : ''));
    }
    if (b.movedMe === true) { a.push('movedMe'); }
    if (b.rating !== null && typeof b.rating !== 'undefined' && b.rating !== '') { a.push('rating:' + b.rating); }
    if (b.dateRead) { a.push('dateRead'); }
    if (b.categoryOverride) { a.push('categoryOverride'); }
    if (b.traditionOverride) { a.push('traditionOverride'); }
    return a;
  }

  function rec(id) {
    var b = state.books[id] || {};
    return { id: id, title: (b.title || ''), author: (b.author || ''), isbn: (b.isbn || '') };
  }

  // ---- pairwise sweep -------------------------------------------------------
  var parent = {}, i, j;
  function find(x) { while (parent[x] !== x) { x = parent[x]; } return x; }
  function uni(x, y) { var rx = find(x), ry = find(y); if (rx !== ry) { parent[rx] = ry; } }
  for (i = 0; i < ids.length; i++) { parent[ids[i]] = ids[i]; }

  var edges = [], nearMiss = [];
  for (i = 0; i < ids.length; i++) {
    if (!state.books[ids[i]]) { continue; }
    for (j = i + 1; j < ids.length; j++) {
      if (!state.books[ids[j]]) { continue; }
      var t = bookIdentityTier(rec(ids[i]), rec(ids[j]));
      if (t === 'exact' || t === 'probable') { edges.push({ a: ids[i], b: ids[j], tier: t }); uni(ids[i], ids[j]); }
      else if (t === 'near-miss') { nearMiss.push({ a: ids[i], b: ids[j] }); }
    }
  }

  var comps = {}, root;
  for (i = 0; i < ids.length; i++) {
    if (!state.books[ids[i]]) { continue; }
    root = find(ids[i]);
    if (!comps[root]) { comps[root] = []; }
    comps[root].push(ids[i]);
  }

  var groups = [], gk;
  for (gk in comps) {
    if (!comps.hasOwnProperty(gk) || comps[gk].length < 2) { continue; }
    var members = comps[gk], strongest = 'probable', e;
    for (e = 0; e < edges.length; e++) {
      if (find(edges[e].a) === gk && edges[e].tier === 'exact') { strongest = 'exact'; break; }
    }
    groups.push({ members: members, tier: strongest });
  }

  var nExact = 0, nProb = 0;
  for (i = 0; i < groups.length; i++) { if (groups[i].tier === 'exact') { nExact++; } else { nProb++; } }

  P('DUPLICATE GROUPS: ' + groups.length + '   (EXACT ' + nExact + ' | PROBABLE ' + nProb + ')');
  P('NEAR-MISS PAIRS:  ' + nearMiss.length + '   (marks nothing, blocks nothing -- counted only)');
  P('');

  var marked = 0;
  for (i = 0; i < groups.length; i++) {
    var g = groups[i];
    P('--- GROUP ' + (i + 1) + '  [' + g.tier.toUpperCase() + ']  size ' + g.members.length + ' ---');
    for (j = 0; j < g.members.length; j++) {
      var r = rec(g.members[j]);
      var att = attachmentsOf(g.members[j]);
      if (att.length) { marked++; }
      P('  id     : ' + r.id);
      P('  title  : ' + JSON.stringify(r.title));
      P('  author : ' + JSON.stringify(r.author));
      P('  isbn   : ' + (r.isbn ? (JSON.stringify(r.isbn) + '  -> isbn13 ' + (isbnKey13(r.isbn) || 'UNPARSEABLE')) : '(absent)'));
      P('  key    : ' + bookIdentityKey(r.title, r.author));
      P('  carries: ' + (att.length ? att.join(', ') : '(nothing attached)'));
    }
    var pairsShown = [];
    for (var e2 = 0; e2 < edges.length; e2++) {
      if (find(edges[e2].a) === find(g.members[0])) { pairsShown.push(edges[e2].tier + ': ' + edges[e2].a + ' ~ ' + edges[e2].b); }
    }
    P('  matched by: ' + pairsShown.join(' | '));
    P('');
  }

  if (nearMiss.length) {
    P('--- NEAR-MISS PAIRS (titles equal, one surname a strict prefix of the other) ---');
    for (i = 0; i < nearMiss.length; i++) {
      var ra = rec(nearMiss[i].a), rb = rec(nearMiss[i].b);
      P('  ' + JSON.stringify(ra.title));
      P('    A ' + ra.id + '  author ' + JSON.stringify(ra.author) + '  isbn ' + (ra.isbn || '(absent)') + '  carries: ' + (attachmentsOf(ra.id).join(', ') || 'nothing'));
      P('    B ' + rb.id + '  author ' + JSON.stringify(rb.author) + '  isbn ' + (rb.isbn || '(absent)') + '  carries: ' + (attachmentsOf(rb.id).join(', ') || 'nothing'));
    }
    P('');
  }

  P('RECORDS INSIDE A GROUP THAT CARRY ATTACHED CONTENT: ' + marked);
  P('  (this is the number that decides how careful the held merge round must be)');
  P('');
  P('END OF CENSUS -- nothing was written.');

  var text = out.join('\n');
  console.log(text);
  try { copy(text); console.log('[report copied to clipboard]'); } catch (e2) {}
  return undefined;
})();

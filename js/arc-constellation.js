// Arc constellation renderer. Composes a knowledge arc into a static SVG --
// books arranged in deterministic scatter (constellation mode, books.length
// > 5) or wider triangular layout (spare focal mode, books.length <= 5);
// threads behind books; marginalia dots in front; Yumi cluster upper-right;
// question rendered as gravity glow + italic serif at center; conditional
// legend at bottom listing only visual elements actually present.
//
// Public entry:  renderArcConstellation(arc, parentSvgElement)
//
// Depends on: renderTraditionFormArc, getTraditionFormsArcDefs (from
// js/tradition-forms-arc.js — must be loaded before this file).
//
// Spec: docs/knowledge-arcs/PRAXIS_ARC_CONSTELLATION.md

// ---------------------------------------------------------------------------
// Internals -- helpers.
// ---------------------------------------------------------------------------

// Deterministic hash of (string + numeric salt) to a float in [0, 1).
// Used for book layout, marginalia cluster angles, rosette anchor angles --
// anywhere we need stable randomness keyed to book id.
function _arcHash(s, salt) {
  var h = 2166136261;
  var combined = String(s) + ':' + String(salt);
  var i;
  for (i = 0; i < combined.length; i = i + 1) {
    h = h ^ combined.charCodeAt(i);
    h = (h * 16777619) | 0;
  }
  return ((h >>> 0) % 100000) / 100000;
}

function _arcClamp(min, x, max) {
  if (x < min) { return min; }
  if (x > max) { return max; }
  return x;
}

function _arcEscapeXml(s) {
  if (typeof s !== 'string') { return ''; }
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function _arcR(x) {
  return Math.round(x * 100) / 100;
}

// ---------------------------------------------------------------------------
// Layout.
// ---------------------------------------------------------------------------

// Constellation scatter: deterministic from book.id; honors a min gap of
// scale*0.6 (= 36 at scale 60) between book centers.
function _arcConstellationLayout(books, width, height) {
  var cx = width / 2;
  var cy = height / 2;
  var maxR = Math.min(width, height) * 0.40;
  var minR = Math.min(width, height) * 0.10;
  var minGap = 60 * 0.6;
  var positions = [];
  var i, j, attempts, theta, r, x, y, ok, dx, dy, dist;
  for (i = 0; i < books.length; i = i + 1) {
    var book = books[i];
    var s1 = _arcHash(book.id, 1);
    var s2 = _arcHash(book.id, 2);
    theta = s1 * Math.PI * 2;
    r = minR + s2 * (maxR - minR);
    x = cx + Math.cos(theta) * r;
    y = cy + Math.sin(theta) * r;
    attempts = 0;
    while (attempts < 80) {
      ok = true;
      for (j = 0; j < positions.length; j = j + 1) {
        dx = x - positions[j].x;
        dy = y - positions[j].y;
        dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minGap) {
          ok = false;
          break;
        }
      }
      if (ok) { break; }
      var s3 = _arcHash(book.id, 10 + attempts);
      theta = (theta + 0.55 + s3 * 0.5) % (Math.PI * 2);
      // Gently push outward when colliding so later books fan out rather
      // than stack at the inner ring.
      r = r + 4;
      if (r > maxR) { r = minR + s3 * (maxR - minR); }
      x = cx + Math.cos(theta) * r;
      y = cy + Math.sin(theta) * r;
      attempts = attempts + 1;
    }
    positions.push({ id: book.id, x: x, y: y, book: book });
  }
  return positions;
}

// Spare focal: wider triangular composition for 1-5 books. Same renderer,
// different layout. Order of books in arc.books determines slot assignment
// (deterministic, but caller-controlled rather than id-hash).
function _arcSpareFocalLayout(books, width, height) {
  var cx = width / 2;
  var cy = height / 2;
  var spread = Math.min(width, height) * 0.32;
  var n = books.length;
  var slots;
  if (n === 1) {
    slots = [ { x: 0, y: 0 } ];
  } else if (n === 2) {
    slots = [
      { x: -spread, y: 0 },
      { x:  spread, y: 0 }
    ];
  } else if (n === 3) {
    slots = [
      { x:  0,             y: -spread * 0.95 },
      { x: -spread * 1.05, y:  spread * 0.55 },
      { x:  spread * 1.05, y:  spread * 0.55 }
    ];
  } else if (n === 4) {
    slots = [
      { x:  0,             y: -spread * 0.95 },
      { x: -spread * 1.05, y:  0              },
      { x:  spread * 1.05, y:  0              },
      { x:  0,             y:  spread * 0.95 }
    ];
  } else {
    // n === 5
    slots = [
      { x:  0,             y: -spread * 0.95 },
      { x: -spread * 1.00, y: -spread * 0.10 },
      { x:  spread * 1.00, y: -spread * 0.10 },
      { x: -spread * 0.55, y:  spread * 0.90 },
      { x:  spread * 0.55, y:  spread * 0.90 }
    ];
  }
  var positions = [];
  var i;
  for (i = 0; i < n; i = i + 1) {
    positions.push({
      id: books[i].id,
      x: cx + slots[i].x,
      y: cy + slots[i].y,
      book: books[i]
    });
  }
  return positions;
}

// ---------------------------------------------------------------------------
// Thread + dot math.
// ---------------------------------------------------------------------------

// Recency opacity ramp: 0 days -> 0.85, 30+ days -> 0.30, linear in between.
function _arcRecencyOpacity(days) {
  if (typeof days !== 'number' || !isFinite(days) || days < 0) { days = 0; }
  var maxAge = 30;
  if (days >= maxAge) { return 0.30; }
  return 0.85 - (days / maxAge) * (0.85 - 0.30);
}

function _arcThreadWidth(strength) {
  if (typeof strength !== 'number' || !isFinite(strength) || strength < 0) {
    strength = 0;
  }
  return _arcClamp(0.6, strength * 0.4, 3);
}

// Which endpoint is "more engaged"? Higher band wins; tie-break on higher
// noteCount; final tie-break on bookAId (stable, deterministic).
function _arcMoreEngagedId(a, b, aId, bId) {
  var ba = (a && typeof a.band === 'number') ? a.band : 0;
  var bb = (b && typeof b.band === 'number') ? b.band : 0;
  if (ba > bb) { return aId; }
  if (bb > ba) { return bId; }
  var na = (a && typeof a.noteCount === 'number') ? a.noteCount : 0;
  var nb = (b && typeof b.noteCount === 'number') ? b.noteCount : 0;
  if (na > nb) { return aId; }
  if (nb > na) { return bId; }
  return aId;
}

// ---------------------------------------------------------------------------
// Renderers.
// ---------------------------------------------------------------------------

// Question -- amber gravity glow + italic serif text at visual center.
// Behind books in z-order (books are unlikely to land at center given the
// layout's min radius from cx,cy).
function _arcRenderQuestion(question, width, height, isSpareFocal) {
  var cx = width / 2;
  var cy = height / 2;
  var out = '';
  if (!question || !question.length) { return ''; }
  var glowR = Math.min(width, height) * 0.35;
  out = out + '<circle cx="' + _arcR(cx) + '" cy="' + _arcR(cy) + '" r="' + _arcR(glowR) + '" fill="var(--arc-question-glow)" opacity="0.08"/>';
  var fs = isSpareFocal ? 20 : 14;
  out = out + '<text data-question="1" x="' + _arcR(cx) + '" y="' + _arcR(cy) + '" text-anchor="middle" dominant-baseline="middle" font-family="\'Cormorant Garamond\', Georgia, serif" font-style="italic" font-size="' + fs + '" fill="var(--ink-2)" opacity="0.78">' + _arcEscapeXml(question) + '</text>';
  return out;
}

// Threads. Each thread split into 2 segments at midpoint; the segment that
// touches the "more engaged" endpoint is 0.4px thicker. Spare focal raises
// minimum opacity to 0.50 (no faint speculative threads in spare mode).
function _arcRenderThreads(threads, posById, isSpareFocal) {
  if (!threads || !threads.length) { return ''; }
  var out = '';
  var i;
  for (i = 0; i < threads.length; i = i + 1) {
    var t = threads[i];
    var pa = posById[t.bookAId];
    var pb = posById[t.bookBId];
    if (!pa || !pb) { continue; }
    var w = _arcThreadWidth(t.strength);
    var op = _arcRecencyOpacity(t.daysSinceLastTouch);
    if (isSpareFocal && op < 0.50) { op = 0.50; }
    var dash = t.speculative ? ' stroke-dasharray="3 3"' : '';
    var moreId = _arcMoreEngagedId(pa.book, pb.book, t.bookAId, t.bookBId);
    var mx = (pa.x + pb.x) / 2;
    var my = (pa.y + pb.y) / 2;
    // Delta between segments. Spec doc says 0.4px; lifted to 1.0px after
    // Stage 3 visual review showed 0.4px was below the perceptual threshold
    // at scale 60. Re-evaluate if scale changes.
    var wA, wB;
    if (moreId === t.bookAId) {
      wA = w + 1.0;
      wB = w;
    } else {
      wA = w;
      wB = w + 1.0;
    }
    out = out
      + '<g data-thread-a="' + t.bookAId + '" data-thread-b="' + t.bookBId + '">'
      + '<line x1="' + _arcR(pa.x) + '" y1="' + _arcR(pa.y)
      + '" x2="' + _arcR(mx) + '" y2="' + _arcR(my)
      + '" stroke="var(--thread-color)" stroke-width="' + _arcR(wA)
      + '" opacity="' + _arcR(op) + '" stroke-linecap="round"' + dash + '/>';
    out = out
      + '<line x1="' + _arcR(mx) + '" y1="' + _arcR(my)
      + '" x2="' + _arcR(pb.x) + '" y2="' + _arcR(pb.y)
      + '" stroke="var(--thread-color)" stroke-width="' + _arcR(wB)
      + '" opacity="' + _arcR(op) + '" stroke-linecap="round"' + dash + '/></g>';
  }
  return out;
}

// Yumi-noticing dashed lines, opacity 0.4, drawn behind books.
function _arcRenderYumiLines(yumiNoticing, posById, yx, yy) {
  if (!yumiNoticing || !yumiNoticing.length) { return ''; }
  var out = '';
  var i;
  for (i = 0; i < yumiNoticing.length; i = i + 1) {
    var p = posById[yumiNoticing[i]];
    if (!p) { continue; }
    out = out
      + '<line x1="' + _arcR(yx) + '" y1="' + _arcR(yy)
      + '" x2="' + _arcR(p.x) + '" y2="' + _arcR(p.y)
      + '" stroke="var(--ink, #412402)" stroke-width="0.6"'
      + ' stroke-dasharray="2 4" opacity="0.4" stroke-linecap="round"/>';
  }
  return out;
}

// Books: each book at its position, full Round 11 form via arc-scale renderer.
function _arcRenderBooks(positions) {
  var out = '';
  var i;
  for (i = 0; i < positions.length; i = i + 1) {
    var p = positions[i];
    var band = (p.book && typeof p.book.band === 'number') ? p.book.band : 0;
    var form = renderTraditionFormArc(p.book.tradition, band, 60);
    if (!form) { continue; }
    out = out + '<g data-book-id="' + p.id + '" transform="translate(' + _arcR(p.x) + ',' + _arcR(p.y) + ')">' + form + '</g>';
  }
  return out;
}

// Marginalia dots:
//   noteCount 0     -> nothing
//   noteCount 1..4  -> N x 4px dots in deterministic organic cluster outside silhouette
//   noteCount 5+    -> rosette: 3 x 3px dots in tight equilateral triangle at one anchor
function _arcRenderMarginalia(positions) {
  var out = '';
  var ringR = 36; // just outside ~30px silhouette radius; inside halo extent
  var i;
  for (i = 0; i < positions.length; i = i + 1) {
    var p = positions[i];
    var nc = (p.book && typeof p.book.noteCount === 'number') ? p.book.noteCount : 0;
    if (nc <= 0) { continue; }
    out = out + '<g data-marginalia-book-id="' + p.id + '">';
    if (nc >= 5) {
      var anchorAngle = _arcHash(p.id, 50) * Math.PI * 2;
      var ax = p.x + Math.cos(anchorAngle) * ringR;
      var ay = p.y + Math.sin(anchorAngle) * ringR;
      var triR = 3.6;
      var a;
      for (a = 0; a < 3; a = a + 1) {
        var theta = (a / 3) * Math.PI * 2 - Math.PI / 2;
        var dx = Math.cos(theta) * triR;
        var dy = Math.sin(theta) * triR;
        out = out
          + '<circle cx="' + _arcR(ax + dx) + '" cy="' + _arcR(ay + dy)
          + '" r="3" fill="var(--marginalia-color)"/>';
      }
    } else {
      var clusterCenter = _arcHash(p.id, 60) * Math.PI * 2;
      var d;
      for (d = 0; d < nc; d = d + 1) {
        var s1 = _arcHash(p.id, 70 + d);
        var s2 = _arcHash(p.id, 80 + d);
        var dotAngle = clusterCenter + (s1 - 0.5) * (Math.PI * 0.7);
        var dotR = ringR + (s2 - 0.5) * 6;
        out = out
          + '<circle cx="' + _arcR(p.x + Math.cos(dotAngle) * dotR)
          + '" cy="' + _arcR(p.y + Math.sin(dotAngle) * dotR)
          + '" r="4" fill="var(--marginalia-color)"/>';
      }
    }
    out = out + '</g>';
  }
  return out;
}

// Yumi cluster -- dashed circle + italic serif label, upper-right.
function _arcRenderYumiCluster(yx, yy) {
  var out = '<g data-yumi-cluster="1">';
  out = out
    + '<circle cx="' + _arcR(yx) + '" cy="' + _arcR(yy) + '" r="14"'
    + ' fill="none" stroke="var(--ink, #412402)" stroke-width="1"'
    + ' stroke-dasharray="3 3" opacity="0.7"/>';
  out = out
    + '<text x="' + _arcR(yx) + '" y="' + _arcR(yy + 28)
    + '" text-anchor="middle" font-family="\'Cormorant Garamond\', Georgia, serif"'
    + ' font-style="italic" font-size="11" fill="var(--ink-2, #633806)">Yumi</text>';
  out = out + '</g>';
  return out;
}

// Legend -- list only visual elements actually present in this arc.
function _arcRenderLegend(arc, positions, width, height) {
  var hasThreads = !!(arc.threads && arc.threads.length);
  var hasSpeculative = false;
  var hasMarginalia = false;
  var hasRosette = false;
  var hasYumi = !!(arc.yumiNoticing && arc.yumiNoticing.length);
  var i;
  if (arc.threads) {
    for (i = 0; i < arc.threads.length; i = i + 1) {
      if (arc.threads[i].speculative) { hasSpeculative = true; break; }
    }
  }
  for (i = 0; i < positions.length; i = i + 1) {
    var nc = positions[i].book && positions[i].book.noteCount;
    if (typeof nc === 'number' && nc > 0) { hasMarginalia = true; }
    if (typeof nc === 'number' && nc >= 5) { hasRosette = true; }
  }
  var parts = [];
  if (hasMarginalia)  { parts.push('green dot · note'); }
  if (hasRosette)     { parts.push('rosette · five+ notes'); }
  if (hasThreads)     { parts.push('green line · thread'); }
  if (hasSpeculative) { parts.push('dashed · speculative'); }
  if (hasYumi)        { parts.push('faint dashes · Yumi noticing'); }
  if (!parts.length) { return ''; }

  // Wrap into at most two lines so the legend never overflows the
  // container. <=2 items fit on one line; >=3 items split balanced.
  var lines = [];
  if (parts.length <= 2) {
    lines.push(parts.join('     '));
  } else {
    var split = Math.ceil(parts.length / 2);
    var line1 = [];
    var line2 = [];
    for (i = 0; i < parts.length; i = i + 1) {
      if (i < split) { line1.push(parts[i]); } else { line2.push(parts[i]); }
    }
    lines.push(line1.join('     '));
    lines.push(line2.join('     '));
  }

  var out = '';
  var lineHeight = 14;
  var baseY = height - 12 - (lines.length - 1) * lineHeight;
  for (i = 0; i < lines.length; i = i + 1) {
    out = out
      + '<text x="16" y="' + _arcR(baseY + i * lineHeight)
      + '" font-family="\'Cormorant Garamond\', Georgia, serif"'
      + ' font-style="italic" font-size="11"'
      + ' fill="var(--ink-2, #633806)" opacity="0.8">'
      + _arcEscapeXml(lines[i]) + '</text>';
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public entry.
// ---------------------------------------------------------------------------

function renderArcConstellation(arc, parentSvgElement) {
  if (!arc || !parentSvgElement) { return; }

  // Container dimensions: prefer viewBox; fall back to client rect; default
  // to 600x500 if neither is set.
  var width = 600;
  var height = 500;
  var vb = parentSvgElement.getAttribute('viewBox');
  if (vb) {
    var parts = vb.split(/\s+/);
    if (parts.length === 4) {
      var w = parseFloat(parts[2]);
      var h = parseFloat(parts[3]);
      if (isFinite(w) && w > 0) { width = w; }
      if (isFinite(h) && h > 0) { height = h; }
    }
  } else if (parentSvgElement.clientWidth && parentSvgElement.clientHeight) {
    width = parentSvgElement.clientWidth;
    height = parentSvgElement.clientHeight;
  }

  if (!arc.books || !arc.books.length) {
    parentSvgElement.innerHTML = getTraditionFormsArcDefs()
      + '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="url(#tfa-ground)"/>';
    return;
  }

  var isSpareFocal = arc.books.length <= 5;
  var positions = isSpareFocal
    ? _arcSpareFocalLayout(arc.books, width, height)
    : _arcConstellationLayout(arc.books, width, height);

  var posById = {};
  var i;
  for (i = 0; i < positions.length; i = i + 1) {
    posById[positions[i].id] = positions[i];
  }

  // Yumi anchor: upper-right, ~30px from each edge.
  var yumiX = width - 30;
  var yumiY = 30;

  var svg = '';
  // 1. Defs.
  svg = svg + getTraditionFormsArcDefs();
  // 2. Wheat ground.
  svg = svg + '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="url(#tfa-ground)"/>';
  // 3. Question gravity glow + text (behind everything else).
  svg = svg + _arcRenderQuestion(arc.question || '', width, height, isSpareFocal);
  // 4. Yumi faint dashed lines (behind threads + books).
  svg = svg + _arcRenderYumiLines(arc.yumiNoticing, posById, yumiX, yumiY);
  // 5. Threads (behind books, in front of Yumi lines).
  svg = svg + _arcRenderThreads(arc.threads || [], posById, isSpareFocal);
  // 6. Books.
  svg = svg + _arcRenderBooks(positions);
  // 7. Marginalia dots (in front of books).
  svg = svg + _arcRenderMarginalia(positions);
  // 8. Yumi cluster (in front of books).
  svg = svg + _arcRenderYumiCluster(yumiX, yumiY);
  // 9. Legend.
  svg = svg + _arcRenderLegend(arc, positions, width, height);

  parentSvgElement.innerHTML = svg;
}

// ===========================================================================
// Stage 9.5 -- SUB-THEORY CONSTELLATION (additive; renderArcConstellation
// above is untouched and revertable). Renders an arc's *sub-theories* as
// identity shapes orbiting the question, with each sub-theory's gathered
// evidence shown as a hollow marginalia cloud. Shapes are IDENTITY ONLY --
// a NEW neutral shape/color vocabulary assigned by hashing the sub-theory
// id; they deliberately do NOT reuse the tradition shape/color taxonomy
// (square=theory, etc.). Only the tradition-NEUTRAL defs tfa-ground +
// tfa-innerL are reused; the grain/halo/inner-light TECHNIQUE is echoed
// with new st-* defs. NOT WIRED in Stage 2 (views.js repoints in Stage 3).
//
// Public entry: renderSubTheoryConstellation(arc, parentSvgElement)
// Data contract (builder produces in Stage 3, renderer consumes):
//   arc = { id, question,
//           subTheories: [ { id, shapeKey, color, maturity /*0..1*/,
//             marks: [ {state:'gathered', kind, label, quote, annotation} ] } ],
//           edges: [ { aId, bId, strength } ],   // empty for now
//           yumiNoticing: [] }
// ===========================================================================

// Stage 9.6b identity grammar. A sub-theory's appearance is a deterministic
// TRIPLE hashed from its id: one of 4 silhouettes, one of 14 surface
// treatments, one of 16 palette colors -- 896 visual combinations, each
// stable per id across renders/sessions (matching the book layout's
// determinism). No dedup within an arc: identity stability beats guaranteed
// distinctness, so adding/removing a sub-theory never shifts another one's
// appearance. The old muted shape/palette vocabulary is gone -- color now
// comes from the theme's --subtheory-1..16 tokens, so NO hex is hardcoded
// in the mark code (the grain stroke is a separate ground detail).
var _ST_SILHOUETTES = ['circle', 'hexagon', 'diamond', 'triangle'];
var _ST_TREATMENTS = ['rings', 'hatch', 'halftone', 'dotgrid', 'labyrinth',
  'linefade', 'burst', 'waves', 'crossweave', 'stipple', 'spiral',
  'herringbone', 'nested', 'sunburst'];
var _ST_SCALE = 60; // B1: quieted 78->60 so marks read quiet (silhouette + treatment still legible), echoing the vocabulary strip

// Unique clip-path id counter, mirroring _tfaNextId -- clip ids must be
// document-unique so two constellations on one page can't collide.
var _stCounter = 0;
function _stNextId() {
  _stCounter = _stCounter + 1;
  return 'st-clip-' + _stCounter;
}

// 9.6b.2: identity hash for the mark grammar. Distinct from _arcHash (which
// many other consumers depend on -- book layout, marginalia clusters,
// stipple -- so it is left byte-identical). The old grammar reused _arcHash,
// which APPENDS ':'+salt: its three salted calls then differed only in the
// final character, so silhouette/treatment/color stayed correlated and ids
// whose hashes happened to differ by a multiple of the moduli collapsed onto
// the same mark (the seed arc's sub-theories all rendered as one silhouette;
// inter-id bucket deltas were identical across all three salts). The fix:
// PREPEND the salt so FNV diverges from the first character, then run a
// light ES3-safe avalanche finalizer (xorshift + a 32-bit mix multiply via
// the |0 emulation, no Math.imul) so small id deltas spread through the low
// bits before each mod. Returns an unsigned 32-bit int; _stIndices takes it
// mod 4 / 14 / 16. Deterministic + stable per id (a theory always wears the
// same mark); this fix is a one-time permanent reshuffle of existing marks.
function _stIdentityHash(id, salt) {
  var s = String(salt) + ':' + String(id);
  var h = 2166136261;
  var i;
  for (i = 0; i < s.length; i = i + 1) {
    h = h ^ s.charCodeAt(i);
    h = (h * 16777619) | 0;
  }
  h = h ^ (h >>> 15);
  h = (h * 16777619) | 0;
  h = (h >>> 0) ^ ((h >>> 0) >>> 13);
  return h >>> 0;
}

// Deterministic identity triple. Three salted avalanche hashes of the id
// (via _stIdentityHash, salt prepended) pick a silhouette (0-3), a treatment
// (0-13), and a color (0-15). The prepended salt + finalizer keep the three
// axes genuinely independent, so similar ids read as different marks. Pure
// function of the id -> stable per id, matching the book layout's
// determinism.
function _stIndices(id) {
  var sIdx = _stIdentityHash(id, 11) % _ST_SILHOUETTES.length;
  var tIdx = _stIdentityHash(id, 13) % _ST_TREATMENTS.length;
  var cIdx = _stIdentityHash(id, 17) % 16;
  // 9b-ii: the new 16-mark shapeIdx default -- reuse the silhouette hash
  // (seed 11) widened to %16, so the default shape is stable-from-id and
  // independent of color (seed 17).
  var shIdx = _stIdentityHash(id, 11) % 16;
  if (sIdx < 0) { sIdx = 0; }
  if (sIdx >= _ST_SILHOUETTES.length) { sIdx = _ST_SILHOUETTES.length - 1; }
  if (tIdx < 0) { tIdx = 0; }
  if (tIdx >= _ST_TREATMENTS.length) { tIdx = _ST_TREATMENTS.length - 1; }
  if (cIdx < 0) { cIdx = 0; }
  if (cIdx >= 16) { cIdx = 15; }
  if (shIdx < 0) { shIdx = 0; }
  if (shIdx >= 16) { shIdx = 15; }
  return { silhouetteIdx: sIdx, treatmentIdx: tIdx, colorIdx: cIdx, shapeIdx: shIdx };
}

// Back-compat shim. views.js:_arcDetailBuildSubTheoryData still calls
// _stIdentity(id) and stores .shapeKey/.color into the data contract; the
// renderer now self-derives its triple from _stIndices and ignores those
// contract fields (grep-confirmed the renderer is their only consumer), so
// this shim exists purely to keep the builder's assignment well-formed. It
// returns the silhouette key + the color TOKEN (no hex) for that id.
function _stIdentity(id) {
  var ix = _stIndices(id);
  return {
    shapeKey: _ST_SILHOUETTES[ix.silhouetteIdx],
    color: 'var(--subtheory-' + (ix.colorIdx + 1) + ')'
  };
}

// New st-* defs. Echoes the tradition grain/halo technique with a
// tradition-NEUTRAL vocabulary: one color-agnostic grain overlay (faint
// dark contour strokes on a transparent tile, layered over the translucent
// identity color) and one backlit halo gradient per palette token. The
// grain stroke (#2A2018) is a pre-existing ground detail and stays bare;
// the halos read the --subtheory-N CSS tokens via stop-color (the same
// var() mechanism every fill in this renderer already uses), so the mark
// grammar adds NO hardcoded hex. tfa-ground + tfa-innerL are reused from
// getTraditionFormsArcDefs(), NOT redefined here.
function _stGetDefs() {
  var s = '<defs>';
  s = s + '<pattern id="st-grain" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">';
  s = s +   '<path d="M0 5 Q9 3 18 5 M0 11 Q9 9 18 11 M0 16 Q9 14 18 16" stroke="#2A2018" stroke-width="0.6" fill="none" opacity="0.18"/>';
  s = s + '</pattern>';
  // One backlit halo gradient per palette token (1..16): transparent core
  // -> ~0.50 ring at 78% -> transparent rim, the 9.6b "backlit" profile.
  var i, c;
  for (i = 1; i <= 16; i = i + 1) {
    c = 'var(--subtheory-' + i + ')';
    s = s + '<radialGradient id="st-halo-' + i + '" cx="50%" cy="50%" r="50%">';
    s = s +   '<stop offset="55%" stop-color="' + c + '" stop-opacity="0"/>';
    s = s +   '<stop offset="78%" stop-color="' + c + '" stop-opacity="0.50"/>';
    s = s +   '<stop offset="100%" stop-color="' + c + '" stop-opacity="0"/>';
    s = s + '</radialGradient>';
  }
  s = s + '</defs>';
  return s;
}

// Silhouette geometry. Takes a silhouette key + the unit scale factor u
// (= scale / 120, matching _tfaGeometry's convention) and returns ONE
// self-closing SVG element string with no fill -- the caller injects fill
// (for the halo) or uses it as a clipPath child (for the body). Centered
// on origin so the same generator at a larger u produces the halo
// silhouette. Four silhouettes: circle, hexagon, diamond, triangle.
function _stSilhouette(key, u) {
  var R = _arcR;
  var k, ang, x, y, pts;
  if (key === 'hexagon') {
    pts = '';
    for (k = 0; k < 6; k = k + 1) {
      ang = (k / 6) * Math.PI * 2 - Math.PI / 2;
      x = Math.cos(ang) * 56 * u;
      y = Math.sin(ang) * 56 * u;
      pts = pts + (k === 0 ? '' : ' ') + R(x) + ',' + R(y);
    }
    return '<polygon points="' + pts + '"/>';
  }
  if (key === 'diamond') {
    return '<polygon points="0,' + R(-58 * u) + ' ' + R(50 * u) + ',0 0,' + R(58 * u) + ' ' + R(-50 * u) + ',0"/>';
  }
  if (key === 'triangle') {
    pts = '';
    for (k = 0; k < 3; k = k + 1) {
      ang = (k / 3) * Math.PI * 2 - Math.PI / 2;
      x = Math.cos(ang) * 58 * u;
      y = Math.sin(ang) * 58 * u;
      pts = pts + (k === 0 ? '' : ' ') + R(x) + ',' + R(y);
    }
    return '<polygon points="' + pts + '"/>';
  }
  // default + 'circle'
  return '<circle cx="0" cy="0" r="' + R(52 * u) + '"/>';
}

// Surface treatment. Draws one of 14 motifs across the silhouette's
// bounding box; the caller clips it to the silhouette. Every stroke/fill
// uses the mark's color TOKEN (c) at a deeper opacity than the translucent
// body, so the motif reads as a darker grain of the same hue -- NO
// hardcoded hex. The motif field spans roughly [-E, E] in both axes.
function _stTreatment(key, u, c) {
  var R = _arcR;
  var E = 60 * u;
  var s = '';
  var i, x, y, r, n, a, ang, w, d;

  if (key === 'rings') { // concentric rings
    for (i = 1; i <= 5; i = i + 1) {
      r = (i / 5) * E;
      s = s + '<circle cx="0" cy="0" r="' + R(r) + '" fill="none" stroke="' + c + '" stroke-width="' + R(1.4 * u) + '" opacity="0.5"/>';
    }
    return s;
  }
  if (key === 'hatch') { // diagonal hatch
    for (x = -2 * E; x <= 2 * E; x = x + 11 * u) {
      s = s + '<line x1="' + R(x) + '" y1="' + R(-E) + '" x2="' + R(x + 2 * E) + '" y2="' + R(E) + '" stroke="' + c + '" stroke-width="' + R(1.3 * u) + '" opacity="0.45"/>';
    }
    return s;
  }
  if (key === 'halftone') { // halftone dots (grow left -> right)
    for (y = -E; y <= E; y = y + 15 * u) {
      for (x = -E; x <= E; x = x + 15 * u) {
        r = (1.2 + ((x + E) / (2 * E)) * 4) * u;
        s = s + '<circle cx="' + R(x) + '" cy="' + R(y) + '" r="' + R(r) + '" fill="' + c + '" opacity="0.5"/>';
      }
    }
    return s;
  }
  if (key === 'dotgrid') { // even dot grid
    for (y = -E; y <= E; y = y + 13 * u) {
      for (x = -E; x <= E; x = x + 13 * u) {
        s = s + '<circle cx="' + R(x) + '" cy="' + R(y) + '" r="' + R(1.8 * u) + '" fill="' + c + '" opacity="0.5"/>';
      }
    }
    return s;
  }
  if (key === 'labyrinth') { // broken-labyrinth rings
    for (i = 1; i <= 5; i = i + 1) {
      r = (i / 5) * E;
      s = s + '<circle cx="0" cy="0" r="' + R(r) + '" fill="none" stroke="' + c + '" stroke-width="' + R(1.6 * u) + '" opacity="0.5" stroke-dasharray="' + R(10 * u) + ' ' + R(6 * u) + '"/>';
    }
    return s;
  }
  if (key === 'linefade') { // fading line-gradient (top opaque -> bottom faint)
    n = 9;
    for (i = 0; i < n; i = i + 1) {
      y = -E + (i / (n - 1)) * (2 * E);
      s = s + '<line x1="' + R(-E) + '" y1="' + R(y) + '" x2="' + R(E) + '" y2="' + R(y) + '" stroke="' + c + '" stroke-width="' + R(1.6 * u) + '" opacity="' + R(0.65 - (i / (n - 1)) * 0.5) + '"/>';
    }
    return s;
  }
  if (key === 'burst') { // radiating burst from center
    n = 16;
    for (i = 0; i < n; i = i + 1) {
      ang = (i / n) * Math.PI * 2;
      s = s + '<line x1="0" y1="0" x2="' + R(Math.cos(ang) * E) + '" y2="' + R(Math.sin(ang) * E) + '" stroke="' + c + '" stroke-width="' + R(1.3 * u) + '" opacity="0.45"/>';
    }
    return s;
  }
  if (key === 'waves') { // woven waves
    w = 9 * u;
    for (y = -E; y <= E; y = y + 13 * u) {
      d = 'M' + R(-E) + ' ' + R(y);
      for (x = -E; x < E; x = x + 12 * u) {
        d = d + ' Q' + R(x + 6 * u) + ' ' + R(y - w) + ' ' + R(x + 12 * u) + ' ' + R(y);
      }
      s = s + '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + R(1.3 * u) + '" opacity="0.45"/>';
    }
    return s;
  }
  if (key === 'crossweave') { // cross-weave grid of lines
    for (x = -E; x <= E; x = x + 12 * u) {
      s = s + '<line x1="' + R(x) + '" y1="' + R(-E) + '" x2="' + R(x) + '" y2="' + R(E) + '" stroke="' + c + '" stroke-width="' + R(1.1 * u) + '" opacity="0.4"/>';
    }
    for (y = -E; y <= E; y = y + 12 * u) {
      s = s + '<line x1="' + R(-E) + '" y1="' + R(y) + '" x2="' + R(E) + '" y2="' + R(y) + '" stroke="' + c + '" stroke-width="' + R(1.1 * u) + '" opacity="0.4"/>';
    }
    return s;
  }
  if (key === 'stipple') { // deterministic stipple scatter
    n = 80;
    for (i = 0; i < n; i = i + 1) {
      x = (_arcHash('st-stipple-x', i) - 0.5) * 2 * E;
      y = (_arcHash('st-stipple-y', i) - 0.5) * 2 * E;
      s = s + '<circle cx="' + R(x) + '" cy="' + R(y) + '" r="' + R(1.5 * u) + '" fill="' + c + '" opacity="0.5"/>';
    }
    return s;
  }
  if (key === 'spiral') { // archimedean spiral
    n = 120;
    d = '';
    for (i = 0; i <= n; i = i + 1) {
      a = (i / n) * Math.PI * 6;
      r = (i / n) * E;
      d = d + (i === 0 ? 'M' : ' L') + R(Math.cos(a) * r) + ' ' + R(Math.sin(a) * r);
    }
    return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + R(1.4 * u) + '" opacity="0.5"/>';
  }
  if (key === 'herringbone') { // chevron / herringbone rows
    w = 7 * u;
    for (y = -E; y <= E; y = y + 13 * u) {
      for (x = -E; x <= E; x = x + 14 * u) {
        s = s + '<path d="M' + R(x) + ' ' + R(y + w) + ' L' + R(x + 7 * u) + ' ' + R(y - w) + ' L' + R(x + 14 * u) + ' ' + R(y + w) + '" fill="none" stroke="' + c + '" stroke-width="' + R(1.2 * u) + '" opacity="0.45"/>';
      }
    }
    return s;
  }
  if (key === 'nested') { // nested line-art squares
    for (i = 1; i <= 5; i = i + 1) {
      r = (i / 5) * E;
      s = s + '<rect x="' + R(-r) + '" y="' + R(-r) + '" width="' + R(2 * r) + '" height="' + R(2 * r) + '" fill="none" stroke="' + c + '" stroke-width="' + R(1.3 * u) + '" opacity="0.45"/>';
    }
    return s;
  }
  // default + 'sunburst' -- fan of lines spreading up from a low anchor
  n = 15;
  y = E * 0.9;
  for (i = 0; i < n; i = i + 1) {
    ang = -Math.PI / 2 + (i / (n - 1) - 0.5) * (Math.PI * 0.95);
    s = s + '<line x1="0" y1="' + R(y) + '" x2="' + R(Math.cos(ang) * E * 1.6) + '" y2="' + R(y + Math.sin(ang) * E * 1.6) + '" stroke="' + c + '" stroke-width="' + R(1.2 * u) + '" opacity="0.45"/>';
  }
  return s;
}

// Maturity -> luminosity proxy. The ONE isolated, swappable render-side
// mapping: maturity in [0,1] -> a luminosity scalar in [0.35, 1.0] (never
// fully invisible). Luminosity is the only depth signal -- no numbers,
// bars, or percentages. The maturity VALUE itself is derived builder-side
// in Stage 3 (v1: normalize(bodyPublic.length + bodyIntellectual.length +
// a weight per evidence item)) because those raw fields live in
// state.subTheories, not in the data contract. Final formula deferred.
function _stLuminosity(maturity) {
  var m = (typeof maturity === 'number' && isFinite(maturity)) ? maturity : 0;
  m = _arcClamp(0, m, 1);
  // 9b-ii: luminosity drives the mark HALO opacity only (the full-fill body
  // is constant). Mapped to [0.32, 0.62] (mid ~0.47) so maturity stays
  // visible without the new halo glowing too hot.
  return _arcR(0.32 + m * 0.30);
}

// Radial layout: question at center, sub-theories on an even orbiting ring
// (index order = caller-controlled, like _arcSpareFocalLayout). n===1 rides
// at the top. Returns [{ id, x, y, sub }].
function _stRadialLayout(subs, width, height) {
  var cx = width / 2;
  var cy = height / 2;
  var n = subs.length;
  var positions = [];
  if (n === 0) { return positions; }
  var orbit = Math.min(width, height) * 0.32;
  var i, theta, px, py;
  for (i = 0; i < n; i = i + 1) {
    // 9.6a: honor a persisted position when both coords are real
    // numbers (a dragged placement); otherwise fall back to the
    // index-derived radial slot. Coords are absolute SVG units in
    // the same space the radial branch produces, so 9.6c's drag
    // handler must record drop coords in that same space.
    if (typeof subs[i].x === 'number' && typeof subs[i].y === 'number') {
      px = subs[i].x;
      py = subs[i].y;
    } else {
      if (n === 1) {
        theta = -Math.PI / 2;
      } else {
        theta = (i / n) * Math.PI * 2 - Math.PI / 2;
      }
      px = cx + Math.cos(theta) * orbit;
      py = cy + Math.sin(theta) * orbit;
    }
    positions.push({
      id:  subs[i].id,
      x:   px,
      y:   py,
      sub: subs[i]
    });
  }
  return positions;
}

// Swappable layout seam, mirroring the book renderer's
// _arcConstellationLayout / _arcSpareFocalLayout switch. Only 'radial'
// exists in Stage 9.5; curved-sweep is an explicit non-goal.
function _stLayout(mode, subs, width, height) {
  if (mode === 'radial') { return _stRadialLayout(subs, width, height); }
  return _stRadialLayout(subs, width, height);
}

// Question -- amber gravity glow + italic serif text at center. Sibling of
// _arcRenderQuestion (not reused, so the sub-theory view stays self-
// contained and independently tunable). data-st-question tags it for the
// Stage 3 interaction layer.
function _stRenderQuestion(question, width, height) {
  if (!question || !question.length) { return ''; }
  var cx = width / 2;
  // 9b-i: question + its amber halo sit slightly low of center (h*0.52),
  // matching the comp's off-center composition. Halo radius is a soft
  // min(w,h)*0.42 disc drawn UNDER the text (pointer-events none so it never
  // eats mark/hover hits).
  var cy = height * 0.52;
  var qhr = Math.min(width, height) * 0.42;
  // Hybrid Stage A: the heavy center disc/glow is dropped -- the arc's
  // question now floats as the quiet italic serif label over a soft halo.
  var out = '';
  out = out + '<ellipse data-st-qhalo="1" cx="' + _arcR(cx) + '" cy="' + _arcR(cy) + '" rx="' + _arcR(qhr) + '" ry="' + _arcR(qhr) + '" fill="url(#tfa-qhalo)" pointer-events="none"/>';
  out = out + '<text data-st-question="1" x="' + _arcR(cx) + '" y="' + _arcR(cy) + '" text-anchor="middle" dominant-baseline="middle" font-family="\'Cormorant Garamond\', Georgia, serif" font-style="italic" font-size="18" fill="var(--ink-2)" opacity="0.82">' + _arcEscapeXml(question) + '</text>';
  return out;
}

// Empty state (0 sub-theories): a quiet prompt under the question so the
// field reads as an invitation, never a bare/broken canvas.
function _stRenderEmpty(width, height) {
  var cx = width / 2;
  var cy = height / 2;
  return '<text data-st-empty="1" x="' + _arcR(cx) + '" y="' + _arcR(cy + 34) + '" text-anchor="middle" font-family="\'Cormorant Garamond\', Georgia, serif" font-style="italic" font-size="13" fill="var(--ink-2, #633806)" opacity="0.7">Begin a sub-theory to map this question.</text>';
}

// 9b-ii: the frozen sixteen marks -- body path + inner-design paths, copied
// VERBATIM from docs/mockups/praxis-marks-16-spec.html (body = the spec
// table's "body path" column; inner = the rendered gallery's fill=none deep
// strokes). Keyed 0-15 by shapeIdx. Local coords span ~+/-44; the renderer
// scales the whole mark by 0.8.
var _ST_MARK_TABLE = [
  /*01 hexagon*/      { body: 'M0,-44 L38,-22 L38,22 L0,44 L-38,22 L-38,-22 Z', inner: ['M0,-29 L25,-14.5 L25,14.5 L0,29 L-25,14.5 L-25,-14.5 Z', 'M0,-14 L12,-7 L12,7 L0,14 L-12,7 L-12,-7 Z'] },
  /*02 teardrop*/     { body: 'M0,-48 C20,-22 30,-6 30,12 A30,30 0 1,1 -30,12 C-30,-6 -20,-22 0,-48 Z', inner: ['M-19,14 A19,19 0 0,1 19,14', 'M-12,22 A12,12 0 0,1 12,22', 'M-5.5,29 A5.5,5.5 0 0,1 5.5,29'] },
  /*03 4-pt star*/    { body: 'M0,-50 C7,-16 16,-7 50,0 C16,7 7,16 0,50 C-7,16 -16,7 -50,0 C-16,-7 -7,-16 0,-50 Z', inner: ['M0,-30 L0,30', 'M-30,0 L30,0', 'M0,-9 A9,9 0 1,0 0.01,-9 Z'] },
  /*04 pentagon*/     { body: 'M0,-46 L44,-12 L27,42 L-27,42 L-44,-12 Z', inner: ['M0,-40 L-24,26', 'M0,-40 L0,30', 'M0,-40 L24,26'] },
  /*05 vesica*/       { body: 'M0,-46 C26,-30 26,30 0,46 C-26,30 -26,-30 0,-46 Z', inner: ['M-11,-32 C-3,-12 -19,12 -11,32', 'M0,-36 C8,-14 -8,14 0,36', 'M11,-32 C19,-12 3,12 11,32'] },
  /*06 arch*/         { body: 'M-32,40 L-32,-6 A32,32 0 0,1 32,-6 L32,40 Z', inner: ['M-18,-6 A18,18 0 0,1 18,-6', 'M-16,4 L-16,32', 'M0,2 L0,32', 'M16,4 L16,32'] },
  /*07 rhombus*/      { body: 'M0,-46 L34,0 L0,46 L-34,0 Z', inner: ['M0,-46 L0,46', 'M-17,-23 L17,23', 'M17,-23 L-17,23'] },
  /*08 rosette*/      { body: 'M0,-44 C22,-44 22,-22 8,-8 C22,-22 44,-22 44,0 C44,22 22,22 8,8 C22,22 22,44 0,44 C-22,44 -22,22 -8,8 C-22,22 -44,22 -44,0 C-44,-22 -22,-22 -8,-8 C-22,-22 -22,-44 0,-44 Z', inner: ['M0,-8 A8,8 0 1,0 0.01,-8 Z', 'M-15,-15 L-26,-26', 'M15,-15 L26,-26', 'M-15,15 L-26,26', 'M15,15 L26,26'] },
  /*09 triangle*/     { body: 'M0,-44 L40,36 L-40,36 Z', inner: ['M-13,-12 L13,-12', 'M-22,4 L22,4', 'M-31,20 L31,20'] },
  /*10 octagon*/      { body: 'M18,-44 L44,-18 L44,18 L18,44 L-18,44 L-44,18 L-44,-18 L-18,-44 Z', inner: ['M10,-24 L24,-10 L24,10 L10,24 L-10,24 L-24,10 L-24,-10 L-10,-24 Z', 'M0,-4 A4,4 0 1,0 0.01,-4 Z'] },
  /*11 egg*/          { body: 'M0,-44 C26,-44 36,-16 36,4 A36,36 0 1,1 -36,4 C-36,-16 -26,-44 0,-44 Z', inner: ['M0,4 m0,-2 a2,2 0 1,1 -2,2 a5,5 0 1,1 5,-5 a9,9 0 1,1 -9,9 a14,14 0 1,1 14,-14 a20,20 0 1,1 -20,20'] },
  /*12 kite*/         { body: 'M0,-48 L28,-8 L0,44 L-28,-8 Z', inner: ['M0,-48 L0,44', 'M-20,-8 L20,-8', 'M-12,12 L12,12'] },
  /*13 semicircle*/   { body: 'M-44,26 A44,44 0 0,1 44,26 Z', inner: ['M-30,26 A30,30 0 0,1 30,26', 'M-17,26 A17,17 0 0,1 17,26', 'M-44,26 L44,26'] },
  /*14 6-pt star*/    { body: 'M0,-46 L8,-16 L36,-26 L16,-2 L40,14 L11,11 L13,40 L0,17 L-13,40 L-11,11 L-40,14 L-16,-2 L-36,-26 L-8,-16 Z', inner: ['M0,-8 L0,8', 'M-8,0 L8,0', 'M-6,-6 L6,6', 'M6,-6 L-6,6'] },
  /*15 mound*/        { body: 'M-46,32 C-30,-26 -8,-40 6,-38 C30,-34 44,-6 46,32 Z', inner: ['M-34,12 C-12,2 14,4 36,14', 'M-26,24 C-6,16 10,18 30,24'] },
  /*16 squircle*/     { body: 'M-18,-36 L18,-36 Q36,-36 36,-18 L36,18 Q36,36 18,36 L-18,36 Q-36,36 -36,18 L-36,-18 Q-36,-36 -18,-36 Z', inner: ['M-12,-28 L-12,28', 'M12,-28 L12,28', 'M-28,-12 L28,-12', 'M-28,12 L28,12'] }
];

// 9b-ii: render each sub-theory as one of the sixteen frozen marks -- a soft
// hue halo (CSS blur in user units; NO svg filter -> no Chrome gray-flash; NO
// opacity animation, that is 9b-iv), then a full-fill body (hue fill + same-hue
// ring + cream shine + deep-shade inner design at .62/1.8). shapeIdx/colorIdx
// default to the id hash; a per-sub markShape/markColor override (threaded by
// views.js ON THE SUB DATA -- the renderer never reads global state) wins when
// present and in [0,15]. The old silhouette x treatment construction retires
// from the render path; tfa-innerL + the silhouette/treatment helpers + the
// st-halo/st-grain defs remain as dead code (removal is a later cleanup).
function _stRenderShapes(positions) {
  var out = '';
  var i;
  for (i = 0; i < positions.length; i = i + 1) {
    var p = positions[i];
    var sub = p.sub || {};
    var ix = _stIndices(p.id);
    var shapeIdx = (typeof sub.markShape === 'number' && sub.markShape >= 0 && sub.markShape <= 15)
      ? sub.markShape : ix.shapeIdx;
    var colorIdx = (typeof sub.markColor === 'number' && sub.markColor >= 0 && sub.markColor <= 15)
      ? sub.markColor : ix.colorIdx;
    var mark = _ST_MARK_TABLE[shapeIdx];
    var colorVar = 'var(--subtheory-' + (colorIdx + 1) + ')';
    var edgeVar = 'var(--subtheory-' + (colorIdx + 1) + '-edge)';
    var lum = _stLuminosity(sub.maturity);
    out = out + '<g data-st-sub-id="' + _arcEscapeXml(p.id) + '" transform="translate(' + _arcR(p.x) + ',' + _arcR(p.y) + ') scale(0.8)">';
    // halo: CSS blur ~9 user units -> ~13 display px inside scale(0.8) at the
    // arcs viewBox-to-CSS ratio. style filter (not an svg <filter>) dodges the
    // shared-defs currentColor/gray-flash trap.
    out = out +   '<circle cx="0" cy="0" r="54" fill="' + colorVar + '" opacity="' + _arcR(lum) + '" style="filter:blur(9px)"/>';
    out = out +   '<g opacity="0.92">';
    out = out +     '<path d="' + mark.body + '" fill="' + colorVar + '" stroke="' + colorVar + '" stroke-width="2"/>';
    out = out +     '<path d="' + mark.body + '" fill="url(#tfa-shine)"/>';
    var j;
    for (j = 0; j < mark.inner.length; j = j + 1) {
      out = out +   '<path d="' + mark.inner[j] + '" stroke="' + edgeVar + '" stroke-opacity="0.62" stroke-width="1.8" fill="none"/>';
    }
    out = out +   '</g>';
    out = out + '</g>';
  }
  return out;
}

// Marginalia marks -- the gathered evidence cloud. GATHERED marks render
// hollow (stroke only) in TEAL (--marginalia-color), echoing the book
// renderer's marginalia, in a deterministic cluster outside the silhouette.
// The INCORPORATED branch (solid + tether back to the shape) is built but
// DORMANT: no evidence carries state:'incorporated' until Stage 10 supplies
// proseAnchors, so it does not execute in 9.6b. Incorporated marks use the
// sub-theory's own --subtheory-N token (self-derived, like the body), so a
// woven mark reads as the shape's color while gathered evidence stays
// neutral teal. Each mark group is tagged with sub id + mark index for the
// Stage 3 click/tooltip layer.
function _stRenderMarks(positions) {
  var out = '';
  var ringR = _ST_SCALE * 0.5 + 14;
  var i, j;
  for (i = 0; i < positions.length; i = i + 1) {
    var p = positions[i];
    var sub = p.sub || {};
    var marks = sub.marks || [];
    if (!marks.length) { continue; }
    var ix = _stIndices(p.id);
    var colorVar = 'var(--subtheory-' + (ix.colorIdx + 1) + ')';
    var clusterCenter = _arcHash(p.id, 300) * Math.PI * 2;
    out = out + '<g data-st-marks-sub-id="' + _arcEscapeXml(p.id) + '">';
    for (j = 0; j < marks.length; j = j + 1) {
      var mark = marks[j] || {};
      var s1 = _arcHash(p.id, 310 + j);
      var s2 = _arcHash(p.id, 360 + j);
      var ang = clusterCenter + (s1 - 0.5) * (Math.PI * 0.9);
      var rr = ringR + (s2 - 0.5) * 8;
      var mx = p.x + Math.cos(ang) * rr;
      var my = p.y + Math.sin(ang) * rr;
      out = out + '<g data-st-mark="1" data-st-sub-id="' + _arcEscapeXml(p.id) + '" data-st-mark-index="' + j + '">';
      if (mark.state === 'incorporated') {
        out = out + '<line x1="' + _arcR(mx) + '" y1="' + _arcR(my) + '" x2="' + _arcR(p.x) + '" y2="' + _arcR(p.y) + '" stroke="' + colorVar + '" stroke-width="0.8" opacity="0.5" stroke-linecap="round"/>';
        out = out + '<circle cx="' + _arcR(mx) + '" cy="' + _arcR(my) + '" r="3.4" fill="' + colorVar + '"/>';
      } else {
        out = out + '<circle cx="' + _arcR(mx) + '" cy="' + _arcR(my) + '" r="3.6" fill="none" stroke="var(--marginalia-color)" stroke-width="1.2" opacity="0.85"/>';
      }
      out = out + '</g>';
    }
    out = out + '</g>';
  }
  return out;
}

// Resonance edges between linked sub-theories. Render path is BUILT but
// DORMANT: arc.edges is empty in 9.5 (one sub-theory exists, no links), so
// nothing draws. Stroke width scales with edge strength, matching the
// thread-width feel of the book renderer.
function _stRenderEdges(edges, posById, showFaint) {
  if (!edges || !edges.length) { return ''; }
  var out = '';
  var i;
  for (i = 0; i < edges.length; i = i + 1) {
    var e = edges[i];
    var pa = posById[e.aId];
    var pb = posById[e.bId];
    if (!pa || !pb) { continue; }
    // Hybrid Stage B: FAINT resonance -- a thin DASHED line, distinct from
    // the solid resonance below. Built-dormant (option A): no edge carries
    // faint:true today (the builder emits only bare resonance), so this
    // branch emits nothing live; it lights up when a future stage supplies
    // faint relationships.
    if (e.faint) {
      if (showFaint === false) { continue; } // Faint links layer hidden
      out = out + '<line data-st-edge-faint="1" data-st-edge-a="' + _arcEscapeXml(e.aId) + '" data-st-edge-b="' + _arcEscapeXml(e.bId) + '" x1="' + _arcR(pa.x) + '" y1="' + _arcR(pa.y) + '" x2="' + _arcR(pb.x) + '" y2="' + _arcR(pb.y) + '" stroke="#966E28" stroke-width="1.3" stroke-dasharray="2 6" opacity="0.4" stroke-linecap="round"/>';
      continue;
    }
    // 9.6c.4: bare resonance links carry NO strength (linkedSubTheories stores
    // plain ids), so they take the SOLID branch -- fixed weight + opacity, tan.
    // The weighted formula is left intact for a future strength-bearing stage.
    var hasStrength = (typeof e.strength === 'number' && isFinite(e.strength) && e.strength > 0);
    var w = hasStrength ? _arcClamp(0.6, e.strength * 0.4, 3) : 1.6;
    var op = hasStrength ? 0.5 : 0.85;
    // 9b-i: resonance reads as a gradient thread (transparent -> amber .7 ->
    // transparent) along its own axis. userSpaceOnUse endpoints = the edge's
    // own pa/pb so the fade tracks the line. _stNextId() keeps the def id
    // unique; the whole svg innerHTML is replaced each render, so old defs are
    // discarded -- no id pileup across re-renders. #966E28 == rgb(150,110,40).
    var edgeGradId = _stNextId();
    out = out + '<linearGradient id="' + edgeGradId + '" gradientUnits="userSpaceOnUse" x1="' + _arcR(pa.x) + '" y1="' + _arcR(pa.y) + '" x2="' + _arcR(pb.x) + '" y2="' + _arcR(pb.y) + '">';
    out = out +   '<stop offset="0%" stop-color="#966E28" stop-opacity="0"/>';
    out = out +   '<stop offset="50%" stop-color="#966E28" stop-opacity="0.7"/>';
    out = out +   '<stop offset="100%" stop-color="#966E28" stop-opacity="0"/>';
    out = out + '</linearGradient>';
    out = out + '<line data-st-edge-a="' + _arcEscapeXml(e.aId) + '" data-st-edge-b="' + _arcEscapeXml(e.bId) + '" x1="' + _arcR(pa.x) + '" y1="' + _arcR(pa.y) + '" x2="' + _arcR(pb.x) + '" y2="' + _arcR(pb.y) + '" stroke="url(#' + edgeGradId + ')" stroke-width="' + _arcR(w) + '" opacity="' + op + '" stroke-linecap="round"/>';
  }
  return out;
}

// Yumi noticing entity -- dashed circle + italic serif label, upper-right.
// The "Quiet today" copy surfaces in the Stage 3 tooltip when yumiNoticing
// is empty (mirrors the book renderer's Yumi tooltip).
function _stRenderYumi(yx, yy) {
  var out = '<g data-st-yumi="1">';
  out = out + '<circle cx="' + _arcR(yx) + '" cy="' + _arcR(yy) + '" r="14" fill="none" stroke="var(--ink, #412402)" stroke-width="1" stroke-dasharray="3 3" opacity="0.7"/>';
  out = out + '<text x="' + _arcR(yx) + '" y="' + _arcR(yy + 28) + '" text-anchor="middle" font-family="\'Cormorant Garamond\', Georgia, serif" font-style="italic" font-size="11" fill="var(--ink-2, #633806)">Yumi</text>';
  out = out + '</g>';
  return out;
}

// Legend -- the sub-theory reading key (NOT the tradition vocabulary).
// gathered/incorporated are a conceptual pair, so when any evidence exists
// BOTH terms show (teaching the hollow/solid contrast before Stage 10
// lights up incorporation). Resonance + Yumi items appear only when
// present, mirroring the book legend's "only what's on screen" principle.
function _stRenderLegend(arc, positions, width, height) {
  // Hybrid Stage C: the full reading grammar. Five keyed entries -- each a
  // small token-colored sample swatch + an italic label -- then a quieter
  // interaction hint. Always shown (it teaches the vocabulary); Yumi stays
  // labeled inline at its own node, not here. Swatch colors reuse the SAME
  // tokens as the live elements (--thread-color for resonance/faint,
  // --marginalia-color for gathered/incorporated, --sunk for book) so the
  // key reads true. The var(--token, #fallback) form matches this file's
  // existing pattern -- no NEW hardcoded color enters.
  var serif = '\'Cormorant Garamond\', Georgia, serif';
  var rowY = height - 30;
  var hintY = height - 12;
  var ink = 'var(--ink-2, #633806)';
  var marg = 'var(--marginalia-color)';
  var thread = 'var(--thread-color)';
  var sy = rowY - 4; // swatch vertical center
  var out = '<g data-st-legend="1">';
  var x = 16;

  // resonance -- solid line
  out = out + '<line x1="' + _arcR(x) + '" y1="' + _arcR(sy) + '" x2="' + _arcR(x + 18) + '" y2="' + _arcR(sy) + '" stroke="' + thread + '" stroke-width="2" stroke-linecap="round"/>';
  out = out + '<text x="' + _arcR(x + 24) + '" y="' + _arcR(rowY) + '" font-family="' + serif + '" font-style="italic" font-size="11" fill="' + ink + '" opacity="0.85">resonance</text>';
  x = x + 86;

  // faint -- dashed line
  out = out + '<line x1="' + _arcR(x) + '" y1="' + _arcR(sy) + '" x2="' + _arcR(x + 18) + '" y2="' + _arcR(sy) + '" stroke="' + thread + '" stroke-width="1" stroke-dasharray="4 4" opacity="0.6" stroke-linecap="round"/>';
  out = out + '<text x="' + _arcR(x + 24) + '" y="' + _arcR(rowY) + '" font-family="' + serif + '" font-style="italic" font-size="11" fill="' + ink + '" opacity="0.85">faint</text>';
  x = x + 64;

  // gathered -- hollow dot
  out = out + '<circle cx="' + _arcR(x + 5) + '" cy="' + _arcR(sy) + '" r="4" fill="none" stroke="' + marg + '" stroke-width="1.2"/>';
  out = out + '<text x="' + _arcR(x + 16) + '" y="' + _arcR(rowY) + '" font-family="' + serif + '" font-style="italic" font-size="11" fill="' + ink + '" opacity="0.85">gathered</text>';
  x = x + 74;

  // incorporated -- filled dot
  out = out + '<circle cx="' + _arcR(x + 5) + '" cy="' + _arcR(sy) + '" r="4" fill="' + marg + '"/>';
  out = out + '<text x="' + _arcR(x + 16) + '" y="' + _arcR(rowY) + '" font-family="' + serif + '" font-style="italic" font-size="11" fill="' + ink + '" opacity="0.85">incorporated</text>';
  x = x + 96;

  // book -- neutral square
  out = out + '<rect x="' + _arcR(x) + '" y="' + _arcR(rowY - 11) + '" width="10" height="10" rx="2" fill="var(--sunk)" stroke="var(--ink-4)" stroke-width="1"/>';
  out = out + '<text x="' + _arcR(x + 16) + '" y="' + _arcR(rowY) + '" font-family="' + serif + '" font-style="italic" font-size="11" fill="' + ink + '" opacity="0.85">book</text>';

  // interaction hint
  out = out + '<text x="16" y="' + _arcR(hintY) + '" font-family="' + serif + '" font-style="italic" font-size="10.5" fill="var(--ink-3, #7a5c34)" opacity="0.72">drag · connect two sub-theories or attach a book · hover for a card</text>';

  out = out + '</g>';
  return out;
}

// Hybrid Stage B: attached books as INERT neutral squares in the field. Each
// book is a small rounded square (neutral --surface-2 fill + muted --ink-4
// outline -- deliberately NOT a --subtheory-N hue, so a book never reads as a
// sub-theory mark). Position is deterministic from the book id (_arcHash) on
// an OUTER ring (0.46) distinct from the mark orbit (0.32), so squares sit in
// the field without overlapping marks. Tagged data-st-book-id only (NO
// data-st-sub-id / data-st-mark), so the drag + connect hit-tests in
// attachSubTheoryDrag skip them; an explicit bail there is the belt-and-
// suspenders inertness guard.
function _stRenderBooks(books, positions, width, height) {
  if (!books || !books.length) { return ''; }
  var cx = width / 2;
  var cy = height / 2;
  // Hybrid Stage C.2: deterministic anti-overlap. Each book starts at its
  // id-hashed angle on an OUTER ellipse (wider than the mark orbit), then if
  // that spot lands within a clearance radius of ANY sub-theory mark (incl.
  // dragged ones) it is rotated in fixed steps around the ellipse until clear
  // -- or, after a full turn, left at its base spot. Pure function of (id,
  // mark positions): stable per id and per arrangement. Fill is --sunk for
  // contrast against the light field; books stay inert.
  var rx = width * 0.46;
  var ry = height * 0.44;
  var sz = 16;
  var clear = _ST_SCALE * 0.5 + sz; // mark radius (~39) + book half + gap
  var marks = positions || [];
  var out = '<g data-st-books="1">';
  var i, j, t;
  for (i = 0; i < books.length; i = i + 1) {
    var b = books[i] || {};
    if (!b.id) { continue; }
    var base = _arcHash(b.id, 700) * Math.PI * 2;
    var bx = cx + Math.cos(base) * rx;
    var by = cy + Math.sin(base) * ry;
    for (t = 0; t < 24; t = t + 1) {
      var ang = base + t * (Math.PI * 2 / 24);
      bx = cx + Math.cos(ang) * rx;
      by = cy + Math.sin(ang) * ry;
      var okay = true;
      for (j = 0; j < marks.length; j = j + 1) {
        var dx = bx - marks[j].x;
        var dy = by - marks[j].y;
        if (dx * dx + dy * dy < clear * clear) { okay = false; break; }
      }
      if (okay) { break; }
    }
    out = out + '<g data-st-book-id="' + _arcEscapeXml(b.id) + '" transform="translate(' + _arcR(bx) + ',' + _arcR(by) + ')">';
    out = out +   '<rect x="' + _arcR(-sz / 2) + '" y="' + _arcR(-sz / 2) + '" width="' + sz + '" height="' + sz + '" rx="3" fill="var(--sunk)" stroke="var(--ink-4)" stroke-width="1.4" opacity="0.95"/>';
    out = out + '</g>';
  }
  out = out + '</g>';
  return out;
}

// ---------------------------------------------------------------------------
// Public entry -- sub-theory constellation.
// ---------------------------------------------------------------------------
function renderSubTheoryConstellation(arc, parentSvgElement, opts) {
  if (!arc || !parentSvgElement) { return; }

  // Stage 9.6b: options arg. showMarginalia (default true) gates the
  // gathered-evidence cloud so the Stage 3 toggle can hide it. Only an
  // explicit false hides it; anything else keeps the cloud visible.
  var options = opts || {};
  var showMarginalia = (options.showMarginalia === false) ? false : true;
  // Hybrid Stage C: Books + Faint links are independent Layers switches
  // (default ON). Resonance is NOT a switch -- it always renders (the spine).
  var showBooks = (options.showBooks === false) ? false : true;
  var showFaint = (options.showFaint === false) ? false : true;
  // B2: showLegend (default ON) gates the whole reading-key legend <g> so the
  // Home embed can suppress it; Arcs keeps the full legend.
  var showLegend = (options.showLegend === false) ? false : true;

  var width = 600;
  var height = 500;
  var vb = parentSvgElement.getAttribute('viewBox');
  if (vb) {
    var parts = vb.split(/\s+/);
    if (parts.length === 4) {
      var w = parseFloat(parts[2]);
      var h = parseFloat(parts[3]);
      if (isFinite(w) && w > 0) { width = w; }
      if (isFinite(h) && h > 0) { height = h; }
    }
  } else if (parentSvgElement.clientWidth && parentSvgElement.clientHeight) {
    width = parentSvgElement.clientWidth;
    height = parentSvgElement.clientHeight;
  }

  var subTheories = (arc.subTheories && arc.subTheories.length) ? arc.subTheories : [];

  var svg = '';
  // Defs: reuse tfa-ground + tfa-innerL (only the tradition-NEUTRAL defs),
  // then add the new st-* grain + halo defs. The unused tfa-t*/tfa-h*
  // tradition defs are emitted inert -- referenced by nothing here.
  svg = svg + getTraditionFormsArcDefs();
  svg = svg + _stGetDefs();
  svg = svg + '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="url(#tfa-stage)"/>';
  svg = svg + _stRenderQuestion(arc.question || '', width, height);

  if (!subTheories.length) {
    svg = svg + _stRenderEmpty(width, height);
    parentSvgElement.innerHTML = svg;
    return;
  }

  var layoutMode = 'radial'; // swappable seam (curved-sweep deferred)
  var positions = _stLayout(layoutMode, subTheories, width, height);
  var posById = {};
  var i;
  for (i = 0; i < positions.length; i = i + 1) {
    posById[positions[i].id] = positions[i];
  }

  var yumiX = width - 30;
  var yumiY = 30;

  svg = svg + _stRenderEdges(arc.edges || [], posById, showFaint); // solid resonance always; faint gated + dormant
  if (showBooks) {
    svg = svg + _stRenderBooks(arc.books || [], positions, width, height); // inert neutral squares (behind marks), nudged clear
  }
  svg = svg + _stRenderShapes(positions);
  if (showMarginalia) {
    svg = svg + _stRenderMarks(positions);
  }
  svg = svg + _stRenderYumi(yumiX, yumiY);
  if (showLegend) {
    svg = svg + _stRenderLegend(arc, positions, width, height);
  }

  parentSvgElement.innerHTML = svg;
}

// ===========================================================================
// Stage 9.6c.2 -- WORKSPACE DRAG LAYER. Pointer-drag a sub-theory mark into
// the user's own arrangement; on drag-end the caller persists the new x/y.
// Re-bound on the freshly-built svg each render (matching
// _stConstellationAttachInteractions -- listeners GC with the discarded svg,
// so no teardown or wired-flag is needed). This function adds NO SVG output:
// the 9.6b.1 render stays byte-for-byte identical and the file stays LF.
//
// Drag vs tap: a press that moves past a small client-px threshold is a
// DRAG (live-translate the mark group, commit x/y on release via
// opts.onCommit). A press below threshold is a TAP -- left to the existing
// click handler in views.js (which navigates to #subtheory/<id>), so tap
// navigation is NOT reimplemented here. After a real drag we swallow the
// synthetic click in the CAPTURE phase so the drag never also navigates;
// the swallow flag is cleared both when it fires AND defensively at the
// next pointerdown, so a drag the browser does not follow with a click can
// never leave the flag stuck and kill the next tap.
//
// setPointerCapture on the grabbed group keeps pointermove/up bound even
// when the pointer leaves the svg; captured events still bubble to the
// svg-level listeners. Reads data-st-sub-id off the shape group (set by
// _stRenderShapes); marginalia mark groups carry data-st-mark and are
// excluded. NO edge-follow this stage (edges arrive in 9.6c.4); a full
// re-render on commit is fine. Desktop pointer/mouse is the 9.6c target;
// touch is a flagged later item.
var _ST_DRAG_THRESHOLD = 4; // client px of movement before a press is a drag

// 9.6c.4 Connect mode. _stConnectArmed is MODULE-level so the armed state
// survives the renderArcDetail re-render a new link triggers (a per-render
// closure would reset to false). It resets on a full reload -- reload never
// comes back armed. _stConnectDisarm holds the CURRENT render's disarm() so
// the once-bound Esc keydown can reach the live svg/button after a re-render.
var _stConnectArmed = false;
var _stConnectDisarm = null;
var _stConnectEscBound = false;

function _stConnectKeydown(evt) {
  if (!_stConnectArmed) { return; }
  if (evt.key === 'Escape' || evt.keyCode === 27) {
    if (_stConnectDisarm) { _stConnectDisarm(); }
  }
}

function attachSubTheoryDrag(svg, opts) {
  if (!svg) { return; }
  var options = opts || {};
  var onCommit = (typeof options.onCommit === 'function') ? options.onCommit : null;

  var drag = null;     // active drag state, or null between presses
  var didDrag = false; // true after a real drag; gates the click swallow

  // 9.6c.3 hover card: shares this function's per-render scope so it can read
  // the drag flag above (suppress the card mid-drag) and re-binds on the
  // fresh svg like the drag layer. arc (the data contract, passed by views.js)
  // supplies header/maturity/marks per sub-theory id; container is the
  // position:relative web-view wrapper the card overlays.
  var arc = options.arc || null;
  var container = svg.parentNode;
  var isTouch = (typeof matchMedia === 'function')
    && matchMedia('(hover: none) and (pointer: coarse)').matches;
  var subById = {};
  var sbI;
  if (arc && arc.subTheories) {
    for (sbI = 0; sbI < arc.subTheories.length; sbI = sbI + 1) {
      subById[arc.subTheories[sbI].id] = arc.subTheories[sbI];
    }
  }
  var card = null; // lazily-created hover card; one at a time per render

  function svgPoint(evt) {
    var ctm = svg.getScreenCTM();
    if (!ctm) { return null; }
    var pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(ctm.inverse());
  }

  function parseTranslate(g) {
    var t = g.getAttribute('transform') || '';
    var m = t.match(/translate\(\s*(-?[0-9.]+)[ ,]+(-?[0-9.]+)\s*\)/);
    if (!m) { return { x: 0, y: 0 }; }
    return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
  }

  function onPointerDown(evt) {
    // Clear any stale swallow flag from a prior drag whose click never
    // fired, so this press's own click is never wrongly swallowed.
    didDrag = false;
    if (_stConnectArmed) { return; } // armed: clicks select/connect, no drag
    if (typeof evt.button === 'number' && evt.button !== 0) { return; }
    // Hybrid Stage B: book squares are INERT -- a press on a book never starts
    // a drag (mirrors the data-st-mark exclusion below; books carry only
    // data-st-book-id).
    if (evt.target && evt.target.closest && evt.target.closest('[data-st-book-id]')) { return; }
    var g = evt.target && evt.target.closest
      ? evt.target.closest('[data-st-sub-id]')
      : null;
    if (!g || g.getAttribute('data-st-mark')) { return; } // shape groups only
    var id = g.getAttribute('data-st-sub-id');
    if (!id) { return; }
    hideCard(); // a press may become a drag -- never leave a card up under it
    var start = svgPoint(evt);
    if (!start) { return; }
    var origin = parseTranslate(g);
    drag = {
      id: id,
      g: g,
      pointerId: evt.pointerId,
      startClientX: evt.clientX,
      startClientY: evt.clientY,
      startUserX: start.x,
      startUserY: start.y,
      originX: origin.x,
      originY: origin.y,
      curX: origin.x,
      curY: origin.y,
      moved: false
    };
    if (g.setPointerCapture) {
      try { g.setPointerCapture(evt.pointerId); } catch (e) {}
    }
  }

  function onPointerMove(evt) {
    if (!drag || evt.pointerId !== drag.pointerId) { return; }
    if (!drag.moved) {
      var dxc = evt.clientX - drag.startClientX;
      var dyc = evt.clientY - drag.startClientY;
      if (dxc * dxc + dyc * dyc < _ST_DRAG_THRESHOLD * _ST_DRAG_THRESHOLD) {
        return; // still within tap tolerance
      }
      drag.moved = true;
    }
    var p = svgPoint(evt);
    if (!p) { return; }
    drag.curX = drag.originX + (p.x - drag.startUserX);
    drag.curY = drag.originY + (p.y - drag.startUserY);
    drag.g.setAttribute('transform',
      'translate(' + _arcR(drag.curX) + ',' + _arcR(drag.curY) + ')');
  }

  function onPointerUp(evt) {
    if (!drag || evt.pointerId !== drag.pointerId) { return; }
    var wasMoved = drag.moved;
    var id = drag.id;
    var fx = drag.curX;
    var fy = drag.curY;
    if (drag.g.releasePointerCapture) {
      try { drag.g.releasePointerCapture(drag.pointerId); } catch (e) {}
    }
    drag = null;
    if (wasMoved) {
      didDrag = true; // swallow the click this drag is about to emit
      if (onCommit) { onCommit(id, fx, fy); }
    }
    // Below threshold: a tap -- leave navigation to the existing click
    // handler; didDrag stays false so that click passes through.
  }

  function onClickCapture(evt) {
    if (_stConnectArmed) {
      // Pre-empt BOTH the nav click (views bindShapeClick) and the mark-
      // tooltip click (views bindMarkClick): they bubble, this fires in the
      // capture phase first, so stopping it here keeps them from running.
      evt.stopPropagation();
      evt.preventDefault();
      handleConnectClick(evt);
      return;
    }
    if (didDrag) {
      didDrag = false;
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  // ---- 9.6c.3 hover card ----
  // A press-band maturity word; luminosity-style read, no numbers.
  function maturityRead(m) {
    var v = (typeof m === 'number' && isFinite(m)) ? m : 0;
    if (v < 0.25) { return 'Nascent'; }
    if (v < 0.5) { return 'Forming'; }
    if (v < 0.75) { return 'Developing'; }
    return 'Mature';
  }

  // Count only state:'gathered' marks (incorporated is dormant today, but
  // this stays correct when Stage 10 lights it up).
  function gatheredCount(sub) {
    var marks = (sub && sub.marks) ? sub.marks : [];
    var n = 0, gi;
    for (gi = 0; gi < marks.length; gi = gi + 1) {
      if (marks[gi] && marks[gi].state === 'gathered') { n = n + 1; }
    }
    return n;
  }

  function ensureCard() {
    if (card) { return card; }
    if (!container) { return null; }
    card = document.createElement('div');
    card.className = 'st-hover-card';
    container.appendChild(card);
    return card;
  }

  // textContent only -- header is user-entered (an XSS surface); never
  // innerHTML with sub-theory data.
  function fillCard(el, sub) {
    el.textContent = '';
    var title = document.createElement('div');
    title.className = 'st-hover-card-title';
    title.textContent = (sub.header && sub.header.length) ? sub.header : 'Untitled sub-theory';
    el.appendChild(title);
    var meta = document.createElement('div');
    meta.className = 'st-hover-card-meta';
    meta.textContent = maturityRead(sub.maturity) + '  ·  ' + gatheredCount(sub) + ' gathered';
    el.appendChild(meta);
    var aff = document.createElement('div');
    aff.className = 'st-hover-card-affordance';
    aff.textContent = 'tap to open';
    el.appendChild(aff);
  }

  // Anchor above the mark, centered; flip below and clamp to the container
  // so the card never clips off-screen.
  function positionCard(el, markEl) {
    if (!container) { return; }
    var crect = container.getBoundingClientRect();
    var mrect = markEl.getBoundingClientRect();
    var cw = el.offsetWidth;
    var ch = el.offsetHeight;
    var x = (mrect.left - crect.left) + mrect.width / 2 - cw / 2;
    var y = (mrect.top - crect.top) - ch - 10;
    if (y < 0) { y = (mrect.bottom - crect.top) + 10; }
    if (x < 0) { x = 0; }
    if (x + cw > container.clientWidth) { x = container.clientWidth - cw; }
    if (x < 0) { x = 0; }
    if (y + ch > container.clientHeight) { y = container.clientHeight - ch; }
    if (y < 0) { y = 0; }
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function showCard(sub, markEl) {
    var el = ensureCard();
    if (!el) { return; }
    fillCard(el, sub);
    el.classList.add('st-hover-card--visible');
    positionCard(el, markEl); // measure after fill + show
  }

  function hideCard() {
    if (card) { card.classList.remove('st-hover-card--visible'); }
  }

  function onShapeEnter(evt) {
    if (drag || _stConnectArmed) { return; } // never mid-drag or while arming
    var g = evt.currentTarget;
    var sub = subById[g.getAttribute('data-st-sub-id')];
    if (!sub) { return; }
    showCard(sub, g);
  }

  function onShapeLeave() {
    hideCard();
  }

  // Per-shape hover binding (mouseenter/leave don't bubble, so no
  // delegation). Desktop only: touch has no hover and tap already navigates.
  if (!isTouch) {
    var shapeEls = svg.querySelectorAll('[data-st-sub-id]:not([data-st-mark])');
    var hi;
    for (hi = 0; hi < shapeEls.length; hi = hi + 1) {
      shapeEls[hi].addEventListener('mouseenter', onShapeEnter);
      shapeEls[hi].addEventListener('mouseleave', onShapeLeave);
    }
  }

  // ---- 9.6c.4 Connect mode ----
  // Selection highlight is runtime-only (a class on the shape <g>, styled with
  // a tan drop-shadow), so the render emit for shapes/marks stays byte-
  // identical. One mark selected at a time per render.
  var selectedId = null;
  var selectedG = null;

  function clearSelection() {
    if (selectedG) { selectedG.removeAttribute('class'); }
    selectedId = null;
    selectedG = null;
  }

  function applySelection(id, g) {
    clearSelection();
    selectedId = id;
    selectedG = g;
    if (g) { g.setAttribute('class', 'st-shape--connect-selected'); }
  }

  // Reflect armed state on the live chrome: the Connect button highlights and
  // the canvas gets a crosshair "pick two" affordance. Called on arm/disarm
  // AND on attach, so a re-render that lands while still armed re-applies it.
  function updateArmedChrome() {
    if (options.connectBtn) {
      if (_stConnectArmed) { options.connectBtn.classList.add('is-connecting'); }
      else { options.connectBtn.classList.remove('is-connecting'); }
    }
    if (_stConnectArmed) { svg.setAttribute('class', 'st-canvas--connecting'); }
    else { svg.removeAttribute('class'); }
  }

  function arm() {
    _stConnectArmed = true;
    clearSelection();
    updateArmedChrome();
  }

  function disarm() {
    _stConnectArmed = false;
    clearSelection();
    updateArmedChrome();
  }

  function onConnectBtn() {
    if (_stConnectArmed) { disarm(); } else { arm(); }
  }

  // A click while armed: pick A, then a DIFFERENT B links them. Clicking the
  // same mark again, or empty canvas / a marginalia mark (no shape target),
  // cancels via disarm(). Stays armed after a real link so connections chain.
  function handleConnectClick(evt) {
    // Hybrid Stage B: book squares are INERT -- never connectable. A book
    // click is a no-op (stays armed), mirroring the data-st-mark exclusion.
    if (evt.target && evt.target.closest && evt.target.closest('[data-st-book-id]')) { return; }
    var g = (evt.target && evt.target.closest)
      ? evt.target.closest('[data-st-sub-id]:not([data-st-mark])')
      : null;
    if (!g) { disarm(); return; }
    var id = g.getAttribute('data-st-sub-id');
    if (!id) { disarm(); return; }
    if (!selectedId) { applySelection(id, g); return; }
    if (id === selectedId) { disarm(); return; }
    var aId = selectedId;
    clearSelection();
    // onLink only re-renders on a REAL new link (linkSubTheories true). On a
    // no-op (already linked / invalid) it does nothing -- selection is already
    // cleared here, we stay armed, no duplicate edge, no needless re-render.
    if (options.onLink) { options.onLink(aId, id); }
  }

  svg.addEventListener('pointerdown', onPointerDown);
  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerUp);
  svg.addEventListener('click', onClickCapture, true); // capture: pre-empt group click

  if (options.connectBtn) {
    options.connectBtn.addEventListener('click', onConnectBtn);
  }

  // Point the module handles at THIS render, then re-apply armed chrome (a
  // link-triggered re-render lands here with _stConnectArmed still true).
  _stConnectDisarm = disarm;
  updateArmedChrome();

  // Esc cancels. Bound ONCE on document (module guard) so re-renders never
  // stack duplicate listeners; it routes through the current render's disarm.
  if (!_stConnectEscBound) {
    _stConnectEscBound = true;
    document.addEventListener('keydown', _stConnectKeydown);
  }

  return;
}

if (typeof window !== 'undefined') {
  window.renderSubTheoryConstellation = renderSubTheoryConstellation;
  window.attachSubTheoryDrag = attachSubTheoryDrag;
  // Chrome-fidelity Stage 2: a thin id->color accessor so the ⌘K spotlight can
  // tint a sub-theory's result chip with the SAME hue as its constellation
  // mark. Single source -- reuses _stIdentity/_stIndices (no hash duplication).
  // 9b-ii: override-aware. The spotlight calls this with only an id (no sub
  // data object), so -- outside the data-driven render path -- it reads a
  // per-sub markColor override straight from window.state, falling back to the
  // id-hash color. Fully guarded: any miss / bad value yields the hash color,
  // and it never throws.
  window.stColorForId = function(id) {
    if (window.state && window.state.subTheories) {
      var rec = window.state.subTheories[id];
      if (rec && typeof rec.markColor === 'number' &&
          rec.markColor >= 0 && rec.markColor <= 15) {
        return 'var(--subtheory-' + (rec.markColor + 1) + ')';
      }
    }
    return _stIdentity(id).color;
  };
}

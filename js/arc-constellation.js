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

// Fixed identity vocabulary. shapeKey[i] is permanently paired with
// palette[i] (6 fixed pairings, not 36 combos) -- _stIdentity hashes the
// sub-theory id to ONE slot index, giving shape+color together. No dedup
// within an arc: identity stability beats guaranteed distinctness, so
// adding/removing a sub-theory never shifts another one's appearance.
var _ST_SHAPES = ['disc', 'lozenge', 'petal', 'squircle', 'drop', 'bloom'];
var _ST_PALETTE = ['#7A6E5D', '#6E7468', '#8A7A6A', '#6B6F78', '#80726A', '#75695C'];
var _ST_SCALE = 64; // identity-shape baseline diameter (px), echoing book scale 60

// Unique clip-path id counter, mirroring _tfaNextId -- clip ids must be
// document-unique so two constellations on one page can't collide.
var _stCounter = 0;
function _stNextId() {
  _stCounter = _stCounter + 1;
  return 'st-clip-' + _stCounter;
}

// Deterministic identity: hash the sub-theory id to a single slot index,
// then read shape + color from that one slot (the fixed pairing). Stable
// per id across renders/sessions, matching the book layout's determinism.
function _stIdentity(id) {
  var i = Math.floor(_arcHash(id, 7) * _ST_SHAPES.length);
  if (i < 0) { i = 0; }
  if (i >= _ST_SHAPES.length) { i = _ST_SHAPES.length - 1; }
  return { index: i, shapeKey: _ST_SHAPES[i], color: _ST_PALETTE[i] };
}

// New st-* defs. Echoes the tradition grain/halo technique with a
// tradition-NEUTRAL vocabulary: one color-agnostic grain overlay (faint
// dark contour strokes on a transparent tile, layered over the solid
// identity color) and one halo gradient per palette slot (the identity
// color fading out). tfa-ground + tfa-innerL are reused from
// getTraditionFormsArcDefs(), NOT redefined here.
function _stGetDefs() {
  var s = '<defs>';
  s = s + '<pattern id="st-grain" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">';
  s = s +   '<path d="M0 5 Q9 3 18 5 M0 11 Q9 9 18 11 M0 16 Q9 14 18 16" stroke="#2A2018" stroke-width="0.6" fill="none" opacity="0.18"/>';
  s = s + '</pattern>';
  var i;
  for (i = 0; i < _ST_PALETTE.length; i = i + 1) {
    var c = _ST_PALETTE[i];
    s = s + '<radialGradient id="st-halo-' + i + '" cx="50%" cy="50%" r="50%">';
    s = s +   '<stop offset="55%" stop-color="' + c + '" stop-opacity="0"/>';
    s = s +   '<stop offset="80%" stop-color="' + c + '" stop-opacity="0.55"/>';
    s = s +   '<stop offset="100%" stop-color="' + c + '" stop-opacity="0"/>';
    s = s + '</radialGradient>';
  }
  s = s + '</defs>';
  return s;
}

// Per-shape silhouette geometry. Takes the unit scale factor u (= scale /
// 120, matching _tfaGeometry's convention) and returns ONE self-closing
// SVG element string with no fill -- the caller injects fill (for the
// halo) or uses it as a clipPath child (for the body). Centered on origin
// so the same generator at a larger u produces the halo silhouette.
function _stShapeGeometry(shapeKey, u) {
  var R = _arcR;
  if (shapeKey === 'lozenge') {
    return '<rect x="' + R(-58 * u) + '" y="' + R(-28 * u) + '" width="' + R(116 * u) + '" height="' + R(56 * u) + '" rx="' + R(28 * u) + '" ry="' + R(28 * u) + '"/>';
  }
  if (shapeKey === 'petal') {
    var px = 50 * u;
    var py = 46 * u;
    return '<path d="M' + R(-px) + ' 0 Q0 ' + R(-py) + ' ' + R(px) + ' 0 Q0 ' + R(py) + ' ' + R(-px) + ' 0 Z"/>';
  }
  if (shapeKey === 'squircle') {
    return '<rect x="' + R(-46 * u) + '" y="' + R(-46 * u) + '" width="' + R(92 * u) + '" height="' + R(92 * u) + '" rx="' + R(26 * u) + '" ry="' + R(26 * u) + '"/>';
  }
  if (shapeKey === 'drop') {
    return '<path d="M0 ' + R(-56 * u) + ' C ' + R(36 * u) + ' ' + R(-28 * u) + ' ' + R(46 * u) + ' ' + R(30 * u) + ' 0 ' + R(52 * u) + ' C ' + R(-46 * u) + ' ' + R(30 * u) + ' ' + R(-36 * u) + ' ' + R(-28 * u) + ' 0 ' + R(-56 * u) + ' Z"/>';
  }
  if (shapeKey === 'bloom') {
    var lobes = 5;
    var outer = 54 * u;
    var inner = 24 * u;
    var k, ang, mang, nang, ox, oy, mx, my, nx, ny;
    var d = '';
    for (k = 0; k < lobes; k = k + 1) {
      ang = (k / lobes) * Math.PI * 2 - Math.PI / 2;
      ox = Math.cos(ang) * outer;
      oy = Math.sin(ang) * outer;
      if (k === 0) { d = 'M' + R(ox) + ' ' + R(oy); }
      mang = ((k + 0.5) / lobes) * Math.PI * 2 - Math.PI / 2;
      mx = Math.cos(mang) * inner;
      my = Math.sin(mang) * inner;
      nang = ((k + 1) / lobes) * Math.PI * 2 - Math.PI / 2;
      nx = Math.cos(nang) * outer;
      ny = Math.sin(nang) * outer;
      d = d + ' Q' + R(mx) + ' ' + R(my) + ' ' + R(nx) + ' ' + R(ny);
    }
    d = d + ' Z';
    return '<path d="' + d + '"/>';
  }
  // default + 'disc'
  return '<circle cx="0" cy="0" r="' + R(52 * u) + '"/>';
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
  return _arcR(0.35 + m * 0.65);
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
  var i, theta;
  for (i = 0; i < n; i = i + 1) {
    if (n === 1) {
      theta = -Math.PI / 2;
    } else {
      theta = (i / n) * Math.PI * 2 - Math.PI / 2;
    }
    positions.push({
      id:  subs[i].id,
      x:   cx + Math.cos(theta) * orbit,
      y:   cy + Math.sin(theta) * orbit,
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
  var cy = height / 2;
  var glowR = Math.min(width, height) * 0.35;
  var out = '';
  out = out + '<circle cx="' + _arcR(cx) + '" cy="' + _arcR(cy) + '" r="' + _arcR(glowR) + '" fill="var(--arc-question-glow)" opacity="0.08"/>';
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

// Identity shapes. Each sub-theory: a luminosity-scaled halo, a solid
// identity-color body (grain overlay) clipped to the silhouette, and a
// bright inner-light ellipse. shapeKey/color come from the contract, with
// _stIdentity as the deterministic fallback so the renderer is correct
// even if the builder omitted them.
function _stRenderShapes(positions) {
  var out = '';
  var u = _ST_SCALE / 120;
  var i;
  for (i = 0; i < positions.length; i = i + 1) {
    var p = positions[i];
    var sub = p.sub || {};
    var ident = _stIdentity(p.id);
    var shapeKey = sub.shapeKey || ident.shapeKey;
    var color = sub.color || ident.color;
    var haloIndex = _ST_PALETTE.indexOf(color);
    if (haloIndex < 0) { haloIndex = ident.index; }
    var lum = _stLuminosity(sub.maturity);
    var clipId = _stNextId();
    var sil = _stShapeGeometry(shapeKey, u);
    var haloShape = _stShapeGeometry(shapeKey, u * 1.2)
      .replace('/>', ' fill="url(#st-halo-' + haloIndex + ')"/>');
    out = out + '<g data-st-sub-id="' + _arcEscapeXml(p.id) + '" transform="translate(' + _arcR(p.x) + ',' + _arcR(p.y) + ')">';
    out = out +   '<g opacity="' + _arcR(lum) + '">' + haloShape + '</g>';
    out = out +   '<clipPath id="' + clipId + '">' + sil + '</clipPath>';
    out = out +   '<g clip-path="url(#' + clipId + ')" opacity="' + _arcR(lum) + '">';
    out = out +     '<rect x="' + _arcR(-70 * u) + '" y="' + _arcR(-70 * u) + '" width="' + _arcR(140 * u) + '" height="' + _arcR(140 * u) + '" fill="' + color + '"/>';
    out = out +     '<rect x="' + _arcR(-70 * u) + '" y="' + _arcR(-70 * u) + '" width="' + _arcR(140 * u) + '" height="' + _arcR(140 * u) + '" fill="url(#st-grain)"/>';
    out = out +   '</g>';
    out = out +   '<ellipse cx="0" cy="' + _arcR(-4 * u) + '" rx="' + _arcR(13 * u) + '" ry="' + _arcR(11 * u) + '" fill="url(#tfa-innerL)" opacity="' + _arcR(lum) + '"/>';
    out = out + '</g>';
  }
  return out;
}

// Marginalia marks -- the gathered evidence cloud. GATHERED marks render
// hollow (stroke only) in a deterministic cluster outside the silhouette.
// The INCORPORATED branch (solid + tether back to the shape) is built but
// DORMANT: no evidence carries state:'incorporated' until Stage 10 supplies
// proseAnchors, so it does not execute in 9.5. Each mark group is tagged
// with sub id + mark index for the Stage 3 click/tooltip layer.
function _stRenderMarks(positions) {
  var out = '';
  var ringR = _ST_SCALE * 0.5 + 14;
  var i, j;
  for (i = 0; i < positions.length; i = i + 1) {
    var p = positions[i];
    var sub = p.sub || {};
    var marks = sub.marks || [];
    if (!marks.length) { continue; }
    var ident = _stIdentity(p.id);
    var color = sub.color || ident.color;
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
        out = out + '<line x1="' + _arcR(mx) + '" y1="' + _arcR(my) + '" x2="' + _arcR(p.x) + '" y2="' + _arcR(p.y) + '" stroke="' + color + '" stroke-width="0.8" opacity="0.5" stroke-linecap="round"/>';
        out = out + '<circle cx="' + _arcR(mx) + '" cy="' + _arcR(my) + '" r="3.4" fill="' + color + '"/>';
      } else {
        out = out + '<circle cx="' + _arcR(mx) + '" cy="' + _arcR(my) + '" r="3.6" fill="none" stroke="' + color + '" stroke-width="1.2" opacity="0.85"/>';
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
function _stRenderEdges(edges, posById) {
  if (!edges || !edges.length) { return ''; }
  var out = '';
  var i;
  for (i = 0; i < edges.length; i = i + 1) {
    var e = edges[i];
    var pa = posById[e.aId];
    var pb = posById[e.bId];
    if (!pa || !pb) { continue; }
    var strength = (typeof e.strength === 'number' && isFinite(e.strength)) ? e.strength : 0;
    var w = _arcClamp(0.6, strength * 0.4, 3);
    out = out + '<line data-st-edge-a="' + _arcEscapeXml(e.aId) + '" data-st-edge-b="' + _arcEscapeXml(e.bId) + '" x1="' + _arcR(pa.x) + '" y1="' + _arcR(pa.y) + '" x2="' + _arcR(pb.x) + '" y2="' + _arcR(pb.y) + '" stroke="var(--thread-color)" stroke-width="' + _arcR(w) + '" opacity="0.5" stroke-linecap="round"/>';
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
  var hasMarks = false;
  var i, j, sub, marks;
  for (i = 0; i < positions.length; i = i + 1) {
    sub = positions[i].sub || {};
    marks = sub.marks || [];
    if (marks.length) { hasMarks = true; break; }
  }
  var hasEdges = !!(arc.edges && arc.edges.length);
  var hasYumi = !!(arc.yumiNoticing && arc.yumiNoticing.length);
  var parts = [];
  if (hasMarks) {
    parts.push('hollow ring · gathered evidence');
    parts.push('solid mark · woven into the writing');
  }
  if (hasEdges) { parts.push('line · resonance between sub-theories'); }
  if (hasYumi)  { parts.push('dashed circle · Yumi noticing'); }
  if (!parts.length) { return ''; }

  var lines = [];
  if (parts.length <= 2) {
    lines.push(parts.join('     '));
  } else {
    var split = Math.ceil(parts.length / 2);
    var l1 = [];
    var l2 = [];
    for (i = 0; i < parts.length; i = i + 1) {
      if (i < split) { l1.push(parts[i]); } else { l2.push(parts[i]); }
    }
    lines.push(l1.join('     '));
    lines.push(l2.join('     '));
  }

  var out = '';
  var lineHeight = 14;
  var baseY = height - 12 - (lines.length - 1) * lineHeight;
  for (i = 0; i < lines.length; i = i + 1) {
    out = out + '<text x="16" y="' + _arcR(baseY + i * lineHeight) + '" font-family="\'Cormorant Garamond\', Georgia, serif" font-style="italic" font-size="11" fill="var(--ink-2, #633806)" opacity="0.8">' + _arcEscapeXml(lines[i]) + '</text>';
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public entry -- sub-theory constellation.
// ---------------------------------------------------------------------------
function renderSubTheoryConstellation(arc, parentSvgElement) {
  if (!arc || !parentSvgElement) { return; }

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
  svg = svg + '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="url(#tfa-ground)"/>';
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

  svg = svg + _stRenderEdges(arc.edges || [], posById); // dormant (empty)
  svg = svg + _stRenderShapes(positions);
  svg = svg + _stRenderMarks(positions);
  svg = svg + _stRenderYumi(yumiX, yumiY);
  svg = svg + _stRenderLegend(arc, positions, width, height);

  parentSvgElement.innerHTML = svg;
}

if (typeof window !== 'undefined') {
  window.renderSubTheoryConstellation = renderSubTheoryConstellation;
}

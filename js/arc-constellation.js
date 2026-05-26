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
  out = out + '<text x="' + _arcR(cx) + '" y="' + _arcR(cy) + '" text-anchor="middle" dominant-baseline="middle" font-family="\'Cormorant Garamond\', Georgia, serif" font-style="italic" font-size="' + fs + '" fill="var(--ink-2)" opacity="0.78">' + _arcEscapeXml(question) + '</text>';
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
    var wA, wB;
    if (moreId === t.bookAId) {
      wA = w + 0.4;
      wB = w;
    } else {
      wA = w;
      wB = w + 0.4;
    }
    out = out
      + '<line x1="' + _arcR(pa.x) + '" y1="' + _arcR(pa.y)
      + '" x2="' + _arcR(mx) + '" y2="' + _arcR(my)
      + '" stroke="var(--thread-color)" stroke-width="' + _arcR(wA)
      + '" opacity="' + _arcR(op) + '" stroke-linecap="round"' + dash + '/>';
    out = out
      + '<line x1="' + _arcR(mx) + '" y1="' + _arcR(my)
      + '" x2="' + _arcR(pb.x) + '" y2="' + _arcR(pb.y)
      + '" stroke="var(--thread-color)" stroke-width="' + _arcR(wB)
      + '" opacity="' + _arcR(op) + '" stroke-linecap="round"' + dash + '/>';
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
    out = out + '<g transform="translate(' + _arcR(p.x) + ',' + _arcR(p.y) + ')">' + form + '</g>';
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
  }
  return out;
}

// Yumi cluster -- dashed circle + italic serif label, upper-right.
function _arcRenderYumiCluster(yx, yy) {
  var out = '';
  out = out
    + '<circle cx="' + _arcR(yx) + '" cy="' + _arcR(yy) + '" r="14"'
    + ' fill="none" stroke="var(--ink, #412402)" stroke-width="1"'
    + ' stroke-dasharray="3 3" opacity="0.7"/>';
  out = out
    + '<text x="' + _arcR(yx) + '" y="' + _arcR(yy + 28)
    + '" text-anchor="middle" font-family="\'Cormorant Garamond\', Georgia, serif"'
    + ' font-style="italic" font-size="11" fill="var(--ink-2, #633806)">Yumi</text>';
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
  if (hasMarginalia) { parts.push('green dot · a note'); }
  if (hasRosette) { parts.push('three-dot rosette · five or more notes'); }
  if (hasThreads) { parts.push('green line · thread between books'); }
  if (hasSpeculative) { parts.push('dashed thread · speculative'); }
  if (hasYumi) { parts.push('faint dashes from upper-right · Yumi is noticing'); }
  if (!parts.length) { return ''; }
  var legend = parts.join('     ');
  return '<text x="16" y="' + _arcR(height - 14)
    + '" font-family="\'Cormorant Garamond\', Georgia, serif"'
    + ' font-style="italic" font-size="11"'
    + ' fill="var(--ink-2, #633806)" opacity="0.8">' + _arcEscapeXml(legend) + '</text>';
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

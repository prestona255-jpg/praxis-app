// Arc-scale tradition form renderer.
// Round 11 visual treatment, parametric on scale (diameter in px).
// Reference: docs/knowledge-arcs/round_11_brighter.svg
// Spec: docs/knowledge-arcs/PRAXIS_ARC_CONSTELLATION.md
//
// Two public entry points:
//   renderTraditionFormArc(tradition, band, scale) -> SVG <g> string
//   getTraditionFormsArcDefs()                     -> SVG <defs> string
//
// All defs IDs are prefixed "tfa-" to avoid collision with existing
// shelf-glyph defs in views.js.

// ---------------------------------------------------------------------------
// Unique clip-path id counter (clip paths inline per call, since silhouette
// dimensions depend on the per-call scale parameter).
// ---------------------------------------------------------------------------
var _tfaCounter = 0;
function _tfaNextId() {
  _tfaCounter = _tfaCounter + 1;
  return 'tfa-clip-' + _tfaCounter;
}

// Rounded-number helper -- avoids 0.30000000000000004-style noise in output.
function _tfaR(x) {
  return Math.round(x * 100) / 100;
}

// ---------------------------------------------------------------------------
// Per-tradition base color (used at 35% opacity for Band 0).
// ---------------------------------------------------------------------------
var _tfaBase = {
  theory:    '#D67248',
  wisdom:    '#F0C82A',
  empirical: '#F0A075',
  history:   '#C8842A',
  memoir:    '#9AAA48',
  novel:     '#E07A98',
  poetry:    '#4858B8',
  place:     '#5FB082',
  practice:  '#8A5A38'
};

// Numeric suffix per tradition, matches the t1b/h1b naming in the ref SVG.
var _tfaNum = {
  theory: 1, wisdom: 2, empirical: 3, history: 4, memoir: 5,
  novel: 6, poetry: 7, place: 8, practice: 9
};

// ---------------------------------------------------------------------------
// getTraditionFormsArcDefs -- patterns, halo gradients, inner-light gradient,
// and the wheat-ground pattern. Inject ONCE per parent SVG (typically inside
// the parent <svg>'s first <defs>).
// ---------------------------------------------------------------------------
function getTraditionFormsArcDefs() {
  var s = '<defs>';

  // Wheat ground (for constellation container background).
  s = s + '<pattern id="tfa-ground" x="0" y="0" width="55" height="55" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="55" height="55" fill="#FAEEDA"/>';
  s = s +   '<path d="M5 8 L7 6 M15 22 L17 20 M28 12 L30 10 M35 30 L37 28 M10 35 L12 33 M22 5 L24 3 M3 25 L5 23 M32 38 L34 36 M42 18 L44 16 M45 42 L47 40 M50 8 L52 6" stroke="#854F0B" stroke-width="0.5" stroke-opacity="0.22" stroke-linecap="round"/>';
  s = s +   '<circle cx="18" cy="14" r="0.6" fill="#BA7517" fill-opacity="0.28"/>';
  s = s +   '<circle cx="33" cy="22" r="0.5" fill="#BA7517" fill-opacity="0.25"/>';
  s = s +   '<circle cx="8" cy="30" r="0.6" fill="#BA7517" fill-opacity="0.28"/>';
  s = s +   '<circle cx="25" cy="34" r="0.5" fill="#BA7517" fill-opacity="0.22"/>';
  s = s +   '<circle cx="42" cy="42" r="0.5" fill="#BA7517" fill-opacity="0.25"/>';
  s = s + '</pattern>';

  // Theory -- terracotta.
  s = s + '<pattern id="tfa-t1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="20" height="20" fill="#D67248"/>';
  s = s +   '<path d="M0 5 Q10 3 20 5 M0 10 Q10 8 20 10 M0 15 Q10 13 20 15" stroke="#7A3A18" stroke-width="0.7" fill="none" opacity="0.65"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h1" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#F0A88A" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#F0A88A" stop-opacity="0.7"/>';
  s = s +   '<stop offset="100%" stop-color="#D67248" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // Wisdom -- sunflower yellow.
  s = s + '<pattern id="tfa-t2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="20" height="20" fill="#F0C82A"/>';
  s = s +   '<path d="M0 5 Q10 3 20 5 M0 10 Q10 8 20 10 M0 15 Q10 13 20 15" stroke="#8A6F0A" stroke-width="0.7" fill="none" opacity="0.6"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h2" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#F8E078" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#F8E078" stop-opacity="0.75"/>';
  s = s +   '<stop offset="100%" stop-color="#F0C82A" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // Empirical -- peach.
  s = s + '<pattern id="tfa-t3" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="20" height="20" fill="#F0A075"/>';
  s = s +   '<path d="M0 5 Q10 3 20 5 M0 10 Q10 8 20 10 M0 15 Q10 13 20 15" stroke="#8A4825" stroke-width="0.7" fill="none" opacity="0.6"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h3" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#F8C8AA" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#F8C8AA" stop-opacity="0.75"/>';
  s = s +   '<stop offset="100%" stop-color="#F0A075" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // History -- bronze.
  s = s + '<pattern id="tfa-t4" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="20" height="20" fill="#C8842A"/>';
  s = s +   '<path d="M0 5 Q10 3 20 5 M0 10 Q10 8 20 10 M0 15 Q10 13 20 15" stroke="#6A3F08" stroke-width="0.7" fill="none" opacity="0.65"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h4" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#E8B068" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#E8B068" stop-opacity="0.7"/>';
  s = s +   '<stop offset="100%" stop-color="#C8842A" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // Memoir -- olive. Note: tile is 22x22 in the reference, kept here.
  s = s + '<pattern id="tfa-t5" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="22" height="22" fill="#9AAA48"/>';
  s = s +   '<path d="M0 5 Q11 2 22 5 M0 11 Q11 8 22 11 M0 17 Q11 14 22 17" stroke="#5A6520" stroke-width="0.7" fill="none" opacity="0.65"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h5" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#C5D080" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#C5D080" stop-opacity="0.65"/>';
  s = s +   '<stop offset="100%" stop-color="#9AAA48" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // Novel -- rose pink.
  s = s + '<pattern id="tfa-t6" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="20" height="20" fill="#E07A98"/>';
  s = s +   '<path d="M0 5 Q10 3 20 5 M0 10 Q10 8 20 10 M0 15 Q10 13 20 15" stroke="#8A3258" stroke-width="0.7" fill="none" opacity="0.6"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h6" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#F5BACE" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#F5BACE" stop-opacity="0.75"/>';
  s = s +   '<stop offset="100%" stop-color="#E07A98" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // Poetry -- cobalt. Pattern uses cream-dot stipple instead of contour lines.
  s = s + '<pattern id="tfa-t7" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="20" height="20" fill="#4858B8"/>';
  s = s +   '<circle cx="5" cy="4" r="0.6" fill="#F8EFC8" opacity="0.7"/>';
  s = s +   '<circle cx="15" cy="12" r="0.5" fill="#F8EFC8" opacity="0.6"/>';
  s = s +   '<circle cx="9" cy="17" r="0.5" fill="#F8EFC8" opacity="0.6"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h7" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#8590D8" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#8590D8" stop-opacity="0.7"/>';
  s = s +   '<stop offset="100%" stop-color="#4858B8" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // Place -- spring green.
  s = s + '<pattern id="tfa-t8" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="20" height="20" fill="#5FB082"/>';
  s = s +   '<path d="M0 5 Q10 3 20 5 M0 10 Q10 8 20 10 M0 15 Q10 13 20 15" stroke="#2A6248" stroke-width="0.7" fill="none" opacity="0.65"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h8" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#98D4B0" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#98D4B0" stop-opacity="0.7"/>';
  s = s +   '<stop offset="100%" stop-color="#5FB082" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // Practice -- warm wood brown.
  s = s + '<pattern id="tfa-t9" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">';
  s = s +   '<rect width="20" height="20" fill="#8A5A38"/>';
  s = s +   '<path d="M0 5 Q10 3 20 5 M0 10 Q10 8 20 10 M0 15 Q10 13 20 15" stroke="#4A2A10" stroke-width="0.7" fill="none" opacity="0.7"/>';
  s = s + '</pattern>';
  s = s + '<radialGradient id="tfa-h9" cx="50%" cy="50%" r="50%">';
  s = s +   '<stop offset="55%" stop-color="#B8896C" stop-opacity="0"/>';
  s = s +   '<stop offset="78%" stop-color="#B8896C" stop-opacity="0.65"/>';
  s = s +   '<stop offset="100%" stop-color="#8A5A38" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  // Inner-light gradient -- bright spec on the dark core. Sized in percentages
  // so it scales to whatever ellipse fills it.
  s = s + '<radialGradient id="tfa-innerL" cx="50%" cy="50%" r="30%">';
  s = s +   '<stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.9"/>';
  s = s +   '<stop offset="100%" stop-color="#FFF8E7" stop-opacity="0"/>';
  s = s + '</radialGradient>';

  s = s + '</defs>';
  return s;
}

// ---------------------------------------------------------------------------
// Per-tradition shape geometry. Each generator takes the unit scale factor u
// (= scale / 120, where 120 is the reference SVG's canonical silhouette
// diameter) and returns the SVG element strings for that tradition's
// silhouette + halo + pattern-fill rect + interior (rings + core) +
// inner-light. Coordinates are scaled from the reference; nothing is
// hardcoded at 60/65/70 in caller-facing math.
// ---------------------------------------------------------------------------
function _tfaGeometry(tradition, u) {
  var R = _tfaR;
  var num = _tfaNum[tradition];
  var patFill = 'url(#tfa-t' + num + ')';
  var haloFill = 'url(#tfa-h' + num + ')';
  var innerFill = 'url(#tfa-innerL)';

  var sil = '';     // silhouette (clip-path child + Band-0 fill body)
  var halo = '';    // halo element with halo gradient fill
  var fillBox = ''; // rect that carries the grain pattern (clipped by sil)
  var rings = '';   // 2 concentric ring elements inside the silhouette
  var core = '';    // dark core element
  var inner = '';   // bright inner-light ellipse over the core

  // Defaults reused across most traditions.
  var innerCx = 0;
  var innerCy = -3 * u;
  var innerRx = 11 * u;
  var innerRy = 9 * u;

  if (tradition === 'theory') {
    sil = '<rect x="' + R(-55 * u) + '" y="' + R(-55 * u) + '" width="' + R(110 * u) + '" height="' + R(110 * u) + '" rx="' + R(8 * u) + '"/>';
    halo = '<rect x="' + R(-70 * u) + '" y="' + R(-70 * u) + '" width="' + R(140 * u) + '" height="' + R(140 * u) + '" rx="' + R(14 * u) + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-60 * u) + '" y="' + R(-60 * u) + '" width="' + R(120 * u) + '" height="' + R(120 * u) + '" fill="' + patFill + '"/>';
    rings = '<circle cx="0" cy="0" r="' + R(40 * u) + '" fill="none" stroke="#3A1A05" stroke-width="0.7" opacity="0.6"/>'
          + '<circle cx="0" cy="0" r="' + R(24 * u) + '" fill="none" stroke="#3A1A05" stroke-width="0.7" opacity="0.65"/>';
    core = '<circle cx="0" cy="0" r="' + R(12 * u) + '" fill="#5C2A0A" opacity="0.85"/>';
  } else if (tradition === 'wisdom') {
    var hxIn = '0,' + R(-60 * u) + ' ' + R(52 * u) + ',' + R(-30 * u) + ' ' + R(52 * u) + ',' + R(30 * u) + ' 0,' + R(60 * u) + ' ' + R(-52 * u) + ',' + R(30 * u) + ' ' + R(-52 * u) + ',' + R(-30 * u);
    var hxOut = '0,' + R(-70 * u) + ' ' + R(60 * u) + ',' + R(-35 * u) + ' ' + R(60 * u) + ',' + R(35 * u) + ' 0,' + R(70 * u) + ' ' + R(-60 * u) + ',' + R(35 * u) + ' ' + R(-60 * u) + ',' + R(-35 * u);
    sil = '<polygon points="' + hxIn + '"/>';
    halo = '<polygon points="' + hxOut + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-60 * u) + '" y="' + R(-60 * u) + '" width="' + R(120 * u) + '" height="' + R(120 * u) + '" fill="' + patFill + '"/>';
    rings = '<circle cx="0" cy="0" r="' + R(40 * u) + '" fill="none" stroke="#6A5A0A" stroke-width="0.7" opacity="0.6"/>'
          + '<circle cx="0" cy="0" r="' + R(24 * u) + '" fill="none" stroke="#6A5A0A" stroke-width="0.7" opacity="0.65"/>';
    core = '<circle cx="0" cy="0" r="' + R(12 * u) + '" fill="#8A6F0A" opacity="0.85"/>';
  } else if (tradition === 'empirical') {
    var pnIn = '0,' + R(-60 * u) + ' ' + R(57 * u) + ',' + R(-18 * u) + ' ' + R(35 * u) + ',' + R(55 * u) + ' ' + R(-35 * u) + ',' + R(55 * u) + ' ' + R(-57 * u) + ',' + R(-18 * u);
    var pnOut = '0,' + R(-72 * u) + ' ' + R(68 * u) + ',' + R(-22 * u) + ' ' + R(42 * u) + ',' + R(66 * u) + ' ' + R(-42 * u) + ',' + R(66 * u) + ' ' + R(-68 * u) + ',' + R(-22 * u);
    sil = '<polygon points="' + pnIn + '"/>';
    halo = '<polygon points="' + pnOut + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-65 * u) + '" y="' + R(-65 * u) + '" width="' + R(130 * u) + '" height="' + R(130 * u) + '" fill="' + patFill + '"/>';
    rings = '<circle cx="0" cy="0" r="' + R(36 * u) + '" fill="none" stroke="#5A2810" stroke-width="0.7" opacity="0.6"/>'
          + '<circle cx="0" cy="0" r="' + R(22 * u) + '" fill="none" stroke="#5A2810" stroke-width="0.7" opacity="0.65"/>';
    core = '<circle cx="0" cy="0" r="' + R(11 * u) + '" fill="#8A4830" opacity="0.85"/>';
    innerRx = 10 * u;
  } else if (tradition === 'history') {
    var diIn = '0,' + R(-65 * u) + ' ' + R(55 * u) + ',0 0,' + R(65 * u) + ' ' + R(-55 * u) + ',0';
    var diOut = '0,' + R(-75 * u) + ' ' + R(65 * u) + ',0 0,' + R(75 * u) + ' ' + R(-65 * u) + ',0';
    sil = '<polygon points="' + diIn + '"/>';
    halo = '<polygon points="' + diOut + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-60 * u) + '" y="' + R(-65 * u) + '" width="' + R(120 * u) + '" height="' + R(130 * u) + '" fill="' + patFill + '"/>';
    rings = '<circle cx="0" cy="0" r="' + R(34 * u) + '" fill="none" stroke="#3A2008" stroke-width="0.7" opacity="0.65"/>'
          + '<circle cx="0" cy="0" r="' + R(20 * u) + '" fill="none" stroke="#3A2008" stroke-width="0.7" opacity="0.7"/>';
    core = '<circle cx="0" cy="0" r="' + R(10 * u) + '" fill="#6A3F08" opacity="0.85"/>';
    innerRx = 10 * u;
  } else if (tradition === 'memoir') {
    sil = '<circle cx="0" cy="0" r="' + R(58 * u) + '"/>';
    halo = '<circle cx="0" cy="0" r="' + R(68 * u) + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-60 * u) + '" y="' + R(-60 * u) + '" width="' + R(120 * u) + '" height="' + R(120 * u) + '" fill="' + patFill + '"/>';
    rings = '<circle cx="0" cy="0" r="' + R(40 * u) + '" fill="none" stroke="#3A4520" stroke-width="0.7" opacity="0.65"/>'
          + '<circle cx="0" cy="0" r="' + R(24 * u) + '" fill="none" stroke="#3A4520" stroke-width="0.7" opacity="0.7"/>';
    core = '<circle cx="0" cy="0" r="' + R(12 * u) + '" fill="#5A6520" opacity="0.85"/>';
  } else if (tradition === 'novel') {
    sil = '<ellipse cx="0" cy="0" rx="' + R(60 * u) + '" ry="' + R(52 * u) + '"/>';
    halo = '<ellipse cx="0" cy="0" rx="' + R(72 * u) + '" ry="' + R(62 * u) + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-65 * u) + '" y="' + R(-55 * u) + '" width="' + R(130 * u) + '" height="' + R(110 * u) + '" fill="' + patFill + '"/>';
    rings = '<ellipse cx="0" cy="0" rx="' + R(40 * u) + '" ry="' + R(32 * u) + '" fill="none" stroke="#5A2538" stroke-width="0.7" opacity="0.65"/>'
          + '<ellipse cx="0" cy="0" rx="' + R(22 * u) + '" ry="' + R(18 * u) + '" fill="none" stroke="#5A2538" stroke-width="0.7" opacity="0.7"/>';
    core = '<ellipse cx="0" cy="0" rx="' + R(10 * u) + '" ry="' + R(8 * u) + '" fill="#8A3258" opacity="0.85"/>';
    innerRx = 10 * u;
    innerRy = 8 * u;
  } else if (tradition === 'poetry') {
    var trIn = '0,' + R(-65 * u) + ' ' + R(56 * u) + ',' + R(38 * u) + ' ' + R(-56 * u) + ',' + R(38 * u);
    var trOut = '0,' + R(-75 * u) + ' ' + R(64 * u) + ',' + R(42 * u) + ' ' + R(-64 * u) + ',' + R(42 * u);
    sil = '<polygon points="' + trIn + '"/>';
    halo = '<polygon points="' + trOut + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-60 * u) + '" y="' + R(-70 * u) + '" width="' + R(120 * u) + '" height="' + R(120 * u) + '" fill="' + patFill + '"/>';
    rings = '<circle cx="0" cy="' + R(3 * u) + '" r="' + R(30 * u) + '" fill="none" stroke="#1A2280" stroke-width="0.7" opacity="0.65"/>'
          + '<circle cx="0" cy="' + R(3 * u) + '" r="' + R(18 * u) + '" fill="none" stroke="#1A2280" stroke-width="0.7" opacity="0.7"/>';
    core = '<circle cx="0" cy="' + R(3 * u) + '" r="' + R(9 * u) + '" fill="#1A2280" opacity="0.85"/>';
    innerRx = 9 * u;
    innerRy = 8 * u;
  } else if (tradition === 'place') {
    var crIn = 'M' + R(-50 * u) + ' ' + R(-35 * u) + ' Q' + R(-15 * u) + ' ' + R(-55 * u) + ' ' + R(30 * u) + ' ' + R(-45 * u) + ' Q' + R(40 * u) + ' ' + R(-10 * u) + ' ' + R(25 * u) + ' ' + R(25 * u) + ' Q' + R(5 * u) + ' ' + R(50 * u) + ' ' + R(-25 * u) + ' ' + R(40 * u) + ' Q' + R(-55 * u) + ' ' + R(15 * u) + ' ' + R(-50 * u) + ' ' + R(-35 * u) + ' Z';
    var crOut = 'M' + R(-58 * u) + ' ' + R(-42 * u) + ' Q' + R(-18 * u) + ' ' + R(-62 * u) + ' ' + R(35 * u) + ' ' + R(-52 * u) + ' Q' + R(47 * u) + ' ' + R(-12 * u) + ' ' + R(30 * u) + ' ' + R(30 * u) + ' Q' + R(8 * u) + ' ' + R(58 * u) + ' ' + R(-28 * u) + ' ' + R(47 * u) + ' Q' + R(-63 * u) + ' ' + R(18 * u) + ' ' + R(-58 * u) + ' ' + R(-42 * u) + ' Z';
    sil = '<path d="' + crIn + '"/>';
    halo = '<path d="' + crOut + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-60 * u) + '" y="' + R(-60 * u) + '" width="' + R(120 * u) + '" height="' + R(120 * u) + '" fill="' + patFill + '"/>';
    rings = '<ellipse cx="' + R(-10 * u) + '" cy="0" rx="' + R(32 * u) + '" ry="' + R(28 * u) + '" fill="none" stroke="#1A4030" stroke-width="0.7" opacity="0.65"/>'
          + '<ellipse cx="' + R(-10 * u) + '" cy="0" rx="' + R(18 * u) + '" ry="' + R(16 * u) + '" fill="none" stroke="#1A4030" stroke-width="0.7" opacity="0.7"/>';
    core = '<ellipse cx="' + R(-10 * u) + '" cy="0" rx="' + R(9 * u) + '" ry="' + R(8 * u) + '" fill="#2A6248" opacity="0.85"/>';
    innerCx = -10 * u;
    innerRx = 9 * u;
    innerRy = 7 * u;
  } else if (tradition === 'practice') {
    var tpIn = R(-38 * u) + ',' + R(-50 * u) + ' ' + R(38 * u) + ',' + R(-50 * u) + ' ' + R(55 * u) + ',' + R(50 * u) + ' ' + R(-55 * u) + ',' + R(50 * u);
    var tpOut = R(-46 * u) + ',' + R(-60 * u) + ' ' + R(46 * u) + ',' + R(-60 * u) + ' ' + R(64 * u) + ',' + R(60 * u) + ' ' + R(-64 * u) + ',' + R(60 * u);
    sil = '<polygon points="' + tpIn + '"/>';
    halo = '<polygon points="' + tpOut + '" fill="' + haloFill + '"/>';
    fillBox = '<rect x="' + R(-65 * u) + '" y="' + R(-55 * u) + '" width="' + R(130 * u) + '" height="' + R(110 * u) + '" fill="' + patFill + '"/>';
    rings = '<circle cx="0" cy="0" r="' + R(35 * u) + '" fill="none" stroke="#2A1A08" stroke-width="0.7" opacity="0.7"/>'
          + '<circle cx="0" cy="0" r="' + R(21 * u) + '" fill="none" stroke="#2A1A08" stroke-width="0.7" opacity="0.75"/>';
    core = '<circle cx="0" cy="0" r="' + R(11 * u) + '" fill="#4A2A10" opacity="0.85"/>';
  } else {
    return null;
  }

  inner = '<ellipse cx="' + R(innerCx) + '" cy="' + R(innerCy) + '" rx="' + R(innerRx) + '" ry="' + R(innerRy) + '" fill="' + innerFill + '"/>';

  return {
    sil: sil,
    halo: halo,
    fillBox: fillBox,
    rings: rings,
    core: core,
    inner: inner
  };
}

// ---------------------------------------------------------------------------
// renderTraditionFormArc(tradition, band, scale) -> SVG <g> string.
// ---------------------------------------------------------------------------
function renderTraditionFormArc(tradition, band, scale) {
  if (band !== 0 && band !== 1 && band !== 2) {
    return '';
  }
  if (typeof tradition !== 'string' || !_tfaBase[tradition]) {
    return '';
  }
  if (typeof scale !== 'number' || !isFinite(scale) || scale <= 0) {
    scale = 60;
  }

  var u = scale / 120;
  var g = _tfaGeometry(tradition, u);
  if (!g) {
    return '';
  }

  var out = '<g class="tradition-form-arc tradition-form-arc--' + tradition + ' tradition-form-arc--band-' + band + '">';

  if (band === 0) {
    // Silhouette filled with base color at 35% opacity over wheat ground.
    // No halo, no rings, no core, no inner light. Add fill+opacity to the
    // last self-closing slash of the silhouette element.
    var silFill = g.sil.replace('/>', ' fill="' + _tfaBase[tradition] + '" opacity="0.35"/>');
    out = out + silFill;
  } else {
    // Band 1: pattern fill + rings + core inside clipped silhouette.
    // Band 2: same + halo + inner-light.
    var clipId = _tfaNextId();
    if (band === 2) {
      out = out + g.halo;
    }
    out = out + '<clipPath id="' + clipId + '">' + g.sil + '</clipPath>';
    out = out + '<g clip-path="url(#' + clipId + ')">';
    out = out +   g.fillBox;
    out = out +   g.rings;
    out = out +   g.core;
    out = out + '</g>';
    if (band === 2) {
      out = out + g.inner;
    }
  }

  out = out + '</g>';
  return out;
}

/* ============================================================================
   PRAXIS 2.0 — IDEA-MARKS RENDERER  (companion to praxis-lumen-amber.css)
   A mark = SHAPE (silhouette + inner design) × COLOUR, one per sub-theory.
   Stored on a sub-theory as { markShape: "01".."16", markColor: 0..15 }.
   Each shape has its own default colour; the reader may override the colour.

   Colour is stamped into each mark (fill→deep gradient) at render time, so the
   16 shapes are NOT a static sprite — they are emitted by render() below. The
   markup matches .lum-mark / .lum-mark > .g / .lum-mark > svg in the stylesheet.

   USAGE
     el.innerHTML = PraxisMarks.render("01", 0, 48);          // shape 01, colour 0
     el.innerHTML = PraxisMarks.render(s.markShape, s.markColor, 40);
     var def = PraxisMarks.defaultColor("04");                // a shape's own colour
     PraxisMarks.COLORS / PraxisMarks.SHAPES                  // for building pickers
   ============================================================================ */
var PraxisMarks = (function () {

  /* shared palette — lifted from the source marks (name, fill, deep) */
  var COLORS = [
    ["teal",       "#6FC9BC", "#37968A"],
    ["blue",       "#8FB8E8", "#5580C2"],
    ["coral",      "#E8998D", "#C4685B"],
    ["gold",       "#E8B45C", "#C08A28"],
    ["cyan",       "#7CC6DA", "#3D93AC"],
    ["yellow",     "#F0D468", "#C4A22E"],
    ["periwinkle", "#9BA4E8", "#5F6AC4"],
    ["pink",       "#F2A8C6", "#CC6E9A"],
    ["green",      "#A8CD8E", "#6FA052"],
    ["violet",     "#AC9DE2", "#7A66C2"],
    ["lavender",   "#C0A8E0", "#8E6EC0"],
    ["lime",       "#C9D67E", "#94A33E"],
    ["mint",       "#8FD4B8", "#4AA582"],
    ["rose",       "#E89BB4", "#C25E84"],
    ["sand",       "#DFC089", "#AE8C46"],
    ["terracotta", "#EFA89A", "#CC6E5C"]
  ];

  /* the 16 shapes — id, name, shape, inner design, default colour index */
  var SHAPES = [
    ["01", "the beacon",     "hexagon",          "nested hexagons",        0],
    ["02", "the wellspring", "teardrop",         "ripple arcs",            1],
    ["03", "the compass",    "four-point star",  "cross + core ring",      2],
    ["04", "the keystone",   "pentagon",         "rays from the apex",     3],
    ["05", "the river",      "lens",             "flowing currents",       4],
    ["06", "the lantern",    "arch",             "arc echo + slats",       5],
    ["07", "the facet",      "rhombus",          "spine + cut lines",      6],
    ["08", "the bloom",      "four-lobe rosette","core ring + lobe veins", 7],
    ["09", "the summit",     "triangle",         "strata lines",           8],
    ["10", "the chamber",    "octagon",          "inner chamber + heart",  9],
    ["11", "the seed",       "egg",              "spiral",                 10],
    ["12", "the kite",       "kite",             "spine + ribs",           11],
    ["13", "the harbor",     "semicircle",       "nested arcs + waterline",12],
    ["14", "the spark",      "six-point star",   "center burst",           13],
    ["15", "the dune",       "mound",            "horizon layers",         14],
    ["16", "the gate",       "squircle",         "lattice",                15]
  ];

  /* each returns the shape's inner SVG, filled with reference F (a gradient url) */
  var DEFS = {
    "01": function (F) { return '<polygon points="32,6 54,19 54,45 32,58 10,45 10,19" fill="' + F + '"/><polygon points="32,15 45,22.5 45,37.5 32,45 19,37.5 19,22.5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/><polygon points="32,24 39,28 39,36 32,40 25,36 25,28" fill="none" stroke="#fff" stroke-opacity=".42" stroke-width="1.3"/>'; },
    "02": function (F) { return '<path d="M32 6 Q52 30 52 42 A20 20 0 1 1 12 42 Q12 30 32 6 Z" fill="' + F + '"/><path d="M20 44 A12 12 0 0 0 44 44" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/><path d="M25 44 A7 7 0 0 0 39 44" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.3"/>'; },
    "03": function (F) { return '<polygon points="32,4 40,24 60,32 40,40 32,60 24,40 4,32 24,24" fill="' + F + '"/><circle cx="32" cy="32" r="5" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.5"/><line x1="32" y1="20" x2="32" y2="44" stroke="#fff" stroke-opacity=".5" stroke-width="1.3"/><line x1="20" y1="32" x2="44" y2="32" stroke="#fff" stroke-opacity=".5" stroke-width="1.3"/>'; },
    "04": function (F) { return '<polygon points="32,6 56,24 47,54 17,54 8,24" fill="' + F + '"/><line x1="32" y1="11" x2="22" y2="52" stroke="#fff" stroke-opacity=".42" stroke-width="1.3"/><line x1="32" y1="11" x2="32" y2="52" stroke="#fff" stroke-opacity=".5" stroke-width="1.3"/><line x1="32" y1="11" x2="42" y2="52" stroke="#fff" stroke-opacity=".42" stroke-width="1.3"/>'; },
    "05": function (F) { return '<path d="M32 6 Q56 32 32 58 Q8 32 32 6 Z" fill="' + F + '"/><path d="M18 28 q7 -4 14 0 t14 0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/><path d="M16 37 q8 5 16 0 t16 0" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.4"/>'; },
    "06": function (F) { return '<path d="M14 56 L14 30 A18 18 0 0 1 50 30 L50 56 Z" fill="' + F + '"/><path d="M22 30 A10 10 0 0 1 42 30" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/><line x1="24" y1="34" x2="24" y2="54" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/><line x1="32" y1="32" x2="32" y2="54" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/><line x1="40" y1="34" x2="40" y2="54" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/>'; },
    "07": function (F) { return '<polygon points="32,5 52,32 32,59 12,32" fill="' + F + '"/><line x1="32" y1="9" x2="32" y2="55" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/><line x1="32" y1="21" x2="46" y2="32" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/><line x1="32" y1="21" x2="18" y2="32" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/>'; },
    "08": function (F) { return '<g fill="' + F + '"><circle cx="32" cy="19" r="13"/><circle cx="32" cy="45" r="13"/><circle cx="19" cy="32" r="13"/><circle cx="45" cy="32" r="13"/></g><circle cx="32" cy="32" r="6" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4"/><g stroke="#fff" stroke-opacity=".4" stroke-width="1.1"><line x1="32" y1="26" x2="32" y2="15"/><line x1="32" y1="38" x2="32" y2="49"/><line x1="26" y1="32" x2="15" y2="32"/><line x1="38" y1="32" x2="49" y2="32"/></g>'; },
    "09": function (F) { return '<polygon points="32,8 56,54 8,54" fill="' + F + '"/><line x1="22" y1="33" x2="42" y2="33" stroke="#fff" stroke-opacity=".45" stroke-width="1.3"/><line x1="16" y1="43" x2="48" y2="43" stroke="#fff" stroke-opacity=".4" stroke-width="1.3"/><line x1="11" y1="50" x2="53" y2="50" stroke="#fff" stroke-opacity=".34" stroke-width="1.3"/>'; },
    "10": function (F) { return '<polygon points="22,6 42,6 58,22 58,42 42,58 22,58 6,42 6,22" fill="' + F + '"/><polygon points="27,16 37,16 48,27 48,37 37,48 27,48 16,37 16,27" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/><circle cx="32" cy="32" r="3.2" fill="#fff" fill-opacity=".55"/>'; },
    "11": function (F) { return '<path d="M32 6 C46 6 50 24 50 36 A18 18 0 0 1 14 36 C14 24 18 6 32 6 Z" fill="' + F + '"/><path d="M32 38 a4 4 0 1 1 4 -4 a8 8 0 1 1 -8 8 a12 12 0 1 1 12 -12" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>'; },
    "12": function (F) { return '<polygon points="32,5 50,26 32,59 14,26" fill="' + F + '"/><line x1="32" y1="9" x2="32" y2="55" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/><line x1="20" y1="26" x2="44" y2="26" stroke="#fff" stroke-opacity=".45" stroke-width="1.3"/><line x1="26" y1="40" x2="38" y2="40" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/>'; },
    "13": function (F) { return '<path d="M10 44 A22 22 0 0 1 54 44 Z" fill="' + F + '"/><path d="M18 44 A14 14 0 0 1 46 44" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/><path d="M26 44 A6 6 0 0 1 38 44" fill="none" stroke="#fff" stroke-opacity=".42" stroke-width="1.3"/><line x1="13" y1="41" x2="51" y2="41" stroke="#fff" stroke-opacity=".38" stroke-width="1.2"/>'; },
    "14": function (F) { return '<g fill="' + F + '"><polygon points="32,6 53,43 11,43"/><polygon points="32,58 11,21 53,21"/></g><g stroke="#fff" stroke-opacity=".5" stroke-width="1.3"><line x1="32" y1="22" x2="32" y2="42"/><line x1="23" y1="27" x2="41" y2="37"/><line x1="41" y1="27" x2="23" y2="37"/></g>'; },
    "15": function (F) { return '<path d="M8 46 Q32 22 56 46 Z" fill="' + F + '"/><path d="M14 46 Q32 30 50 46" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.3"/><path d="M21 46 Q32 37 43 46" fill="none" stroke="#fff" stroke-opacity=".37" stroke-width="1.3"/>'; },
    "16": function (F) { return '<rect x="8" y="8" width="48" height="48" rx="17" ry="17" fill="' + F + '"/><g stroke="#fff" stroke-opacity=".46" stroke-width="1.3"><line x1="24" y1="14" x2="24" y2="50"/><line x1="40" y1="14" x2="40" y2="50"/><line x1="14" y1="24" x2="50" y2="24"/><line x1="14" y1="40" x2="50" y2="40"/></g>'; }
  };

  var uid = 0;

  function colorAt(idx) { return COLORS[idx] || COLORS[0]; }

  function defaultColor(shapeId) {
    for (var i = 0; i < SHAPES.length; i++) { if (SHAPES[i][0] === shapeId) { return SHAPES[i][4]; } }
    return 0;
  }

  /* returns an HTML string for one mark (glow container + inline SVG) */
  function render(shapeId, colorIdx, cd) {
    var def = DEFS[shapeId];
    if (!def) { return ""; }
    var c = colorAt(typeof colorIdx === "number" ? colorIdx : defaultColor(shapeId));
    var size = cd || 52;
    var gid = "mg" + (uid++);
    var inner = def("url(#" + gid + ")");
    return '<span class="lum-mark" style="--cd:' + size + 'px;--mk-glow:' + c[1] + '">' +
      '<span class="g"></span>' +
      '<svg viewBox="0 0 64 64"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient></defs>' +
      inner + '</svg></span>';
  }

  return { render: render, defaultColor: defaultColor, COLORS: COLORS, SHAPES: SHAPES };
})();

if (typeof module !== "undefined" && module.exports) { module.exports = PraxisMarks; }

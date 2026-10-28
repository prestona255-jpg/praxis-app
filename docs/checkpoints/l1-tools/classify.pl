#!/usr/bin/perl
# L1 Stage 1a classifier: rows.tsv -> classified.tsv (adds role, token, pair, note).
# Method = Preston's 27 Oct F3 ruling: classify by ROLE in the declaration; ambiguity -> "?".
use strict; use warnings;

my @rows;
while (<STDIN>) { chomp; my @f = split /\t/, $_, -1; push @rows, \@f; }

sub rgba {
  my $l = shift;
  if ($l =~ /^#([0-9a-f]+)$/) {
    my $h = $1;
    if (length $h == 3 || length $h == 4) { $h = join '', map { $_ x 2 } split //, $h; }
    my @c = map { hex } ($h =~ /(..)/g);
    my $a = @c > 3 ? $c[3] / 255 : 1;
    return ($c[0], $c[1], $c[2], $a);
  }
  if ($l =~ /^rgba?\(([^)]*)\)$/) {
    my @p = split /[,\s\/]+/, $1; @p = grep { $_ ne '' } @p;
    my $a = !defined $p[3] ? 1 : $p[3] =~ /^[\d.]+%$/ ? $p[3] / 100 : $p[3] =~ /^[\d.]+$/ ? $p[3] : 0.5;
    return ($p[0], $p[1], $p[2], $a + 0);
  }
  return (0, 0, 0, 1);
}
sub Y { my ($r, $g, $b) = @_; my @c = map { my $v = $_ / 255; $v <= 0.03928 ? $v / 12.92 : (($v + 0.055) / 1.055) ** 2.4 } ($r, $g, $b); return 0.2126*$c[0] + 0.7152*$c[1] + 0.0722*$c[2]; }
sub hsl {
  my ($r, $g, $b) = map { $_ / 255 } @_;
  my $mx = $r; $mx = $g if $g > $mx; $mx = $b if $b > $mx; my $mn = $r; $mn = $g if $g < $mn; $mn = $b if $b < $mn;
  my $l = ($mx + $mn) / 2; my ($h, $s) = (0, 0);
  if ($mx != $mn) {
    my $d = $mx - $mn; $s = $l > 0.5 ? $d / (2 - $mx - $mn) : $d / ($mx + $mn);
    if ($mx == $r) { $h = ($g - $b) / $d + ($g < $b ? 6 : 0); } elsif ($mx == $g) { $h = ($b - $r) / $d + 2; } else { $h = ($r - $g) / $d + 4; }
    $h *= 60;
  }
  return ($h, $s, $l);
}
sub family {
  my ($r, $g, $b) = @_; my ($h, $s, $l) = hsl($r, $g, $b);
  return 'teal'  if $h >= 150 && $h <= 220 && $s >= 0.25 && $l > 0.15 && $l < 0.9;
  return 'coral' if ($h < 22 || $h > 340) && $s >= 0.40 && $l > 0.28 && $l < 0.78;
  return 'gold'  if $h >= 26 && $h <= 54 && $s >= 0.45 && $l >= 0.24 && $l <= 0.78;
  return 'neutral';
}
sub over { my ($r,$g,$b,$a,$br,$bg,$bb) = @_; return ($r*$a + $br*(1-$a), $g*$a + $bg*(1-$a), $b*$a + $bb*(1-$a)); }

my $THEORY = qr/\.arcfield|\.arcs\b|\.arcs-|\.arc-(?!picker)|\.st-|\.stb-|\.subtheory|\.af-|constellation|galaxy|\[data-st-palette|\.subtheory-rail/;
my $CAMERA = qr/\.scan-(?:cam|vf|torch|br\b|reticle|draftbar|mode-seg|shutter|book-auto|shim|tray|dupe-tick|overlay\.over-cam|verdict-inner)|#scan-(?:receipt|shelf-glyph)/;
my $FLOAT  = qr/sheet|panel|modal|menu|pop|picker|toast|dropdown|spotlight|overlay|dialog|listbox|tooltip|tip\b|composer|dock|bar\b|receipt|tray|capdoor|drawer|fab|bloom/;
my $COVER  = qr/cover|spine|book-cover|\.cov\b|mspine|thumb/;
my $SUNK   = qr/chip|pill|tab\b|-tab|seg|spine|track|toggle|well|sunk|inactive|cavity|input|field|textarea|select|tag\b|-tag|badge|count|kbd|key\b|placeholder|search|ghost|quiet|swatch|dot\b|bar\b|cloth|board/;
my $PAGE   = qr/(?:^|[\s.])(?:body|html)\b|-page(?:\s|$|:)|\.page\b|ground|room\b|-root(?:\s|$)|::before\b.*ground/;
my $FIELD  = qr/input|textarea|select|\bfield|search-input|capfield|writeline|composer|typein|k-field/;
my $SCRIM  = qr/scrim|backdrop|overlay|veil|shade|dim\b/;
my $YUMI   = qr/yumi|bloom|ydock|caret|seed|send|lum-yumi|itx-send|ij-dot|glyph/;
my $DANGER = qr/danger|error|destructive|delete|remove|warn|is-failed|k-destructive/;
my $FOCUS  = qr/:focus|focus-visible|is-focus|stb-focus/;
my $YUMIOWN = qr/dot\b|seed|send|caret|halo|glyph|ydock|well|orb/;
my $ONGOLD = qr/btn-primary|actionbtn-primary|is-on|\.on\b|signin|\.move\b|commit|create|newborn-door|cta|k-btn--primary|u-btn-gild|aria-checked="true"|aria-pressed="true"|k-toast button/;
my $FLOAT2 = qr/\.app-nav|dock|bar\b|sheet|panel|menu|picker|toast|drawer|modal|composer/;   # C2 (28 Oct): Preston's list, exactly
my $COVER2 = qr/\.bk-cover|\.scan-cov|cover|spine/;                                            # C2: covers, placeholders, spines
my $YUMIRIGHT = qr/\.lum-yumi \.dot|\.lum-yumi\.has-well|\.itx-send|caret|halo|ydock.*seed|yumi.*seed/;   # C3: the only owners of --yumi
my $Y4A3D29 = Y(0x4a, 0x3d, 0x29);
my $ROOM   =qr/^\.(?:bk-surface|notebook|shelf|home-page|account|pf-root|search|about|intro-journey|lit-page|value-page)(?:\.[\w-]+)*(?::[\w-]+)?$/;

# pass 1: per-sheet rank pools (distinct composited luminance) for dark text, light text, dark fills
my (%poolDT, %poolLT, %poolDF);
my @meta;
for my $i (0 .. $#rows) {
  my ($sheet, $line, $ctx, $sel, $prop, $lit, $val) = @{$rows[$i]};
  my ($r, $g, $b, $a) = rgba($lit);
  my $fam = family($r, $g, $b);
  my ($h, $s, $l) = hsl($r, $g, $b);
  my $grp = $prop =~ /^(?:color|-webkit-text-fill-color|caret-color|text-decoration-color|-webkit-text-stroke(?:-color)?)$/ ? 'text'
          : $prop =~ /^background/ ? 'bg'
          : $prop =~ /^(?:border|outline|column-rule)/ ? 'border'
          : $prop =~ /shadow$|^filter$/ ? 'shadow'
          : $prop =~ /^(?:fill|stroke|stop-color|flood-color)$/ ? 'svg'
          : 'other';
  my $isLight = Y($r, $g, $b) > 0.35;
  my @comp = $isLight ? over($r,$g,$b,$a,36,24,12) : over($r,$g,$b,$a,253,249,238);
  my $cy = Y(@comp);
  $meta[$i] = { r=>$r, g=>$g, b=>$b, a=>$a, fam=>$fam, l=>$l, s=>$s, grp=>$grp, light=>$isLight, cy=>$cy, Y=>Y($r,$g,$b) };
  next if $a == 0;
  $meta[$i]{bk} = bk($cy);
  if ($grp eq 'text' && $fam eq 'neutral' && (Y($r,$g,$b) > 0.6 || Y($r,$g,$b) < 0.3)) {
    if ($isLight) { $poolLT{$sheet}{bk($cy)} = 1; } else { $poolDT{$sheet}{bk($cy)} = 1; }
  }
  if ($grp eq 'bg' && $a >= 0.95 && Y($r,$g,$b) < 0.06 && $fam ne 'gold') { $poolDF{$sheet}{sprintf('%.5f', Y($r,$g,$b))} = 1; }
}
sub bk { my $v = shift; return sprintf('%.2f', int($v * 10 + 0.5) / 10); }   # 0.1-luminance buckets: near-identical values share a rank
sub tier {
  my ($pool, $v, $desc) = @_;
  my @k = sort { $desc ? $b <=> $a : $a <=> $b } keys %$pool;
  return 0 unless @k > 1;
  my $idx = 0; for (my $j = 0; $j < @k; $j++) { if ($k[$j] eq $v) { $idx = $j; last; } }
  my $t = int(3 * $idx / scalar(@k)); return $t > 2 ? 2 : $t;
}

my %PAIR = (
  '--ink'        => 'ink / page-2 · 14.65 d · 10.16 n',
  '--ink-2'      => 'ink-2 / page-2 · 5.94 d · 6.42 n',
  '--ink-3'      => 'ink-3 / page-2 · 6.09 d · 5.18 n',
  '--on-night'   => 'on-night / sky · 13.28 d · 15.10 n',
  '--on-night-2' => 'on-night-2 / sky · 8.39 d · 9.54 n',
  '--on-night-3' => 'on-night-3 / sky · 6.77 d · 7.70 n',
  '--gold-ink'   => 'gold-ink / page-2 · 5.79 d · 6.41 n',
  '--gold-star'  => 'gold-star / sky · 8.37 d · 9.52 n',
  '--gold'       => 'on-gold / gold · 6.30 d · 9.52 n',
  '--page'       => 'ink / page · 11.47 d · 14.22 n',
  '--page-2'     => 'ink / page-2 · 14.65 d · 10.16 n',
  '--page-3'     => 'ink / page-3 · 10.04 d · 7.54 n (ink-2/-3 label-only ≥3)',
  '--sky'        => 'on-night / sky · 13.28 d · 15.10 n',
  '--umber'      => 'on-night / umber · 10.16',
  '--umber-2'    => 'on-night / umber-2 · 7.54 (on-night-3 label-only 3.84)',
  '--line'       => 'separator — exempt (day 1.36)',
  '--line-field' => 'line-field / page-2 · 6.09 d · 5.18 n (≥3)',
  '--line-night' => 'hairline on sky — separator',
  '--yumi'       => 'yumi / sky · 3.70 d · 4.20 n (≥3, seated on sky)',
  '--scrim'      => '— (veil, non-text)',
  '--hi'         => '— (light hairline, non-text)',
  '--card-hi'    => '— (card edge, non-text)',
  '--shadow-float' => '— (floating shadow, non-text)',
  '--shadow-cover' => '— (cover contact shadow, non-text)',
);

my (@ink3) = ('--ink', '--ink-2', '--ink-3');
my (@onn3) = ('--on-night', '--on-night-2', '--on-night-3');
my (@dk3)  = ('--sky', '--umber', '--umber-2');

for my $i (0 .. $#rows) {
  my ($sheet, $line, $ctx, $sel, $prop, $lit, $val) = @{$rows[$i]};
  my $m = $meta[$i]; my $grp = $m->{grp}; my $fam = $m->{fam}; my $a = $m->{a};
  my $s = lc $sel;
  my ($goldbg, $fb) = @{$rows[$i]}[7, 8];
  my ($role, $tok, $note, $q) = ('', '', '', 0);
  my $grad = ($val =~ /gradient\(/) ? 1 : 0;
  my $pct = int($a * 100 + 0.5);

  if ($s =~ $CAMERA) {
    ($role, $tok, $note) = ('UNTOUCHED', '— (literal stays)', 'camera surface');
    $q = 1 if $s =~ /verdict-inner/;
    $note .= '; verdict card over the frozen frame — camera or paper?' if $q;
  } elsif ($s =~ $THEORY) {
    ($role, $tok, $note, $q) = ('UNTOUCHED', '— (literal stays)', 'theory surface (arcs / sub-theories behind the switch)', 1);
  } elsif ($ctx =~ /\@keyframes/) {
    ($role, $tok, $note, $q) = ($a == 0 ? 'overlay' : 'shadow', $a == 0 ? 'transparent' : 'none', "inside $ctx — an animated glow; Stage 2 motion decides whether it survives", 1);
  } elsif ($a == 0) {
    ($role, $tok, $note) = ('overlay', 'transparent', 'fully transparent stop/edge');
  } elsif ($s =~ $YUMI && $s =~ $YUMIOWN && $grp ne 'text' && $s !~ /panel|sees|ledger/) {
    if ($grp eq 'shadow') { ($role, $tok, $note, $q) = ('yumi', 'none', "a glow on Yumi's own mark — her halo is a wash, not a shadow", 1); }
    else { ($role, $tok, $note) = ('yumi', $a < 0.95 ? "color-mix(in srgb, var(--yumi) $pct%, transparent)" : 'var(--yumi)', "Yumi's seed / dot / halo — the whole fill is hers" . ($grad ? '; gradient stop (Stage 2 flattens)' : '')); }
  } elsif ($grp eq 'shadow' && $a >= 0.95 && $val =~ /(?:^|,)\s*(?:inset\s+)?0(?:px)?\s+0(?:px)?\s+0(?:px)?\s+[\d.]+px\s+\Q$lit\E/i) {
    my $dg = ($fam eq 'coral' || $s =~ $DANGER) ? ' (ruling C: no error colour)' : '';
    ($role, $tok, $note) = ('gold-text', 'ring: `0 0 0 <spread> var(--gold-ink)`', "a ring drawn with box-shadow — the focus/active ring, spread kept$dg");
  } elsif ($s =~ /mote|spark|\bstar\b|ember/ && $grp eq 'bg') {
    ($role, $tok, $note, $q) = ('gold-on-sky', 'var(--gold-star)', 'a decorative mote / spark — light on a dark ground?', 1);
  } elsif ($grp eq 'shadow') {
    if ($prop eq 'text-shadow') { ($role, $tok, $note, $q) = ('shadow', 'none', 'text-shadow has no canon token (§4: shadow only what floats)', 1); }
    elsif ($prop eq 'filter') { ($role, $tok, $note, $q) = ('shadow', $fam eq 'gold' ? 'var(--star-glow)' : 'none', 'filter drop-shadow; --star-glow is for star groups only', 1); }
    else {
      my $t = ($s =~ $COVER) ? '--shadow-cover' : ($s =~ $FLOAT) ? '--shadow-float' : '--card-hi';
      ($role, $tok) = ('shadow', "var($t)");
      $note = 'whole box-shadow declaration → one token';
      if ((my $v2 = $val) =~ s/var\(\s*--[\w-]+\s*,[^()]*(?:\([^()]*\))?[^()]*\)//g) { }
      if ($val =~ /var\(--[\w-]+\)/) { $note = 'mixes token layers with literal layers — only the literal layers become this token; the var() layers (ring, edge) stay, as `box-shadow: var(--x), <kept layers>`'; $q = 1 if $s =~ $FOCUS || $s =~ /focus-within|error|invalid/; }
      if ($m->{light} && $val =~ /inset/) { $note .= '; this literal is the inset light edge (--hi inside the token)'; }
      if ($fam eq 'gold') { $note .= '; gold glow dropped (Stage 2 flat)'; }
    }
  } elsif ($fam eq 'teal' || $fam eq 'coral') {
    if ($s =~ $YUMI && $s =~ $YUMIOWN && $grp ne 'text') { ($role, $tok, $note) = ('yumi', 'var(--yumi)', "Yumi's seed / send / caret / halo ($fam)"); $tok = "color-mix(in srgb, var(--yumi) $pct%, transparent)" if $a < 0.95; }
    elsif ($s =~ $YUMI && ($grp eq 'text' || $prop eq 'caret-color')) {
      if ($prop eq 'caret-color') { ($role, $tok, $note) = ('yumi', 'var(--yumi)', "Yumi's caret"); }
      else { ($role, $tok, $note, $q) = ($m->{light} ? 'text-on-dark-2' : 'text-2', $m->{light} ? 'var(--on-night-2)' : 'var(--ink-2)', "Yumi's words in a retired $fam — her lines are ink (Fraunces italic), --yumi is not a text colour", 1); }
    }
    elsif ($s =~ $YUMI && $grp ne 'text') { ($role, $tok, $note, $q) = ('yumi', $a < 0.95 ? "color-mix(in srgb, var(--yumi) $pct%, transparent)" : 'var(--yumi)', "Yumi surface in $fam, not plainly seed/send/caret/halo", 1); }
    elsif ($fam eq 'coral' || $s =~ $DANGER) {
      if ($grp eq 'border') { ($role, $tok, $note) = ('border', $a < 0.95 ? 'var(--line)' : 'var(--line)', 'danger line → --line (ruling C)'); }
      elsif ($grp eq 'bg') { ($role, $tok, $note, $q) = ('fill-sunk', 'var(--page-3)', 'danger fill → quiet card (ruling C)', 1); }
      else { ($role, $tok, $note) = ('gold-text', 'var(--gold-ink)', 'danger/error colour → --gold-ink (ruling C)'); }
    } else {
      ($q, $note) = (1, "retired $fam hue, not Yumi's");
      if ($grp eq 'text' || $grp eq 'svg') { ($role, $tok) = ('text-2', 'var(--ink-2)'); }
      elsif ($grp eq 'border') { ($role, $tok) = ('border', 'var(--line)'); }
      else { ($role, $tok) = ($a < 0.95 ? 'overlay' : 'fill-sunk', $a < 0.95 ? "color-mix(in srgb, var(--ink-2) $pct%, transparent)" : 'var(--page-3)'); }
    }
  } elsif ($s =~ $DANGER && $fam eq 'neutral' && $grp eq 'text' && 0) {
    # (neutral danger text keeps its ink tier)
  } elsif ($grp eq 'border' || ($grp eq 'svg' && $prop eq 'stroke')) {
    if ($fam eq 'gold') {
      if ($a < 0.95) { ($role, $tok, $note, $q) = ('border', 'var(--line)', "translucent gold rule ($pct%)", 1); }
      elsif ($m->{Y} > 0.5 && $s !~ $FOCUS) { ($role, $tok, $note, $q) = ('border', 'var(--line)', 'pale gold hairline — a separator, not the gold-ink rule?', 1); }
      else { ($role, $tok, $note) = ('gold-text', 'var(--gold-ink)', $s =~ $FOCUS ? 'focus ring' : 'gold rule'); }
    } elsif ($s =~ $FOCUS || $prop =~ /^outline/) { ($role, $tok, $note) = ('gold-text', 'var(--gold-ink)', 'focus ring'); }
    elsif ($s =~ /::(?:after|before)/ && $a >= 0.95 && $m->{Y} > 0.15 && $m->{Y} < 0.45) { ($role, $tok, $note, $q) = ('text-3', 'var(--ink-3)', 'a border-drawn icon (chevron) — an icon, 3:1, not a separator', 1); }
    elsif ($m->{light} && ($a < 0.95 || $m->{Y} > 0.85) && $m->{Y} > 0.7 && $s !~ $FIELD) { ($role, $tok, $note) = ('border', 'var(--line-night)', 'light hairline → on a dark ground'); $q = 1 if $a >= 0.95; }
    elsif ($s =~ $FIELD) { ($role, $tok, $note) = ('border', 'var(--line-field)', 'field boundary (3:1)'); }
    else { ($role, $tok) = ('border', 'var(--line)'); }
  } elsif ($grp eq 'text' || ($grp eq 'svg' && $prop ne 'stroke' && $s =~ /text|label|glyph|icon|ic\b/)) {
    if ($fam eq 'gold') {
      if ($m->{Y} > 0.33) { ($role, $tok, $note, $q) = ('gold-on-sky', 'var(--gold-star)', 'bright gold as text — reads as on-sky', 1); }
      else { ($role, $tok) = ('gold-text', 'var(--gold-ink)'); }
    } elsif ($m->{Y} < 0.3 && ($goldbg || $s =~ $ONGOLD)) {
      ($role, $tok, $note) = ('text-1', 'var(--on-gold)', 'text on a gold fill → --on-gold (§1)');
    } elsif ($m->{Y} >= 0.3 && $m->{Y} <= 0.6) {
      ($role, $tok, $note, $q) = ('text-3', 'var(--ink-3)', 'mid-tone text — paper or sky ground unknown from the rule', 1);
    } elsif ($m->{light}) {
      my $t = tier($poolLT{$sheet}, $m->{bk}, 1);
      ($role, $tok, $note) = ('text-on-dark-' . ($t + 1), "var($onn3[$t])", 'light text → on-night tier ' . ($t + 1));
    } else {
      my $t = tier($poolDT{$sheet}, $m->{bk}, 0);
      ($role, $tok, $note) = ('text-' . ($t + 1), "var($ink3[$t])", "rank " . ($t + 1) . " of 3 among $sheet dark text");
    }
    $note .= sprintf('; alpha %.2f folded into the tier', $a) if $a < 0.95;
  } else {
    # backgrounds, svg fills, other
    if ($fam eq 'gold') {
      if ($a < 0.95) { ($role, $tok, $note, $q) = ('overlay', "color-mix(in srgb, var(--gold) $pct%, transparent)", 'translucent gold wash — not in the ruled list', 1); }
      elsif ($s =~ /btn|button|primary|cta|commit|create|save|send|pill|-on\b|is-on|active|selected|reading|dot|fab/) { ($role, $tok) = ('gold-fill', 'var(--gold)'); }
      else { ($role, $tok, $note, $q) = ('gold-fill', 'var(--gold)', 'gold fill, not obviously pressable', 1); }
    } elsif ($a < 0.95) {
      if ($m->{light}) { ($role, $tok, $note) = ('overlay', 'var(--hi)', "translucent white ($pct%) → --hi"); }
      elsif ($m->{Y} < 0.06 && ($s =~ $SCRIM || $a >= 0.3)) { ($role, $tok, $note) = ('overlay', 'var(--scrim)', "translucent black ($pct%) → veil"); }
      else { ($role, $tok, $note) = ('overlay', 'var(--line)', "translucent dark wash ($pct%) → --line"); $q = 1 if $a >= 0.3; }
    } elsif ($m->{Y} < 0.06) {
      my $t = tier($poolDF{$sheet}, sprintf('%.5f', $m->{Y}), 0);
      ($role, $tok, $note) = ('fill-dark', "var($dk3[$t])", 'dark fill rank ' . ($t + 1) . ' of 3 (darkest → sky)');
    } elsif ($m->{Y} < 0.45) {
      ($role, $tok, $note, $q) = ('fill-sunk', 'var(--page-3)', 'mid-tone fill — neither paper nor sky', 1);
      if ($s =~ /dot|pip|mark|bar\b|fill\b|progress|rail|stem/) { ($role, $tok, $note) = ('text-3', 'var(--ink-3)', 'small mark painted in ink-3'); $q = 1; }
    } else {
      if ($s =~ $ROOM) { ($role, $tok, $note) = ('fill-page', 'var(--page)', 'the room scope itself — its ground'); }
      elsif ($s =~ $SUNK && $m->{Y} > 0.93 && $s =~ /selected|is-on|\.on\b|::after|knob|thumb/) { ($role, $tok, $note) = ('fill-card', 'var(--page-2)', 'the raised part of a sunk control (selected segment / knob)'); }
      elsif ($s =~ $SUNK) { ($role, $tok) = ('fill-sunk', 'var(--page-3)'); }
      elsif ($s =~ $PAGE) { ($role, $tok) = ('fill-page', 'var(--page)'); }
      elsif ($m->{Y} < 0.74) { ($role, $tok, $note, $q) = ('fill-sunk', 'var(--page-3)', 'cream darker than a card, no sunk keyword', 1); }
      else { ($role, $tok) = ('fill-card', 'var(--page-2)'); }
    }
    $note = ($note ? "$note; " : '') . 'gradient stop (Stage 2 flattens)' if $grad && $role ne 'UNTOUCHED';
  }
  # ---- Preston's Stage 1a review, 28 Oct (C1–C5, Q1–Q10): overrides, then every '?' is ruled ----
  my $old = $tok;
  if ($s =~ /verdict-inner/) { ($role, $tok, $note) = ('shadow', 'var(--shadow-float)', 'C5: a paper card over the frozen frame'); }
  elsif ($s =~ /^\.shelf\.lum-amber-deep \.arc-chip$/ && $grp eq 'bg') { ($role, $tok, $note) = ('fill-sunk', 'var(--page-3)', 'C5 / Q1 exception: renders on the shelf route'); }
  elsif ($role eq 'UNTOUCHED') { $note .= ($note =~ /theory/ ? ' — Q1: stays until arcs return' : ''); }
  elsif ($s =~ /:focus/ && !$fb && ($grp eq 'shadow' || $grp eq 'border')) {
    if ($prop eq 'box-shadow') { ($role, $tok, $note) = ('focus-ring', 'ring: `0 0 0 2px var(--gold-ink)` (whole declaration)', 'C1: a focus ring, never a shadow; companion layers dropped (§5 focus ring 4.53 d · 8.97 n)'); }
    else { ($role, $tok, $note) = ('focus-ring', 'var(--gold-ink)', 'C1: focus outline'); }
  }
  elsif ($s =~ /\.ij-dot/) {
    if ($grp eq 'shadow') { ($role, $tok, $note) = ('shadow', 'none', "C3: the intro's step tablist (js/intros.js:412), not Yumi's seed — glow dropped"); }
    else { ($role, $tok, $note) = ('overlay', 'color-mix(in srgb, var(--gold-star) 22%, transparent)', "C3: the intro's step tablist, not Yumi's seed"); }
  }
  elsif ($role eq 'yumi' && $s !~ $YUMIRIGHT) {
    if ($grp eq 'shadow') { my $t = ($s =~ $COVER2) ? '--shadow-cover' : ($s =~ $FLOAT2) ? '--shadow-float' : '--card-hi'; ($role, $tok, $note) = ('shadow', "var($t)", 'C3: not one of Yumi\'s owned elements → a shadow by selector (C2)'); }
    else { ($role, $tok, $note) = ('overlay', $a < 0.95 ? "color-mix(in srgb, var(--ink-2) $pct%, transparent)" : 'var(--ink-2)', 'C3: not one of Yumi\'s owned elements'); }
  }
  elsif ($role eq 'yumi' && $grp eq 'shadow') { ($role, $tok, $note) = ('yumi', 'none', 'Q7: her halo is the wash, not a shadow'); }
  elsif ($role eq 'shadow' && $tok =~ /^var\(--(?:card-hi|shadow-float|shadow-cover)\)$/) {
    my $t = ($s =~ $COVER2) ? '--shadow-cover' : ($s =~ $FLOAT2) ? '--shadow-float' : '--card-hi';
    $tok = "var($t)"; $note .= "; C2: moved from $old" if $tok ne $old;
  }
  elsif ($role eq 'overlay' && $tok =~ /var\(--gold\) (\d+)%/) { $tok = "color-mix(in srgb, var(--gold-star) $1%, transparent)"; $note = 'Q2: gold wash in the canon\'s own form (--wheat-glow / --window-line), alpha kept; Stage 2 may flatten'; }
  elsif ($role eq 'gold-fill' && $q) { if ($s =~ /orb|mark|atmo/) { $tok = 'var(--gold-star)'; $note = 'Q5: an orb / mark / ground atmosphere → --gold-star'; } else { $note = 'Q5: a pressed / active control → --gold'; } }
  # C4: a dark-text literal lighter than #4a3d29 is never tier 1
  if ($role eq 'text-1' && $tok eq 'var(--ink)' && $m->{Y} >= $Y4A3D29 - 1e-9) { ($role, $tok) = ('text-2', 'var(--ink-2)'); $note .= '; C4: lighter than #4a3d29 → tier 2'; }
  # the shadow rows whose declaration still carries var() layers keep them (only the literal layers become the token)
  $q = 0;   # every group is ruled (Q1–Q10)
  my ($bare) = ($tok =~ /var\((--[\w-]+)\)/);
  if ($fb && $role ne 'UNTOUCHED') { $note = "only a var() fallback — dropped, the token is always defined after L1 (role read: $role → $tok)"; $role = 'fallback'; $tok = '— (fallback dropped)'; $q = 0; }
  if ($s =~ $DANGER && $grp eq 'text' && $role !~ /UNTOUCHED|gold-text|fallback/) { $note = ($note ? "$note; " : '') . 'destructive control — Q10 as guessed (ruling C: ink-2 words + confirm sheet)'; }
  my $pair = ($role eq 'UNTOUCHED') ? '—' : ($bare && $PAIR{$bare}) ? $PAIR{$bare} : ($tok eq 'transparent' || $tok eq 'none') ? '— (non-text)' : ($tok =~ /color-mix/ ? '— (wash, non-text)' : '—');
  print join("\t", @{$rows[$i]}[0 .. 6], $role . ($q ? ' ?' : ''), $tok, $pair, $note), "\n";
}

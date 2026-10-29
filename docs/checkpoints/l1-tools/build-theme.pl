#!/usr/bin/perl
# L1.1 theme.css builder. Usage: perl build-theme.pl s6map.tsv l1-core.css l1-day-body.css < theme.css > theme.new
# Works on LF text; the caller restores CRLF.
use strict; use warnings;
my ($mapf, $coref, $dayf) = @ARGV;
my (%cat, %val);
open my $mh, '<', $mapf or die; while (<$mh>) { chomp; my ($n, $c, $b) = split /\t/; $cat{$n} = $c; my ($v) = ($b =~ /`([^`]+)`/); $val{$n} = $v; } close $mh;
sub slurp { my $f = shift; open my $h, '<:raw', $f or die "$f"; local $/; my $t = <$h>; close $h; $t =~ s/\r//g; return $t; }
my $core = slurp($coref); my $day = slurp($dayf);
local $/; my $src = <STDIN>; $src =~ s/\r//g;

# ---- 1. the original :root: keep THEORY / KEEP definitions (and the comment block right before each kept run) ----
$src =~ /\A(.*?)^:root \{\n(.*?)^\}\n/ms or die 'no :root';
my ($head, $body) = ($1, $2);
my $rootEnd = $+[0];
my @items; my $b = $body;
while (length $b) {
  if ($b =~ s/\A(\s+)//) { push @items, ['ws', $1]; next; }
  if ($b =~ s{\A(/\*.*?\*/)}{}s) { push @items, ['cm', $1]; next; }
  if ($b =~ s/\A(--[\w-]+)(\s*:[^;]*;)//s) { push @items, ['def', $1 . $2, $1]; next; }
  die 'unparsed :root text: ' . substr($b, 0, 60);
}
my $kept = ''; my @pend; my ($nkeep, $ndrop) = (0, 0);
for my $it (@items) {
  if ($it->[0] eq 'def') {
    my $c = $cat{$it->[2]} || 'UNMAPPED';
    die "unmapped theme :root token $it->[2]" if $c eq 'UNMAPPED';
    if ($c eq 'THEORY' || $c eq 'KEEP') { $kept .= join('', map { $_->[1] } @pend) . $it->[1]; $nkeep++; }
    else { $ndrop++; }
    @pend = ();
  } elsif ($it->[0] eq 'cm') { push @pend, $it; }
  else { if (@pend) { push @pend, $it; } else { $kept .= $it->[1]; } }
}
$kept .= join('', map { $_->[1] } grep { $_->[0] eq 'ws' } @pend);   # drop trailing orphan comments
$kept =~ s/\n{3,}/\n\n/g;
my $rest = substr($src, $rootEnd);

# ---- 2. the alias block: every §6 "becomes var(...)" name, declared once, re-resolved inside the sky scopes ----
my @alias;
for my $n (sort keys %cat) {
  next unless $cat{$n} eq 'ALIAS';
  my $v = $val{$n}; die "no value for $n" unless defined $v;
  next if $v eq "var($n)";                       # §6 self-reference = defined by the §3 type scale in the core
  push @alias, "  $n: $v;";
}
my $aliasBlock = "/* §6 — every other live name, re-pointed (names stay, values move; ruled D: retired hues are\n"
  . "   aliases, never purged). Declared on :root AND re-declared on the two sky scopes so each alias resolves\n"
  . "   against that scope's core (a custom property resolves where it is declared, not where it is used). */\n"
  . ":root,\n.yumi-panel,\n.yumi-bloom,\n.arcs.lum-amber-deep,\n.arcfield {\n" . join("\n", @alias) . "\n}\n";   # L1.2 M9: the two arc rooms

# ---- 3. the day block, generated from ONE source and declared twice (rail 4) ----
my $dayBlock = "/* §2 — DAY. Declared twice from one source (tools: docs/checkpoints/l1-tools/build-theme.pl); the two\n"
  . "   bodies are byte-identical and diffed by the build (P3).\n"
  . "   L1.2 M9: the Arcs list and the arc interior keep a light literal ground in both moods, so they take the\n"
  . "   day values here in both moods (and re-declare the §6 aliases above) — corrections.md M9. */\n"
  . "html[data-mood=\"day\"],\n.arcs.lum-amber-deep,\n.arcfield {\n$day}\n"
  . "\@media (prefers-color-scheme: light) {\nhtml[data-mood=\"auto\"] {\n$day}\n}\n";

# ---- 4. the old dual-ground override -> the two sky scopes of §2 ----
my $newScopes = "/* §7 — [data-ground=\"dark\"] carries no token lines after L1 (the mood owns every value); the selector is\n"
  . "   kept because views.js still writes it on 16 routes. .app-nav and .spotlight-panel follow the mood. */\n"
  . "[data-ground=\"dark\"] {}\n"
  . "/* §2 — Yumi's panel is always sky: its scope maps the paper tokens onto the sky set. */\n"
  . ".yumi-panel { --page:var(--sky); --page-2:var(--umber); --page-3:var(--umber-2); --ink:var(--on-night); --ink-2:var(--on-night-2); --ink-3:var(--on-night-3); --line:var(--line-night); --gold:var(--gold-star); --gold-ink:var(--gold-star); --on-gold:var(--sky); }\n"
  . "/* §2 — the Bloom on paper: the --bl-* set. */\n"
  . ".yumi-bloom { --gold:var(--bl-gold); --gold-light:var(--bl-light); --text-on-dark:var(--bl-core); --tradition-wisdom-halo:var(--bl-wisdom); --tradition-theory-halo:var(--bl-theory); --tradition-empirical-halo:var(--bl-emp); }\n";
$rest =~ s{/\* =+\n   UMBER dual-ground override\..*?\*/\n\[data-ground="dark"\],\n\.app-nav,\n\.yumi-bloom,\n\.yumi-panel,\n\.spotlight-panel \{\n.*?\n\}\n}{$newScopes}s or die 'no dual-ground block';

# ---- 5. the shell ground (§8): html paints the page; the dark-route override has nothing left to swap ----
$rest =~ s#^body \{\n#html {\n  /* §8 — the web splash: the page colour paints before anything else loads. */\n  background: var(--page);\n}\nbody {\n#m or die 'no body';
$rest =~ s{body\[data-ground="dark"\]::before \{\n  background: var\(--ground-grad\), var\(--ground\);\n\}}{body[data-ground="dark"]::before {\n  /* L1: no override — the mood paints the same --page ground on every route. */\n}} or die 'no dark ::before';
# §1 --grain-op / --grain-blend: the one noise tile (the Day Three tile, 220px, alpha .55)
my $tile = <<'TILE';
  opacity: var(--grain-op);
  mix-blend-mode: var(--grain-blend);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 220px 220px;
TILE
$rest =~ s#(body::after \{\n(?:.*\n)*?)  opacity: \.015;\n  background-image: url\([^\n]*\);\n#$1$tile# or die 'no body::after tile';

print $head, $core, "\n", $aliasBlock, "\n", $dayBlock, "\n",
  "/* The theory layer (behind the switch; re-pointed when arcs return) and the not-a-look tokens — untouched at L1. */\n",
  ":root {\n", $kept, "}\n", $rest;
print STDERR "root defs kept=$nkeep dropped=$ndrop aliases=" . scalar(@alias) . "\n";

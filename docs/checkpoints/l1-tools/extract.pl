#!/usr/bin/perl
# L1 Stage 1a: every literal colour in a CONSUMER declaration (not a --custom-property
# definition). TSV out: sheet, line, ctx(@media path), selector, property, literal, value.
use strict; use warnings;
for my $f (@ARGV) {
  open my $fh, '<:raw', $f or die "$f: $!"; local $/; my $s = <$fh>; close $fh;
  $s =~ s/\r//g;
  # strip comments, keep newlines so line numbers hold (browser semantics: first */ closes)
  $s =~ s{/\*.*?\*/}{ my $c = $&; $c =~ tr/\n//cd; ' ' . $c }gse;
  (my $short = $f) =~ s{.*/}{};
  my @st; my @blk; my $buf = ''; my $bufLine = 1; my $line = 1;
  my $n = length $s;
  for (my $i = 0; $i < $n; $i++) {
    my $c = substr($s, $i, 1);
    if ($c eq '{') {
      my $p = $buf; $p =~ s/^\s+|\s+$//g; $p =~ s/\s+/ /g; push @st, $p; push @blk, []; $buf = ''; $bufLine = $line;
    } elsif ($c eq '}' || $c eq ';') {
      push @{$blk[-1]}, [$buf, $bufLine] if @blk;
      $buf = ''; $bufLine = $line;
      if ($c eq '}') {
        my $body = join(';', map { $_->[0] } @{$blk[-1] || []});
        # does this rule paint a gold fill behind its own text?
        my $goldbg = ($body =~ /background(?:-color|-image)?\s*:[^;]*(?:var\(--(?:lum-)?gold(?:-hi|-l|-d|-star)?\)|var\(--grad\)|#(?:f2c25a|e0a838|d9a441|a8761a|e8b23a|d9931a))/i) ? 1 : 0;
        emit($short, $_->[0], $_->[1], \@st, $goldbg) for @{$blk[-1] || []};
        pop @st; pop @blk;
      }
    } else {
      if ($buf !~ /\S/ && $c =~ /\S/) { $bufLine = $line; }
      $buf .= $c;
    }
    $line++ if $c eq "\n";
  }
}
sub emit {
  my ($sheet, $d, $ln, $st, $goldbg) = @_;
  return unless @$st;
  return unless $d =~ /^\s*([-\w]+)\s*:(.*)$/s;
  my ($prop, $val) = ($1, $2);
  return if $prop =~ /^--/;
  $val =~ s/\s+/ /g; $val =~ s/^\s+|\s+$//g;
  my @lits = ($val =~ /(#[0-9a-fA-F]{3,8}(?![0-9a-zA-Z_-])|\brgba?\([^)]*\))/g);
  return unless @lits;
  my $sel = $st->[-1];
  my $ctx = join(' >> ', @{$st}[0 .. $#$st - 1]);
  for my $l (@lits) {
    (my $ln2 = lc $l) =~ s/\s+//g;
    my $fb = ($val =~ /var\(\s*--[\w-]+\s*,\s*\Q$l\E/i) ? 1 : 0;   # literal is only a var() fallback
    print join("\t", $sheet, $ln, $ctx, $sel, $prop, $ln2, $val, $goldbg ? 1 : 0, $fb), "\n";
  }
}

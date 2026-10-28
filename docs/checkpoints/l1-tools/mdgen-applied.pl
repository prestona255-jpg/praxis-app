#!/usr/bin/perl
# cls.tsv (the ruled classification of the PRE-L1 bytes) -> the applied table rows for l1-literals.md.
# applied = "untouched" for a ruled UNTOUCHED row; otherwise "yes" — proven by the 1b re-run, where the only
# consumer literals left equal the ruled UNTOUCHED set exactly (sheet + selector + property + literal).
use strict; use warnings; use utf8;
binmode STDOUT, ':utf8'; binmode STDIN, ':utf8';
my $n = 0;
print "| # | sheet:line (pre-L1) | selector | property | literal | role | token | §5 pair it lands on | applied | note |\n";
print "|---:|---|---|---|---|---|---|---|---|---|\n";
while (<STDIN>) {
  chomp; my ($sheet, $line, $ctx, $sel, $prop, $lit, $val, $role, $tok, $pair, $note) = split /\t/, $_, -1;
  $n++;
  my $s = $sel; $s = substr($s, 0, 72) . '…' if length $s > 73;
  $s = "\@media … › $s" if $ctx ne '';
  for ($s, $note, $tok, $pair) { s/\|/\\|/g; }
  $s =~ s/`/'/g;
  (my $sh = $sheet) =~ s/\.css$//;
  my $ap = ($role eq 'UNTOUCHED') ? 'untouched' : 'yes';
  printf "| %d | %s:%d | `%s` | %s | `%s` | %s | %s | %s | %s | %s |\n", $n, $sh, $line, $s, $prop, $lit, $role, ($tok =~ /^—/ ? $tok : "`$tok`"), $pair, $ap, $note;
}

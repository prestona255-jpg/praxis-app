#!/usr/bin/perl
# cls.tsv -> the table body of docs/checkpoints/l1-literals.md (rows only; header written by hand)
use strict; use warnings; use utf8;
binmode STDOUT, ':utf8'; binmode STDIN, ':utf8';
my $n = 0;
print "| # | sheet:line | selector | property | literal | role | proposed token | §5 pair it lands on | note |\n";
print "|---:|---|---|---|---|---|---|---|---|\n";
while (<STDIN>) {
  chomp; my @f = split /\t/, $_, -1;
  my ($sheet, $line, $ctx, $sel, $prop, $lit, $val, $role, $tok, $pair, $note) = @f;
  $n++;
  my $s = $sel; $s = substr($s, 0, 72) . '…' if length $s > 73;
  $s = "\@media … › $s" if $ctx ne '';
  for ($s, $note, $tok, $pair) { s/\|/\\|/g; }
  $s =~ s/`/'/g;
  (my $sh = $sheet) =~ s/\.css$//;
  printf "| %d | %s:%d | `%s` | %s | `%s` | %s | %s | %s | %s |\n", $n, $sh, $line, $s, $prop, $lit, ($role =~ /\?/ ? "**$role**" : $role), ($tok =~ /^—/ ? $tok : "`$tok`"), $pair, $note;
}

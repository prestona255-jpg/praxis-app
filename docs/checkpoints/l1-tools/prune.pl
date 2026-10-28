#!/usr/bin/perl
# L1.1: delete every look-token DEFINITION (§6 ALIAS / CORE) from a non-theme sheet — theme.css now holds the one
# definition. THEORY and KEEP definitions stay. In place; byte-preserving outside the deleted declarations.
# Usage: perl prune.pl s6map.tsv file.css [...]
use strict; use warnings;
my $mapf = shift;
my %cat; open my $mh, '<', $mapf or die; while (<$mh>) { chomp; my ($n, $c) = split /\t/; $cat{$n} = $c; } close $mh;
for my $f (@ARGV) {
  open my $fh, '<:raw', $f or die; local $/; my $src = <$fh>; close $fh;
  my $mask = $src; $mask =~ s{/\*.*?\*/}{ my $c = $&; $c =~ s/[^\n\r]/ /g; $c }gse;   # same length, comments blanked
  my @del; my $depth = 0; my $stmtStart = 0; my %by;
  for (my $i = 0; $i < length $mask; $i++) {
    my $c = substr($mask, $i, 1);
    if ($c eq '{') { $depth++; $stmtStart = $i + 1; }
    elsif ($c eq '}' || $c eq ';') {
      my $st = substr($mask, $stmtStart, $i - $stmtStart);
      if ($depth > 0 && $st =~ /^(\s*)(--[\w-]+)\s*:/) {
        my ($lead, $name) = ($1, $2);
        my $c2 = $cat{$name} || 'UNMAPPED';
        if ($c2 eq 'ALIAS' || $c2 eq 'CORE') {
          my $s = $stmtStart + length($lead); my $e = ($c eq ';') ? $i + 1 : $i;
          push @del, [$s, $e]; $by{$c2}++;
        } elsif ($c2 eq 'UNMAPPED') { print STDERR "$f: UNMAPPED $name kept\n"; }
      }
      if ($c eq '}') { $depth--; }
      $stmtStart = $i + 1;
    }
  }
  # widen each deletion to swallow its whole line when it stands alone, else trailing blanks
  my $out = $src; my $n = 0;
  for my $d (sort { $b->[0] <=> $a->[0] } @del) {
    my ($s, $e) = @$d;
    my $ls = rindex($out, "\n", $s - 1) + 1;
    my $le = index($out, "\n", $e); $le = length($out) if $le < 0;
    my $before = substr($out, $ls, $s - $ls); my $after = substr($out, $e, $le - $e);
    if ($before =~ /^[ \t]*$/ && $after =~ /^[ \t\r]*$/) { substr($out, $ls, $le + 1 - $ls) = ''; }
    else { my $t = $e; $t++ while $t < length($out) && substr($out, $t, 1) =~ /[ \t]/; substr($out, $s, $t - $s) = "\x01"; }
    $n++;
  }
  # a line that lost a declaration and now holds only whitespace + a comment: the comment described the removed
  # value (a claim outliving its code) — drop the line with it
  my $orph = 0;
  $out = join('', map {
    if (/\x01/) { (my $l = $_) =~ s/\x01//g; if ($l =~ m{^[ \t]*(?:/\*(?:(?!\*/).)*\*/[ \t]*)*\r?\n?$}s) { $orph++ if $l =~ /\S/; ''; } else { $l } } else { $_ }
  } split /(?<=\n)/, $out);
  print STDERR "$f: orphan comment lines dropped: $orph\n";
  open my $oh, '>:raw', $f or die; print $oh $out; close $oh;
  printf STDERR "%s: deleted %d definitions (ALIAS %d, CORE %d)\n", $f, $n, $by{ALIAS} || 0, $by{CORE} || 0;
}

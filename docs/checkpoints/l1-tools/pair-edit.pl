#!/usr/bin/perl
# L1.1 pairing fix (Preston, 28 Oct, M1–M7). Usage: perl pair-edit.pl spec.tsv file.css [...]
# spec.tsv: METHOD <TAB> exact selector (prelude, whitespace-normalised) <TAB> prop <TAB> new value
# For every rule whose prelude equals the selector, the declaration of `prop` gets the new value. `bg` means
# whichever of background / background-color / background-image the rule carries (rewritten as `background:`);
# a prop the rule lacks is appended. Values only — no selector is added, removed or renamed.
use strict; use warnings;
my $specf = shift;
my %spec; open my $sh, '<:utf8', $specf or die; while (<$sh>) { chomp; next if /^#|^\s*$/; my ($m, $sel, $p, $v) = split /\t/; push @{$spec{$sel}}, [$m, $p, $v]; } close $sh;
my %hit;
for my $f (@ARGV) {
  open my $fh, '<:raw', $f or die; local $/; my $src = <$fh>; close $fh;
  my $mask = $src; $mask =~ s{/\*.*?\*/}{ my $c = $&; $c =~ s/[^\n\r]/ /g; $c }gse;
  my @edits; my $st = 0;
  for (my $i = 0; $i < length $mask; $i++) {
    my $c = substr($mask, $i, 1);
    if ($c eq '{') {
      my $pre = substr($mask, $st, $i - $st); (my $n = $pre) =~ s/^\s+|\s+$//g; $n =~ s/\s+/ /g;
      my $close = index($mask, '}', $i);
      if ($spec{$n} && index(substr($mask, $i + 1, $close - $i - 1), '{') < 0) {
        my $body = substr($src, $i + 1, $close - $i - 1);
        for my $e (@{$spec{$n}}) {
          my ($m, $p, $v) = @$e;
          my $re = ($p eq 'bg') ? qr/(?<![\w-])(background(?:-color|-image)?)\s*:\s*[^;]*?(\s*;|\s*$)/ : qr/(?<![\w-])(\Q$p\E)\s*:\s*[^;]*?(\s*;|\s*$)/;
          my $prop = ($p eq 'bg') ? 'background' : $p;
          if ($body =~ s/$re/$prop:$v$2/) { $hit{"$n\t$p"}++; }
          else { $body =~ s/\s*$//; $body .= ($body =~ /;\s*$/ || $body eq '' ? '' : ';') . " $prop:$v; "; $hit{"$n\t$p"}++; }
        }
        push @edits, [$i + 1, $close - $i - 1, $body];
      }
      $st = $i + 1;
    } elsif ($c eq '}' || $c eq ';') { $st = $i + 1; }
  }
  for my $e (sort { $b->[0] <=> $a->[0] } @edits) { substr($src, $e->[0], $e->[1]) = $e->[2]; }
  open my $oh, '>:raw', $f or die; print $oh $src; close $oh;
  printf STDERR "%s: %d rules rewritten\n", $f, scalar @edits;
}
for my $sel (sort keys %spec) { for my $e (@{$spec{$sel}}) { print STDERR "NOT FOUND: $sel ($e->[1])\n" unless $hit{"$sel\t$e->[1]"}; } }

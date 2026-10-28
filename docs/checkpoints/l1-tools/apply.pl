#!/usr/bin/perl
# L1.1: apply the ruled consumer-literal table (classify.pl output) to the sheets, in place.
# Usage: perl apply.pl cls.tsv file.css [...]    (cls.tsv must come from extract.pl on THESE bytes)
use strict; use warnings;
my $clsf = shift;
my %rows;   # "sheet\tline\tprop" -> [ [lit, role, tok], ... ] in source order
open my $ch, '<', $clsf or die; while (<$ch>) { chomp; my @f = split /\t/, $_, -1; push @{$rows{"$f[0]\t$f[1]\t$f[4]"}}, [$f[5], $f[7], $f[8]]; } close $ch;
my $LIT = qr/#[0-9a-fA-F]{3,8}(?![0-9a-zA-Z_-])|\brgba?\([^)]*\)/;
my %stat;
sub toplayers { my $v = shift; my @l; my $d = 0; my $cur = ''; for my $c (split //, $v) { if ($c eq '(') { $d++; } elsif ($c eq ')') { $d--; } if ($c eq ',' && $d == 0) { push @l, $cur; $cur = ''; next; } $cur .= $c; } push @l, $cur; s/^\s+|\s+$//g for @l; return @l; }
sub dropfb { my $v = shift; 1 while $v =~ s/var\(\s*(--[\w-]+)\s*,\s*(?:$LIT)\s*\)/var($1)/; return $v; }
sub transform {
  my ($prop, $val, $list) = @_;
  my $imp = ($val =~ s/\s*!important\s*$//) ? ' !important' : '';
  my @tok = map { $_->[2] } @$list; my @role = map { $_->[1] } @$list;
  return undef if grep { $_ eq 'UNTOUCHED' } @role;    # an untouched row leaves the whole declaration as it is
  my $v = $val;
  # 1. var() fallbacks are dropped first (the token is always defined after L1)
  if (grep { $_ eq 'fallback' } @role) { $v = dropfb($v); $stat{fallback} += grep { $_ eq 'fallback' } @role; }
  my @live = grep { $_->[1] ne 'fallback' } @$list;
  return $v . $imp unless @live;
  if ($prop eq 'box-shadow') {
    my @kept = grep { $_ !~ $LIT && /var\(/ } toplayers($v);
    if (grep { $_->[1] eq 'focus-ring' } @live) { $stat{focus}++; return '0 0 0 2px var(--gold-ink)' . $imp; }
    my ($sh) = grep { /^var\(--(?:card-hi|shadow-float|shadow-cover)\)$/ } map { $_->[2] } @live;
    if ($sh) { $stat{shadow}++; return join(', ', $sh, @kept) . $imp; }
    if (grep { $_->[2] eq 'none' } @live) { $stat{none}++; return (@kept ? join(', ', @kept) : 'none') . $imp; }
  }
  if ($prop eq 'text-shadow' && grep { $_->[2] eq 'none' } @live) { $stat{none}++; return 'none' . $imp; }
  if ($prop eq 'filter') {
    my $i = 0;
    $v =~ s{drop-shadow\((?:[^()]|\([^()]*\))*\)}{ my $seg = $&; my $r = $seg; if ($seg =~ $LIT) { my $t = $live[$i++][2]; $r = ($t eq 'none') ? '' : $t; } $r }ge;
    $v =~ s/\s{2,}/ /g; $v =~ s/^\s+|\s+$//g; $v = 'none' if $v eq ''; $stat{filter}++;
    return $v . $imp;
  }
  # everything else: each literal in place, in source order
  my $i = 0;
  $v =~ s{$LIT}{ my $r = $live[$i] ? $live[$i][2] : $&; $i++; $r }ge;
  die "literal count mismatch in $prop: $val" if $i != @live;
  $stat{inplace} += $i;
  return $v . $imp;
}
for my $f (@ARGV) {
  open my $fh, '<:raw', $f or die; local $/; my $src = <$fh>; close $fh;
  (my $short = $f) =~ s{.*/}{};
  my $mask = $src; $mask =~ s{/\*.*?\*/}{ my $c = $&; $c =~ s/[^\n\r]/ /g; $c }gse;
  my @edits; my $depth = 0; my $st = 0; my $line = 1; my $bl = 1; my $seen = 0;
  for (my $i = 0; $i < length $mask; $i++) {
    my $c = substr($mask, $i, 1);
    if ($c eq '{' || $c eq '}' || $c eq ';') {
      if ($c ne '{' && $depth > 0) {
        my $d = substr($mask, $st, $i - $st);
        if ($d =~ /^(\s*)([-\w]+)(\s*:\s*)(.*?)(\s*)$/s && $2 !~ /^--/) {
          my ($lead, $prop, $colon, $vm, $tail) = ($1, $2, $3, $4, $5);
          my $vs = $st + length($lead) + length($prop) + length($colon);
          my $val = substr($src, $vs, length $vm);
          my $key = "$short\t$bl\t$prop";
          if (exists $rows{$key} && $val =~ $LIT) {
            my $n = () = ($vm =~ /$LIT/g);
            my @take = splice(@{$rows{$key}}, 0, $n);
            die "row shortfall at $key" if @take != $n;
            $seen += $n;
            my $nv = transform($prop, $val, \@take);
            push @edits, [$vs, length $vm, $nv] if defined $nv && $nv ne $val;
          }
        }
      }
      if ($c eq '{') { $depth++; } elsif ($c eq '}') { $depth--; }
      $st = $i + 1; $bl = $line;
    } else { if (substr($mask, $st, $i - $st) !~ /\S/ && $c =~ /\S/) { $bl = $line; } }
    $line++ if $c eq "\n";
  }
  for my $e (sort { $b->[0] <=> $a->[0] } @edits) { substr($src, $e->[0], $e->[1]) = $e->[2]; }
  open my $oh, '>:raw', $f or die; print $oh $src; close $oh;
  printf STDERR "%s: %d literal rows seen, %d declarations rewritten\n", $f, $seen, scalar @edits;
}
my $left = 0; for my $k (keys %rows) { $left += @{$rows{$k}}; }
print STDERR "rows not matched to a declaration: $left\n";
print STDERR join(' ', map { "$_=$stat{$_}" } sort keys %stat), "\n";

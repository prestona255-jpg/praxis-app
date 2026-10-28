#!/usr/bin/perl
# L1 Stage 0 token census. Usage: perl census.pl <file.css> [skipsel-regex]
# Prints: defs, hex-in-values, rgba-in-values (skipping blocks whose selector
# matches skipsel), duplicates (same name twice in one block; same name twice
# under identical selector+media context), backdrop-filter, Cormorant, gradients.
use strict; use warnings;
my ($f, $skip) = @ARGV;
open my $fh, '<:raw', $f or die "$f: $!";
local $/; my $src = <$fh>; close $fh;
$src =~ s/\r//g;
my $raw = $src;
# strip comments (standard CSS: first */ closes)
$src =~ s{/\*.*?\*/}{ }gs;
my @stack; my $buf = '';
my ($defs, $hex, $rgba, $dupBlock, $bf, $grad) = (0,0,0,0,0,0);
my (%ctxNames, %blockNames, %defsByName);
my $skipHex = 0; my $skipRgba = 0;
my $i = 0; my $n = length $src;
my @blockStack;  # hash refs of names per open block
my @hexList;
while ($i < $n) {
  my $c = substr($src, $i, 1);
  if ($c eq '{') {
    my $pre = $buf; $pre =~ s/^\s+|\s+$//g; $pre =~ s/\s+/ /g;
    push @stack, $pre; push @blockStack, {}; $buf = '';
  } elsif ($c eq '}') {
    decl($buf); $buf = '';
    pop @stack; pop @blockStack;
  } elsif ($c eq ';') {
    decl($buf); $buf = '';
  } else { $buf .= $c; }
  $i++;
}
sub decl {
  my ($d) = @_;
  return unless @stack;
  return unless $d =~ /^\s*([-\w]+)\s*:(.*)$/s;
  my ($prop, $val) = ($1, $2);
  my $sel = $stack[-1];
  my $ctx = join(' >> ', @stack);
  my $skipped = (defined $skip && $skip ne '' && $sel =~ /$skip/) ? 1 : 0;
  if ($prop =~ /^--/) {
    $defs++;
    $defsByName{$prop}++;
    if ($blockStack[-1]{$prop}++) { $dupBlock++; }
    $ctxNames{$ctx}{$prop}++;
  }
  if ($prop =~ /^(-webkit-)?backdrop-filter$/) { $bf++ unless $val =~ /^\s*none\s*(!important)?\s*$/ && 0; }
  my @h = ($val =~ /#[0-9a-fA-F]{3,8}(?![0-9a-zA-Z_-])/g);
  my @r = ($val =~ /\brgba?\(/g);
  if ($skipped) { $skipHex += @h; $skipRgba += @r; }
  else { $hex += @h; $rgba += @r; push @hexList, map { "[$sel] $prop=$_" } (@h, @r) if $ENV{LISTHEX}; }
  $grad += () = ($val =~ /(?:linear|radial|conic|repeating-linear|repeating-radial)-gradient\(/g);
}
my $dupCtx = 0;
for my $ctx (keys %ctxNames) { for my $nm (keys %{$ctxNames{$ctx}}) { $dupCtx += $ctxNames{$ctx}{$nm} - 1 if $ctxNames{$ctx}{$nm} > 1; } }
my $names = scalar keys %defsByName;
my $corm = () = ($raw =~ /Cormorant/g);
my $cormLive = () = ($src =~ /Cormorant/g);
my $bfRaw = () = ($src =~ /(?:-webkit-)?backdrop-filter\s*:/g);
my $bfStd = () = ($src =~ /(?<!-webkit-)backdrop-filter\s*:/g);
my $gradRaw = () = ($src =~ /gradient\(/g);
printf "%s\n  defs=%d uniqueNames=%d hexInValues=%d rgbaInValues=%d (skipped-blocks hex=%d rgba=%d)\n  dupSameBlock=%d dupSameSelectorCtx=%d\n  backdrop-filter decls: all=%d std=%d (incl -webkit-: %d)\n  Cormorant raw=%d live(non-comment)=%d  gradient( live=%d\n",
  $f, $defs, $names, $hex, $rgba, $skipHex, $skipRgba, $dupBlock, $dupCtx, $bf, $bfStd, $bfRaw, $corm, $cormLive, $gradRaw;
print "  $_\n" for @hexList;

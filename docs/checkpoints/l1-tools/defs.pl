#!/usr/bin/perl
# every --custom-property DEFINITION: sheet, line, ctx, selector, name, value
use strict; use warnings;
for my $f (@ARGV) {
  open my $fh, '<:raw', $f or die; local $/; my $s = <$fh>; close $fh;
  $s =~ s/\r//g;
  $s =~ s{/\*.*?\*/}{ my $c = $&; $c =~ tr/\n//cd; ' ' . $c }gse;
  (my $short = $f) =~ s{.*/}{};
  my @st; my $buf = ''; my $bl = 1; my $line = 1;
  for (my $i = 0; $i < length $s; $i++) {
    my $c = substr($s, $i, 1);
    if ($c eq '{') { my $p = $buf; $p =~ s/^\s+|\s+$//g; $p =~ s/\s+/ /g; push @st, $p; $buf = ''; }
    elsif ($c eq '}' || $c eq ';') {
      if (@st && $buf =~ /^\s*(--[\w-]+)\s*:(.*)$/s) { my ($n, $v) = ($1, $2); $v =~ s/\s+/ /g; $v =~ s/^\s+|\s+$//g; print join("\t", $short, $bl, join(' >> ', @st[0 .. $#st - 1]), $st[-1], $n, $v), "\n"; }
      $buf = ''; pop @st if $c eq '}';
    } else { if ($buf !~ /\S/ && $c =~ /\S/) { $bl = $line; } $buf .= $c; }
    $line++ if $c eq "\n";
  }
}

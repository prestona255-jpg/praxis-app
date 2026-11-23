#!/bin/sh
# RIG-1 P6: nothing moved inside a scenario. For each scenario id, cut its text out of the old file and the new
# file by the SAME rule -- from its "await stage('<id>'" line up to the line before the next "await stage(" line,
# or before the "const errs = " line for the last one -- strip each line's leading whitespace (indentation is
# ignored, nothing else is), and compare the two cuts byte for byte. Then compare the order of the stage ids.
#   sh docs/checkpoints/rig-1-shots/p6-compare.sh      (from the repo root)
OLD=docs/checkpoints/fb-1a-shots/rig/driver.js
cut_ids() { grep -o "await stage('[A-Z][0-9]*'" "$1" | sed "s/await stage('//; s/'//"; }
scene() {  # $1 file, $2 id, $3 first line of the function body, $4 last line of the function body
  sed -n "$3,$4p" "$1" | awk -v id="$2" '
    /await stage\(\047/ { on = (index($0, "await stage(\047" id "\047") > 0) }
    /^[ \t]*const errs = / { on = 0 }
    on { sub(/^[ \t]+/, ""); print }'
}
match=0; total=0
check_suite() {  # $1 new file, $2/$3 old body range
  new_ids=$(cut_ids "$1" | tr '\n' ' '); old_ids=$(sed -n "$2,$3p" "$OLD" | grep -o "await stage('[A-Z][0-9]*'" | sed "s/await stage('//; s/'//" | tr '\n' ' ')
  echo "order, old: $old_ids"; echo "order, new: $new_ids"
  [ "$new_ids" = "$old_ids" ] && echo "order: SAME" || echo "order: DIFFERENT"
  nlast=$(wc -l < "$1")
  for id in $old_ids; do
    total=$((total + 1))
    a=$(scene "$OLD" "$id" "$2" "$3" | md5sum | cut -c1-32); b=$(scene "$1" "$id" 1 "$nlast" | md5sum | cut -c1-32)
    n=$(scene "$OLD" "$id" "$2" "$3" | wc -l)
    if [ "$a" = "$b" ] && [ "$n" -gt 0 ]; then match=$((match + 1)); echo "  $id  equal  ($n lines, md5 $a)"; else echo "  $id  DIFFERENT  old $a / new $b"; fi
  done
}
echo "== fb-1a: driver.js scenarios() (lines 152-508) vs tools/rig/scenarios/fb-1a.js"; check_suite tools/rig/scenarios/fb-1a.js 152 508
echo "== fb-1a-extras: driver.js extras() (lines 515-622) vs tools/rig/scenarios/fb-1a-extras.js"; check_suite tools/rig/scenarios/fb-1a-extras.js 515 622
echo "P6: $match of $total scenarios equal once indentation is ignored"

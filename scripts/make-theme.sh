#!/usr/bin/env bash
# Create a new color theme by hue-rotating all 12 tier sprites.
#
# Usage: scripts/make-theme.sh <theme-name> <modulate-%>
#
# modulate-% controls hue shift via ImageMagick -modulate 100,100,<n>
#   100 = no change (purple original)
#    66 = blue  (~-61°)
#    50 = cyan  (~-90°)
#    83 = red   (~-30°)  — try 133 for green (+60°)
#
# Example:
#   scripts/make-theme.sh blue 66
#   scripts/make-theme.sh green 133

set -e

THEME="${1:?Usage: make-theme.sh <theme-name> <modulate-%>}"
MODULATE="${2:?Usage: make-theme.sh <theme-name> <modulate-%>}"

SPRITES_DIR="$(dirname "$0")/../assets/sprites"
OUT_DIR="${SPRITES_DIR}/${THEME}"

mkdir -p "$OUT_DIR"

TIERS=(
  t1-dormant
  t2-stirring
  t3-kindling
  t4-breaking
  t5-wisp
  t6-flicker
  t7-blaze
  t8-inferno
  t9-drake
  t10-wyrm
  t11-dragon
  t12-nova
)

for f in "${TIERS[@]}"; do
  magick "${SPRITES_DIR}/purple/${f}.png" \
    -modulate "100,100,${MODULATE}" \
    "${OUT_DIR}/${f}.png"
  echo "  → ${f}.png"
done

echo "Theme '${THEME}' (modulate ${MODULATE}%) written to ${OUT_DIR}"
echo "Now run: python3 scripts/build-tier-avatars.py ${THEME}"

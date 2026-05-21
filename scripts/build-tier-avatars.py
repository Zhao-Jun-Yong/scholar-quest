#!/usr/bin/env python3
"""
Rebuild src/tier-avatars.ts embedding ALL themes so the plugin can switch at runtime.

Usage:
    python3 scripts/build-tier-avatars.py

Output:
    src/tier-avatars.ts  (overwritten in place)

To add a new color theme:
    1. Run: scripts/make-theme.sh <theme> <hue_modulate_%>
    2. Run: python3 scripts/build-tier-avatars.py
"""

import base64
from pathlib import Path

REPO = Path(__file__).parent.parent

THEMES = ['purple', 'blue', 'teal', 'green', 'crimson', 'pink', 'orange']

TIER_FILES = [
    't1-dormant', 't2-stirring', 't3-kindling', 't4-breaking',
    't5-wisp', 't6-flicker', 't7-blaze', 't8-inferno',
    't9-drake', 't10-wyrm', 't11-dragon', 't12-nova',
]

IMG_TAG = '<img src="data:image/png;base64,{b64}" style="width:100%;height:100%;object-fit:contain;image-rendering:pixelated;image-rendering:crisp-edges">'


def encode(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode()


def build() -> None:
    sprites_root = REPO / "assets" / "sprites"

    lines = [
        "// Auto-generated — do not edit by hand. Regenerate with: python3 scripts/build-tier-avatars.py",
        "",
        "export const THEMES = ['purple', 'blue', 'teal', 'green', 'crimson', 'pink', 'orange'] as const;",
        "export type AvatarTheme = typeof THEMES[number];",
        "",
        "export const THEME_AVATARS: Record<AvatarTheme, string[]> = {",
    ]

    for theme in THEMES:
        sprites_dir = sprites_root / theme
        if not sprites_dir.exists():
            print(f"Error: theme folder not found: {sprites_dir}")
            raise SystemExit(1)
        imgs = []
        for stem in TIER_FILES:
            png = sprites_dir / f"{stem}.png"
            if not png.exists():
                print(f"Error: missing sprite: {png}")
                raise SystemExit(1)
            imgs.append(f"    '{IMG_TAG.format(b64=encode(png))}'")
        lines.append(f"  {theme}: [")
        lines.extend(f"{img}," for img in imgs)
        lines.append("  ],")

    lines.append("};")
    lines.append("")

    out = REPO / "src" / "tier-avatars.ts"
    out.write_text("\n".join(lines))
    print(f"Written {out} ({len(THEMES)} themes × {len(TIER_FILES)} tiers)")


if __name__ == "__main__":
    build()

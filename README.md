# Scholar Quest

[![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.19467725.svg)](https://doi.org/10.5281/zenodo.19467725)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-zhaojun0425-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/zhaojun0425)

An [Obsidian](https://obsidian.md) plugin that gamifies academic work with XP, levels, and milestone tracking.

**Design philosophy:** Gamification should accelerate productivity, not become a task itself. XP is awarded silently in the background; wins surface automatically.

## Features

- **Auto-detected XP** — earn points for reading papers, creating and developing atomic notes, and writing manuscript drafts
- **Career calibration** — one-time onboarding wizard estimates your starting level from your academic history (degrees, publications, grants, talks, supervision, peer reviews); re-runnable any time via the command palette
- **Milestone system** — 14 project types with predefined milestone templates; mark milestones complete via the sidebar or command palette
- **Sidebar panel** — tier avatar, XP progress bar, daily word count with session bonus tracker, streak counter, recent activity feed, achievements, and active projects with pending milestones
- **Achievement system** — 36 pixel art achievements tied to XP milestones, level thresholds, activity counts, and career events
- **Daily streak** — opens Obsidian each day to build a streak; displayed with a pixel art flame icon from day 2
- **Writing session bonus** — earn a one-time daily bonus when you write 500+ net new words in a manuscript
- **Daily presence** — small XP reward for opening Obsidian each day
- **Tier avatar progression** — 12 visual tiers from dormant egg to Nova; your avatar evolves in the sidebar as you level up
- **Manual log** — quickly log off-Obsidian activities (data analysis, fieldwork) in ~2 seconds
- **Level system** — 12 tiers, levels 1–60; XP per level scales linearly to level 20, then flattens at 6,000 XP/level for long-term play
- **Status bar** — ambient level indicator: `Lv 7 · ████░░ · +30 today`
- **Fully configurable** — vault paths, tags, XP values, milestone templates, and tier names all editable in settings

## Getting Started

1. **Install** the plugin (Settings → Community plugins → Browse → search "Scholar Quest")
2. **Open Obsidian** — the career calibration wizard appears automatically on first launch
3. **Enter your academic history** (rough estimates are fine) to set a starting level, or click "Start at Level 1" to begin fresh
4. **Open the sidebar** via the graduation cap icon in the ribbon
5. **Work normally** — XP accumulates in the background as you read papers, develop notes, and hit milestones

## XP Sources

| Activity | XP | How |
|---|---|---|
| Paper skimmed | 20 | `keywords` frontmatter: `📥 → 👀` |
| Paper completed | 50 | `keywords` frontmatter: `→ ✅` |
| New atomic note | 30 | New file with atom tag created |
| Atomic note developed | 30 | +50 words or +1 wikilink (once/hr per file) |
| Writing progress | 20 | Per 100 net new words in a manuscript file |
| Writing session bonus | 50 | Once per day when 500+ words written |
| Daily presence | 5 | Opening Obsidian each day |
| Project milestones | 20–300 | Via sidebar or "Complete milestone" command |
| Manual activities | configurable | Via "Log activity" command |

## Tier Progression

12 tiers from dormant egg to Nova. Your sidebar avatar evolves as you level up.

| Tier | Name | Levels |
|---|---|---|
| T1 | Dormant | 1–5 |
| T2 | Stirring | 6–10 |
| T3 | Kindling | 11–15 |
| T4 | Breaking | 16–20 |
| T5 | Wisp | 21–25 |
| T6 | Flicker | 26–30 |
| T7 | Blaze | 31–35 |
| T8 | Inferno | 36–40 |
| T9 | Drake | 41–45 |
| T10 | Wyrm | 46–50 |
| T11 | Dragon | 51–55 |
| T12 | Nova | 56–60 |

A typical active researcher reaches the flat zone (Wisp, level 21) after about 3 years of active use. A senior professor importing a full career history starts around level 21.

## Achievements

36 pixel art achievements unlock automatically based on your progress:

- **XP milestones** — Getting Warmed Up, In the Zone, Veteran, Established, Well-Cited, Distinguished, Eminent
- **Level thresholds** — Kindled, Hatched, Risen, Luminary, Nova
- **Activity counts** — Bookworm, Scholar, Voracious Reader, Prolific, Zettelkasten, Grand Zettelkasten, Wordsmith, Marathon Writer, Endless Writer, Deep Thinker, On a Roll, Relentless, Milestone Chaser, Project Veteran
- **Career events** — Under Review, Accepted!, Funded!, Graduate!, On Stage, Doctor!
- **First actions** — First Steps, First Idea, First Read, Milestone Unlocked, First Draft

Unlocked achievements appear as pixel art chips in the sidebar; locked ones are dimmed.

## Recommended Vault Setup

Scholar Quest works with any structure, but is designed around:

- **Paper notes** in a sources folder (`Atlas/Sources/` by default), with a `keywords` frontmatter field tracking reading status via emoji (`📥 → 👀 → ✅`)
- **Atomic notes** in an ideas folder (`Atlas/Ideas/` by default), tagged with a card tag (`cards/atom` by default)
- **Project notes** in a projects folder (`Efforts/` by default), tagged by project type (e.g. `project/manuscript`)

All paths and tags are configurable in Settings → Scholar Quest.

## Commands

- `Scholar Quest: Log activity` — log a manual academic activity
- `Scholar Quest: Complete milestone` — mark a project milestone done
- `Scholar Quest: Show XP summary` — see your current level, total XP, and today's gain
- `Scholar Quest: Import career history` — re-run the career calibration wizard

## Configuration

Go to **Settings → Scholar Quest** to configure:

- **Vault paths** — sources folder, ideas folder, projects folder
- **Tags** — atom note tag, project type tags
- **XP values** — per activity type, writing session bonus threshold, daily presence XP
- **Milestone templates** — add, remove, or rename milestones per project type
- **Manual activities** — custom activities with custom XP values

## Project Types

`manuscript` · `conference` · `invited-talk` · `peer-review` · `grant` · `report` · `thesis` · `data` · `software` · `teaching` · `workshop` · `supervision` · `service` · `outreach`

## Roadmap

- Zotero integration for richer reading progress tracking
- Shareable profile card

## Development

```bash
git clone https://github.com/Zhao-Jun-Yong/scholar-quest.git
cd scholar-quest
npm install
npm run dev    # watch mode — rebuilds on save and copies to vault
npm test       # run tests
```

## Citation

If you use Scholar Quest in your work, please cite it:

```
Yong, Z.-J. (2026). Scholar Quest: Gamify your academic workflow with XP and levels (v1.0.0).
https://doi.org/10.5281/zenodo.19467725
```

A `CITATION.cff` file is included for automated citation tools (GitHub, Zotero, Zenodo).

## License

MIT — see [LICENSE](LICENSE).

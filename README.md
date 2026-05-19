# Scholar Quest

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-zhaojun0425-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/zhaojun0425)

An [Obsidian](https://obsidian.md) plugin that gamifies academic work with XP, levels, and milestone tracking.

**Design philosophy:** Gamification should accelerate productivity, not become a task itself. XP is awarded silently in the background; wins surface automatically.

## Features

- **Auto-detected XP** — earn points for reading papers (via keyword emoji progression), creating and developing atomic notes, and writing manuscript drafts
- **Career calibration** — one-time onboarding wizard estimates your starting level from your academic history (degrees, publications, grants, talks, supervision, peer reviews); re-runnable any time via the command palette
- **Milestone system** — 14 project types (manuscript, conference, grant, thesis, data collection, peer review, and more) with predefined milestone templates; mark milestones complete via command palette
- **Sidebar panel** — profile header with tier avatar and current level, XP progress bar, recent activity feed, achievements, and active projects with pending milestones; open via the graduation cap ribbon icon
- **Achievement system** — 26 unlock-based achievements tied to XP milestones, level thresholds, activity counts, and career events
- **Tier avatar progression** — 12 visual tiers from egg stages through Nova; your avatar evolves in the sidebar as you level up
- **Manual log** — quickly log off-Obsidian activities (data analysis, fieldwork) in ~2 seconds
- **Level system** — 12 tiers, levels 1–60, XP per level = 300 × N
- **Status bar** — ambient level indicator: `⚗️ Lv 7 · ████░░ · +30 today`
- **Fully configurable** — vault paths, tags, XP values, milestone templates, and tier names all editable in settings

## Getting Started

1. **Install** the plugin (see [Installation](#installation-manual) below)
2. **Open Obsidian** — the career calibration wizard appears automatically on first launch
3. **Enter your academic history** (rough estimates are fine) to set a starting level, or click "Start at Level 1" to begin fresh
4. **Open the sidebar** via the graduation cap icon in the ribbon, or from the right sidebar
5. **Work normally** — XP accumulates in the background as you read papers, develop notes, and hit milestones

The plugin tracks your vault activity automatically. No manual XP logging required for core activities.

## Recommended Workflow

Scholar Quest is designed around a common academic Obsidian setup:

- **Paper notes** in a sources folder (`Atlas/Sources/` by default), with a `keywords` frontmatter field tracking reading status via emoji (`📥 → 👀 → ✅`). The plugin reads these emoji to award XP automatically.
- **Atomic notes** in an ideas folder (`Atlas/Ideas/` by default), tagged with a card tag (`cards/atom` by default). Each note captures a single idea or concept.
- **Project notes** in a projects folder (`Efforts/` by default), tagged by project type (e.g. `project/manuscript`). The plugin reads these to initialise milestone tracking.

You don't need to follow this structure exactly — all paths and tags are configurable in Settings → Scholar Quest.

**New to this workflow?** These are good starting points:

- [Obsidian](https://obsidian.md) — the note-taking app this plugin runs on
- [Zettelkasten method](https://zettelkasten.de) — the atomic note-taking approach the ideas folder is built around
- [Zotero](https://zotero.org) — reference manager; pair with the [Zotero Integration](https://github.com/mgmeyers/obsidian-zotero-integration) plugin to import paper notes directly into Obsidian

## XP Sources

| Activity | XP | How |
|---|---|---|
| Paper skimmed | 20 | `keywords` frontmatter: `📥 → 👀` |
| Paper completed | 50 | `keywords` frontmatter: `→ ✅` |
| New atomic note | 30 | New file with atom tag created |
| Atomic note developed | 10 | +50 words or +1 wikilink (once/hr per file) |
| Writing progress | 10 | Per 100 words above peak in manuscript file |
| Project milestones | 20–300 | Via "Complete milestone" command |
| Manual activities | 40+ | Via "Log activity" command |

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

## Achievements

26 achievements unlock based on your progress. Conditions include XP milestones (Getting Warmed Up, In the Zone, Veteran), level thresholds (Kindled, Hatched, Risen, Luminary, Nova), activity counts (Bookworm, Zettelkasten, Relentless), and career events (Accepted!, Funded!, Doctor!). Unlocked achievements appear as chips in the sidebar; locked ones are visible but dimmed.

## Commands

- `Scholar Quest: Log activity` — log a manual academic activity
- `Scholar Quest: Complete milestone` — mark a project milestone done
- `Scholar Quest: Show XP summary` — see your current level, total XP, and today's gain
- `Scholar Quest: Import career history` — re-run the career calibration wizard

## Installation (Manual)

1. Download `main.js` and `manifest.json` from the [latest release](../../releases/latest)
2. Create a folder `<your-vault>/.obsidian/plugins/scholar-quest/`
3. Copy both files into that folder
4. Reload Obsidian → Settings → Community plugins → enable Scholar Quest

Requires Obsidian 1.4.0 or later. Works on desktop and mobile.

## Configuration

Go to **Settings → Scholar Quest** to configure:

- **Vault paths** — sources folder, ideas folder, projects folder
- **Tags** — atom note tag, project type tags (14 types)
- **XP values** — per activity type and threshold
- **Milestone templates** — add, remove, or rename milestones per project type; reset to defaults
- **Manual activities** — add custom activities with custom XP values
- **Level system** — tier names, status bar icon

## Default Vault Structure

The plugin ships with defaults matching an [Obsidian Zettelkasten](https://obsidian.md) setup:

| Setting | Default |
|---|---|
| Sources folder | `Atlas/Sources` |
| Ideas folder | `Atlas/Ideas` |
| Projects folder | `Efforts` |
| Atom note tag | `cards/atom` |
| Manuscript tag | `project/manuscript` |

All defaults are overridable in settings.

## Project Types

`manuscript` · `conference` · `invited-talk` · `peer-review` · `grant` · `report` · `thesis` · `data` · `software` · `teaching` · `workshop` · `supervision` · `service` · `outreach`

## Roadmap

- **Phase 3:** Shareable profile card, social leaderboard

## Development

```bash
git clone https://github.com/Zhao-Jun-Yong/scholar-quest.git
cd scholar-quest
npm install
npm run dev    # watch mode — rebuilds main.js on save
npm test       # run tests
```

Copy `main.js` and `manifest.json` to your vault's `.obsidian/plugins/scholar-quest/` folder.

## License

MIT — see [LICENSE](LICENSE).

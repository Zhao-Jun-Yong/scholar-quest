# Scholar Quest

An [Obsidian](https://obsidian.md) plugin that gamifies academic work with XP, levels, and milestone tracking.

**Design philosophy:** Gamification should accelerate productivity, not become a task itself. XP is awarded silently in the background; wins surface automatically.

## Features

- **Auto-detected XP** — earn points for reading papers (via keyword emoji progression), creating and developing atomic notes, and writing manuscript drafts
- **Milestone system** — 14 project types (manuscript, conference, grant, thesis, data collection, peer review, and more) with predefined milestone templates; mark milestones complete via command palette
- **Manual log** — quickly log off-Obsidian activities (data analysis, fieldwork) in ~2 seconds
- **Level system** — 5 tiers (Spark → Ember → Flame → Beacon → Nova), levels 1–25, XP = 300 × N per level
- **Status bar** — ambient level indicator: `⚗️ Lv 7 · ████░░ · +30 today`
- **Fully configurable** — vault paths, tags, XP values, milestone templates, and tier names all editable in settings

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

## Commands

- `Scholar Quest: Log activity` — log a manual academic activity
- `Scholar Quest: Complete milestone` — mark a project milestone done
- `Scholar Quest: Show XP summary` — see your current level, total XP, and today's gain

## Installation (Manual)

1. Download `main.js` and `manifest.json` from the [latest release](../../releases/latest)
2. Create a folder `<your-vault>/.obsidian/plugins/scholar-quest/`
3. Copy both files into that folder
4. Reload Obsidian → Settings → Community plugins → enable Scholar Quest

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

- **Phase 2:** Sidebar panel with full profile, tier icons/avatars, achievement system
- **Phase 3:** Shareable profile card, social leaderboard

## Development

```bash
git clone https://github.com/Zhao-Jun-Yong/scholar-quest
cd scholar-quest
npm install
npm run dev    # watch mode — rebuilds main.js on save
npm test       # run tests (56 tests)
```

Copy `main.js` and `manifest.json` to your vault's `.obsidian/plugins/scholar-quest/` folder.

## License

MIT

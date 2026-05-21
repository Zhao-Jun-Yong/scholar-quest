# Scholar Quest

[![DOI](https://zenodo.org/badge/doi/10.5281/zenodo.19467725.svg)](https://doi.org/10.5281/zenodo.19467725)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-zhaojun0425-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/zhaojun0425)

An [Obsidian](https://obsidian.md) plugin that gamifies academic work with XP, levels, and milestone tracking.

**Design philosophy:** Gamification should accelerate productivity, not become a task itself. XP is awarded silently in the background; wins surface automatically.

## Features

- **Auto-detected XP** — earn points for reading papers, creating and developing atomic notes, and writing in project files
- **Career calibration** — onboarding wizard estimates your starting level from your academic history across 6 categories (credentials, publications, grants & patents, recognition, supervision & service); re-opens with previous values pre-filled so you only update what has changed
- **Milestone system** — 14 project types with predefined milestone templates; mark milestones complete via the sidebar or command palette
- **Sidebar panel** — tier avatar, XP progress bar, daily word count with session bonus tracker, streak counter, recent activity feed, achievements, and active projects with pending milestones
- **Achievement system** — 36 pixel art achievements tied to XP milestones, level thresholds, activity counts, and career events
- **Daily streak** — open Obsidian each day to build a streak; displayed with a pixel art flame icon from day 2
- **Writing session bonus** — earn a one-time daily bonus when you write 500+ net new words in any project file
- **Daily presence** — small XP reward for opening Obsidian each day
- **Tier avatar progression** — 12 visual tiers from dormant egg to Nova; your avatar evolves in the sidebar as you level up
- **Manual log** — browse a searchable catalog of 52 activities across 10 discipline categories (wet lab, fieldwork, teaching, outreach, clinical research, and more); build a personal shortlist; log in ~2 seconds via the command palette
- **Level system** — 12 tiers, levels 1–60; XP per level scales linearly to level 20, then flattens at 6,000 XP/level for long-term play
- **Status bar** — ambient level indicator: `Lv 7 · ████░░ · +30 today`
- **Fully configurable** — vault paths, tags, milestone templates, and tier names all editable in settings

## Installation

**Community plugin catalog** *(pending Obsidian review)*
Settings → Community plugins → Browse → search "Scholar Quest"

**BRAT** *(available now — recommended for early adopters)*
1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) from the community catalog
2. Open BRAT settings → Add Beta Plugin → enter `Zhao-Jun-Yong/scholar-quest`
3. Reload Obsidian

**Manual**
Download `main.js` and `manifest.json` from the [latest release](https://github.com/Zhao-Jun-Yong/scholar-quest/releases/latest), place both in `.obsidian/plugins/scholar-quest/`, and reload Obsidian.

## Getting Started

1. **Install** the plugin (Settings → Community plugins → Browse → search "Scholar Quest")
2. **Open Obsidian** — the career calibration wizard appears automatically on first launch
3. **Enter your academic history** across credentials, publications, grants & patents, recognition, and supervision & service — rough estimates are fine — then click "Set starting level", or click "Start at Level 1" to begin fresh
4. **Open the sidebar** via the graduation cap icon in the ribbon
5. **Work normally** — XP accumulates in the background as you read papers, develop notes, and hit milestones

## XP Sources

| Activity | XP | How |
|---|---|---|
| Paper skimmed | 20 | Reading status field set to 👀 for the first time (once per paper) |
| Paper completed | 50 | Reading status field set to ✅ for the first time (once per paper) |
| New atomic note | 30 → 15 → 5 | New file with atom tag; diminishing returns after 10/30 per day |
| Atomic note developed | 10 | +50 words or +1 wikilink (once/hr per file) |
| Writing progress | 20 | Per 100 net new words above peak in any project file |
| Writing session bonus | 50 | Once per day when 500+ words written |
| Daily presence | 5 | Opening Obsidian each day |
| Project milestones | 20–300 | Via sidebar or "Complete milestone" command |
| Manual activities | 15–50 | Via "Log activity" command — 52-activity catalog |

## Career Calibration

The career wizard awards starting XP across 19 fields in 6 categories. Re-opening it (via "Import career history") pre-fills all previous values — only update what has changed, and the XP difference is applied automatically.

| Category | Field | XP |
|---|---|---|
| **Credentials** | PhD | 1,200 |
| | Masters | 400 |
| | Postdoctoral positions (count of positions, not years) | 400 each |
| **Publications** | First-author papers | 500 each |
| | Co-author papers | 150 each |
| | Authored books / monographs | 2,000 each |
| | Edited volumes | 700 each |
| | Software / datasets released | 350 each |
| **Grants & Patents** | Grants as PI | 900 each |
| | Grants as co-I | 200 each |
| | Patents granted | 450 each |
| **Recognition** | Invited talks / keynotes | 200 each |
| | Conference presentations | 100 each |
| | Major awards / honors | 400 each |
| **Supervision & Service** | PhD students supervised to completion | 300 each |
| | Masters students supervised to completion | 150 each |
| | PhD theses examined (external/internal) | 150 each |
| | Peer reviews completed | 80 each |
| | Editorial board roles | 300 each |

A fresh postdoc (PhD + 3 papers + a few talks) starts around Level 8. A mid-career researcher starts around Level 13. A senior professor with a full career history starts around Level 24–25.

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

A typical active researcher reaches the flat zone (Wisp, level 21) after about 3 years of active use.

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

- **Reference notes** in a sources folder (`Atlas/Sources/` by default), with a frontmatter field tracking reading progress — set it to your skimmed value (👀 by default) when you skim a source, and your completed value (✅ by default) when you finish it
- **Developed notes** in a notes folder (`Atlas/Ideas/` by default), tagged to mark them as eligible for XP
- **Project notes** in a projects folder (`Efforts/` by default), tagged by project type (e.g. `project/manuscript`)

All folder paths, tag names, and frontmatter field names are configurable in Settings → Scholar Quest.

## Commands

| Command | Action |
|---|---|
| `Scholar Quest: Log activity` | Log a manual academic activity |
| `Scholar Quest: Complete milestone` | Mark a project milestone done |
| `Scholar Quest: Show XP summary` | See your current level, total XP, and today's gain |
| `Scholar Quest: Import career history` | Re-open the career calibration wizard (pre-fills previous values) |
| `Scholar Quest: Open Scholar Quest panel` | Open the sidebar |

## Configuration

Go to **Settings → Scholar Quest** to configure:

- **Vault paths** — sources folder, notes folder, projects folder
- **Reading tracking** — the frontmatter field and the values that mean "skimmed" and "completed"
- **Note tracking** — atom tag and the frontmatter field it lives in
- **XP values** — writing rate, session bonus threshold, daily presence, and more
- **Manual log activities** — build a personal shortlist from a 52-activity catalog; browse by category or search
- **Milestone templates** — add custom milestones per project type (built-in milestone XP values are fixed; custom milestones capped at 200 XP)
- **Tier names** — rename the 12 tiers to whatever suits you

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
Yong, Z.-J. (2026). Scholar Quest: Gamify your academic workflow with XP and levels (v1.2.0).
https://doi.org/10.5281/zenodo.19467725
```

A `CITATION.cff` file is included for automated citation tools (GitHub, Zotero, Zenodo).

## License

MIT — see [LICENSE](LICENSE).

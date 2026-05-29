# Changelog

## [1.5.0] — 2026-05-29

### UI

- **Dragon picker shows T1 eggs** — onboarding wizard now previews each colour theme as its Tier 1 egg instead of the Tier 11 dragon; all 7 options (purple, blue, teal, green, crimson, pink, orange) are displayed in a single row using a 7-column grid with responsive sizing

---

## [1.4.0] — 2026-05-24

### New features

- **ORCID import in career calibration** — paste your ORCID iD in the career calibration wizard to pre-fill publications, grants, peer reviews, invited talks, awards, and editorial roles from your public profile. Fields auto-filled by ORCID are highlighted with an accent border so you know what to review. First-author vs co-author split uses contributor position in your ORCID record. Three fields have no ORCID equivalent (students supervised, theses examined) and remain manual.

### Bug fixes

- **Vault scan flooded activity log** — the first-time vault scan called `awardXP()` once per paper, which caused large vaults (500+ papers) to overflow the 500-entry activity log and silently drop prior entries including career history. The scan now accumulates XP and posts a single `vault-scan` summary entry, keeping the log intact.

---

## [1.3.1] — 2026-05-21

### Bug fixes

- **Writing XP was silently broken** — a typo in the default project tag (`projec/manuscript` instead of `project/manuscript`) caused writing progress XP and the daily session bonus to never trigger for manuscript files; fixed in default settings

### Changes

- **Writing XP extended to all project types** — writing progress XP and the daily session bonus now apply to any file tagged with a known project tag (manuscript, thesis, grant, report, conference, invited-talk, peer-review, workshop, and others), not just manuscript files
- **Removed unfinished `research-program` project type** — milestone templates and default tag entry removed; the type was never surfaced in the UI

---

## [1.3.0] — 2026-05-21

### Career calibration

- **7 new career fields** — postdoctoral positions, edited volumes, software/datasets released, patents granted, major awards/honors, PhD theses examined, and editorial board roles; form now covers 19 fields across 6 categories
- **XP reweightings** — grants as PI 600 → 900 (reflects 10–20% acceptance rates); authored books 1,200 → 2,000 (reflects humanities monograph as primary output); PhD 1,000 → 1,200
- **Re-open pre-fill** — re-opening "Import career history" now shows previous values pre-filled; only edit what has changed; confirmation shows the net XP delta (e.g. `+1,200 XP`)
- **UI redesign** — career form reorganised into a compact 2-column grid layout; 19 fields fit in roughly the same space as the previous 12
- **Dragon locked on re-open** — dragon picker hidden when re-opening; replaced with a locked-dragon notice; "Start at Level 1" replaced with "Cancel" to prevent accidental XP wipe

### Settings

- **Removed "Unread value" setting** — the unprocessed reading tag (📥) was never read by any plugin logic; removed from settings, types, and defaults to reduce noise. Only the skimmed (👀) and completed (✅) values affect XP.

---

## [1.1.0] — 2026-05-19

### New features
- **Configurable frontmatter field names** — three new settings under Vault Setup:
  - *Reading status field* — frontmatter property containing reading status emoji (`📥 👀 ✅`); default `keywords`
  - *Atomic note tag field* — frontmatter property containing atomic note tags; default `tags`
  - *Project tag field* — frontmatter property containing project type tags; default `tags`

  Users with non-standard vault conventions (e.g. using `keywords` instead of `tags` for note classification) can now point the plugin to their actual field names without restructuring their vault.

---

## [1.0.0] — 2026-05-19

### New features
- **Daily streak** — consecutive days opening Obsidian tracked and displayed with a pixel art flame icon in the sidebar (shows from day 2 onward)
- **Writing session bonus** — one-time daily XP bonus (+50) when you write 500+ net new words in a manuscript file
- **Daily presence** — small XP reward (+5) for opening Obsidian each day
- **Word count progress** — live sidebar display showing words written today and progress toward the session bonus threshold; updates as you type
- **Sidebar auto-refresh** — sidebar now updates automatically after every file edit, not just on open
- **XP settings section** — all XP values (writing rate, session bonus, daily presence, etc.) now editable in Settings → Scholar Quest
- **Activity grouping** — consecutive writing-progress entries for the same file are merged in the activity feed to reduce noise

### Achievements
- 10 new achievements added (7 career milestone + 3 late-career stretch), all with PixelLab pixel art icons:
  - **Established** (50,000 XP), **Well-Cited** (100,000 XP), **Distinguished** (175,000 XP), **Eminent** (260,000 XP)
  - **Deep Thinker** (200 notes developed), **Marathon Writer** (250 writing sessions), **Milestone Chaser** (25 milestones)
  - **Grand Zettelkasten** (500 notes developed), **Endless Writer** (500 writing sessions), **Project Veteran** (100 milestones)
- Achievement unlock notifications no longer display raw icon data

### Balance changes
- Writing XP doubled: 10 → 20 XP per 100 net new words
- XP curve flattened: cap introduced at 6,000 XP/level from level 20 onward (previously unbounded linear)
  - Total XP to max level: ~303,000 (down from ~549,000)
  - Active researcher reaches max level around year 10

### Bug fixes
- **Daily presence double-award** — presence XP could be awarded twice if the plugin reloaded mid-save; fixed by persisting the guard date before awarding XP
- **Writing snapshot fields lost** — `dailyWritingDate`, `dailyWritingStart`, and `writingBonusAwarded` were being discarded on every file edit; these are now preserved correctly
- **Onboarding level preview capped at 25** — career import preview now correctly previews up to level 60

### UI
- Level pips (5-dot tier indicator) removed from sidebar
- Sidebar header spacing tightened

---

## [0.3.0] — 2026-05-15

- Project archive/unarchive in sidebar
- Achievements panel with locked/unlocked chips
- Status bar with pixel art scroll icon
- Manual activity logger

## [0.2.0] — 2026-04-20

- Milestone system with 14 project types
- Career calibration onboarding wizard
- Tier avatar progression (12 tiers)

## [0.1.0] — 2026-03-10

- Initial release: XP engine, sidebar, atomic note and paper tracking

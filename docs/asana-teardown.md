# Asana Teardown — Finito "full clone" spec

> Source of truth for making Finito look & function like Asana.
> Everything here is **measured from the live app** (`app.asana.com`, signed-in, List view,
> dark-mode system theme, 1440×900) by reading the computed DOM — not from memory or marketing.
> Captured 2026-10-25. Companion machine-readable tokens: [`asana-tokens.json`](./asana-tokens.json).

## 0. Method
- Asana ships a CSS design-token system: **1,868 custom properties** on `:root` (light defaults)
  with dark overrides applied via `body.DesignTokenThemeSelectors-theme--systemDarkMode`.
- Light values read from `getComputedStyle(:root)`; dark from `getComputedStyle(document.body)`.
- Layout/type read from `getBoundingClientRect` + `getComputedStyle` on rendered elements.
- Re-measure before building each new piece; this doc is additive.

## 1. Color — semantic (the ~100 tokens that actually drive the UI)

| Role | Light | Dark |
|---|---|---|
| Canvas (app bg) | `#f3f3f3` | `#262626` |
| Surface / card (bg-weak) | `#ffffff` | `#1e1e1e` |
| Surface strong (bg-strong) | `#eaeaea` | `#2b2b2b` |
| Row hover (bg-hover) | `rgba(38,38,38,.03)` | `rgba(255,255,255,.06)` |
| Row active (bg-active) | `rgba(38,38,38,.06)` | `rgba(255,255,255,.11)` |
| Border | `#eaeaea` | `#333333` |
| Border hover | `#c6c6c6` | `#505050` |
| Border strong | `#e1e1e1` | `#424242` |
| Border active | `#888888` | — |
| Text | `#050505` | `#f3f3f3` |
| Text weak (secondary/muted) | `#636363` | `#a0a0a0` |
| Text disabled | `#aaaaaa` | `#636363` |

### Brand & accents
- **Coral/red (brand signature)** — `--color-button-creation-background` / `--color-logo-background-strong`:
  `#ff584a`, hover `#fc4136`, active `#f32822`. Same in light & dark. Used *sparingly*: Create button,
  logo, AI accents (`--color-ai-icon`), omnibutton hover, danger-border-active.
  Weak coral tint: `#ffe4e0` (logo-weak / omnibutton hover bg).
- **Primary action blue** — links & primary buttons: text/border `#2c60b8`, hover text `#1b4da0`,
  strong-bg `#4075cf`→active `#2c60b8`. Dark: text `#6ca0f8`, border `#4075cf`.
- **Success** green: strong `#46a75a`, border `#6fca7f`.
- **Warning** yellow: strong `#e9c300`.
- **Danger** red: strong `#e22923`, border `#ff998b`/`#ff584a`.

### Project / tag palette (customization surfaces)
16 families: `red, orange, yellow-orange, yellow, yellow-green, green, blue-green, aqua, blue,
indigo, purple, magenta, hot-pink, pink, cool-gray, none`. Each has `primary`/`secondary` ×
`background|border|text|icon` × `default|hover|active`. Full set in `asana-tokens.json →
customizationSurfaces`. Pattern: **primary** = saturated fill with near-black `#050505` text;
**secondary** = tinted bg with colored icon. These drive section/tag/status pills.

## 2. Typography
- **Body font = system stack** (no webfont): `-apple-system, system-ui, "Segoe UI", Roboto,
  "Helvetica Neue", Helvetica, Arial, sans-serif`. Base **14px**, weight 400.
- Role scale (measured):
  | Element | Size / line-height / weight |
  |---|---|
  | Task row title | 14px / normal / 400 |
  | Column header | 14px / normal / 400, color = text-weak |
  | Section header | 16px / 20px / 500 |
  | Add-task row | 14px / 400, color = text-weak (`#a0a0a0`) |
  | Tab label | 14px / 500 |
- **Implication for Finito:** drop Atkinson Hyperlegible + Mono-headings. Switch to the system stack,
  14px base, and reserve weight 500 (not 600/mono) for section/emphasis.

## 3. Spacing, radius, sizing
- **Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 80 (`--box-spacing-*`).
- **Sizing scale:** 12,16,20,24,28,32,36,40,48,56,64,72,80,96,120,160,200,240,280,320,360,400,480,560,640,720.
- **Radius:** 4px (`--globule-border-radius`, pills/tags); **6px** on buttons, tabs, completion control.
- **Avatars:** xxs 16, xs 20, s 24, m 28, l 36, xl 48, huge 64, mega 120. (List assignee ≈ 20–24.)
- **Button padding:** sm 4 / md 8 / lg 12 / xl 16.

## 4. Layout (List view, 1440×900)
```
┌──────────────────────────────── topbar 48px (Create · Search · Work with Dash) ─────────────┐
├ rail 64px ┬ project sidebar 180px ┬────────────── main content ───────────────────────────────┤
│ icons:    │ Home, Inbox,          │ project header (icon · name · ★ · set status · Share · ...) │
│ Work      │ My tasks, Projects,   │ tabs: Overview · List · Board · Timeline · Dashboard ·      │
│ Agents    │ Portfolios, + project │       Calendar · Messages · Files · +                       │
│ Strategy  │ list w/ color icons   │ toolbar row (filter/sort/group/options)                     │
│ ...       │                       │ ── spreadsheet ──                                           │
│           │ Upgrade / Invite      │ column header row 33px (Task name | Assignee | Due | …)      │
│ avatar    │                       │ ▸ Section header 36px, 16/500, collapsible                  │
└───────────┴───────────────────────┤   task row 37px: ◯ complete · title 14/400 · cells         │
                                     │   Add task… (muted)                                        │
```
- **Topbar:** 48px tall.
- **Far-left rail:** 64px, icon nav (Home workspace / Agents / Strategy / Knowledge / People / Clients / More), account avatar bottom.
- **Project sidebar:** ~180px (Home, Inbox, My tasks, Projects, Portfolios, then workspace project list with colored square icons, Upgrade + Invite pinned bottom).
- **Tabs:** selected = blue text `#6ca0f8` on dark-blue pill `rgb(0,27,78)` (dark mode), 6px radius, 28px tall, weight 500. Unselected = text-weak, transparent.
- **Spreadsheet:** continuous grid (not cards). Column header row **33px**. Section header **36px** (▸ chevron + 16px/500 name + count). Task row **37px**, sticky first column = completion circle + task name; remaining columns are custom fields rendered as pills.
- **Add task** ghost row under each section, muted.

## 5. Motion
- **Standard interactive transition:** `0.2s ease` on `background, border-color, box-shadow, color, fill`.
- Token durations: enter-small `.15s` / enter-large `.3s`; exit-small `.1s` / exit-large `.2s`;
  opacity enter `75ms` / exit `50ms`; drawer open `.3s` / close `.2s`;
  **task-pane open `.5s`** / close `.2s` (deliberately slow, satisfying); step fwd `.15s` / back `.1s`.

## 6. Z-index layers (`--level-*`)
popout 150 · aiFloatingPane/tabbyCats 200 · layer 250 · modal 300 · **toast 350 /
creatureCelebration 350** · educationPopover 400 · attachmentPicker 1000 · loadingScreen 2000 ·
errorModal 2050 · dragAndDropPreview 2100.

## 7. The completion celebration (famous "creatures")
- `--level-creatureCelebration: 350`, `--level-tabbyCats: 200`.
- Rainbow confetti palette: purple `#805bee`, red `#f32822`, bright-yellow `#e9c300`,
  green `#46a75a`, blue `#2c60b8`, dark-yellow `#d7b500`.
- Standard (non-rainbow) completion glow: green `#6fca7f` / blue `#2c60b8`.

## 8. Rebuild mapping → Finito
Current Finito identity to replace: purple `#6600ff`, Atkinson fonts, mono headings,
per-group white cards, 240px sidebar.

| Phase | Work |
|---|---|
| **A. Tokens** | Rewrite `src/index.css` `:root` + `[data-theme=dark]` to the tables in §1/§3/§5. Primary → coral `#ff584a` only where Asana uses it; action blue `#2c60b8` for links/primary buttons. System font stack; drop Atkinson/Mono/@font-face. |
| **B. Chrome** | 48px topbar; 64px icon rail + 180px project sidebar (replaces current white pill sidebar); Asana tab bar with blue selected pill. |
| **C. List view** | Convert per-group cards → one continuous spreadsheet: 37px rows, 36px collapsible section headers (16/500), 33px muted column headers, completion circle, field pills, ghost add-task row. |
| **D. Task pane** | Right pane, `.5s` open, Asana field stack + activity/comment feed. |
| **E. Board / Timeline / Calendar** | Re-skin to match (measure each live first). |
| **F. Delight** | Completion celebration (creatures/confetti) + green-fill circle. |

## 9. Still to measure (next passes)
- Completion circle exact diameter/stroke + hover→check→green-fill states.
- Task detail pane full anatomy (field rows, dependency UI, comment composer).
- Board card anatomy; Timeline/Calendar chips.
- Exact easing curves beyond `ease` (any cubic-bezier on pane/drawer).
- Light-mode full token dump (only 16 dark overrides captured so far; light `:root` captured whole).

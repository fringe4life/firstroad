# Lucide → Astryx icon map

Ticket: [#68](https://github.com/fringe4life/firstroad/issues/68). Map: [#64](https://github.com/fringe4life/firstroad/issues/64).

Inventory from the dirty `apps/web` worktree (live UI, `lucide-react@1.33.0`). Astryx facts from `@astryxdesign/cli@0.5.4` (`astryx docs icons --dense` / `--json`), `@astryxdesign/core@0.5.4` `Icon` / `IconName`, and `@astryxdesign/theme-neutral@0.5.4`.

## How Astryx icons work

Astryx does **not** ship a Lucide-style icon pack. There is no `TrashIcon` / `Kanban` export from `@astryxdesign/core`. Glyphs are semantic registry keys, not named SVG components.

Consumption API:

```tsx
import {Icon} from '@astryxdesign/core/Icon';

<Icon icon="close" size="md" color="primary" />
```

`icon` is one of:

1. An `IconName` string (28 keys; resolved through the theme registry, then core `defaultIcons`).
2. A namespaced extension key (`numberInput:stepperDown`, or an app key such as `firstroad:kanban`).
3. An SVG component (`ComponentType<SVGProps<SVGSVGElement>>`) — **the documented fallback** for anything not in the semantic list.

`defaultIcons` (inline SVGs in core) is **not** a public named export. `Icon/index.ts` exports `Icon`, `renderIconSlot`, `useIcon`, `registerIcons`, `getIcon`, `getExtendedIcon`, `resetIcons`, and types. It does not export per-glyph components.

`@astryxdesign/theme-neutral` is documented as “Muted, minimal theme (Lucide icons)”. Its registry maps the 28 `IconName`s onto `lucide-react` components. Switching app code to `<Icon icon="close" />` plus `neutralTheme` still pulls Lucide for those 28 glyphs unless the theme registry is replaced.

## Import paths (Astryx)

| Export | Import path | Role |
| --- | --- | --- |
| `Icon` | `@astryxdesign/core/Icon` | Render a semantic name or a custom SVG. Prop is `icon`, not `name`. |
| `IconName` | `@astryxdesign/core/Icon` | Union of the 28 semantic strings. |
| `IconType` | `@astryxdesign/core/Icon` | `ComponentType<SVGProps<SVGSVGElement>>` for custom glyphs. |
| `getIcon` / `getExtendedIcon` | `@astryxdesign/core/Icon` | Registry lookup (RSC-safe). `getExtendedIcon(key, fallback)` for namespaced keys. |
| `neutralTheme` | `@astryxdesign/theme-neutral` (source) or `@astryxdesign/theme-neutral/built` | Theme object; `icons` field is the live registry. |
| `neutralIconRegistry` | `@astryxdesign/theme-neutral` | The 28-key Lucide-backed registry (`export {neutralIconRegistry} from './icons'`). |

CLI names (authoritative list): `close`, `chevronDown`, `chevronLeft`, `chevronRight`, `chevronsLeft`, `chevronsRight`, `check`, `success`, `error`, `warning`, `info`, `calendar`, `clock`, `externalLink`, `menu`, `moreHorizontal`, `search`, `arrowUp`, `arrowDown`, `arrowsUpDown`, `funnel`, `eyeSlash`, `viewColumns`, `copy`, `checkDouble`, `wrench`, `stop`, `microphone`.

No `chevronUp`, `moreVertical`, spinner / loader, plus, trash, pencil, or product glyphs in that list.

## Lucide alias collapse

`lucide-react@1.33.0` identity (same component reference):

| Canonical | Aliases used in firstroad |
| --- | --- |
| `X` | `XIcon` |
| `Check` | `CheckIcon`, `LucideCheck` |
| `CircleCheck` | `CheckCircle2`, `CircleCheckIcon` |
| `ChevronLeft` | `ChevronLeftIcon` |
| `ChevronRight` | `ChevronRightIcon` |
| `ChevronDown` | `ChevronDownIcon` |
| `ChevronUp` | `ChevronUpIcon` |
| `Calendar` | `CalendarIcon` |
| `File` | `FileIcon` |
| `Image` | `ImageIcon` |
| `Archive` | `ArchiveIcon` |
| `Info` | `InfoIcon` |
| `Minus` | `MinusIcon` |
| `MoreHorizontal` | `MoreHorizontalIcon` |
| `TriangleAlert` | `TriangleAlertIcon` (`AlertTriangle` is the same component; unused import name) |
| `OctagonX` | `OctagonXIcon` |
| `LoaderCircle` | `Loader2Icon`, `LucideLoaderCircle` (`Loader2` same) |
| `Loader` | `LucideLoader` — **not** `LoaderCircle` |
| `ArrowUpRightFromSquare` | `LucideArrowUpRightFromSquare`, `SquareArrowOutUpRight` |
| `ArrowUpDown` | `LucideArrowUpDown` |
| `ArrowLeftRight` | `LucideArrowLeftRight` |
| `Trash` | `LucideTrash` — **not** `Trash2` |
| `Pen` | `LucidePen` — **not** `Pencil` |
| `Pencil` | `LucidePencil` |
| `Plus` | `LucidePlus` |
| `Ban` | `LucideBan` |
| `Lock` | `LucideLock` |
| `User` | `LucideUser` |
| `LogOut` | `LucideLogOut` |
| `Paperclip` | `LucidePaperclip` |
| `Slash` | `LucideSlash` |
| `MoreVertical` | `LucideMoreVertical` |
| `UserCog` | `LucideUserCog` |
| `Book` | `LucideBook` |
| `BookCopy` | `LucideBookCopy` |
| `CircleUser` | `LucideCircleUser` |
| `Library` | `LucideLibrary` |
| `Users` | `LucideUsers` |

Distinct glyphs (not aliases): `Trash` ≠ `Trash2`; `Pen` ≠ `Pencil`; `Loader` ≠ `LoaderCircle`; `XCircle` ≠ `OctagonX`; `ExternalLink` ≠ `ArrowUpRightFromSquare`; `CheckCircle` ≠ `CircleCheck` / `CheckCircle2`.

63 import identifiers → 53 canonical Lucide glyphs. 54 files import `lucide-react`.

## Semantic map (`IconName`)

Match quality:

- **exact** — theme-neutral uses this same Lucide component for that `IconName`.
- **semantic** — CLI usage matches; glyph in `neutralIconRegistry` is a different Lucide icon.
- **none** — no `IconName`. Fallback in the last column.

Render path for every **exact** / **semantic** row: `Icon` from `@astryxdesign/core/Icon`, `<Icon icon="<IconName>" />`.

| Lucide import(s) | Canonical glyph | Astryx `IconName` | Match | Fallback if none |
| --- | --- | --- | --- | --- |
| `XIcon` | `X` | `close` | exact (`neutralIconRegistry.close` = `<X />`) | — |
| `ChevronDownIcon` | `ChevronDown` | `chevronDown` | exact | — |
| `ChevronLeft`, `ChevronLeftIcon` | `ChevronLeft` | `chevronLeft` | exact | — |
| `ChevronRight`, `ChevronRightIcon` | `ChevronRight` | `chevronRight` | exact | — |
| `Check`, `CheckIcon`, `LucideCheck` | `Check` | `check` | exact | — |
| `CheckCircle2`, `CircleCheckIcon` | `CircleCheck` | `success` | semantic (registry uses `CheckCircle`, not `CircleCheck`) | — |
| `XCircle` | `XCircle` | `error` | exact | — |
| `OctagonXIcon` | `OctagonX` | `error` | semantic (same status slot; different glyph) | — |
| `TriangleAlertIcon` | `TriangleAlert` | `warning` | exact (`AlertTriangle` ≡ `TriangleAlert`) | — |
| `InfoIcon` | `Info` | `info` | exact | — |
| `Calendar`, `CalendarIcon` | `Calendar` | `calendar` | exact | — |
| `Menu` | `Menu` | `menu` | exact | — |
| `MoreHorizontalIcon` | `MoreHorizontal` | `moreHorizontal` | exact | — |
| `LucideArrowUpDown` | `ArrowUpDown` | `arrowsUpDown` | exact | — |
| `LucideArrowUpRightFromSquare`, `SquareArrowOutUpRight` | `ArrowUpRightFromSquare` | `externalLink` | semantic (registry uses `ExternalLink`, a different Lucide icon) | — |
| `ChevronUpIcon` | `ChevronUp` | — | none | Custom SVG via `<Icon icon={ChevronUp} />`. No `chevronUp`. Do not invert `chevronDown` unless grilling accepts a rotated glyph. |
| `LucideMoreVertical` | `MoreVertical` | — | none | Custom SVG. Closest semantic is `moreHorizontal` (overflow). `MoreMenu` `@astryxdesign/core/MoreMenu` owns overflow chrome. |
| `Loader2Icon`, `LucideLoaderCircle` | `LoaderCircle` | — | none | Custom SVG. Button/IconButton `isLoading` covers submit/pending **buttons**; not a general spinner `IconName`. |
| `LucideLoader` | `Loader` | — | none | Same as `LoaderCircle` (distinct glyph). |
| `LucidePlus` | `Plus` | — | none | Custom SVG. |
| `LucideTrash` | `Trash` | — | none | Custom SVG. |
| `Trash2` | `Trash2` | — | none | Custom SVG. Keep distinct from `Trash` if both stay. |
| `LucidePen` | `Pen` | — | none | Custom SVG. |
| `LucidePencil`, `Pencil` | `Pencil` | — | none | Custom SVG. Keep distinct from `Pen`. |
| `LucideBan` | `Ban` | — | none | Custom SVG. |
| `LucideLogOut` | `LogOut` | — | none | Custom SVG. |
| `LucideLock` | `Lock` | — | none | Custom SVG. |
| `LucideUser` | `User` | — | none | Custom SVG. |
| `LucideUserCog` | `UserCog` | — | none | Custom SVG. |
| `LucideCircleUser` | `CircleUser` | — | none | Custom SVG. Closest unused semantic is none; `User` is a different glyph. |
| `LucideUsers` | `Users` | — | none | Custom SVG. |
| `LucideBook` | `Book` | — | none | Custom SVG. |
| `LucideBookCopy` | `BookCopy` | — | none | Custom SVG. |
| `LucideLibrary` | `Library` | — | none | Custom SVG. |
| `LucidePaperclip` | `Paperclip` | — | none | Custom SVG. |
| `LucideSlash` | `Slash` | — | none | Custom SVG. Astryx `Breadcrumbs` default separator is `/` (string), not an icon. |
| `LucideArrowLeftRight` | `ArrowLeftRight` | — | none | Custom SVG. Not `arrowsUpDown`. |
| `MinusIcon` | `Minus` | — | none | Custom SVG. |
| `Moon` | `Moon` | — | none | Custom SVG. Theme mode is `Theme` `@astryxdesign/core/theme`, not an icon name. |
| `Sun` | `Sun` | — | none | Custom SVG. |
| `Kanban` | `Kanban` | — | none | Custom SVG. Brand mark; candidate for a namespaced key (`firstroad:kanban`) on the app theme. |
| `Bug` | `Bug` | — | none | Custom SVG. Used as generic error/empty placeholder. Closest semantic: `error` (status), different glyph. |
| `CircleSlash2` | `CircleSlash2` | — | none | Custom SVG. Empty-state companion to `Bug`. |
| `ShieldCheck` | `ShieldCheck` | — | none | Custom SVG. Not `success` / `check`. |
| `TicketX` | `TicketX` | — | none | Custom SVG. |
| `Mail` | `Mail` | — | none | Custom SVG. |
| `MailX` | `MailX` | — | none | Custom SVG. |
| `MessageSquareWarning` | `MessageSquareWarning` | — | none | Custom SVG. Closest semantic: `warning`. |
| `File`, `FileIcon` | `File` | — | none | Custom SVG. |
| `FileImage` | `FileImage` | — | none | Custom SVG. |
| `FileExclamationPoint` | `FileExclamationPoint` | — | none | Custom SVG. |
| `ArchiveIcon` | `Archive` | — | none | Custom SVG. |
| `ImageIcon` | `Image` | — | none | Custom SVG. |

Unused `IconName`s in firstroad today: `chevronsLeft`, `chevronsRight`, `clock`, `search`, `arrowUp`, `arrowDown`, `funnel`, `eyeSlash`, `viewColumns`, `copy`, `checkDouble`, `wrench`, `stop`, `microphone`. Search UI exists (`ticket-search-input.tsx`) but does not import a Lucide search icon.

## Fallback (no equivalent)

Official rule ([icons docs](https://astryx.atmeta.com/docs/icons) + `astryx docs icons`): pass an SVG component to `Icon`. Any `ComponentType<SVGProps<SVGSVGElement>>` works. CLI example still shows Lucide and Heroicons as those SVGs:

```tsx
import {Icon} from '@astryxdesign/core/Icon';
import {PhotoIcon} from '@heroicons/react/24/outline';
import {HeartIcon} from 'lucide-react';

<Icon icon={PhotoIcon} size="lg" />
<Icon icon={HeartIcon} color="negative" />
```

Do not render raw `<svg>` / unwrapped Lucide components. Wiki contributing rules: wrap in `Icon`, or pass the component into an Astryx slot (`Button icon`, `SideNavItem icon`, `IconButton icon`) that wraps internally.

App-owned glyphs that should theme: register a namespaced key on `defineTheme({icons})` and resolve with `getExtendedIcon('firstroad:kanban', <KanbanGlyph />)` / `<Icon icon="firstroad:kanban" />`. Do not widen core `IconName`.

Map #64 destination is “migrate lucide → Astryx icons” and drop Lucide as an app import. That does **not** follow from the semantic list alone: 38 of 53 canonical glyphs have no `IconName`. Dropping `lucide-react` from `apps/web` requires either (a) keeping Lucide only inside `neutralIconRegistry` (theme package already depends on it), (b) swapping the theme registry to another pack (Heroicons, inline SVGs) **and** supplying custom SVGs for the 38, or (c) using core `defaultIcons` for the 28 and custom SVGs for the rest. Core fallbacks are “intentionally minimal (~1.4KB)” and themes are expected to override them.

## File inventory

Paths relative to `apps/web/src`.

| File | Lucide imports | Astryx |
| --- | --- | --- |
| `app/(auth)/accept-invitation/[id]/not-found.tsx` | `MailX` | none → custom SVG |
| `app/(auth)/tickets/[slug]/not-found.tsx` | `TicketX` | none → custom SVG |
| `app/(auth)/tickets/error.tsx` | `TicketX` | none → custom SVG |
| `components/breadcrumbs.tsx` | `LucideSlash` | none; prefer `Breadcrumbs` default `/` separator |
| `components/date-picker.tsx` | `CalendarIcon` | `calendar` (or drop: `DateInput` owns the calendar icon) |
| `components/form/submit-button.tsx` | `LucideLoaderCircle` | none; `Button isLoading` |
| `components/generic-component.tsx` | `Bug`, `CircleSlash2` | none → custom SVG |
| `components/header.tsx` | `Kanban` | none → custom SVG / `firstroad:kanban` |
| `components/pending-icon-button.tsx` | `LucideLoader` | none; `IconButton`/`Button isLoading` |
| `components/placeholder.tsx` | `MessageSquareWarning` | none → custom SVG (`warning` if status-only) |
| `components/sort-select.tsx` | `LucideArrowUpDown` | `arrowsUpDown` |
| `components/theme/theme-switcher.tsx` | `Moon`, `Sun` | none → custom SVG |
| `components/ui/breadcrumb.tsx` | `ChevronRightIcon`, `MoreHorizontalIcon` | `chevronRight`, `moreHorizontal` |
| `components/ui/calendar.tsx` | `ChevronLeft`, `ChevronRight` | `chevronLeft`, `chevronRight` (or drop: Astryx `Calendar`) |
| `components/ui/checkbox.tsx` | `CheckIcon` | `check` (or drop: `CheckboxInput` owns indicator) |
| `components/ui/dialog.tsx` | `XIcon` | `close` |
| `components/ui/dropdown-menu.tsx` | `CheckIcon`, `ChevronRightIcon` | `check`, `chevronRight` |
| `components/ui/input-otp.tsx` | `MinusIcon` | none → custom SVG (OTP is already a gap in #67) |
| `components/ui/select.tsx` | `CheckIcon`, `ChevronDownIcon`, `ChevronUpIcon` | `check`, `chevronDown`; `ChevronUp` none |
| `components/ui/sheet.tsx` | `XIcon` | `close` |
| `components/ui/sonner.tsx` | `CircleCheckIcon`, `InfoIcon`, `Loader2Icon`, `OctagonXIcon`, `TriangleAlertIcon` | `success`, `info`, none (loader), `error`, `warning` |
| `features/attachments/components/attachment-item.tsx` | `Trash2` | none → custom SVG |
| `features/attachments/components/attachment-preview.tsx` | `FileExclamationPoint`, `Trash2` | none → custom SVG |
| `features/attachments/constants.tsx` | `ArchiveIcon`, `FileIcon`, `FileImage`, `ImageIcon` | none → custom SVG |
| `features/auth/components/account-dropwdown.tsx` | `LucideLock`, `LucideUser` | none → custom SVG |
| `features/auth/components/sign-out-button.tsx` | `LucideLogOut` | none → custom SVG |
| `features/auth/components/user-profile-card.tsx` | `Calendar`, `CheckCircle2`, `Mail`, `XCircle` | `calendar`, `success`, none (`Mail`), `error` |
| `features/comment/components/add-comment-attachment-button.tsx` | `LucidePaperclip` | none → custom SVG |
| `features/comment/components/comment-delete-button.tsx` | `LucideTrash` | none → custom SVG |
| `features/comment/components/comment-edit-button.tsx` | `LucidePencil` | none → custom SVG |
| `features/invitations/components/invitation-cancel-button.tsx` | `LucideTrash` | none → custom SVG |
| `features/invitations/components/invitation-list.tsx` | `Bug`, `CircleSlash2` | none → custom SVG |
| `features/invitations/components/invite-member-button.tsx` | `LucidePlus` | none → custom SVG |
| `features/memberships/components/membership-action-buttons.tsx` | `LucideLogOut` | none → custom SVG |
| `features/memberships/components/membership-item.tsx` | `LucideBan`, `LucideCheck` | none (`Ban`), `check` |
| `features/memberships/components/membership-list.tsx` | `Bug`, `CircleSlash2` | none → custom SVG |
| `features/memberships/components/memberships-more-menu.tsx` | `LucideUserCog` | none → custom SVG |
| `features/memberships/components/permission-toggle.tsx` | `LucideBan`, `LucideCheck` | none (`Ban`), `check` |
| `features/navigation/components/constants.tsx` | `LucideBook`, `LucideBookCopy`, `LucideCircleUser`, `LucideLibrary`, `LucideUsers` | none → custom SVG (`SideNavItem icon`) |
| `features/navigation/components/mobile-menu-button.tsx` | `Menu` | `menu` |
| `features/navigation/components/sidebar-client.tsx` | `Kanban` | none → custom SVG / `firstroad:kanban` |
| `features/organisation/components/admin-area-banner.tsx` | `ShieldCheck` | none → custom SVG |
| `features/organisation/components/organisation-action-buttons.tsx` | `LucideArrowUpRightFromSquare`, `LucideLogOut`, `LucidePen`, `LucideTrash` | `externalLink`; rest none → custom SVG |
| `features/organisation/components/organisation-list.tsx` | `Bug`, `CircleSlash2` | none → custom SVG |
| `features/organisation/components/organisations-heading.tsx` | `LucidePlus` | none → custom SVG |
| `features/organisation/components/select-active-organisation-heading.tsx` | `LucidePlus` | none → custom SVG |
| `features/organisation/components/switch-org-button.tsx` | `LucideArrowLeftRight` | none → custom SVG |
| `features/pagination/components/pagination.tsx` | `ChevronLeftIcon`, `ChevronRightIcon` | `chevronLeft`, `chevronRight` (or drop: Astryx `Pagination`) |
| `features/ticket/components/referenced-ticket-item.tsx` | `LucideArrowUpRightFromSquare` | `externalLink` |
| `features/ticket/components/ticket-actions-desktop.tsx` | `LucideMoreVertical`, `LucidePencil`, `SquareArrowOutUpRight` | none (`MoreVertical`/`Pencil`); `externalLink` |
| `features/ticket/components/ticket-actions-mobile.tsx` | `LucidePencil`, `Trash2` | none → custom SVG |
| `features/ticket/components/ticket-list.tsx` | `Bug`, `CircleSlash2` | none → custom SVG |
| `features/ticket/components/ticket-more-menu.tsx` | `LucideTrash` | none → custom SVG |
| `features/ticket/constants.tsx` | `Check`, `File`, `Pencil` | `check`; `File`/`Pencil` none → custom SVG |

## Counts

| | |
| --- | --- |
| Files importing `lucide-react` | 54 |
| Distinct import identifiers | 63 |
| Canonical Lucide glyphs | 53 |
| Glyphs with an `IconName` | 15 |
| Glyphs with **no** `IconName` | 38 |
| `IconName`s unused by firstroad | 14 of 28 |

The 15 with an `IconName`: `X`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `Check`, `CircleCheck`, `XCircle`, `OctagonX`, `TriangleAlert`, `Info`, `Calendar`, `Menu`, `MoreHorizontal`, `ArrowUpDown`, `ArrowUpRightFromSquare`.

## Sources

- Live UI: `apps/web` dirty worktree; `rg` of `from "lucide-react"`; `apps/web/package.json` `lucide-react@1.33.0`. Alias identity checked against `apps/web/node_modules/lucide-react`.
- CLI: `bunx @astryxdesign/cli docs icons --dense` and `--json` (`@astryxdesign/cli@0.5.4`). Same 28 names as https://astryx.atmeta.com/docs/icons and `packages/cli/assets/docs/icons.doc.mjs`.
- Core: https://github.com/facebook/astryx/blob/main/packages/core/src/Icon/index.ts (public exports), `globalIconRegistry.tsx` (`IconName` union), `defaultIcons.tsx` (not exported), `Icon.tsx` (`icon` prop modes), `Icon.doc.mjs` (dense prop text: pass SVG for names not in the list).
- Theme: https://github.com/facebook/astryx/blob/main/packages/themes/neutral/src/icons.tsx (`neutralIconRegistry` Lucide map), `source.ts` (`export {neutralIconRegistry}`), `@astryxdesign/core` README (“theme-neutral … Lucide icons”). npm `@astryxdesign/core@0.5.4` / `@astryxdesign/theme-neutral@0.5.4`; exports include `./Icon` and theme-neutral `.` + `./built`.
- Docs: https://astryx.atmeta.com/docs/icons, https://astryx.atmeta.com/docs/cli (`--dense`), https://github.com/facebook/astryx/wiki/Contributing-Templates (wrap SVGs in `Icon`).

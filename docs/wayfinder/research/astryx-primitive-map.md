# Astryx primitive map (shadcn base-nova / Base UI)

Ticket: [#67](https://github.com/fringe4life/firstroad/issues/67). Map: [#64](https://github.com/fringe4life/firstroad/issues/64).

Inventory from the dirty `apps/web` worktree (live UI). Astryx facts from `@astryxdesign/core@0.5.4` + `@astryxdesign/cli@0.5.4` (`astryx component … --json`) and [migration](https://astryx.atmeta.com/docs/migration) / [styling](https://astryx.atmeta.com/docs/styling).

## Stack (do not use Radix tables)

`apps/web/components.json` is `"style": "base-nova"`. Primitives wrap **`@base-ui/react@1.7.0`**, not Radix. Compound API is Base UI: `Root` / `Trigger` / `Popup` / `Positioner` / `Backdrop`, plus `render` + `nativeButton` composition.

Astryx 0.5.4 is a closed StyleX component library. It is **not** a Base UI or Radix wrapper. Native `<dialog>` / `showModal()` for Dialog, AlertDialog, MobileNav, BottomSheet. Own layer system (`usePopover` / `useLayer`). Every component accepts `xstyle` (`stylex.create()` only), plus `className`/`style`.

Do not wrap shadcn in Astryx styles. Replace the primitive. Source: [migration guide](https://astryx.atmeta.com/docs/migration).

## Cross-cutting API shifts

| Current (base-nova / Base UI) | Astryx 0.5.4 |
| --- | --- |
| `open` / `onOpenChange` | `isOpen` / `onOpenChange` |
| `disabled` | `isDisabled` |
| `className` + `cva` variants | named props (`variant`, `size`, `padding`, …); leftover layout via `xstyle` |
| `cn(...)` / `buttonVariants()` on `<Link>` | `href` + `as={Link}` on Button/Tab/SideNavItem, or `LinkProvider` |
| Base UI `render={<Comp />}` composition | `href`/`as`, Popover trigger render-prop, or children slots — no `render`/`nativeButton` |
| Uncontrolled `<input name>` for FormData | `htmlName` + usually controlled `value`/`onChange`; server-action forms need an adapter |
| Standalone `Label` + control | Field owns label (`TextInput`/`CheckboxInput`/`Selector` `label` prop) |
| Children as visible label | `label` string required; `children` optional override on Button |
| `size="icon"` / `icon-xs`…`icon-lg` | `IconButton` (`sm` 28 / `md` 32 / `lg` 36) |
| Tailwind token classes (`bg-primary`, `text-muted-foreground`) | CSS vars / `tokens.stylex`; do not restyle via leftover utilities on migrated controls |

## Persistent frame

Migration order (official): Theme → AppShell → TopNav / SideNav / MobileNav, then shared primitives. Source: [migration](https://astryx.atmeta.com/docs/migration).

| Current file | Astryx import | Notes |
| --- | --- | --- |
| `src/app/layout.tsx` (Header + Sidebar + main grid) | `AppShell` `@astryxdesign/core/AppShell` | Slots: `topNav`, `sideNav`, `mobileNav`, `children`. `height` `fill`\|`auto`. `variant` `wash`\|`surface`\|`section`\|`elevated` (default `elevated`). `--header-height` / `--side-width` CSS island stays app-owned until grilling. |
| `src/components/header.tsx` | `TopNav` `@astryxdesign/core/TopNav` | `heading` = brand (`TopNavHeading` + Astryx icon, not lucide Kanban). `endContent` = theme control + account menu / Sign in-up. Ghost/outline/default header links: `Button href as={Link}` (`ghost` / `secondary` / `primary`). `MobileMenuButton` goes away if AppShell `mobileNav.hasToggle`. ViewTransition on the nav is app-owned, not an Astryx slot. |
| `src/features/navigation/components/sidebar.tsx` (desktop `<nav>`) | `SideNav` `@astryxdesign/core/SideNav` | `collapsible` covers hover-expand icon rail (`true` or `{ defaultIsCollapsed, isCollapsed, onCollapsedChange }`). `resizable` optional. Children: `SideNavItem` (`label`, `icon`, `href`, `isSelected`, `as={Link}`) + `SideNavSection`. Drop `buttonVariants({ variant: "ghost" })` on next/link. |
| `src/features/navigation/components/sidebar-client.tsx` (Sheet `side="left"`) | `MobileNav` `@astryxdesign/core/MobileNav` | Native `<dialog>`. `isOpen`/`onOpenChange`, `side="start"` (LTR left), `header`, `width` (default 320). Same `SideNavItem` children. **Not** `BottomSheet` (bottom-only, grab handle, snap points). AppShell `mobileNav` can own open state. |
| `src/features/navigation/components/mobile-menu-button.tsx` | `IconButton` or AppShell `MobileNavToggle` | `IconButton` `label="Open navigation menu"` `variant="ghost"` `icon={…}`. Prefer shell toggle. |
| `src/components/theme/theme-switcher.tsx` | `Theme` `@astryxdesign/core/theme` + `IconButton` or `Switch` | `Theme` owns mode (`light`\|`dark`\|`system`). Root Theme syncs `data-theme` + `data-astryx-theme` to `<html>`. Drop `next-themes`. Official settings pattern is `Switch` (`value`/`onChange` → `setMode`). Firstroad icon Sun/Moon toggle: `IconButton` / `ToggleButton` (`pressedIcon`) calling the same `mode` setter. View-transition types stay app-owned. |
| `src/components/theme/theme-provider.tsx` | `Theme` + `neutralTheme` `@astryxdesign/theme-neutral/built` | `import '@astryxdesign/theme-neutral/theme.css'`. SSR: set `data-theme` on `<html>` to avoid flash. |

## `components/ui` → Astryx

### Action / overlay

| Current file | Primitive today | Astryx import | Notes |
| --- | --- | --- | --- |
| `button.tsx` | `@base-ui/react/button` + `cva` | `Button` `@astryxdesign/core/Button`; icon-only → `IconButton` `@astryxdesign/core/IconButton` | **Variants:** `default`→`primary`, `secondary`→`secondary`, `ghost`→`ghost`, `destructive`→`destructive`. **No `outline`** → `secondary`. **No `link`** → `Link` `@astryxdesign/core/Link`. **Sizes:** `xs`/`sm`/`default`/`lg` collapse to `sm`/`md`/`lg` (28/32/36). `icon*` sizes → `IconButton`. `label` required. `href`+`as` replace `render={<Link/>}` + `buttonVariants()`. `isLoading` replaces pending-icon pattern. `xstyle` for full-width (`width="100%"` exists). |
| `dialog.tsx` | `@base-ui/react/dialog` + `dialogContentVariants` size/variant | `Dialog` `@astryxdesign/core/Dialog`; header `DialogHeader` from same path; confirmations `AlertDialog` `@astryxdesign/core/AlertDialog` | `isOpen` not `open`. Native `<dialog>`. `variant` `standard`\|`fullscreen` (not compact/ghost). Width: `compact`/`default`/`wide` cva → `width` number/string (default 400, clamped). `purpose` `required`\|`form`\|`info` (default `info`) replaces overlay-click policy. Compound Header/Footer/Title/Description → `DialogHeader` (`title`, `subtitle`) + `Layout` `header`/`content`/`footer` inside Dialog. Intercepting `@auth` dialogs: still Dialog, wire `isOpen` from route. **ConfirmDialog + server action Form:** `AlertDialog.onAction` does **not** auto-close and is a click callback, not a form action — keep `Dialog` `purpose="form"` with Footer buttons, or wrap `onAction` around the action. |
| `sheet.tsx` | `@base-ui/react/dialog` + `side` top/right/bottom/left | **Used path (left nav):** `MobileNav`. **Bottom:** `BottomSheet` `@astryxdesign/core/BottomSheet`. **No top-edge sheet.** Right ≈ `MobileNav side="end"` | Only consumer is mobile sidebar (`side="left"`). `sheetSideClasses` + Tailwind slide animations → component-owned motion. Do not map Sheet to Dialog. Overlay is not a separate export (`Overlay` is a media scrim, not a modal backdrop). |
| `dropdown-menu.tsx` | `@base-ui/react/menu` (compound + checkbox/radio/sub) | `DropdownMenu` `@astryxdesign/core/DropdownMenu`; overflow `MoreMenu` `@astryxdesign/core/MoreMenu` | Data `items` **or** compound `DropdownMenuItem` / `DropdownMenuDivider` / `DropdownMenuRadioGroup` / `DropdownMenuSubMenu`. Trigger is `button` prop (Button props), not `DropdownMenuTrigger render={trigger}`. `presentation` `popover`\|`bottom-sheet`\|`adaptive`. Ticket/membership overflow: `MoreMenu` (`items`, `label`, `variant="ghost"`). Radio status group: keep compound `DropdownMenuRadioGroup`. `variant="destructive"` on items exists. |
| `popover.tsx` | `@base-ui/react/popover` | `Popover` `@astryxdesign/core/Popover` | `content` slot + `children` trigger (must contain a button) or trigger render-prop. `placement` `above`\|`below`\|`start`\|`end` replaces `side`. Date picker popover: prefer collapsing to `DateInput` (owns calendar popover). Hover: `HoverCard`, not Popover. |
| `sonner.tsx` | `sonner` + `next-themes` | `useToast` `@astryxdesign/core/Toast` | Layout `<Toaster />` → hook self-mounts viewport (or explicit viewport). **Types: `info` \| `error` only.** `toast.success(...)` in `withActionFeedback` / `useActionStateWithFeedback` / ticket status / `redirect-toast` has **no success type** — map success → `type: 'info'`. No `loading` toast. `isAutoHide` default true for info, false for error. |

### Form controls

| Current file | Primitive today | Astryx import | Notes |
| --- | --- | --- | --- |
| `input.tsx` | native `<input>` + Tailwind | `TextInput` `@astryxdesign/core/TextInput` | `type` **only** `'text'`\|`'password'`\|`'email'`. `label` required (`isLabelHidden` if chrome needs no visible label). `status: { type, message }` replaces `aria-invalid` classes. `htmlName` for forms. Search: `hasClear` + `startIcon`. **File:** `FileInput` `@astryxdesign/core/FileInput` (`mode` `input`\|`dropzone`, `isMultiple`, `accept`) — attachments use `type="file"` today. Number: `NumberInput`. |
| `textarea.tsx` | native `<textarea>` | `TextArea` `@astryxdesign/core/TextArea` | Same Field pattern. `rows` default 3. `maxLength` counts graphemes. Uncontrolled `name` → `htmlName`. |
| `label.tsx` | native `<label>` | `Field` / `FieldLabel` `@astryxdesign/core/Field` | No standalone Label. Pairing Input+Label in password/ticket/org forms → drop Label, pass `label` on the control. Custom controls: `<Field label inputID>`. |
| `checkbox.tsx` | `@base-ui/react/checkbox` | `CheckboxInput` `@astryxdesign/core/CheckboxInput`; groups `CheckboxList` | `value: boolean \| 'indeterminate'`, `onChange(checked, e)`. Label is on the control. Change-password “show password” etc. stay CheckboxInput. |
| `select.tsx` | `@base-ui/react/select` | `Selector` `@astryxdesign/core/Selector` | `options` data (strings / `{value,label,…}` / dividers / sections), not Item children. `variant` `input` (forms) \| `ghost` (toolbars). `size` `sm`\|`md`\|`lg`. Trigger size `sm`/`default` → `sm`/`md`. `htmlName` hidden input. Searchable: `hasSearch`. Async: `Typeahead`. Pagination page-size + `sort-select.tsx`: Selector. |
| `input-otp.tsx` | `input-otp` | **No Astryx component in 0.5.4** | `astryx search otp` / `pin` / `component --list` (163 names): no OTP/PIN/one-time field. Used by `otp-verify-form.tsx` (6 slots, `name="otp"`). **Gap.** Map #64 already lists this as a possible exception pending widget research + grilling. Closest non-match: `TextInput` (no segmented cells) or a local StyleX widget. |

### Dates

| Current file | Primitive today | Astryx import | Notes |
| --- | --- | --- | --- |
| `calendar.tsx` | `@daypicker/react` `DayPicker` + `buttonVariants` | `Calendar` `@astryxdesign/core/Calendar` | First-party month grid. `mode` `single`\|`range`. `value` ISO `YYYY-MM-DD` (not `Date`). `onChange(value, valueAsDate)`. `hasOutsideDays` ≡ `showOutsideDays`. No `classNames` hash — styling is tokens/`xstyle`. DayPicker-specific range classNames die. |
| *(consumer)* `src/components/date-picker.tsx` | Popover + Calendar + hidden `<input name>` | `DateInput` `@astryxdesign/core/DateInput` | `value` ISO string, `htmlName` if still posting FormData. `nativePicker` `touch`\|`always`\|`never`. Range: `DateRangeInput`. This file is not under `ui/` but is the only Calendar consumer. |

### Structure / content

| Current file | Primitive today | Astryx import | Notes |
| --- | --- | --- | --- |
| `card.tsx` | `div` compounds (Header/Title/Description/Action/Content/Footer) | `Card` `@astryxdesign/core/Card` | Single container. **No Header/Title/Description/Footer exports.** Inner structure: `Layout` `header`/`content`/`footer` or app children. `padding` spacing step (theme default 4). `variant` `default`\|`transparent`\|`muted` + palette tints. `elevation` `none`\|`low`\|`med`\|`high`. Clickable rows: `ClickableCard` / `ListItem`, not a styled Button. Ticket/comment/profile cards: Card + Layout. |
| `separator.tsx` | `@base-ui/react/separator` | `Divider` `@astryxdesign/core/Divider` | `orientation` same. Extra: `label`, `variant` `subtle`\|`strong`, `isFullBleed`. NavItem separators → Divider or `SideNavSection`. |
| `skeleton.tsx` | `div` + `animate-pulse` + `className` size | `Skeleton` `@astryxdesign/core/Skeleton` | `width`/`height` number (px) or CSS string (default `100%`). `radius` `none`\|`0`–`4`\|`rounded` (avatars: `rounded`). `index` for stagger. Drop `className="aspect-square w-9"`. |
| `breadcrumb.tsx` | Base UI `useRender` + `mergeProps` compounds | `Breadcrumbs` + `BreadcrumbItem` `@astryxdesign/core/Breadcrumbs` | `separator` default `/` (RTL-aware); firstroad uses LucideSlash via `src/components/breadcrumbs.tsx`. Item: `href` omit = current page; `as` for next/link. Ellipsis/overflow is built in. Wrapper `src/components/breadcrumbs.tsx` stays an app mapper over `BreadcrumbItem`. |
| `table.tsx` | native `<table>` compounds | `Table` `@astryxdesign/core/Table` (`TableHeader`/`TableBody`/`TableFooter`/`TableRow`/`TableCell`/`TableHeaderCell` same path) | **Two modes:** `data`+`columns` **or** `children` (current org/membership/invitation tables). `density` `compact`\|`balanced`\|`spacious`. `dividers` `rows`\|`columns`\|`grid`\|`none`. `hasHover`. `textOverflow` `wrap`\|`truncate`. No `TableCaption` in the docs dump — caption via surrounding `Text` if needed. |
| `tabs.tsx` | `@base-ui/react/tabs` + `tabsListVariants` default/line | `TabList` + `Tab` `@astryxdesign/core/TabList` | Controlled `value`/`onChange`. Default landmark is **nav**, not ARIA tabs; pass `role="tablist"` only when panels swap in place. Account/admin tabs are **route nav** (`TabsTrigger render={<Link/>}`): `Tab href as={Link}` and **do not** set `role="tablist"`. `layout` `hug`\|`fill`. `hasDivider` ≈ line variant. No `TabsContent` required for link tabs. `SegmentedControl` is a different control (radio-in-a-bar), not page tabs. |
| `avatar.tsx` | `@base-ui/react/avatar` Root/Image/Fallback + Badge/Group | `Avatar` `@astryxdesign/core/Avatar`; `AvatarGroup` / `AvatarGroupOverflow` `@astryxdesign/core/AvatarGroup`; `AvatarStatusDot` from Avatar | One component: `src`, `name` (initials + alt), `size` `xsm`\|`sm`\|`md`\|`lg`\|`xl` or px. Current `sm`/`default`/`lg` (24/32/40-ish) → `sm`/`md`/`lg` (24/36/48). `AvatarBadge` → `status={<AvatarStatusDot …/>}`. `href`/`as`/`onClick` for interactive avatars. Account dropdown trigger: Avatar as button via `onClick`. |

## Gaps (Astryx 0.5.4)

| Gap | Evidence | Implication |
| --- | --- | --- |
| OTP / PIN field | Not in `astryx component --list`; search `otp`/`pin` is noise | Keep `input-otp` as an exception until widget research (#64 Not yet specified) or author a local StyleX OTP. |
| Toast `success` / `warning` / `loading` | `useToast` types `info`\|`error` | Map `toast.success` → `info`; errors → `error`. No spinner toast. |
| Button `outline` / `link` / extra icon sizes | ButtonVariantMap: `primary` `secondary` `ghost` `destructive`; sizes `sm` `md` `lg` | `outline`→`secondary`; `link`→`Link`; icon sizes→`IconButton`. |
| Sheet `side="top"` | MobileNav `start`\|`end`; BottomSheet bottom only | Unused in firstroad. Do not invent a top sheet. |
| Base UI `render` composition | No equivalent prop | Every `render={<Link/>}` / `render={trigger}` call site must switch to `href`/`as` or a supported trigger slot. |
| Uncontrolled FormData inputs | Astryx fields are labeled + typically controlled | `htmlName` exists on TextInput/Selector/CheckboxInput/TextArea. Prototype must decide controlled vs hidden-input adapter for server actions. |
| Sonner theme binding | Toaster reads `useTheme()` | Dies with `next-themes`; Toast follows Astryx `Theme` automatically. |

## Not 1:1 (still in scope of this ticket’s files)

- **Header Sign in/up** styled as buttons: `Button` with `href`/`as`, not `buttonVariants` on `<Link>`.
- **NavItem** (`nav-item.tsx`) is not under `ui/` but is the SideNav cell: `SideNavItem`, not ghost Button.
- **Confirm dialog** (`confirm-dialog.tsx`) is Dialog+Form, not a ui file; prefer `Dialog`+`purpose="form"` over `AlertDialog` until grilling.
- **Pagination** (feature, not `ui/`): Astryx `Pagination` `@astryxdesign/core/Pagination` exists (`page`, `totalPages`/`hasMore`, `pageSizeOptions` → Selector). Out of this ticket’s file list; note for later conversion.

## Sources

- Live UI: `apps/web/src/components/ui/*`, `header.tsx`, `theme-switcher.tsx`, `features/navigation/components/sidebar*.tsx`, `sidebar-client.tsx`, `mobile-menu-button.tsx`, `layout.tsx`, `components.json`, `apps/web/package.json` (`@base-ui/react@1.7.0`).
- Astryx CLI 0.5.4: `astryx component --list`; `astryx component <Name> --json` for Button, IconButton, TextInput, TextArea, CheckboxInput, Selector, TabList, Dialog, AlertDialog, DropdownMenu, MoreMenu, Popover, Avatar, Card, Divider, Skeleton, Breadcrumbs, Table, Calendar, DateInput, Toast, AppShell, TopNav, SideNav, MobileNav, Switch, Link, Overlay, BottomSheet, Theme, Field, FileInput, Pagination, SegmentedControl.
- Docs: https://astryx.atmeta.com/docs/migration, https://astryx.atmeta.com/docs/styling, `astryx search otp|pin|sheet|toast|calendar`.
- Types: `/tmp/astryx-research/node_modules/@astryxdesign/core/dist/**/*.d.ts` (ButtonVariantMap, DialogPurpose, MobileNavProps, Toast useToast).

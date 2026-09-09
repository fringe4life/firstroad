# Astryx equivalents for sonner, DayPicker, and input-otp

Facts for [#69](https://github.com/fringe4life/firstroad/issues/69). No in/out-of-cutover call — that is [#74](https://github.com/fringe4life/firstroad/issues/74).

**Astryx sampled:** `@astryxdesign/core` / `@astryxdesign/cli` **v0.5.4** (2026-09-09).  
**firstroad call sites:** dirty `apps/web` worktree (same paths exist at `HEAD` `2397f126`).

## Sources

- CLI: `npx astryx --dense component --list`, `component Toast`, `component DateInput`, `component Calendar`, `hook useToast`, `search otp` / `search pin` (after installing core locally; one-off CLI without core returns `ERR_CORE_NOT_FOUND`).
- Catalog: <https://astryx.atmeta.com/components> (v0.5.4).
- Docs/CLI: <https://astryx.atmeta.com/docs/cli>, <https://astryx.atmeta.com/components/Toast>, <https://astryx.atmeta.com/components/Calendar>.
- Source: [facebook/astryx](https://github.com/facebook/astryx) `packages/core` (`Toast.doc.mjs`, `useToast.tsx`, `types.ts`, `LayerProvider.tsx`, `Calendar.doc.mjs`, `DateInput.doc.mjs` / `DateInput.tsx`, `TextInput.tsx`).

## Snapshot: firstroad usage

| Dep (apps/web) | Version | Wrapper | Runtime use |
| --- | --- | --- | --- |
| `sonner` | 2.0.8 | `src/components/ui/sonner.tsx` | Root `<Toaster expand />`; `toast.success` / `toast.error` / `toast.promise` |
| `@daypicker/react` | 10.0.1 | `src/components/ui/calendar.tsx` | Single-date picker in ticket deadline field |
| `input-otp` | 1.5.0 | `src/components/ui/input-otp.tsx` | 6-digit OTP on sign-in + email-verify |

---

## 1. sonner

### firstroad call sites

- **Viewport:** `src/app/layout.tsx` mounts `<Toaster expand />` from `@/components/ui/sonner`. Wrapper wires `next-themes` `theme`, lucide icons (`error` / `info` / `loading` / `success` / `warning`), CSS vars, `toastOptions.classNames.toast = "cn-toast"`.
- **Module `toast()`:**
  - `src/utils/with-action-feedback.ts` — `toast.success` / `toast.error` on action `SUCCESS` / `ERROR` (used by many client forms: sign-in/up, org, invitations, memberships, OTP send/verify, …).
  - `src/hooks/use-action-state-with-feedback.ts` — same pair (ticket upsert, attachments, comments, confirm dialog).
  - `src/components/redirect-toast.tsx` — `toast.success` from cookie; mounted in `src/app/(auth)/layout.tsx`.
  - `src/features/ticket/utils/status-change-with-toast.ts` — `toast.promise(promise, { loading: "Updating status" })` then `toast.error` / `toast.success` on the same promise.

Used APIs: `success`, `error`, `promise`+`loading`. No `toast.info` / `toast.warning` / `toast.custom` call sites.

### Astryx names

| Name | Import | Role |
| --- | --- | --- |
| **Toast** | `@astryxdesign/core/Toast` | Visual card. CLI: overlay; production path is the hook, not a layout `<Toaster>`. |
| **useToast** | `@astryxdesign/core/Toast` | `(options: ToastOptions) => dismissFn`. |
| **LayerProvider** | `@astryxdesign/core/Layer` | Root toast config + mounts `ToastViewport`. Nested providers are no-ops. |
| **ToastViewport** | `@astryxdesign/core/Toast` | Stack host. `Toast.doc.mjs` lists it in `hiddenComponents`. Defaults: `position='bottomEnd'`, `maxVisible=5`. |

`LayerToastConfig`: `position` (`topEnd` \| `topStart` \| `bottomEnd` \| `bottomStart`), `maxVisible`, `inset`.

Without `LayerProvider` / `AppShell`, `useToast` self-mounts a fallback viewport under `document.body` (warns once). During SSR it throws: wrap with `<LayerProvider>` or `<AppShell>`. Fallback mirrors `data-theme` / `data-astryx-theme` onto that container.

`ToastOptions` / `ToastType` (`packages/core/src/Toast/types.ts`):

- `body: ReactNode` (required)
- `type?: 'info' | 'error'` — default `'info'`
- `isAutoHide?` — **true for info, false for error**
- `autoHideDuration?` — default `5000`
- `endContent?`, `renderContent?`, `uniqueID?`, `collisionBehavior?: 'overwrite' | 'ignore'`, `onHide?`

CLI `ToastTypes` template: info auto-dismisses at 5s; error persists until dismiss. `ToastDismiss` / `ToastDeduplication` templates: dismiss fn + `uniqueID` overwrite for in-progress updates (e.g. progress text). No `promise` helper.

### Coverage vs current usage

| firstroad | Astryx |
| --- | --- |
| Non-blocking success/error after actions | `showToast({ body })` (info) and `showToast({ body, type: 'error' })` |
| Root toaster | `LayerProvider` (or fallback viewport), not a sonner-style `<Toaster>` |
| Stacking | Viewport stack; `maxVisible` default 5 |
| Dedup / replace | `uniqueID` + `collisionBehavior` |
| Custom chrome | `endContent` / `renderContent` |

### Gaps (relative to these call sites)

1. **No module-level `toast()`.** `useToast()` is a client hook. `with-action-feedback.ts` is a plain function that imports `toast` from `sonner`. That pattern has no Astryx counterpart without a hook (or a client wrapper that holds `showToast`).
2. **Types are only `info` \| `error`.** No `success`, `warning`, or `loading`. firstroad `toast.success` has no dedicated variant (Banner elsewhere in Astryx has success/warning; Toast does not).
3. **No `toast.promise`.** Status change uses loading-then-success/error. Closest documented pattern: persistent toast + returned dismiss fn, or `uniqueID` overwrite. No loading type or spinner slot on Toast itself (`Spinner` is a separate component).
4. **Error auto-hide differs.** Astryx error defaults to persist (`isAutoHide: false`). sonner errors auto-hide unless configured otherwise. firstroad does not pass a duration.
5. **`<Toaster expand />`.** sonner `expand` expands the stack so all toasts show full content. Astryx has `maxVisible` (count), not an expand flag.
6. **Theme/icons wiring.** Wrapper binds `next-themes` and lucide icons. Astryx Toast paints an inverted `MediaTheme` surface and a built-in dismiss `Button`; no icon map prop. Map #64 already drops `next-themes` in favor of Astryx `Theme`.
7. **SSR.** Fallback `useToast` cannot run during SSR.

---

## 2. `@daypicker/react` (calendar)

### firstroad call sites

- `src/components/ui/calendar.tsx` — shadcn wrapper around `DayPicker`. Forwards `React.ComponentProps<typeof DayPicker>`; default `showOutsideDays`; Tailwind `classNames`; custom `Chevron` lucide icons. Range classNames exist; **no caller uses `mode="range"`**.
- `src/components/date-picker.tsx` — only consumer. `mode="single"`, `onSelect`, `selected: Date`. Button + Base UI `Popover` + hidden `<input name={name} type="hidden" value={yyyy-MM-dd}>`. Uncontrolled; `defaultValue` string or **today**; imperative `ref.reset()` → `setDate(new Date())`.
- `src/features/ticket/components/ticket-upsert-form.tsx` — deadline field: `name="deadline"`, `id`, `defaultValue` from ticket/payload via `toDeadlineString`, reset on success.

`lucide-react` `Calendar` in `user-profile-card.tsx` is an **icon**, not DayPicker.

### Astryx names

| Name | Import | Role |
| --- | --- | --- |
| **Calendar** | `@astryxdesign/core/Calendar` | Month grid. CLI keywords include `daypicker`, `datepicker`. `mode: 'single' \| 'range'` (no multi). Value: `ISODateString` (`YYYY-MM-DD`) or `DateRange`. `onChange`, `defaultValue`, `hasOutsideDays` (default true), `handleRef.navigateTo(iso)`. |
| **DateInput** | `@astryxdesign/core/DateInput` | Labeled text field + calendar popover (touch: bottom sheet / native `input type=date` via `nativePicker`). CLI: “Use for scheduling, **deadlines**, booking dates”. `value?: ISODateString`, `onChange`, `format` including `'system_date'` → `YYYY-MM-DD`. |
| **DateRangeInput** / **DateTimeInput** | same package | Range / date+time. No firstroad caller. |
| **Popover** | `@astryxdesign/core/Popover` | Overlay primitive; DateInput already includes a popover. |

CLI list includes Calendar and DateInput. Catalog Form Controls matches.

### Coverage vs current usage

| firstroad | Astryx |
| --- | --- |
| Single-day month grid | `Calendar` `mode="single"` |
| Outside days | `hasOutsideDays` (default true) |
| `YYYY-MM-DD` for form | Calendar/DateInput ISO string; DateInput `format="system_date"` for display |
| Button + popover + grid | **DateInput** is that product (field + icon + popover). **Calendar** is the grid only. |
| Ticket deadline | DateInput docs explicitly mention deadlines |

### Gaps (relative to these call sites)

1. **Value type / callbacks.** DayPicker `selected: Date` + `onSelect`. Astryx Calendar/DateInput use `ISODateString` + `onChange`.
2. **DateInput has no `htmlName`.** TextInput/TextArea/Switch/Tokenizer document `htmlName` for native form `name`. DateInput CLI props and `DateInput.tsx` render an `<input type="text">` **without** `name`. firstroad submits deadline via hidden `name="deadline"`. DateInput does not participate in `FormData` that way unless a hidden input stays.
3. **DateInput omits `defaultValue`.** Props omit BaseProps `defaultValue`. firstroad DatePicker is uncontrolled with `defaultValue` + `reset()`. DateInput is `value` + `onChange` (optional `value`). `hasClear` clears; there is no documented reset-to-today handle. Calendar `handleRef` only `navigateTo` (visible month), not selection reset.
4. **UX shape.** firstroad: outline **button** showing `yyyy-MM-dd`, calendar in popover, no typing. DateInput: **typable** field (parses MM/DD/YYYY etc.) + calendar icon. `nativePicker` default `'touch'` swaps in OS picker on coarse pointer.
5. **Styling hooks.** firstroad Calendar restyles DayPicker via `classNames` + `components.Chevron`. Astryx Calendar theming targets: `astryx-calendar`, `astryx-calendar-nav`, `astryx-calendar-day` — no DayPicker `classNames`/`components` API.
6. **Range chrome in the wrapper is unused.** Astryx range mode exists; firstroad does not use it.

**Calendar** covers the DayPicker **grid** used today. **DateInput** covers the **composed deadline control** more closely than Calendar+Popover rebuilt by hand.

---

## 3. input-otp

### firstroad call sites

- `src/components/ui/input-otp.tsx` — shadcn wrapper: `OTPInput` / `OTPInputContext` from `input-otp`. Exports `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`.
- **Only consumer:** `src/features/auth/components/otp-verify-form.tsx`
  - `<InputOTP maxLength={6} name="otp" required>`
  - two groups of three slots (`0–2`, `3–5`)
  - native form field `name="otp"`
- Pages: `src/app/(password)/sign-in/otp/verify/page.tsx`, `src/app/(password)/verify-email/otp/verify/page.tsx` via `OtpVerifyFormWithConnection`.
- `InputOTPSeparator` is **exported and unused**.

### Astryx names

**None.**

Evidence:

- Catalog Form Controls: Calendar, Checkbox, Date*, Field, File, Number, Radio, Selector, Slider, Switch, Text Area, **Text Input**, Time, Tokenizer, Typeahead — **no OTP / PIN / passcode**.
- CLI `--json component --list` (v0.5.4): no name containing `otp`, `pin`, or `passcode`.
- `astryx search otp` (18 hits): Stepper/Avatar/Button/etc. — incidental tokens, not an OTP field.
- `astryx search pin`: Spinner, sticky columns, layout — not a PIN input.
- `TextInputType` is `'text' \| 'password' \| 'email'` only (`TextInput.tsx`).

Closest published field is **TextInput** (`htmlName`, `isRequired`, max length via native rest attrs is not a first-class OTP slot API). It is a single box, not six slots / two groups.

### Coverage vs current usage

Does **not** cover: segmented 6-digit slots, `OTPInput` caret/slot context, grouped slots, `name="otp"` slot host.

### Gaps

Full product gap vs `input-otp` + current OTP verify UI. No Astryx component, hook, or template named for one-time codes. `astryx gap-report` was removed from the CLI (CLI changelog).

---

## Matrix

| firstroad | Astryx component | Covers current usage? | Main gaps |
| --- | --- | --- | --- |
| sonner `Toaster` + `toast.*` | **Toast** + **useToast** + **LayerProvider** | Partial: info/error bodies, stack, dismiss, dedup | No module `toast()`, no success/warning/loading, no `promise`, error persist default, no `expand`, hook-only, SSR fallback throw |
| DayPicker grid (`ui/calendar`) | **Calendar** | Yes for single-month single-select grid | `Date` vs ISO, no `classNames`/`components`, `onSelect` vs `onChange` |
| DatePicker (deadline) | **DateInput** (grid: **Calendar**) | Partial: single date, ISO `YYYY-MM-DD`, popover calendar | No `htmlName`, no uncontrolled `defaultValue` / reset-to-today, typable field vs button, `nativePicker` |
| input-otp 6-slot | — | No | No OTP/PIN component in core v0.5.4 |

## Out of this ticket

Whether any of the three stay as exceptions is [#74](https://github.com/fringe4life/firstroad/issues/74) grilling, after this note.

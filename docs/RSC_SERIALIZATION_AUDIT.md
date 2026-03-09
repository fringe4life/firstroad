# RSC Serialization Audit

**Date:** January 24, 2026  
**Re-assessed:** March 2026 (against Vercel React Best Practices — versioned skills, AGENTS.md v1.0.0)  
**Focus:** Minimize data transfer at React Server Component → Client Component boundaries (rule 3.5 Minimize Serialization at RSC Boundaries)

## Executive Summary

Audited server-to-client data transfer across RSC boundaries. Several boundaries have been optimized since the original audit; remaining opportunities are noted below.

**Overall Assessment:** 🟢 **IMPROVED** — Detail-page ticket actions already pass minimal props to client components. List-page ticket serialization and comments list payload remain as optimization opportunities where refactors are justified by payload size.

---

## Key Findings

### ✅ **GOOD** - Already Optimized

1. **Membership Components** - Using minimal `OrganisationMemberRow` type
2. **Pagination Metadata** - Only essential fields passed
3. **Action Props** - Passing function references, not data

### 🟡 **OPTIMIZATION OPPORTUNITIES**

1. **Ticket list page** — List page had been sending full `BaseTicket` to client (`TicketListItem`); see §1 below for post-optimization status (server-rendered row + minimal action props).
2. **Comments list** — Server sends full comment list to `Comments` client; per-item button props are already minimal. A minimal `CommentListPayload` type reduces the initial payload (see §2).

### ✅ **ALREADY OPTIMIZED** (not opportunities)

3. **OrganisationItem** — Only `organizationId` is passed to `OrganisationActionButtons`; no full `BaseOrganisation` object at the client boundary.

---

## Detailed Analysis

### 1. Ticket → Client Components 🟢 (Detail) / 🟡 (List)

**Detail page (ticket/[slug]):**  
The server component `TicketDetailActionsDesktop` receives `ticket` from the page and passes **only** `{ id, slug, status }` to the client component `TicketActionsDesktop`. So the RSC boundary at the detail actions is **already optimized**. No change required for detail actions.

**List page (tickets list):**  
The client component `TicketListItem` receives full `BaseTicket` from the server (when the list is rendered by a server parent). It passes:
- `ticket={{ id, slug, status }}` to `TicketActionsDesktop` and `TicketActionsMobile` — **minimal, good.**
- `ticket={ticket}` (full) to `TicketCard` — required for display (title, description, deadline, user.name, bounty, etc.). So the **only** full-ticket serialization at the list boundary is for the card content. Reducing that would require splitting the card into server-rendered content and client-only actions, a larger refactor.

**Summary:** Detail-page ticket actions: ✅ minimal. List page: full ticket is serialized to `TicketListItem` for card display; actions already receive minimal props.

**Impact:** 🟢 Detail actions optimized; 🟡 List view full ticket remains for card display (acceptable unless targeting payload size).

---

### 2. Comment → Client Components 🟡

**Current implementation:**  
`Comments` (client) receives `list` / `listWithAttachments` from the server (full comment objects with user info and attachments). That list is stored in client state and passed to `CommentList`, which renders `CommentItem` and `CommentOwnerButtons`.

**CommentOwnerButtons:**  
In `comment-list.tsx`, when rendering buttons we already pass **minimal** props: `comment={{ id: item.id, content: item.content }}`. So at the point where `CommentOwnerButtons` is rendered, only `id` and `content` are passed — no full comment object at that call site.

**RSC boundary:**  
The serialization cost is at the **server → Comments** boundary: the server sends the full `listWithAttachments` (array of full comment objects) once. So the initial payload still includes full comments (user, ticket relation, etc.). Reducing that would require the server to send a minimal list shape and the client to request full details only when needed, or to pass minimal props from server-rendered wrappers — a larger change.

**Summary:** Client-side rendering of buttons already uses minimal `{ id, content }`. Server → client boundary still sends full comment list for initial load.

**Impact:** 🟡 **MEDIUM** — Initial list payload could be reduced with a refactor; per-item client props are already minimal where we control the call site.

---

### 3. OrganisationItem → Client Components 🟢

**Server Component:** `src/features/organisation/components/organisation-item.tsx` (Server)  
**Client Components:**
- `OrganisationActionButtons` (client)

**Current Implementation:**
```typescript
// Server component passes only organizationId
<OrganisationActionButtons organizationId={organisation.id} />
```

**Fields in BaseOrganisation:**
- `id`, `name`, `slug`, `createdAt`, `metadata`
- `_count: { members }`
- `memberShipByUser: { id, organizationId, userId, role, createdAt }`

**Fields Actually Used:**

**OrganisationItem (Server) uses:**
- ✅ `organisation.id` (display + pass to client)
- ✅ `organisation.name` (display)
- ✅ `organisation.memberShipByUser?.createdAt` (display)
- ✅ `organisation.memberShipByUser?.role` (display)
- ✅ `organisation._count.members` (display)

**OrganisationActionButtons (Client) uses:**
- ✅ `organizationId` (only this is passed - **already optimized!**)

**Optimization Status:** ✅ **ALREADY OPTIMIZED** - Only `organizationId` is passed, not the full object

**Impact:** ✅ **NONE** - Already optimal

---

## Recommendations

### Priority 1: Ticket Components — ✅ Done for detail; optional for list

**Detail page:** Already optimized. `TicketDetailActionsDesktop` (server) passes only `ticket={{ id, slug, status }}` to `TicketActionsDesktop` (client). No change needed.

**List page:** `TicketListItem` (client) receives full ticket from server but passes only `{ id, slug, status }` to the action components. Full ticket is still serialized to `TicketListItem` because `TicketCard` needs display fields. To reduce list payload further would require a structural change (e.g. server-rendered card content with client-only action slots). Optional.

---

### Priority 2: Comment Components — 🟡 Partially optimized

**CommentOwnerButtons:** Already receives minimal `comment={{ id, content }}` when rendered from `CommentList` (see `comment-list.tsx`). No change at that call site.

**Server → Comments boundary:** The server still sends the full `listWithAttachments` array to `Comments` (client). To reduce initial payload, the server could send a minimal list (e.g. ids + content) and the client could hydrate or fetch full data as needed — a larger refactor. Optional unless targeting first-load payload size.

---

### Priority 3: Review Other Boundaries 🟢

**Areas checked (March 2026):**
1. **Pagination components** — Already using minimal metadata ✅
2. **Form components** — Passing action functions (good) ✅
3. **Navigation components** — Minimal data ✅
4. **OrganisationActionButtons** — Only `organizationId` passed ✅

---

## Implementation Guide (historical; detail/list already optimized)

### Step 1: Update Ticket Components

**1. Update `TicketOwnerOptionsProps`:**

**Option A: Minimal object (recommended)**
```typescript
// Before
export interface TicketOwnerOptionsProps {
  ticket: BaseTicket;
  isDetail?: boolean;
  currentUserId?: string | null;
}

// After
export interface TicketOwnerOptionsProps {
  ticket: { userId: string };  // minimal object for isOwner check
  ticketSlug: string; // for edit link
  isDetail?: boolean;
  currentUserId?: string | null;
}
```

**Option B: Update isOwner utility (better, but requires utility change)**
```typescript
// Update isOwner to accept userId directly
const isOwner = (user: Maybe<User>, userId: string): boolean => 
  user?.id === userId;

// Then TicketOwnerOptionsProps becomes:
export interface TicketOwnerOptionsProps {
  ticketUserId: string;  // for isOwner check
  ticketSlug: string; // for edit link
  isDetail?: boolean;
  currentUserId?: string | null;
}
```

**2. Update `TicketMoreMenuProps`:**
```typescript
// Before
interface TicketMoreMenuProps {
  ticket: TicketModel;
  trigger: React.ReactNode;
}

// After
interface TicketMoreMenuProps {
  ticketId: string;
  ticketStatus: TicketStatus;
  trigger: React.ReactNode;
}
```

**3. Update `isOwner` usage:**
```typescript
// Before
if (!isOwner(session, ticket)) {

// After - need to pass userId separately or check differently
// Option A: Pass userId as separate prop
if (session?.id !== ticketId) {

// Option B: Keep ticket object but only for isOwner check
// (less optimal but simpler)
```

---

### Step 2: Update Comment Components

**1. Update `CommentOwnerButtonsProps`:**
```typescript
// Before
interface CommentOwnerButtonsProps {
  comment: Comment;
  onEdit: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => Promise<ActionState<string>>;
}

// After
interface CommentOwnerButtonsProps {
  commentId: string;
  commentContent: string;
  onEdit: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => Promise<ActionState<string>>;
}
```

---

## Impact Estimation

### Current Serialization Size (Approximate)

**Ticket Object:**
- ~15-20 fields (including nested user object)
- Estimated: ~500-800 bytes per ticket

**Comment Object:**
- ~8-10 fields (including nested user and ticket relations)
- Estimated: ~300-500 bytes per comment

**After Optimization:**

**Ticket Components:**
- `TicketOwnerOptions`: 2 fields → ~50 bytes (94% reduction)
- `TicketMoreMenu`: 2 fields → ~50 bytes (94% reduction)

**Comment Components:**
- `CommentOwnerButtons`: 2 fields → ~50 bytes (90% reduction)

### Performance Impact

**For a page with 10 tickets:**
- Current: ~5-8 KB serialized
- Optimized: ~1 KB serialized
- **Savings: ~4-7 KB per page load**

**For a page with 20 comments:**
- Current: ~6-10 KB serialized
- Optimized: ~1 KB serialized
- **Savings: ~5-9 KB per page load**

**Total potential savings:** ~10-16 KB per page with tickets and comments

---

## Testing Checklist

After implementing optimizations:

- [ ] Verify `TicketOwnerOptions` still works correctly
- [ ] Verify `TicketMoreMenu` still works correctly
- [ ] Verify `CommentOwnerButtons` still works correctly
- [ ] Test ownership checks still work
- [ ] Test edit/delete actions still work
- [ ] Measure bundle size reduction
- [ ] Test in production-like environment

---

## TypeScript Benefits

Since you're using TypeScript, this optimization is **safer and easier**:

1. **Type Safety:** TypeScript will catch missing props
2. **Refactoring:** IDE can help update all usages
3. **Documentation:** Types serve as documentation
4. **Compile-time Checks:** Catch errors before runtime

---

## References

- Vercel React Best Practices AGENTS.md § 3.5 Minimize Serialization at RSC Boundaries (versioned: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — `skills/react-best-practices/`)
- [Next.js RSC Documentation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

## Summary

**Current Status (March 2026):** 🟢 Improved — Detail ticket actions and comment owner buttons already receive minimal props at the client boundary. Remaining opportunities are list-page ticket payload (full ticket for card display) and initial comments list payload.

**Recommended Actions:**
1. ✅ **Done:** Ticket detail actions pass minimal `{ id, slug, status }` to client.
2. ✅ **Done:** CommentOwnerButtons receives minimal `{ id, content }` from CommentList.
3. 🟡 **Optional:** Reduce server → Comments initial payload (full list) if targeting first-load size.
4. 🟡 **Optional:** Reduce list-page ticket serialization by splitting card into server-rendered content + client actions.
5. 🟢 **Done:** OrganisationActionButtons and other boundaries use minimal data.

**Expected Impact (if optional refactors done):**
- Further payload reduction on list and comment-heavy pages
- Faster RSC boundary serialization on slow connections

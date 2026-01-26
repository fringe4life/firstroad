# RSC Serialization Audit

**Date:** January 24, 2026  
**Focus:** Minimize data transfer at React Server Component → Client Component boundaries

## Executive Summary

Audited server-to-client data transfer across RSC boundaries. Found **3 areas** where data can be optimized by passing only required fields instead of full objects.

**Overall Assessment:** 🟡 **GOOD** - Most components are well-optimized, but there are opportunities to reduce serialization overhead.

---

## Key Findings

### ✅ **GOOD** - Already Optimized

1. **Membership Components** - Using minimal `OrganisationMemberRow` type
2. **Pagination Metadata** - Only essential fields passed
3. **Action Props** - Passing function references, not data

### 🟡 **OPTIMIZATION OPPORTUNITIES**

1. **TicketItem → Client Components** - Passing full `BaseTicket` object
2. **CommentItem → Client Components** - Passing full `Comment` object  
3. **OrganisationItem → Client Components** - Passing full `BaseOrganisation` object

---

## Detailed Analysis

### 1. TicketItem → Client Components 🔴

**Server Component:** `src/features/ticket/components/ticket-item.tsx` (Server)  
**Client Components:** 
- `TicketOwnerOptions` (client)
- `TicketMoreMenu` (client)

**Current Implementation:**
```typescript
// Server component passes full ticket object
<TicketOwnerOptions ticket={ticket} />
<TicketMoreMenu ticket={ticket} />
```

**Fields in BaseTicket:**
- `id`, `title`, `slug`, `description`, `status`, `bounty`
- `createdAt`, `updatedAt`, `deadline`
- `userId` (for ownership check)
- `user: { name }` (nested object)

**Fields Actually Used:**

**TicketItem (Server) uses:**
- ✅ `ticket.id` (ViewTransition name)
- ✅ `ticket.slug` (link)
- ✅ `ticket.status` (icon)
- ✅ `ticket.title` (display)
- ✅ `ticket.description` (display)
- ✅ `ticket.deadline` (display)
- ✅ `ticket.user.name` (display)
- ✅ `ticket.bounty` (display)

**TicketOwnerOptions (Client) uses:**
- ✅ `ticket.userId` (for `isOwner(session, ticket)` check - needs full object)
- ✅ `ticket.slug` (for edit link)

**Note:** `isOwner` utility function expects an object with `userId` property, so we need to pass at least `{ userId: string }` or update the utility.

**TicketMoreMenu (Client) uses:**
- ✅ `ticket.id` (for delete action)
- ✅ `ticket.status` (for status dropdown)

**Optimization Opportunity:**
- `TicketOwnerOptions` only needs `userId` and `slug` - currently receives full ticket
- `TicketMoreMenu` only needs `id` and `status` - currently receives full ticket

**Impact:** 🟡 **MEDIUM** - Ticket object is relatively small (~10 fields), but serialization still adds overhead

---

### 2. CommentItem → Client Components 🟡

**Server Component:** `src/features/comment/components/comment-item.tsx` (Server)  
**Client Components:**
- `CommentOwnerButtons` (client)

**Current Implementation:**
```typescript
// Server component passes full comment object
<CommentOwnerButtons comment={comment} />
```

**Fields in Comment:**
- `id`, `content`, `createdAt`, `updatedAt`
- `ticketId`, `userId`
- `user: { name }` (nested object)
- `ticket` (relation, but not used)

**Fields Actually Used:**

**CommentItem (Server) uses:**
- ✅ `comment.updatedAt` (TimeAgo)
- ✅ `comment.createdAt` (TimeAgo)
- ✅ `comment.content` (display)
- ✅ `comment.user?.name` (display)

**CommentOwnerButtons (Client) uses:**
- ✅ `comment.id` (for delete button)
- ✅ `comment.content` (for edit button - passed to `onEdit`)

**CommentEditButton (Client) uses:**
- ✅ `comment.id` (for edit)
- ✅ `comment.content` (for edit)

**Optimization Opportunity:**
- `CommentOwnerButtons` only needs `id` and `content` - currently receives full comment object
- The `user` object is not used in client components (only in server CommentItem)

**Impact:** 🟡 **MEDIUM** - Comment object is small, but `user` and `ticket` relations are unnecessary

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

### Priority 1: Optimize Ticket Components 🔴

**File:** `src/features/ticket/components/ticket-item.tsx`

**Current:**
```typescript
<TicketOwnerOptions ticket={ticket} />
<TicketMoreMenu ticket={ticket} />
```

**Optimized:**
```typescript
// Option 1: Pass minimal object for isOwner check
<TicketOwnerOptions 
  ticket={{ userId: ticket.userId }} 
  ticketSlug={ticket.slug} 
/>

// Option 2: Update isOwner to accept userId directly
<TicketOwnerOptions 
  ticketUserId={ticket.userId} 
  ticketSlug={ticket.slug} 
/>

<TicketMoreMenu 
  ticketId={ticket.id} 
  ticketStatus={ticket.status} 
/>
```

**Benefits:**
- Reduces serialization from ~10 fields to 2-3 fields per component
- Smaller payload size
- Faster RSC boundary crossing

**Trade-offs:**
- Need to update prop types in client components
- Slightly more verbose prop passing

---

### Priority 2: Optimize Comment Components 🟡

**File:** `src/features/comment/components/comment-item.tsx`

**Current:**
```typescript
<CommentOwnerButtons comment={comment} />
```

**Optimized:**
```typescript
<CommentOwnerButtons 
  commentId={comment.id} 
  commentContent={comment.content} 
/>
```

**Benefits:**
- Removes unnecessary `user` and `ticket` relation serialization
- Smaller payload
- Faster RSC boundary

**Trade-offs:**
- Need to update `CommentOwnerButtons` prop types
- Need to update `CommentEditButton` to accept `commentId` and `commentContent` separately

---

### Priority 3: Review Other Boundaries 🟢

**Areas to check:**
1. **Pagination components** - Already using minimal metadata ✅
2. **Form components** - Passing action functions (good) ✅
3. **Navigation components** - Minimal data ✅

---

## Implementation Guide

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

- [Vercel Best Practices: Minimize Serialization](https://github.com/vercel-labs/agent-skills/blob/main/vercel-react-best-practices/rules/server-serialization.md)
- [Next.js RSC Documentation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

## Summary

**Current Status:** 🟡 Good, but can be improved

**Recommended Actions:**
1. 🔴 **High Priority:** Optimize Ticket components (2 components)
2. 🟡 **Medium Priority:** Optimize Comment components (1 component)
3. 🟢 **Low Priority:** Review other boundaries (already optimized)

**Expected Impact:**
- ~10-16 KB reduction per page load
- Faster RSC boundary serialization
- Better performance on slower connections
- Improved serverless cold start times

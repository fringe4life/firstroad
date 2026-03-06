# Git Commit Message Template

## Usage

Supply this file to the AI to generate a git commit message based on changes since the last commit. Messages use emoji bullet points for clarity and visual appeal.

**Repo context**: This is a **Turborepo monorepo**. Main areas: `apps/web` (Next.js), `apps/inngest`, `packages/database` (Prisma), `packages/emails`. When changes span packages or touch root config (`turbo.json`, root `package.json`), mention the affected scope in the bullets (e.g. "turbo env vars", "web app", "database package").

## Format

The AI should:

1. Analyze the git diff to understand changes
2. **For single type changes**: Use the format: `type:\n` followed by emoji bullet points
3. **For multiple type changes**: Use separate sections: `type1:\n` followed by emoji bullets, then `type2:\n` followed by emoji bullets, etc.
4. Each change gets its own line with an appropriate emoji
5. Start with the commit type(s) followed by a colon
6. Add a newline, then list changes as emoji bullets
7. Choose emojis that match the type of change
8. Keep each bullet point concise and descriptive
9. Prioritize the most impactful changes first
10. **Automatically stage, commit, and push** via GitKraken MCP unless specifically instructed otherwise

## Commit Types

- `feat`: New features
- `fix`: Bug fixes
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes
- `test`: Test changes
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

**Optional scope** (for monorepo): You may prefix the type with a scope in parentheses, e.g. `feat(web):`, `chore(db):`, `build(turbo):`, when the change is limited to one app or package. Omit scope when changes span multiple areas or are repo-wide.

## Common Emojis

- 🔀 Routing, navigation, parallel/interception routes
- 🎯 Features, functionality
- 📝 Documentation, structure, updates
- 🔧 Configuration, setup
- ⚡ Performance, optimization
- 🐛 Bug fixes
- 🎨 UI, styling, components
- 📛 Badges, metadata
- 🔐 Auth, security
- 📦 Dependencies, packages
- ♻️ Refactoring, code quality
- 🗑️ Removal, deletion
- ✨ New functionality
- 🏗️ Turborepo, monorepo config, turbo.json, workspace scripts

## Examples

### Small Changes (1-5 files)

```
docs:
📛 Added tech stack badges with package versions
📝 Updated project structure documentation
```

```
fix:
🐛 Resolved session type inference errors
🔧 Updated auth helper types
```

### Multiple Types (Mixed Changes)

```
docs:
📝 Updated README with current codebase structure
📁 Refreshed project structure to reflect password feature module

refactor:
♻️ Moved password management to dedicated feature module
🔧 Enhanced error handling with Better Auth APIError
```

```
feat:
✨ Added password changed email notification system

fix:
🐛 Fixed FieldError component to prevent password exposure

style:
🎨 Improved CSS animations with modern transform properties
```

### Medium Changes (6-15 files)

```
feat:
✨ Implemented password reset flow
📧 Added email verification with React Email
🔐 Created forgot-password action and form
```

### Large Changes (16-30 files)

```
refactor:
♻️ Converted all components to arrow functions
🎨 Migrated AlertDialog to Dialog component
🔀 Created shared auth content components
🎯 Preserved state on interception route refresh
📦 Updated dependencies
```

### Extensive Changes (30+ files)

```
refactor:
♻️ Converted 35+ components from function declarations to arrow functions
🔀 Implemented interception routes for auth modals with state preservation
🎯 Created shared page content components (sign-in, sign-up, forgot-password)
🎨 Applied 16 canonical CSS class optimizations (data-disabled, data-inset, min-w-32)
🔧 Configured Biome useArrowFunction linter rule in complexity group
🗑️ Removed AlertDialog component in favor of Dialog
📦 Updated project dependencies (bun.lock, package.json)
```

### Turborepo / monorepo changes

```
build(turbo):
🏗️ Added env vars to turbo.json for Vercel build (DATABASE_URL, RESEND_*, S3_*, etc.)
🔧 Ensures Turborepo passes through project env to @firstroad/web build
```

```
docs:
📝 Updated README and update-readme.md for Turborepo layout (apps/web, packages/database)
📁 Documented root scripts, turbo filters, and deploy:prod from apps/web
```

```
chore:
🏗️ Switched deploy:prod to standard Vercel deploy (cd apps/web && vercel deploy --prod)
🔧 Added framework and buildCommand to apps/web/vercel.json
📝 Adjusted vercel-deployment.md for Root Directory and link flow
```

## Instructions for AI

**Use the GitKraken MCP** for all git operations (status, diff, stage, commit, push). Do not use terminal `git` commands—the sandbox may lack SSH key access for push, and the GitKraken MCP handles credentials correctly. Fall back to git commands only if the MCP is unavailable or lacks a needed feature.

1. Use GitKraken MCP to get git status and diff (unstaged and staged changes)
2. Analyze the changes and categorize them (note when changes touch multiple areas: root, apps/web, packages/database, packages/emails)
3. Count files changed and lines modified
4. Include newly added files in the commit message summary
5. Generate a commit message:
   - Start with commit type and colon (e.g., `feat:`, `refactor:`, `docs:`)
   - Add a newline
   - List changes as emoji bullet points
   - Each change on its own line
   - Use relevant emojis from the common emojis list
   - Order by importance (most impactful first)
   - Keep bullet points concise and descriptive
   - When passing the message to `git commit` via a shell, prefer a heredoc (see below) so you usually do not need to escape special characters manually
6. Scale based on change size:
   - Small (1-5 files): 2-3 bullet points
   - Medium (6-15 files): 3-4 bullet points
   - Large (16-30 files): 5-7 bullet points
   - Extensive (30+ files): 7-10 bullet points
7. **Automatically execute git operations via GitKraken MCP**:
   - Stage all changes
   - Commit with generated message
   - Push to origin
   - **Skip git operations only if explicitly instructed** (e.g., "just generate the message", "don't commit", etc.)

### Shell usage (recommended heredoc form)

When you need to run `git commit` via a shell, wrap the generated message in a heredoc so the entire multi-line message is passed as a single, exact argument:

```bash
git commit -m "$(cat <<'EOF'
feat(web):
✨ Short summary line
🎯 First bullet point
🐛 Second bullet point
EOF
)"
```

This avoids most shell-escaping issues. The escaping rules below are only needed when you cannot use a heredoc and must pass the message directly as a literal shell argument.

## Character Escaping Rules

When generating commit messages that will be passed directly as a literal shell argument (without a heredoc), escape these characters to prevent shell interpretation issues:

- **Apostrophes**: `Valibot's` → `Valibot\'s`
- **Double quotes**: `"feature"` → `\"feature\"`
- **Backslashes**: `\n` → `\\n`
- **Dollar signs**: `$variable` → `\$variable`
- **Backticks**: `` `code` `` → `` \`code\` ``
- **Parentheses**: `(important)` → `\(important\)`
- **Brackets**: `[array]` → `\[array\]`
- **Braces**: `{object}` → `\{object\}`
- **Pipes**: `a|b` → `a\|b`
- **Semicolons**: `; command` → `\; command`
- **Ampersands**: `a&b` → `a\&b`
- **Less than**: `<tag>` → `\<tag\>`
- **Greater than**: `>output` → `\>output`
- **Question marks**: `?query` → `\?query`
- **Exclamation marks**: `!important` → `\!important`
- **Hash symbols**: `#comment` → `\#comment`
- **At symbols**: `@user` → `\@user`
- **Percent signs**: `%complete` → `\%complete`
- **Tildes**: `~home` → `\~home`
- **Caret**: `^version` → `\^version`
- **Plus signs**: `+feature` → `\+feature`
- **Equals signs**: `=value` → `\=value`
- **Commas**: `a,b` → `a\,b`
- **Periods**: `.file` → `\.file`
- **Colons**: `:value` → `\:value`
- **Slashes**: `/path` → `\/path`

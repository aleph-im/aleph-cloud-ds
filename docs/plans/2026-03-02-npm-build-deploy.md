# npm Build & Deploy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up CI/CD that publishes `@aleph-front/ds` to npm on GitHub Release, with version derived from the git tag.

**Architecture:** Two GitHub Actions workflows — CI runs checks on every PR/push to main, Publish runs on release creation. The package ships raw TypeScript source (no build step). Version in `package.json` stays `0.0.0` in git; the publish workflow patches it from the tag at publish time.

**Tech Stack:** GitHub Actions, pnpm, npm registry

**Design doc:** `docs/plans/2026-03-02-npm-build-deploy-design.md`

---

### Task 1: Prepare package.json for npm publishing

**Files:**
- Modify: `packages/ds/package.json`

**Step 1: Add publishing fields to package.json**

Add `files`, `publishConfig`, and `repository` fields:

```json
{
  "name": "@aleph-front/ds",
  "version": "0.0.0",
  "type": "module",
  "license": "MIT",
  "files": [
    "src/"
  ],
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/aleph-im/aleph-cloud-ds.git",
    "directory": "packages/ds"
  },
  "exports": { ... }
}
```

Key points:
- `files: ["src/"]` — only ships source code, excludes tests, config, node_modules
- `publishConfig.access: "public"` — required for scoped packages to be public
- `repository` — npm shows a link to the repo on the package page

**Step 2: Verify the files list with a dry run**

Run: `cd packages/ds && npm pack --dry-run 2>&1 | head -40`

Expected: Only files under `src/`, `package.json`, `LICENSE`, and `README.md` are listed. No test files, no `tsconfig.json`, no `vitest` config.

**Step 3: Commit**

```bash
git add packages/ds/package.json
git commit -m "chore: prepare package.json for npm publishing"
```

---

### Task 2: Create CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create the workflow file**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    name: Lint, typecheck, test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5  # v4.3.1
        with:
          persist-credentials: false

      - uses: pnpm/action-setup@9fd676a19091d4595eefd76e4bd31c97133911f1  # v4.2.0

      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020  # v4.4.0
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      - name: Build preview
        run: pnpm build
```

**Step 2: Validate the workflow**

Run: `actionlint .github/workflows/ci.yml`

Expected: No errors.

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add CI workflow for lint, typecheck, test"
```

---

### Task 3: Create publish workflow

**Files:**
- Create: `.github/workflows/publish.yml`

**Step 1: Create the workflow file**

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    name: Publish @aleph-front/ds
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5  # v4.3.1
        with:
          persist-credentials: false

      - uses: pnpm/action-setup@9fd676a19091d4595eefd76e4bd31c97133911f1  # v4.2.0

      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020  # v4.4.0
        with:
          node-version: 22
          cache: pnpm
          registry-url: https://registry.npmjs.org

      - run: pnpm install --frozen-lockfile

      - name: Extract and validate version
        id: version
        run: |
          TAG="${GITHUB_REF_NAME}"
          VERSION="${TAG#v}"
          if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$'; then
            echo "::error::Invalid semver tag: $TAG"
            exit 1
          fi
          echo "version=$VERSION" >> "$GITHUB_OUTPUT"

      - name: Patch package version
        run: npm version "${{ steps.version.outputs.version }}" --no-git-tag-version
        working-directory: packages/ds

      - name: Run checks
        run: pnpm check

      - name: Publish
        run: npm publish
        working-directory: packages/ds
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Step 2: Validate the workflow**

Run: `actionlint .github/workflows/publish.yml`

Expected: No errors.

**Step 3: Commit**

```bash
git add .github/workflows/publish.yml
git commit -m "ci: add publish workflow triggered by GitHub Releases"
```

---

### Task 4: Fix preview typecheck (pre-existing issue)

CI will fail if the preview app has typecheck errors. The `next-env.d.ts` file was showing as modified in git status.

**Files:**
- Modify: `apps/preview/next-env.d.ts` (if needed)
- Possibly: `apps/preview/tsconfig.json`

**Step 1: Check the typecheck error**

Run: `pnpm typecheck 2>&1`

Diagnose and fix the error. Common fix: regenerate `next-env.d.ts` or adjust tsconfig.

**Step 2: Verify fix**

Run: `pnpm typecheck`

Expected: Clean exit, no errors.

**Step 3: Commit**

```bash
git add <fixed files>
git commit -m "fix: resolve preview typecheck errors"
```

---

### Task 5: Validate full pipeline locally

**Step 1: Run the full check suite**

Run: `pnpm check`

Expected: All lint, typecheck, and test steps pass.

**Step 2: Test npm pack dry run**

Run: `cd packages/ds && npm pack --dry-run`

Expected: Only `src/` files, `package.json`, and `LICENSE` are included.

**Step 3: Simulate version patching**

Run: `cd packages/ds && npm version 0.1.0-test --no-git-tag-version && cat package.json | grep version && git checkout package.json`

Expected: Version is patched to `0.1.0-test`, then restored.

---

### Task 6: Push and create PR

**Step 1: Push the feature branch**

```bash
git push -u origin feature/npm-build-deploy
```

**Step 2: Create PR**

```bash
gh pr create \
  --title "Add CI/CD pipeline for npm publishing" \
  --body "$(cat <<'EOF'
## Summary
- Prepare DS package.json for npm publishing (files, publishConfig, repository)
- Add CI workflow: lint + typecheck + test + build on PRs and main pushes
- Add publish workflow: triggered by GitHub Release, patches version from tag, publishes to npm

## Setup required (one-time, by org admin)
1. Create `@aleph-front` org on npmjs.com
2. Generate granular automation token (publish-only)
3. Add as `NPM_TOKEN` secret in repo settings

## Test plan
- [ ] CI workflow runs on this PR
- [ ] `npm pack --dry-run` shows only src/ files
- [ ] After merge: create a test release (v0.0.1-alpha.0) to verify publish
EOF
)"
```

---

### Task 7: Update docs

- [ ] DESIGN-SYSTEM.md — no changes needed (no new tokens/components)
- [ ] ARCHITECTURE.md — add CI/CD section documenting the two workflows and release process
- [ ] DECISIONS.md — log: raw TS source (no build), tag-driven versioning, GitHub Release trigger
- [ ] BACKLOG.md — completed items moved, deferred ideas added
- [ ] CLAUDE.md — update Current Features with CI/CD and npm publishing

---

## Important: Repo Access

Current GitHub auth has read-only access to `aleph-im/aleph-cloud-ds`. To push:
- Either get push access granted by an org admin
- Or create a fork PR from `cpascariello/aleph-cloud-ds`

The `NPM_TOKEN` secret must be added by someone with admin access to the repo.

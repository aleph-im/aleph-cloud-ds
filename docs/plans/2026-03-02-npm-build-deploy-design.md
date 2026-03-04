# Design: Build & Deploy to npm

## Summary

Set up a CI/CD pipeline that publishes `@aleph-front/ds` to npm as raw TypeScript source, triggered by GitHub Releases with auto-versioning from git tags.

## Decisions

- **Ship format:** Raw TypeScript source + CSS (no compilation step)
- **Release trigger:** GitHub Release creation with `v*` tag
- **Version source of truth:** Git tag (package.json stays `0.0.0` in repo, patched at publish time)
- **npm access:** Public, scoped under `@aleph-front`
- **Approach:** Minimal GitHub Actions with tag-driven version sync

## Package Preparation

The DS package ships raw `.tsx`, `.ts`, and `.css` files. The `package.json` needs:

- `"files"` field to control what gets published (only `src/`, no tests)
- `"publishConfig": { "access": "public" }` for scoped public package
- Version stays `0.0.0` in git — the publish workflow patches it from the tag

## Workflow 1: CI (`ci.yml`)

**Triggers:** push to `main`, pull requests to `main`

**Steps:**

1. Checkout + pnpm setup + install
2. Run `pnpm check` (lint + typecheck + test) on the DS package
3. Run preview app build to catch integration issues

## Workflow 2: Publish (`publish.yml`)

**Triggers:** GitHub Release created (tag pattern `v*`)

**Steps:**

1. Checkout code
2. Extract version from tag (`v0.2.0` → `0.2.0`), validate it's valid semver
3. Patch `packages/ds/package.json` version with the extracted value
4. Run full checks (`pnpm check`)
5. `npm publish` from `packages/ds/` using an `NPM_TOKEN` secret

## npm Org Setup (manual, one-time)

1. Create the `@aleph-front` org on npmjs.com (or claim the scope)
2. Generate a granular automation token (publish-only)
3. Add it as `NPM_TOKEN` secret in the GitHub repo settings

## Release Workflow for Humans

1. Write code, merge PRs to main
2. When ready to release: GitHub → Releases → Create new release
3. Tag: `v0.1.0`, Title: `v0.1.0`, describe changes
4. Publish → CI publishes to npm automatically

## Consumer Migration

After first publish, scheduler-dashboard can switch from `file:` link to versioned dependency. No rush — `file:` link keeps working for local development.

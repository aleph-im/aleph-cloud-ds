# Aleph Cloud Design System

Tokens-first design system for [Aleph Cloud](https://aleph.im), built with Tailwind CSS 4, OKLCH color scales, and CSS custom properties. Ships as a component library (`@aleph-front/ds`) with a Next.js preview app for visual reference.

**Status:** Published on npm as [`@aleph-front/ds`](https://www.npmjs.com/package/@aleph-front/ds).

## Prerequisites

- [Node.js](https://nodejs.org/) 22 LTS
- [React](https://react.dev/) 19+ and React DOM 19+ (peer dependencies)

## Quick Start

```bash
npm install
npm run dev       # http://localhost:3000 — preview app with theme switcher
npm run check     # lint + typecheck + test
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Static export of the preview app |
| `npm run test` | Run tests (Vitest) |
| `npm run lint` | Lint all workspaces (oxlint) |
| `npm run typecheck` | Type-check all workspaces |
| `npm run check` | lint + typecheck + test |

## Project Structure

```
packages/ds/          # @aleph-front/ds — tokens + components
apps/preview/         # @aleph-front/preview — Next.js preview app
docs/                 # Architecture, decisions, design system docs
```

## Importing the DS

The design system uses source-level subpath exports:

```tsx
import { Button } from "@aleph-front/ds/button";
import { Spinner } from "@aleph-front/ds/ui/spinner";
import { cn } from "@aleph-front/ds/lib/cn";
import "@aleph-front/ds/styles/tokens.css";
```

Within each workspace, internal imports use the `@ac/*` alias which resolves to `./src/*`.

## Using with Another Local Project

The DS exports raw TypeScript/TSX source (no build step), so the consuming project's bundler must transpile it.

### 1. Link the package

From the DS repo, register the package globally:

```bash
cd packages/ds
npm link
```

From your other project, link it:

```bash
npm link @aleph-front/ds
```

### 2. Configure your bundler

Since `@aleph-front/ds` ships source files, your bundler needs to transpile it.

**Next.js** — add to `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ["@aleph-front/ds"],
};
```

**Vite** — add to `vite.config.ts`:

```ts
export default defineConfig({
  ssr: { noExternal: ["@aleph-front/ds"] },
});
```

### 3. Include the tokens CSS

Import the design tokens in your app's global CSS or layout:

```css
@import "@aleph-front/ds/styles/tokens.css";
```

Or in a layout file:

```tsx
import "@aleph-front/ds/styles/tokens.css";
```

### 4. Tailwind CSS

If your project uses Tailwind, add the DS source to your content paths so Tailwind scans its classes:

```css
@import "tailwindcss";
@source "../../node_modules/@aleph-front/ds/src/**/*.tsx";
```

## Documentation

| You need to... | Go here |
|----------------|---------|
| Use tokens (colors, fonts, shadows, gradients, transitions) | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) |
| Use or build components | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) § Components |
| Understand token architecture and patterns | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Know why a decision was made | [`docs/DECISIONS.md`](docs/DECISIONS.md) |
| See planned or deferred work | [`docs/BACKLOG.md`](docs/BACKLOG.md) |

## License

MIT — see [LICENSE](LICENSE)

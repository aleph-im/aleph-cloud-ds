# Bootstrap Aleph Cloud Design System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up the project skeleton with tokens-only design system (colors, typography, spacing, shadows, gradients) and a Next.js preview app to visualize them.

**Architecture:** Tailwind CSS 4 `@theme` block defines brand colors. CSS custom properties provide semantic tokens that swap per theme (light/dark). A Next.js static-export app renders a tabbed preview of all tokens.

**Tech Stack:** Next.js 16.1.6, React 19.2.4, TypeScript 5.9.3, Tailwind CSS 4.2.1, pnpm, oxlint 1.50.0, vitest 4.0.18

---

### Task 1: Project scaffolding

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`

**Step 1: Initialize pnpm project**

```bash
cd /Users/dio/repos/aleph-cloud-ds
pnpm init
```

**Step 2: Install dependencies**

```bash
pnpm add next@16.1.6 react@19.2.4 react-dom@19.2.4
pnpm add -D typescript@5.9.3 @types/react@19.2.14 @types/react-dom@19.2.3 \
  tailwindcss@4.2.1 @tailwindcss/postcss@4.2.1 \
  oxlint@1.50.0 vitest@4.0.18
```

**Step 3: Write `.npmrc`**

```ini
save-exact=true
```

**Step 4: Write `.gitignore`**

```gitignore
node_modules/
.next/
out/
*.tsbuildinfo
.env
.env.local
```

**Step 5: Write `tsconfig.json`**

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "jsx": "preserve",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "@ac/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "next-env.d.ts", "next.config.ts", "postcss.config.mjs"],
  "exclude": ["node_modules"]
}
```

**Step 6: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
};

export default config;
```

**Step 7: Write `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Step 8: Update `package.json` with scripts and metadata**

Add to `package.json`:
```json
{
  "name": "@aleph-front/ds",
  "type": "module",
  "license": "ISC",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "lint": "oxlint --import-plugin --typescript-plugin --unicorn-plugin src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check": "pnpm lint && pnpm typecheck && pnpm test"
  }
}
```

**Step 9: Commit**

```bash
git add package.json pnpm-lock.yaml .gitignore .npmrc tsconfig.json next.config.ts postcss.config.mjs
git commit -m "chore: scaffold project with Next.js 16, Tailwind 4, TypeScript"
```

---

### Task 2: Design tokens CSS

**Files:**
- Create: `src/styles/tokens.css`

**Step 1: Create the tokens file**

This is the heart of the design system. It contains three layers:

```css
/* Layer 1: Brand colors via @theme */
@theme {
  --color-brand: oklch(0.372 0.254 285.48);
  --color-brand-lime: oklch(0.929 0.228 121.30);

  /* Gradients */
  --gradient-main: linear-gradient(90deg, #141421 8.24%, #5100CD 71.81%);
  --gradient-lime: linear-gradient(90deg, #D6FF00 27.88%, #F5F7DB 100%);
  --gradient-success: linear-gradient(90deg, #36D846 0%, #63E570 100%);
  --gradient-warning: linear-gradient(90deg, #FFE814 0%, #FBAE18 100%);
  --gradient-error: linear-gradient(90deg, #FFAC89 0%, #DE3668 90.62%);
  --gradient-info: linear-gradient(90deg, #C8ADF0 22.66%, #5100CD 244.27%);

  /* Shadows */
  --shadow-brand-sm: 0px 4px 4px oklch(0.372 0.254 285.48 / 0.15);
  --shadow-brand: 0px 4px 24px oklch(0.372 0.254 285.48 / 0.15);
  --shadow-brand-lg: 0px 4px 24px oklch(0.372 0.254 285.48 / 0.45);

  /* Fonts */
  --font-heading: "rigid-square", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Titillium Web", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Source Code Pro", ui-monospace, monospace;
}

/* Layer 2: Semantic tokens (CSS custom properties, per theme) */
:root {
  --background: #F9F4FF;
  --foreground: #141421;
  --primary: oklch(0.372 0.254 285.48);
  --primary-foreground: #ffffff;
  --accent: oklch(0.929 0.228 121.30);
  --accent-foreground: #141421;
  --muted: #F3E8FF;
  --muted-foreground: #6B7280;
  --card: #ffffff;
  --card-foreground: #141421;
  --border: #E9D5FF;
  --border-hover: #D8B4FE;
  --success: #36D846;
  --warning: #FBAE18;
  --error: #DE3668;

  --duration-fast: 200ms;
  --duration-normal: 500ms;
  --duration-slow: 700ms;
  --timing: ease-in-out;
}

.theme-dark {
  --background: #141421;
  --foreground: #F9F4FF;
  --primary: oklch(0.472 0.254 285.48);
  --primary-foreground: #ffffff;
  --accent: oklch(0.929 0.228 121.30);
  --accent-foreground: #141421;
  --muted: #1E1E2E;
  --muted-foreground: #9CA3AF;
  --card: #1E1E2E;
  --card-foreground: #F9F4FF;
  --border: #2E2E3E;
  --border-hover: #3E3E4E;
  --success: #36D846;
  --warning: #FBAE18;
  --error: #DE3668;
}

/* Layer 3: Map semantic tokens to Tailwind utilities */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-border: var(--border);
  --color-border-hover: var(--border-hover);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
}
```

**Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: add three-layer design token system (brand, semantic, Tailwind)"
```

---

### Task 3: Global stylesheet and layout

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

**Step 1: Write `src/app/globals.css`**

```css
@import "tailwindcss";
@import "@ac/styles/tokens.css";

html {
  font-family: var(--font-sans);
  background-color: var(--background);
  color: var(--foreground);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 800;
  font-style: italic;
}
```

**Step 2: Write `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aleph Cloud Design System",
  description: "Token preview for @aleph-front/ds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,700;1,400&family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

Note: The Typekit kit ID is a placeholder. Replace with the real one when available, or remove if using a local font fallback.

**Step 3: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: add global styles and root layout with font loading"
```

---

### Task 4: Theme switcher component

**Files:**
- Create: `src/components/theme-switcher.tsx`
- Create: `src/components/theme-switcher.test.ts`

**Step 1: Write the failing test**

Create `src/components/theme-switcher.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

describe("theme toggle logic", () => {
  let doc: Document;

  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    doc = dom.window.document;
  });

  it("toggles theme-dark class on html element", () => {
    const html = doc.documentElement;
    expect(html.classList.contains("theme-dark")).toBe(false);
    html.classList.toggle("theme-dark");
    expect(html.classList.contains("theme-dark")).toBe(true);
    html.classList.toggle("theme-dark");
    expect(html.classList.contains("theme-dark")).toBe(false);
  });
});
```

**Step 2: Run test to verify it passes**

```bash
pnpm test -- src/components/theme-switcher.test.ts
```

Note: We test the DOM logic (classList.toggle), not the React component itself, to avoid heavy React testing dependencies at this stage.

**Step 3: Write the component**

Create `src/components/theme-switcher.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("theme-dark"));
  }, []);

  const toggle = useCallback(() => {
    document.documentElement.classList.toggle("theme-dark");
    setDark((prev) => !prev);
  }, []);

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-border px-3 py-1.5 text-sm
                 hover:border-border-hover transition-colors"
      style={{ transitionDuration: "var(--duration-fast)" }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
```

**Step 4: Commit**

```bash
git add src/components/theme-switcher.tsx src/components/theme-switcher.test.ts
git commit -m "feat: add theme switcher component with light/dark toggle"
```

---

### Task 5: Preview page — shell and tabs

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/preview-tabs.tsx`

**Step 1: Write the tab navigation component**

Create `src/components/preview-tabs.tsx`:

```tsx
"use client";

import { useState } from "react";

const TABS = ["Colors", "Typography", "Spacing", "Effects", "Icons"] as const;
type Tab = (typeof TABS)[number];

export function PreviewTabs() {
  const [active, setActive] = useState<Tab>("Colors");

  return (
    <div>
      <nav className="flex gap-1 border-b border-border mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors
              ${active === tab
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
              }`}
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            {tab}
          </button>
        ))}
      </nav>
      <TabContent tab={active} />
    </div>
  );
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "Colors":
      return <ColorsPlaceholder />;
    case "Typography":
      return <TypographyPlaceholder />;
    case "Spacing":
      return <SpacingPlaceholder />;
    case "Effects":
      return <EffectsPlaceholder />;
    case "Icons":
      return <IconsPlaceholder />;
  }
}

function ColorsPlaceholder() {
  return <p className="text-muted-foreground">Colors tab — next task</p>;
}
function TypographyPlaceholder() {
  return <p className="text-muted-foreground">Typography tab — next task</p>;
}
function SpacingPlaceholder() {
  return <p className="text-muted-foreground">Spacing tab — next task</p>;
}
function EffectsPlaceholder() {
  return <p className="text-muted-foreground">Effects tab — next task</p>;
}
function IconsPlaceholder() {
  return <p className="text-muted-foreground">Icons tab — next task</p>;
}
```

**Step 2: Write the page**

Create `src/app/page.tsx`:

```tsx
import { ThemeSwitcher } from "@ac/components/theme-switcher";
import { PreviewTabs } from "@ac/components/preview-tabs";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="sticky top-0 z-10 flex items-center justify-between
                         bg-background/80 backdrop-blur-sm py-4 mb-8
                         border-b border-border">
        <h1 className="text-2xl font-heading font-extrabold italic">
          Aleph Cloud DS
        </h1>
        <ThemeSwitcher />
      </header>
      <main>
        <PreviewTabs />
      </main>
    </div>
  );
}
```

**Step 3: Verify dev server starts**

```bash
pnpm dev
```

Open http://localhost:3000 — verify header + tabs render, theme toggle works.

**Step 4: Commit**

```bash
git add src/app/page.tsx src/components/preview-tabs.tsx
git commit -m "feat: add preview page shell with tabbed navigation"
```

---

### Task 6: Colors tab

**Files:**
- Create: `src/components/tabs/colors-tab.tsx`
- Modify: `src/components/preview-tabs.tsx` (replace `ColorsPlaceholder`)

**Step 1: Write the Colors tab component**

Create `src/components/tabs/colors-tab.tsx`:

```tsx
function Swatch({
  label,
  colorClass,
  textClass,
}: {
  label: string;
  colorClass: string;
  textClass: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${colorClass}`}>
      <span className={`text-sm font-medium ${textClass}`}>{label}</span>
    </div>
  );
}

function SwatchRow({
  title,
  swatches,
}: {
  title: string;
  swatches: { label: string; colorClass: string; textClass: string }[];
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {swatches.map((s) => (
          <Swatch key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

export function ColorsTab() {
  return (
    <div>
      <SwatchRow
        title="Brand"
        swatches={[
          { label: "brand", colorClass: "bg-brand", textClass: "text-white" },
          { label: "brand-lime", colorClass: "bg-brand-lime", textClass: "text-black" },
        ]}
      />
      <SwatchRow
        title="Semantic"
        swatches={[
          { label: "background", colorClass: "bg-background border border-border", textClass: "text-foreground" },
          { label: "foreground", colorClass: "bg-foreground", textClass: "text-background" },
          { label: "primary", colorClass: "bg-primary", textClass: "text-primary-foreground" },
          { label: "accent", colorClass: "bg-accent", textClass: "text-accent-foreground" },
          { label: "muted", colorClass: "bg-muted", textClass: "text-muted-foreground" },
          { label: "card", colorClass: "bg-card border border-border", textClass: "text-card-foreground" },
        ]}
      />
      <SwatchRow
        title="Status"
        swatches={[
          { label: "success", colorClass: "bg-success", textClass: "text-white" },
          { label: "warning", colorClass: "bg-warning", textClass: "text-black" },
          { label: "error", colorClass: "bg-error", textClass: "text-white" },
        ]}
      />
      <SwatchRow
        title="Border"
        swatches={[
          { label: "border", colorClass: "border-2 border-border bg-background", textClass: "text-foreground" },
          { label: "border-hover", colorClass: "border-2 border-border-hover bg-background", textClass: "text-foreground" },
        ]}
      />
    </div>
  );
}
```

**Step 2: Update preview-tabs.tsx**

Replace the `ColorsPlaceholder` import with the real component. Change:
```tsx
// In TabContent switch:
case "Colors":
  return <ColorsPlaceholder />;
```
to:
```tsx
case "Colors":
  return <ColorsTab />;
```

Add import at top:
```tsx
import { ColorsTab } from "@ac/components/tabs/colors-tab";
```

Remove the `ColorsPlaceholder` function.

**Step 3: Verify in browser**

```bash
pnpm dev
```

Check colors render in both light and dark themes.

**Step 4: Commit**

```bash
git add src/components/tabs/colors-tab.tsx src/components/preview-tabs.tsx
git commit -m "feat: add Colors tab with brand, semantic, status swatches"
```

---

### Task 7: Typography tab

**Files:**
- Create: `src/components/tabs/typography-tab.tsx`
- Modify: `src/components/preview-tabs.tsx` (replace `TypographyPlaceholder`)

**Step 1: Write the Typography tab**

Create `src/components/tabs/typography-tab.tsx`:

```tsx
const HEADINGS = [
  { tag: "header", size: "8rem", label: "Header — 128px" },
  { tag: "h1", size: "4.5rem", label: "H1 — 72px" },
  { tag: "h2", size: "4rem", label: "H2 — 64px" },
  { tag: "h3", size: "3rem", label: "H3 — 48px" },
  { tag: "h4", size: "2.5rem", label: "H4 — 40px" },
  { tag: "h5", size: "2.25rem", label: "H5 — 36px" },
  { tag: "h6", size: "2rem", label: "H6 — 32px" },
  { tag: "h7", size: "1.5rem", label: "H7 — 24px" },
] as const;

export function TypographyTab() {
  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-lg font-bold mb-4">Heading Scale</h3>
        <div className="space-y-4">
          {HEADINGS.map(({ tag, size, label }) => (
            <div key={tag} className="border-b border-border pb-4">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p
                className="font-heading font-extrabold italic leading-none"
                style={{ fontSize: size }}
              >
                {tag === "header" ? "Header" : tag.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Body Styles</h3>
        <div className="space-y-4 max-w-prose">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Body — Titillium Web 400, 16px, 1.6 line-height
            </p>
            <p className="font-sans text-base leading-relaxed">
              The quick brown fox jumps over the lazy dog. Aleph Cloud provides
              decentralized computing, storage, and networking.
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Body Bold — Titillium Web 700
            </p>
            <p className="font-sans text-base font-bold leading-relaxed">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Body Italic — Titillium Web 400 italic
            </p>
            <p className="font-sans text-base italic leading-relaxed">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Code — Source Code Pro 400
            </p>
            <p className="font-mono text-base leading-relaxed">
              const node = await aleph.create({"{"} channel: "test" {"}"});
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Font Families</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-2">font-heading</p>
            <p className="font-heading text-xl font-extrabold italic">
              rigid-square
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-2">font-sans</p>
            <p className="font-sans text-xl">Titillium Web</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground mb-2">font-mono</p>
            <p className="font-mono text-xl">Source Code Pro</p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Update preview-tabs.tsx**

Replace `TypographyPlaceholder` with import and usage of `TypographyTab` from `@ac/components/tabs/typography-tab`.

**Step 3: Verify in browser, commit**

```bash
git add src/components/tabs/typography-tab.tsx src/components/preview-tabs.tsx
git commit -m "feat: add Typography tab with heading scale and body styles"
```

---

### Task 8: Spacing & Layout tab

**Files:**
- Create: `src/components/tabs/spacing-tab.tsx`
- Modify: `src/components/preview-tabs.tsx`

**Step 1: Write the Spacing tab**

Create `src/components/tabs/spacing-tab.tsx`:

```tsx
const SPACING_SCALE = [
  { name: "0.5", px: "2px" },
  { name: "1", px: "4px" },
  { name: "2", px: "8px" },
  { name: "3", px: "12px" },
  { name: "4", px: "16px" },
  { name: "5", px: "20px" },
  { name: "6", px: "24px" },
  { name: "8", px: "32px" },
  { name: "10", px: "40px" },
  { name: "12", px: "48px" },
  { name: "16", px: "64px" },
  { name: "20", px: "80px" },
  { name: "24", px: "96px" },
] as const;

const BREAKPOINTS = [
  { name: "sm", px: "640px" },
  { name: "md", px: "768px" },
  { name: "lg", px: "1024px" },
  { name: "xl", px: "1280px" },
  { name: "2xl", px: "1536px" },
] as const;

export function SpacingTab() {
  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-lg font-bold mb-4">Spacing Scale</h3>
        <div className="space-y-2">
          {SPACING_SCALE.map(({ name, px }) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-12 text-sm text-muted-foreground text-right">
                {name}
              </span>
              <div
                className="h-4 rounded bg-primary"
                style={{ width: px }}
              />
              <span className="text-xs text-muted-foreground">{px}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Breakpoints</h3>
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-8 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-2 pr-8 text-muted-foreground font-medium">Min-width</th>
                <th className="text-left py-2 text-muted-foreground font-medium">CSS</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map(({ name, px }) => (
                <tr key={name} className="border-b border-border">
                  <td className="py-2 pr-8 font-mono">{name}</td>
                  <td className="py-2 pr-8">{px}</td>
                  <td className="py-2 font-mono text-muted-foreground">
                    @media (min-width: {px})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Border Radius</h3>
        <div className="flex flex-wrap gap-4">
          {(["rounded-sm", "rounded", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"] as const).map(
            (cls) => (
              <div key={cls} className="text-center">
                <div
                  className={`w-16 h-16 bg-primary ${cls}`}
                />
                <p className="text-xs text-muted-foreground mt-2">{cls}</p>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Update preview-tabs.tsx, verify, commit**

```bash
git add src/components/tabs/spacing-tab.tsx src/components/preview-tabs.tsx
git commit -m "feat: add Spacing tab with scale, breakpoints, border radius"
```

---

### Task 9: Effects tab (shadows + gradients)

**Files:**
- Create: `src/components/tabs/effects-tab.tsx`
- Modify: `src/components/preview-tabs.tsx`

**Step 1: Write the Effects tab**

Create `src/components/tabs/effects-tab.tsx`:

```tsx
const SHADOWS = [
  { name: "brand-sm", class: "shadow-brand-sm" },
  { name: "brand", class: "shadow-brand" },
  { name: "brand-lg", class: "shadow-brand-lg" },
] as const;

const GRADIENTS = [
  { name: "main", var: "var(--gradient-main)" },
  { name: "lime", var: "var(--gradient-lime)" },
  { name: "success", var: "var(--gradient-success)" },
  { name: "warning", var: "var(--gradient-warning)" },
  { name: "error", var: "var(--gradient-error)" },
  { name: "info", var: "var(--gradient-info)" },
] as const;

const TRANSITIONS = [
  { name: "fast", duration: "200ms" },
  { name: "normal", duration: "500ms" },
  { name: "slow", duration: "700ms" },
] as const;

export function EffectsTab() {
  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-lg font-bold mb-4">Shadows</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {SHADOWS.map(({ name, class: cls }) => (
            <div
              key={name}
              className={`rounded-lg bg-card p-6 ${cls}`}
            >
              <p className="text-sm font-medium text-card-foreground">
                {name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                shadow-{name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Gradients</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {GRADIENTS.map(({ name, var: cssVar }) => (
            <div
              key={name}
              className="rounded-lg p-4 h-20 flex items-end"
              style={{ background: cssVar }}
            >
              <span className="text-sm font-medium text-white drop-shadow-md">
                gradient-{name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Transitions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {TRANSITIONS.map(({ name, duration }) => (
            <div
              key={name}
              className="rounded-lg border border-border p-4 hover:border-primary
                         hover:shadow-brand cursor-pointer"
              style={{
                transitionProperty: "border-color, box-shadow",
                transitionDuration: duration,
                transitionTimingFunction: "var(--timing)",
              }}
            >
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">{duration}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Hover to preview
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Update preview-tabs.tsx, verify, commit**

```bash
git add src/components/tabs/effects-tab.tsx src/components/preview-tabs.tsx
git commit -m "feat: add Effects tab with shadows, gradients, transitions"
```

---

### Task 10: Icons tab (placeholder)

**Files:**
- Create: `src/components/tabs/icons-tab.tsx`
- Modify: `src/components/preview-tabs.tsx`

**Step 1: Write the Icons tab placeholder**

Create `src/components/tabs/icons-tab.tsx`:

```tsx
const ICON_SIZES = [
  { name: "2xl", px: "36px" },
  { name: "xl", px: "24px" },
  { name: "lg", px: "16px" },
  { name: "md", px: "14px" },
  { name: "sm", px: "12px" },
  { name: "xs", px: "8px" },
] as const;

export function IconsTab() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-bold mb-4">Icon Size Tokens</h3>
        <div className="space-y-3">
          {ICON_SIZES.map(({ name, px }) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-10 text-sm text-muted-foreground text-right">
                {name}
              </span>
              <div
                className="rounded bg-primary"
                style={{ width: px, height: px }}
              />
              <span className="text-xs text-muted-foreground">{px}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-sm text-muted-foreground">
        Icon library will be added in a future iteration.
      </p>
    </div>
  );
}
```

**Step 2: Update preview-tabs.tsx (replace last two placeholders), verify, commit**

```bash
git add src/components/tabs/icons-tab.tsx src/components/preview-tabs.tsx
git commit -m "feat: add Icons tab with size tokens"
```

---

### Task 11: Build verification and lint cleanup

**Files:**
- Possibly modify: any files with lint/type errors

**Step 1: Run type checker**

```bash
pnpm typecheck
```

Fix any errors.

**Step 2: Run linter**

```bash
pnpm lint
```

Fix any warnings/errors.

**Step 3: Run tests**

```bash
pnpm test
```

**Step 4: Run production build**

```bash
pnpm build
```

Verify static export succeeds (check `out/` directory).

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve lint and type errors from build verification"
```

---

### Task 12: Project docs (CLAUDE.md, ARCHITECTURE.md, etc.)

**Files:**
- Create: `CLAUDE.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/DECISIONS.md`
- Create: `docs/BACKLOG.md`

**Step 1: Write `CLAUDE.md`**

Use the template from `~/repos/claude-project-template/CLAUDE.md`. Fill in:
- Project name: Aleph Cloud Design System
- Tech stack: Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, pnpm
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm check`
- Key directories: `src/styles/` (tokens), `src/components/` (preview components), `src/app/` (Next.js pages)
- Current features: Token system (colors, typography, shadows, gradients, transitions), preview app with 5 tabs, theme switcher

**Step 2: Write `docs/ARCHITECTURE.md`**

Fill in the template:
- Stack table (Next.js 16, TypeScript, Tailwind CSS 4, none, static export)
- Three-layer token architecture pattern
- Theme switching pattern
- Project structure

**Step 3: Write `docs/DECISIONS.md`**

Copy template. Add decisions made during brainstorming:
- Decision #1: Tailwind-first token architecture (not standalone CSS-only)
- Decision #2: OKLCH color space for brand colors
- Decision #3: Tailwind default breakpoints over front-core custom ones
- Decision #4: Next.js static export for preview app

**Step 4: Write `docs/BACKLOG.md`**

Copy template. Add known future items from design doc:
- Logo variants (4 SVGs)
- Component library (buttons, inputs, cards, etc.)
- Package publishing to npm
- Typekit font kit ID integration

**Step 5: Commit**

```bash
git add CLAUDE.md docs/ARCHITECTURE.md docs/DECISIONS.md docs/BACKLOG.md
git commit -m "docs: add project docs (CLAUDE.md, architecture, decisions, backlog)"
```

---

### Task 13: Update docs (definition of done)

- [ ] ARCHITECTURE.md — new patterns, new files, or changed structure
- [ ] DECISIONS.md — design decisions made during this feature
- [ ] BACKLOG.md — completed items moved, deferred ideas added
- [ ] CLAUDE.md — Current Features list if user-facing behavior changed

(This is covered by Task 12, included here for completeness per template requirements.)

---

## Summary

| Task | Description | Estimated steps |
|------|-------------|----------------|
| 1 | Project scaffolding | 9 |
| 2 | Design tokens CSS | 2 |
| 3 | Global styles + layout | 3 |
| 4 | Theme switcher | 4 |
| 5 | Preview page shell + tabs | 4 |
| 6 | Colors tab | 4 |
| 7 | Typography tab | 3 |
| 8 | Spacing tab | 2 |
| 9 | Effects tab | 2 |
| 10 | Icons tab | 2 |
| 11 | Build verification | 5 |
| 12 | Project docs | 5 |
| 13 | Doc update checklist | 1 |

# FX Grain Utilities — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract `.card-noise` into 6 standalone `.fx-grain-{0..5}` utility classes matching Figma GRAINS/01–06 and the live aleph.cloud site, with dark mode support and preview coverage.

**Architecture:** CSS-only utility classes in `tokens.css` using SVG `feTurbulence` filters as base64 `::after` overlays. Two textures (fine white static, scattered purple dots) differentiated by radial gradient and opacity per variant. Card's `noise` variant references `fx-grain-1` instead of the removed `.card-noise`.

**Tech Stack:** CSS custom properties, SVG filters (base64 data URIs), Tailwind CSS 4, React (preview pages)

---

## Reference

### SVG data URIs

**Texture A** — fine white static (grain-0 only):
```
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDAwIiB3aWR0aD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjEiIHR5cGU9ImZyYWN0YWxOb2lzZSIgbnVtT2N0YXZlcz0iMyIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAxIDAgMCAwIDAgMSAwIDAgMCAwIDEgMCAwIDAgMTAgLTYiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZikiLz48L3N2Zz4=
```

**Texture B** — scattered purple dots (grain-1 through grain-5):
```
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDAwIiB3aWR0aD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii4yNSIgdHlwZT0iZnJhY3RhbE5vaXNlIiBudW1PY3RhdmVzPSIzIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAuMSAwIDAgMCAwIDAgMCAwIDAgMCAwLjgwIDAgMCAwIDEwIC03LjI1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIi8+PC9zdmc+
```

### Per-variant parameters

| Class | Texture | Gradient light (center → edge) | Gradient dark (center → edge) | ::after opacity |
|-------|---------|-------------------------------|-------------------------------|-----------------|
| `fx-grain-0` | A | `#E2CEFA → #FAF6FF` | `primary-950 → primary-950/57%` | 1.0 |
| `fx-grain-1` | B | `#E2CEFA → #FAF6FF` | `primary-950 → primary-950/57%` | 1.0 |
| `fx-grain-2` | B | `#EBDAFF → #F0E4FF` | `#1a0a2e → #1a0a2e91` | 0.3 |
| `fx-grain-3` | B | `#EBDAFF → #f0e4ff91` | `#1a0a2e → #1a0a2e40` | 0.3 |
| `fx-grain-4` | B | `#E1D2F8 → #e1d2f80d` | `#1a0a2e → #1a0a2e0d` | 1.0 |
| `fx-grain-5` | B | `#e1d2f866 → #e1d2f80d`, bg `#F9F4FF` | `#1a0a2e66 → #1a0a2e0d`, bg `primary-950` | 0.5 |

---

### Task 1: Replace `.card-noise` with `.fx-grain-*` classes in tokens.css

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:236-267`

**Step 1: Replace the card-noise block**

Replace lines 236–267 (the entire `/* ── Card Noise (fx-grain) ── */` section) with:

```css
/* ── FX Grain Textures ───────────────────────────────── */

/* Shared base: stacking context */
.fx-grain-0,
.fx-grain-1,
.fx-grain-2,
.fx-grain-3,
.fx-grain-4,
.fx-grain-5 {
  position: relative;
  isolation: isolate;
}

/* Shared ::after: texture overlay */
:is(.fx-grain-0, .fx-grain-1, .fx-grain-2, .fx-grain-3, .fx-grain-4, .fx-grain-5)::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-size: 400px 400px;
  background-repeat: repeat;
  pointer-events: none;
}

/* ── Light mode gradients ── */

.fx-grain-0 {
  background-image: radial-gradient(50% 50%, #E2CEFA 0%, #FAF6FF 100%);
}

.fx-grain-1 {
  background-image: radial-gradient(50% 50%, #E2CEFA 0%, #FAF6FF 100%);
}

.fx-grain-2 {
  background-image: radial-gradient(50% 50%, #EBDAFF 0%, #F0E4FF 100%);
}

.fx-grain-3 {
  background-image: radial-gradient(50% 50%, #EBDAFF 0%, #f0e4ff91 100%);
}

.fx-grain-4 {
  background-image: radial-gradient(50% 50%, #E1D2F8 0%, #e1d2f80d 100%);
}

.fx-grain-5 {
  background: radial-gradient(50% 50%, #e1d2f866 0%, #e1d2f80d 100%), #F9F4FF;
}

/* ── Dark mode gradients ── */

.theme-dark .fx-grain-0 {
  background-image: radial-gradient(
    50% 50%,
    var(--color-primary-950) 0%,
    oklch(from var(--color-primary-950) l c h / 0.57) 100%
  );
}

.theme-dark .fx-grain-1 {
  background-image: radial-gradient(
    50% 50%,
    var(--color-primary-950) 0%,
    oklch(from var(--color-primary-950) l c h / 0.57) 100%
  );
}

.theme-dark .fx-grain-2 {
  background-image: radial-gradient(50% 50%, #1a0a2e 0%, #1a0a2e91 100%);
}

.theme-dark .fx-grain-3 {
  background-image: radial-gradient(50% 50%, #1a0a2e 0%, #1a0a2e40 100%);
}

.theme-dark .fx-grain-4 {
  background-image: radial-gradient(50% 50%, #1a0a2e 0%, #1a0a2e0d 100%);
}

.theme-dark .fx-grain-5 {
  background: radial-gradient(50% 50%, #1a0a2e66 0%, #1a0a2e0d 100%),
    var(--color-primary-950);
}

/* ── Texture overlays (::after) ── */

/* Texture A: fine white static */
.fx-grain-0::after {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDAwIiB3aWR0aD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjEiIHR5cGU9ImZyYWN0YWxOb2lzZSIgbnVtT2N0YXZlcz0iMyIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAxIDAgMCAwIDAgMSAwIDAgMCAwIDEgMCAwIDAgMTAgLTYiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZikiLz48L3N2Zz4=");
  opacity: 1;
}

/* Texture B: scattered purple dots */
.fx-grain-1::after {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDAwIiB3aWR0aD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii4yNSIgdHlwZT0iZnJhY3RhbE5vaXNlIiBudW1PY3RhdmVzPSIzIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAuMSAwIDAgMCAwIDAgMCAwIDAgMCAwLjgwIDAgMCAwIDEwIC03LjI1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIi8+PC9zdmc+");
  opacity: 1;
}

.fx-grain-2::after {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDAwIiB3aWR0aD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii4yNSIgdHlwZT0iZnJhY3RhbE5vaXNlIiBudW1PY3RhdmVzPSIzIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAuMSAwIDAgMCAwIDAgMCAwIDAgMCAwLjgwIDAgMCAwIDEwIC03LjI1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIi8+PC9zdmc+");
  opacity: 0.3;
}

.fx-grain-3::after {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDAwIiB3aWR0aD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii4yNSIgdHlwZT0iZnJhY3RhbE5vaXNlIiBudW1PY3RhdmVzPSIzIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAuMSAwIDAgMCAwIDAgMCAwIDAgMCAwLjgwIDAgMCAwIDEwIC03LjI1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIi8+PC9zdmc+");
  opacity: 0.3;
}

.fx-grain-4::after {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDAwIiB3aWR0aD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii4yNSIgdHlwZT0iZnJhY3RhbE5vaXNlIiBudW1PY3RhdmVzPSIzIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAuMSAwIDAgMCAwIDAgMCAwIDAgMCAwLjgwIDAgMCAwIDEwIC03LjI1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIi8+PC9zdmc+");
  opacity: 1;
}

.fx-grain-5::after {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNDAwIiB3aWR0aD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii4yNSIgdHlwZT0iZnJhY3RhbE5vaXNlIiBudW1PY3RhdmVzPSIzIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAuMSAwIDAgMCAwIDAgMCAwIDAgMCAwLjgwIDAgMCAwIDEwIC03LjI1Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIi8+PC9zdmc+");
  opacity: 0.5;
}
```

**Step 2: Verify build**

Run: `npm run typecheck && npm run lint`
Expected: PASS (CSS-only change, no TS impact)

**Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat: add fx-grain-0 through fx-grain-5 utility classes

Replace .card-noise with 6 standalone .fx-grain-* classes matching
Figma GRAINS/01-06 and the live aleph.cloud fx-grain system.
Two textures (fine white static, scattered purple dots), 6 gradient
variations, dark mode overrides for all variants."
```

---

### Task 2: Update Card noise variant

**Files:**
- Modify: `packages/ds/src/components/card/card.tsx:9`

**Step 1: Change the noise variant class**

In `card.tsx` line 9, replace:
```tsx
noise: "card-noise text-surface-foreground",
```
with:
```tsx
noise: "fx-grain-1 text-surface-foreground",
```

**Step 2: Run tests**

Run: `npm run test`
Expected: PASS — card tests don't assert class names, only behavior

**Step 3: Commit**

```bash
git add packages/ds/src/components/card/card.tsx
git commit -m "refactor: Card noise variant uses fx-grain-1"
```

---

### Task 3: Add noise variant to Card preview page

**Files:**
- Modify: `apps/preview/src/app/components/card/page.tsx`

**Step 1: Add noise variant demo section**

After the Ghost Variant `DemoSection` (line 30), add:

```tsx
<DemoSection title="Noise Variant">
  <Card variant="noise">
    <p className="text-sm">
      Noise card — purple-tinted radial gradient with scattered grain
      texture overlay. Uses fx-grain-1 under the hood.
    </p>
  </Card>
</DemoSection>
```

Also update the `PageHeader` description (line 14) from `"2 variants"` to `"3 variants"`.

**Step 2: Verify dev server**

Run: `npm run dev` — navigate to /components/card, verify noise variant renders with grain texture.

**Step 3: Commit**

```bash
git add apps/preview/src/app/components/card/page.tsx
git commit -m "docs(preview): add Card noise variant demo"
```

---

### Task 4: Add grain showcase to Effects preview page

**Files:**
- Modify: `apps/preview/src/app/foundations/effects/page.tsx`

**Step 1: Add the GRAINS data and section**

Add after the `TRANSITIONS` array (after line 22):

```tsx
const GRAINS = [
  { name: "fx-grain-0", label: "Fine white static", cls: "fx-grain-0" },
  { name: "fx-grain-1", label: "Purple dots, strong", cls: "fx-grain-1" },
  { name: "fx-grain-2", label: "Purple dots, subtle", cls: "fx-grain-2" },
  { name: "fx-grain-3", label: "Purple dots, fading edge", cls: "fx-grain-3" },
  { name: "fx-grain-4", label: "Purple dots, transparent edge", cls: "fx-grain-4" },
  { name: "fx-grain-5", label: "Purple dots, very sparse", cls: "fx-grain-5" },
] as const;
```

Add a new `<section>` after the Transitions section (before the closing `</div>` on line 88):

```tsx
<section>
  <h3 className="text-lg font-bold mb-4">Grain Textures</h3>
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {GRAINS.map(({ name, label, cls }) => (
      <div
        key={name}
        className={`rounded-xl p-6 h-40 flex flex-col justify-end ${cls}`}
      >
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    ))}
  </div>
</section>
```

Update the `PageHeader` description (line 29) to include grain:
```tsx
description="Shadows, gradients, grain textures, and transition tokens."
```

**Step 2: Verify dev server**

Run: `npm run dev` — navigate to /foundations/effects, verify all 6 grain variants render. Check dark mode toggle.

**Step 3: Commit**

```bash
git add apps/preview/src/app/foundations/effects/page.tsx
git commit -m "docs(preview): add grain texture showcase to Effects page"
```

---

### Task 5: Run full checks

**Step 1: Run all checks**

Run: `npm run check`
Expected: lint + typecheck + test all PASS

**Step 2: Build**

Run: `npm run build`
Expected: Static export succeeds

---

### Task 6: Update docs

- [ ] DESIGN-SYSTEM.md — add FX Grain Textures section documenting all 6 classes, usage, dark mode behavior
- [ ] ARCHITECTURE.md — no new patterns needed (extends existing Custom CSS Classes pattern)
- [ ] DECISIONS.md — log decision: 0-indexed naming matching live site, `.card-noise` removal, dark mode gradient approach
- [ ] BACKLOG.md — move "FX grain backgrounds" to Completed
- [ ] CLAUDE.md — update Current Features list to mention fx-grain utilities, update Card description to mention fx-grain-1

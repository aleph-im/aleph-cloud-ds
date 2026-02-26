# Decisions Log

Key decisions made during development. When you wonder "why did we do X?", the answer should be here.

---

## How Decisions Are Logged

Decisions are captured when these phrases appear:
- "decided" / "let's go with" / "rejected"
- "choosing X because" / "not doing X because"
- "actually, let's" / "changed my mind"

Each entry includes:
- Context (what we were working on)
- Decision (what was chosen)
- Rationale (why - the most important part)

---

## Decision #10 — 2026-02-26

**Context:** Whether to tokenize structural button properties (radii, heights, padding, font sizes)
**Decision:** Use plain Tailwind values, don't tokenize structural properties
**Rationale:** No rebrand has happened yet. Extracting to tokens later is a trivial mechanical refactor. Tokenizing now adds indirection, loses Tailwind autocomplete, and creates tokens that may never change. YAGNI.

## Decision #9 — 2026-02-26

**Context:** Button font family
**Decision:** Use `font-heading` (Rigid Square), `font-extrabold`, no italic
**Rationale:** Buttons are brand elements, not body text. The existing front-core also used a display font (Rubik bold) for buttons. Italic reserved for headings.

## Decision #8 — 2026-02-26

**Context:** Polymorphic button rendering (`as="a"` vs `asChild`)
**Decision:** Use `asChild` pattern (React.cloneElement) instead of `as` prop
**Rationale:** Works with Next.js `<Link>`, router links, and any element without prop forwarding headaches. No Radix dependency — simple cloneElement implementation.

## Decision #7 — 2026-02-26

**Context:** Button variant architecture
**Decision:** CVA (Class Variance Authority) with 6 variants (primary, secondary, outline, text, destructive, warning) and 4 sizes (xs, sm, md, lg). No `color` prop — variant determines color.
**Rationale:** Variant-determines-color eliminates the combinatorial explosion of the old system (2 kinds × 4 variants × 8+ colors). CVA gives type-safe variant maps with zero runtime. Rebrand-safe because visual decisions live in the token layer.
**Alternatives considered:** Pure Tailwind maps (reinvents CVA), CSS Modules (doesn't leverage Tailwind utilities)

## Decision #6 — 2026-02-26

**Context:** Color token architecture for component library
**Decision:** Full OKLCH 50–950 scales for primary, accent, success, warning, error, neutral. Replace bare semantic tokens (`--primary`, etc.) with scales. No backward compatibility.
**Rationale:** Scales give components fine-grained color control. OKLCH enables Tailwind's `/opacity` modifier. No external consumers exist, so no backward compat needed — replace, don't deprecate.

## Decision #5 — 2026-02-26

**Context:** CSS import of token file
**Decision:** Use relative path (`../styles/tokens.css`) instead of path alias (`@ac/styles/tokens.css`)
**Rationale:** CSS `@import` is processed by PostCSS, which doesn't read tsconfig paths. Only TypeScript files benefit from the `@ac/*` alias.

## Decision #4 — 2026-02-26

**Context:** Module resolution for TypeScript
**Decision:** Use `module: "esnext"` and `moduleResolution: "bundler"` instead of `nodenext`
**Rationale:** Next.js uses a bundler (Turbopack/webpack), not Node's native module resolution. `nodenext` requires explicit file extensions and doesn't resolve tsconfig paths properly in a bundler context.

## Decision #3 — 2026-02-26

**Context:** Breakpoint values — front-core uses 576/992/1200/1400
**Decision:** Use Tailwind defaults (640/768/1024/1280/1536)
**Rationale:** Close enough that custom breakpoints aren't worth the complexity. Tailwind defaults are well-tested and documented.

## Decision #2 — 2026-02-26

**Context:** Color space for brand colors
**Decision:** OKLCH for brand colors, hex for semantic tokens
**Rationale:** OKLCH provides perceptually uniform color manipulation. Brand purple (#5100CD) converts cleanly. Hex used for semantic tokens because they're simpler static values.

## Decision #1 — 2026-02-26

**Context:** Choosing architecture for design token system
**Decision:** Three-layer Tailwind-first architecture (@theme + CSS custom properties + @theme inline)
**Rationale:** Lets all default Tailwind classes work out of the box while adding brand-specific tokens. CSS custom properties enable theme switching without JS runtime. Proven pattern from data-terminal project.
**Alternatives considered:** CSS-in-JS (styled-components — rejected, what we're replacing), standalone CSS variables without Tailwind integration

# Input, Textarea & FormField Design

Three composable form components following the same patterns as the Button component (CVA, `cn()`, `forwardRef`).

## Components

### Input

**File:** `src/components/input/input.tsx`

**Props:** Extends `InputHTMLAttributes<HTMLInputElement>` + CVA variants:
- `size` — `"sm" | "md"` (default: `"md"`)
- `error` — `boolean` (default: `false`) — toggles error border color

**Visual style:**
- `rounded-full` (pill shape, matching buttons)
- `border-2` (thinner than button's `border-3` — inputs feel lighter)
- `font-sans` (body font — inputs are content, not labels)
- Focus: `ring-2 ring-primary-400 ring-offset-2` (same focus ring as Button)
- Error: border switches to `error-500`
- Disabled: `opacity-50 pointer-events-none`

**Sizes:**

| Size | Padding | Font |
|------|---------|------|
| `sm` | `py-1.5 px-4` | `text-sm` |
| `md` | `py-2 px-5` | `text-base` |

**Colors (theme-aware):**
- Background: `bg-card`
- Text: `text-foreground`
- Border: `border-edge`, hover: `border-edge-hover`
- Placeholder: `text-muted-foreground`

### Textarea

**File:** `src/components/textarea/textarea.tsx`

**Props:** Extends `TextareaHTMLAttributes<HTMLTextAreaElement>` + same CVA variants as Input:
- `size` — `"sm" | "md"` (default: `"md"`)
- `error` — `boolean` (default: `false`)

**Differences from Input:**
- `rounded-2xl` instead of `rounded-full` (pill shape looks wrong on multi-line)
- Default `rows={4}`
- `resize-y` (vertical resize only)
- Otherwise identical styling

### FormField

**File:** `src/components/form-field/form-field.tsx`

**Props:**
- `label` — `string` (required)
- `required` — `boolean` (default: `false`) — appends styled asterisk after label
- `helperText` — `string` (optional) — hint below the input
- `error` — `string` (optional) — replaces helper text, shown in error color
- `children` — `ReactNode` (the Input or Textarea)
- `className` — `string` (optional) — applied to wrapper div

**Layout:**
```
┌─────────────────────────────┐
│ Label *                     │  font-sans text-sm font-medium text-foreground
│ ┌─────────────────────────┐ │
│ │ [children — Input/etc]  │ │  gap-1.5 between label and input
│ └─────────────────────────┘ │
│ Helper text or error msg    │  font-sans text-xs text-muted-foreground (or text-error-600)
└─────────────────────────────┘
```

**Required asterisk:**
```tsx
<label>
  {label}
  {required && <span className="text-error-600 ml-0.5" aria-hidden="true">*</span>}
</label>
```

**Accessibility:**
- `useId()` generates stable id, wired to `htmlFor` on label
- `cloneElement` passes `id` and `aria-describedby` to child
- Error message gets `role="alert"`

**No CVA** — FormField is a layout wrapper, not a visual variant component.

**What FormField does NOT do:**
- No validation logic (consumer's job)
- No disabled styling (comes from child Input/Textarea)

## Testing Strategy

Test behavior and accessibility, not appearance.

**Input (`input.test.tsx`):**
- Renders `<input>` with forwarded ref
- Forwards HTML attributes (`placeholder`, `type`, `aria-label`)
- Merges custom `className`
- Error state adds `aria-invalid="true"`
- Disabled state sets `disabled` attribute

**Textarea (`textarea.test.tsx`):**
- Renders `<textarea>` with forwarded ref
- Default `rows={4}`, overridable
- Same attribute forwarding and error/disabled tests as Input

**FormField (`form-field.test.tsx`):**
- Label `htmlFor` wired to child input's `id`
- Helper text renders, linked via `aria-describedby`
- Error replaces helper text, gets `role="alert"`, linked via `aria-describedby`
- Required asterisk renders when `required={true}`, has `aria-hidden="true"`

## Preview App

Add "Form Controls" section to `src/components/tabs/components-tab.tsx` (existing Components tab, below button showcase):
- Input sizes: sm and md
- Input states: default, error, disabled
- Textarea: default and error
- FormField: label + helper text, label + error, required asterisk

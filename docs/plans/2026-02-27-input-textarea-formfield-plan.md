# Input, Textarea & FormField Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Input, Textarea, and FormField components to the design system with TDD.

**Architecture:** Three composable components following Button's patterns (CVA, `cn()`, `forwardRef`). Input and Textarea are styled primitives. FormField is a layout wrapper that wires accessibility (label, helper text, error) via `useId()` + `cloneElement`. No validation logic — consumers handle that.

**Tech Stack:** React 19, CVA, Tailwind CSS 4, Vitest + Testing Library

**Reference:** `docs/plans/2026-02-27-input-textarea-formfield-design.md`

---

### Task 1: Input — failing tests

**Files:**
- Create: `src/components/input/input.test.tsx`

**Step 1: Write the test file**

```tsx
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox", { name: "Name" })).toBeTruthy();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Name" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards HTML attributes", () => {
    render(<Input placeholder="Enter name" type="email" aria-label="Email" />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("placeholder")).toBe("Enter name");
    expect(input.getAttribute("type")).toBe("email");
  });

  it("merges custom className", () => {
    render(<Input className="custom-class" aria-label="Name" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("custom-class");
  });

  it("sets aria-invalid when error is true", () => {
    render(<Input error aria-label="Name" />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("does not set aria-invalid when error is false", () => {
    render(<Input aria-label="Name" />);
    expect(
      screen.getByRole("textbox").getAttribute("aria-invalid"),
    ).toBeNull();
  });

  it("sets disabled attribute", () => {
    render(<Input disabled aria-label="Name" />);
    expect(
      (screen.getByRole("textbox") as HTMLInputElement).disabled,
    ).toBe(true);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm test -- src/components/input/input.test.tsx`
Expected: FAIL — module `./input` not found

**Step 3: Commit**

```bash
git add src/components/input/input.test.tsx
git commit -m "test: add failing Input tests"
```

---

### Task 2: Input — implementation

**Files:**
- Create: `src/components/input/input.tsx`

**Step 1: Write the Input component**

```tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const inputVariants = cva(
  [
    "w-full font-sans text-foreground bg-card",
    "border-2 border-edge rounded-full",
    "placeholder:text-muted-foreground",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "py-1.5 px-4 text-sm",
        md: "py-2 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants> & {
    error?: boolean;
  };

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, error = false, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          inputVariants({ size }),
          error && "border-error-500 hover:border-error-600",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants, type InputProps };
```

**Step 2: Run tests to verify they pass**

Run: `pnpm test -- src/components/input/input.test.tsx`
Expected: PASS — all 7 tests

**Step 3: Run full check**

Run: `pnpm check`
Expected: 0 lint warnings, 0 type errors, all tests pass

**Step 4: Commit**

```bash
git add src/components/input/input.tsx
git commit -m "feat: add Input component"
```

---

### Task 3: Textarea — failing tests

**Files:**
- Create: `src/components/textarea/textarea.test.tsx`

**Step 1: Write the test file**

```tsx
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toBeTruthy();
    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("defaults to 4 rows", () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox").getAttribute("rows")).toBe("4");
  });

  it("allows overriding rows", () => {
    render(<Textarea rows={8} aria-label="Message" />);
    expect(screen.getByRole("textbox").getAttribute("rows")).toBe("8");
  });

  it("forwards HTML attributes", () => {
    render(<Textarea placeholder="Type here" aria-label="Message" />);
    expect(
      screen.getByRole("textbox").getAttribute("placeholder"),
    ).toBe("Type here");
  });

  it("merges custom className", () => {
    render(<Textarea className="custom-class" aria-label="Message" />);
    expect(screen.getByRole("textbox").className).toContain("custom-class");
  });

  it("sets aria-invalid when error is true", () => {
    render(<Textarea error aria-label="Message" />);
    expect(
      screen.getByRole("textbox").getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("sets disabled attribute", () => {
    render(<Textarea disabled aria-label="Message" />);
    expect(
      (screen.getByRole("textbox") as HTMLTextAreaElement).disabled,
    ).toBe(true);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm test -- src/components/textarea/textarea.test.tsx`
Expected: FAIL — module `./textarea` not found

**Step 3: Commit**

```bash
git add src/components/textarea/textarea.test.tsx
git commit -m "test: add failing Textarea tests"
```

---

### Task 4: Textarea — implementation

**Files:**
- Create: `src/components/textarea/textarea.tsx`

**Step 1: Write the Textarea component**

```tsx
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const textareaVariants = cva(
  [
    "w-full font-sans text-foreground bg-card",
    "border-2 border-edge rounded-2xl",
    "placeholder:text-muted-foreground",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "resize-y transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "py-1.5 px-4 text-sm",
        md: "py-2 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> &
  VariantProps<typeof textareaVariants> & {
    error?: boolean;
  };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size, error = false, rows = 4, className, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          textareaVariants({ size }),
          error && "border-error-500 hover:border-error-600",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants, type TextareaProps };
```

**Step 2: Run tests to verify they pass**

Run: `pnpm test -- src/components/textarea/textarea.test.tsx`
Expected: PASS — all 8 tests

**Step 3: Run full check**

Run: `pnpm check`
Expected: 0 lint warnings, 0 type errors, all tests pass

**Step 4: Commit**

```bash
git add src/components/textarea/textarea.tsx
git commit -m "feat: add Textarea component"
```

---

### Task 5: FormField — failing tests

**Files:**
- Create: `src/components/form-field/form-field.test.tsx`

**Step 1: Write the test file**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "./form-field";

describe("FormField", () => {
  it("renders label linked to child input via htmlFor", () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Email");
    expect(label.tagName).toBe("LABEL");
    expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
  });

  it("renders helper text linked via aria-describedby", () => {
    render(
      <FormField label="Email" helperText="We'll never share it">
        <input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    const helper = screen.getByText("We'll never share it");
    expect(input.getAttribute("aria-describedby")).toBe(helper.id);
  });

  it("renders error message replacing helper text", () => {
    render(
      <FormField label="Email" helperText="Hint" error="Invalid email">
        <input />
      </FormField>,
    );
    expect(screen.queryByText("Hint")).toBeNull();
    expect(screen.getByText("Invalid email")).toBeTruthy();
  });

  it("error message has role=alert", () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>,
    );
    expect(screen.getByRole("alert").textContent).toBe("Invalid email");
  });

  it("error message is linked via aria-describedby", () => {
    render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    const error = screen.getByRole("alert");
    expect(input.getAttribute("aria-describedby")).toBe(error.id);
  });

  it("renders required asterisk with aria-hidden", () => {
    render(
      <FormField label="Email" required>
        <input />
      </FormField>,
    );
    const asterisk = screen.getByText("*");
    expect(asterisk.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render asterisk when not required", () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>,
    );
    expect(screen.queryByText("*")).toBeNull();
  });

  it("merges custom className on wrapper", () => {
    const { container } = render(
      <FormField label="Email" className="custom-wrapper">
        <input />
      </FormField>,
    );
    expect(container.firstElementChild?.className).toContain("custom-wrapper");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm test -- src/components/form-field/form-field.test.tsx`
Expected: FAIL — module `./form-field` not found

**Step 3: Commit**

```bash
git add src/components/form-field/form-field.test.tsx
git commit -m "test: add failing FormField tests"
```

---

### Task 6: FormField — implementation

**Files:**
- Create: `src/components/form-field/form-field.tsx`

**Step 1: Write the FormField component**

```tsx
import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@ac/lib/cn";

type FormFieldProps = {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

function FormField({
  label,
  required = false,
  helperText,
  error,
  children,
  className,
}: FormFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error ?? helperText);

  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: inputId,
        ...(hasMessage ? { "aria-describedby": messageId } : {}),
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-error-600 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {child}
      {error ? (
        <p id={messageId} role="alert" className="text-xs text-error-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={messageId} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

FormField.displayName = "FormField";

export { FormField, type FormFieldProps };
```

**Step 2: Run tests to verify they pass**

Run: `pnpm test -- src/components/form-field/form-field.test.tsx`
Expected: PASS — all 8 tests

**Step 3: Run full check**

Run: `pnpm check`
Expected: 0 lint warnings, 0 type errors, all tests pass

**Step 4: Commit**

```bash
git add src/components/form-field/form-field.tsx
git commit -m "feat: add FormField component"
```

---

### Task 7: Preview app — form controls showcase

**Files:**
- Modify: `src/components/tabs/components-tab.tsx`

**Step 1: Add form controls section**

Add imports at the top of the file:

```tsx
import { Input } from "@ac/components/input/input";
import { Textarea } from "@ac/components/textarea/textarea";
import { FormField } from "@ac/components/form-field/form-field";
```

Add the following sections inside `ComponentsTab`, after the existing "As Link" section (before the closing `</div>`):

```tsx
      <Section title="Input Sizes">
        <div className="grid gap-4 max-w-md">
          <Input size="sm" placeholder="Small input" aria-label="Small input" />
          <Input size="md" placeholder="Medium input" aria-label="Medium input" />
        </div>
      </Section>

      <Section title="Input States">
        <div className="grid gap-4 max-w-md">
          <Input placeholder="Default" aria-label="Default" />
          <Input error placeholder="Error state" aria-label="Error" />
          <Input disabled placeholder="Disabled" aria-label="Disabled" />
        </div>
      </Section>

      <Section title="Textarea">
        <div className="grid gap-4 max-w-md">
          <Textarea placeholder="Default textarea" aria-label="Default textarea" />
          <Textarea error placeholder="Error textarea" aria-label="Error textarea" />
        </div>
      </Section>

      <Section title="Form Fields">
        <div className="grid gap-6 max-w-md">
          <FormField label="Username" helperText="Choose a unique username">
            <Input placeholder="aleph_user" />
          </FormField>
          <FormField label="Email" required error="Please enter a valid email">
            <Input type="email" placeholder="you@example.com" error />
          </FormField>
          <FormField label="Bio" helperText="Tell us about yourself">
            <Textarea placeholder="I build on Aleph Cloud..." />
          </FormField>
        </div>
      </Section>
```

**Step 2: Run full check**

Run: `pnpm check`
Expected: 0 lint warnings, 0 type errors, all tests pass

**Step 3: Visual verification**

Run: `pnpm dev`
Open http://localhost:3000 → Components tab. Verify:
- Input sizes (sm/md) render with correct padding
- Error input has red border
- Disabled input is dimmed
- Textarea renders multi-line with rounded-2xl
- FormField shows label, helper text, error message, required asterisk
- All states work in both light and dark themes

**Step 4: Commit**

```bash
git add src/components/tabs/components-tab.tsx
git commit -m "feat: add form controls showcase to preview app"
```

---

### Task 8: Update docs

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/DECISIONS.md`
- Modify: `docs/BACKLOG.md`
- Modify: `CLAUDE.md`

**Step 1: Update DESIGN-SYSTEM.md**

Add to the `## Components` section, after the Spinner component:

```markdown
### Input

Styled text input with CVA sizing and error state.

\```tsx
import { Input } from "@ac/components/input/input";

<Input size="md" placeholder="Enter text" />
<Input size="sm" placeholder="Small" />
<Input error placeholder="Invalid" />
<Input disabled placeholder="Disabled" />
\```

**Sizes:** `sm` (py-1.5, text-sm) · `md` (py-2, text-base, default)

**Error:** `error={true}` switches border to error-500, sets `aria-invalid`.

### Textarea

Multi-line text input. Same API as Input, `rounded-2xl`, vertical resize.

\```tsx
import { Textarea } from "@ac/components/textarea/textarea";

<Textarea placeholder="Enter message" />
<Textarea size="sm" rows={6} />
<Textarea error placeholder="Invalid" />
\```

**Defaults:** `rows={4}`, `resize-y`, `size="md"`

### FormField

Layout wrapper that wires label, helper text, and error message to a child input with proper accessibility attributes.

\```tsx
import { FormField } from "@ac/components/form-field/form-field";
import { Input } from "@ac/components/input/input";

<FormField label="Email" required helperText="We'll never share it">
  <Input type="email" placeholder="you@example.com" />
</FormField>

<FormField label="Email" required error="Invalid email">
  <Input type="email" error />
</FormField>
\```

**Props:** `label` (required), `required`, `helperText`, `error`, `className`

**Accessibility:** Auto-generates `id`, wires `htmlFor`, `aria-describedby`, and `role="alert"` on errors.
```

**Step 2: Update ARCHITECTURE.md**

Add to the project structure tree:

```
│   ├── input/
│   │   ├── input.tsx       # Input component (CVA variants)
│   │   └── input.test.tsx  # Behavior + accessibility tests
│   ├── textarea/
│   │   ├── textarea.tsx    # Textarea component (CVA variants)
│   │   └── textarea.test.tsx
│   ├── form-field/
│   │   ├── form-field.tsx  # FormField layout wrapper
│   │   └── form-field.test.tsx
```

**Step 3: Update BACKLOG.md**

Move "Component library (continued)" to Completed section. Update description to note Input, Textarea, and FormField are done; remaining components (cards, modals, etc.) still open. If needed, create a new open item for the remaining components.

**Step 4: Update CLAUDE.md**

Add to Current Features list:
- Input component with 2 sizes, error/disabled states
- Textarea component with vertical resize
- FormField wrapper with label, required asterisk, helper text, error message

**Step 5: Commit**

```bash
git add docs/DESIGN-SYSTEM.md docs/ARCHITECTURE.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs: add Input, Textarea, FormField to design system docs"
```

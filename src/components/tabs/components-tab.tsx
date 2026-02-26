import { Button } from "@ac/components/button/button";

const variants = [
  "primary",
  "secondary",
  "outline",
  "text",
  "destructive",
  "warning",
] as const;

const sizes = ["xs", "sm", "md", "lg"] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function PlaceholderIcon({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>{label}</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

export function ComponentsTab() {
  return (
    <div>
      <Section title="Variants">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-end gap-3">
          {sizes.map((s) => (
            <Button key={s} size={s}>
              Size {s}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="With Icons">
        <div className="flex flex-wrap items-center gap-3">
          <Button iconLeft={<PlaceholderIcon label="Add" />}>
            Icon Left
          </Button>
          <Button iconRight={<PlaceholderIcon label="Arrow" />}>
            Icon Right
          </Button>
          <Button
            iconLeft={<PlaceholderIcon label="Add" />}
            iconRight={<PlaceholderIcon label="Arrow" />}
          >
            Both Icons
          </Button>
        </div>
      </Section>

      <Section title="Loading">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} loading>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Disabled">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} disabled>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="As Link">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="primary">
            <a href="#demo">Primary Link</a>
          </Button>
          <Button asChild variant="text">
            <a href="#demo">Text Link</a>
          </Button>
        </div>
      </Section>
    </div>
  );
}

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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {swatches.map((s) => (
          <Swatch key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

function ScaleRow({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-11">
        {stops.map((stop) => (
          <div
            key={stop}
            className="rounded-lg p-3"
            style={{ backgroundColor: `var(--color-${color}-${stop})` }}
          >
            <span
              className={`text-xs font-medium ${stop >= 500 ? "text-white" : "text-black"}`}
            >
              {stop}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColorsTab() {
  return (
    <div>
      <ScaleRow title="Primary" color="primary" />
      <ScaleRow title="Accent" color="accent" />
      <ScaleRow title="Success" color="success" />
      <ScaleRow title="Warning" color="warning" />
      <ScaleRow title="Error" color="error" />
      <ScaleRow title="Neutral" color="neutral" />

      <SwatchRow
        title="Semantic (theme-aware)"
        swatches={[
          {
            label: "background",
            colorClass: "bg-background border border-edge",
            textClass: "text-foreground",
          },
          {
            label: "foreground",
            colorClass: "bg-foreground",
            textClass: "text-background",
          },
          {
            label: "primary",
            colorClass: "bg-primary",
            textClass: "text-primary-foreground",
          },
          {
            label: "accent",
            colorClass: "bg-accent",
            textClass: "text-accent-foreground",
          },
          {
            label: "muted",
            colorClass: "bg-muted",
            textClass: "text-muted-foreground",
          },
          {
            label: "card",
            colorClass: "bg-card border border-edge",
            textClass: "text-card-foreground",
          },
        ]}
      />
      <SwatchRow
        title="Border"
        swatches={[
          {
            label: "border",
            colorClass: "border-2 border-edge bg-background",
            textClass: "text-foreground",
          },
          {
            label: "border-hover",
            colorClass: "border-2 border-edge-hover bg-background",
            textClass: "text-foreground",
          },
        ]}
      />
    </div>
  );
}

type DocHeaderProps = {
  title: string;
  description: string;
};

export function DocHeader({ title, description }: DocHeaderProps) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-heading font-extrabold italic mb-2">
        {title}
      </h2>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

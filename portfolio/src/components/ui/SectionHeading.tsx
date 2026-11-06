type SectionHeadingProps = {
  /** id untuk <h2>; dipakai section sebagai aria-labelledby. */
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
};

export function SectionHeading({ id, title, eyebrow, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Consistent section header used across public pages.
 */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) => {
  const alignment =
    align === "center"
      ? "items-center text-center mx-auto"
      : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment} max-w-3xl ${className}`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <div
        className={`crimson-mark mt-4 mb-5 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      <h2 className="section-title">{title}</h2>
      {description && (
        <p
          className={`section-copy mt-4 ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;

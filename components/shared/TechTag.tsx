type TechTagProps = {
  label: string;
  className?: string;
};

const TechTag = ({ label, className = "" }: TechTagProps) => (
  <span className={`tech-tag ${className}`}>{label}</span>
);

export default TechTag;

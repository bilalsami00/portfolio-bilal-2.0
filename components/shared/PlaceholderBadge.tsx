type PlaceholderBadgeProps = {
  label?: string;
};

/**
 * Visible marker for content that must be replaced with real data.
 */
const PlaceholderBadge = ({ label = "Placeholder" }: PlaceholderBadgeProps) => (
  <span className="placeholder-badge">{label}</span>
);

export default PlaceholderBadge;

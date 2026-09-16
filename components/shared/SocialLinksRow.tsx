import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { socialLinks, primarySocialLinks } from "../../data/socials";
import type { SocialLink } from "../../data/types";
import { resolveFontAwesomeIcon } from "../../utilities/resolveFontAwesomeIcon";

const platformIconMap: Record<string, "fab" | "fas"> = {
  linkedin: "fab",
  github: "fab",
  facebook: "fab",
  youtube: "fab",
  twitter: "fab",
  stackoverflow: "fab",
  email: "fas",
  other: "fas",
};

const platformIconName: Record<string, string> = {
  linkedin: "linkedin",
  github: "github",
  facebook: "facebook",
  youtube: "youtube",
  twitter: "twitter",
  stackoverflow: "stack-overflow",
  email: "envelope",
  other: "link",
};

type SocialLinksRowProps = {
  variant?: "primary" | "all";
  className?: string;
};

const SocialLinksRow = ({
  variant = "primary",
  className = "",
}: SocialLinksRowProps) => {
  const links: SocialLink[] =
    variant === "primary"
      ? primarySocialLinks
      : socialLinks.filter((item) => !item.isPlaceholder);

  return (
    <ul className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
      {links.map((link) => {
        const icon = resolveFontAwesomeIcon(
          platformIconMap[link.platform] || "fab",
          platformIconName[link.platform] as never
        );

        return (
          <li key={link.id}>
            <Link
              href={link.href}
              target="_blank"
              rel="noreferrer"
              title={link.title}
              aria-label={link.title}
              className="
                inline-flex h-10 w-10 items-center justify-center
                border border-steel-700 bg-ink-800/70 text-steel-300
                transition-all duration-300
                hover:border-crimson-500/60 hover:text-parchment-100 hover:bg-ink-700
              "
            >
              {icon && <FontAwesomeIcon icon={icon} className="h-4 w-4" />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialLinksRow;

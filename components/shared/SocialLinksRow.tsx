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
  whatsapp: "fab",
  phone: "fas",
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
  whatsapp: "whatsapp",
  phone: "phone",
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
    <ul className={`flex flex-wrap items-center gap-2 sm:gap-2.5 ${className}`}>
      {links.map((link) => {
        const icon = resolveFontAwesomeIcon(
          platformIconMap[link.platform] || "fab",
          platformIconName[link.platform] as never
        );
        const opensInNewTab = /^https?:/i.test(link.href);

        return (
          <li key={link.id}>
            <Link
              href={link.href}
              target={opensInNewTab ? "_blank" : undefined}
              rel={opensInNewTab ? "noreferrer" : undefined}
              title={link.title}
              aria-label={link.title}
              className="
                inline-flex h-11 w-11 items-center justify-center
                border border-steel-700/80 bg-ink-800/70 text-steel-300
                transition-colors duration-300
                hover:border-crimson-500/60 hover:text-parchment-100 hover:bg-ink-700
                focus-visible:border-crimson-500/60
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

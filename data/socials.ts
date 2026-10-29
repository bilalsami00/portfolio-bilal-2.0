import { siteIdentity } from "./site";
import type { SocialLink } from "./types";

/**
 * Confirmed public profiles and contact actions.
 * Phone and email come from siteIdentity so the icon row stays in sync
 * with the footer and contact page.
 * LinkedIn is the URL from the CV and has not been re-checked in this pass.
 */

const phoneDigits = siteIdentity.phone.replace(/\D/g, "");

export const socialLinks: SocialLink[] = [
  {
    id: "social-github",
    label: "GitHub",
    platform: "github",
    href: "https://github.com/bilalsami00",
    title: "GitHub profile",
  },
  {
    id: "social-linkedin",
    label: "LinkedIn",
    platform: "linkedin",
    href: "https://www.linkedin.com/in/bilal-sami-9b027b240/",
    title: "LinkedIn profile",
  },
  {
    id: "social-whatsapp",
    label: "WhatsApp",
    platform: "whatsapp",
    href: `https://wa.me/${phoneDigits}`,
    title: "WhatsApp",
  },
  {
    id: "social-phone",
    label: "Call",
    platform: "phone",
    href: `tel:+${phoneDigits}`,
    title: "Call",
  },
  {
    id: "social-email",
    label: "Email",
    platform: "email",
    href: `mailto:${siteIdentity.email}`,
    title: "Email",
  },
];

/** Primary socials for hero and compact UI — only real, non-placeholder links */
export const primarySocialLinks = socialLinks.filter(
  (link) =>
    !link.isPlaceholder &&
    [
      "linkedin",
      "github",
      "stackoverflow",
      "whatsapp",
      "phone",
      "email",
    ].includes(link.platform)
);

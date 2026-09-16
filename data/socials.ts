import type { SocialLink } from "./types";

/**
 * Social profiles for Bilal Sami.
 * Only GitHub is confirmed from the project remote; other links are placeholders.
 */

export const socialLinks: SocialLink[] = [
  {
    id: "social-github",
    label: "GitHub",
    platform: "github",
    href: "https://github.com/bilalsami00",
    title: "View GitHub profile",
  },
  {
    id: "social-linkedin",
    label: "LinkedIn",
    platform: "linkedin",
    href: "#",
    title: "LinkedIn profile (placeholder — replace)",
    isPlaceholder: true,
  },
  {
    id: "social-stackoverflow",
    label: "Stack Overflow",
    platform: "stackoverflow",
    href: "#",
    title: "Stack Overflow profile (placeholder — replace)",
    isPlaceholder: true,
  },
  {
    id: "social-youtube",
    label: "YouTube",
    platform: "youtube",
    href: "#",
    title: "YouTube channel (placeholder — replace)",
    isPlaceholder: true,
  },
  {
    id: "social-facebook",
    label: "Facebook",
    platform: "facebook",
    href: "#",
    title: "Facebook profile (placeholder — replace)",
    isPlaceholder: true,
  },
  {
    id: "social-twitter",
    label: "Twitter / X",
    platform: "twitter",
    href: "#",
    title: "Twitter profile (placeholder — replace)",
    isPlaceholder: true,
  },
];

/** Primary socials for hero and compact UI — only real, non-placeholder links */
export const primarySocialLinks = socialLinks.filter(
  (link) =>
    !link.isPlaceholder &&
    ["linkedin", "github", "stackoverflow"].includes(link.platform)
);

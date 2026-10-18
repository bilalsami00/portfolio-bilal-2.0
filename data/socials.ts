import type { SocialLink } from "./types";

/**
 * Confirmed public profiles only.
 * LinkedIn is the URL from the CV and has not been re-checked in this pass.
 */

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
];

/** Primary socials for hero and compact UI — only real, non-placeholder links */
export const primarySocialLinks = socialLinks.filter(
  (link) =>
    !link.isPlaceholder &&
    ["linkedin", "github", "stackoverflow"].includes(link.platform)
);

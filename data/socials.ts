import type { SocialLink } from "./types";

/**
 * Social profiles taken from the original OpenFolio config.ts.
 * Twitter remains a placeholder until a real profile URL is provided.
 */

export const socialLinks: SocialLink[] = [
  {
    id: "social-linkedin",
    label: "LinkedIn",
    platform: "linkedin",
    href: "https://linkedin.com/in/kashanhaider",
    title: "Connect on LinkedIn",
  },
  {
    id: "social-github",
    label: "GitHub",
    platform: "github",
    href: "https://github.com/smkh-pro",
    title: "View GitHub profile",
  },
  {
    id: "social-stackoverflow",
    label: "Stack Overflow",
    platform: "stackoverflow",
    href: "https://stackoverflow.com/users/9877416/kashan-haider",
    title: "View Stack Overflow profile",
  },
  {
    id: "social-youtube",
    label: "YouTube",
    platform: "youtube",
    href: "https://youtube.com/smkh-pro",
    title: "Visit YouTube channel",
  },
  {
    id: "social-facebook",
    label: "Facebook",
    platform: "facebook",
    href: "https://www.facebook.com/SMKH.PRO",
    title: "Visit Facebook profile",
  },
  {
    id: "social-twitter",
    label: "Twitter / X",
    platform: "twitter",
    href: "#",
    title: "Twitter profile (placeholder)",
    isPlaceholder: true,
  },
];

/** Primary socials for hero and compact UI */
export const primarySocialLinks = socialLinks.filter(
  (link) =>
    !link.isPlaceholder &&
    ["linkedin", "github", "stackoverflow"].includes(link.platform)
);

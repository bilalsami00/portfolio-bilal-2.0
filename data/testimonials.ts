import type { TestimonialEntry } from "./types";

/**
 * No verified testimonials exist in the repository.
 * This structure is intentionally marked as placeholder — do not invent praise.
 */

export const testimonials: TestimonialEntry[] = [
  {
    id: "testimonial-placeholder-1",
    quote:
      "[Placeholder] Add a short quote from a colleague, client, or manager about collaboration, delivery quality, or technical ownership.",
    authorName: "[Colleague / Client Name]",
    authorRole: "[Role]",
    authorCompany: "[Company]",
    isPlaceholder: true,
  },
  {
    id: "testimonial-placeholder-2",
    quote:
      "[Placeholder] Add a second perspective covering communication, reliability, or product thinking.",
    authorName: "[Colleague / Client Name]",
    authorRole: "[Role]",
    authorCompany: "[Company]",
    isPlaceholder: true,
  },
];

export const hasRealTestimonials = testimonials.some(
  (item) => !item.isPlaceholder
);

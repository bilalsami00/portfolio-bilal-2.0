import type { TestimonialEntry } from "./types";

/**
 * No verified testimonials. The list stays empty so the site does not show fake quotes.
 */

export const testimonials: TestimonialEntry[] = [];

export const hasRealTestimonials = testimonials.some(
  (item) => !item.isPlaceholder
);

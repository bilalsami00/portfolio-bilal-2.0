import { projectImageVariants } from "../data/projectImageVariants";

export type ImageVariant = {
  src: string;
  width: number;
  height: number;
};

export type ProjectImageVariantSet = {
  cover: ImageVariant[];
  tall: ImageVariant[];
  full: ImageVariant;
};

type ResponsiveImage = {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
};

const toSrcSet = (variants: ImageVariant[]) =>
  variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");

/**
 * Resolves optimized variants for a screenshot. Falls back to the original
 * file when the optimizer has not been run for it yet.
 */
export const getProjectImage = (
  src: string,
  kind: "cover" | "tall" | "full"
): ResponsiveImage => {
  const set = projectImageVariants[src];
  if (!set) return { src };

  if (kind === "full") {
    return {
      src: set.full.src,
      width: set.full.width,
      height: set.full.height,
    };
  }

  const variants = set[kind];
  const largest = variants[variants.length - 1];
  return {
    src: largest.src,
    srcSet: toSrcSet(variants),
    width: largest.width,
    height: largest.height,
  };
};

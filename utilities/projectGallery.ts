import type { PortfolioProject } from "../data/types";
import { projectScreenshots } from "../data/projectScreenshots";
import { getProjectImage } from "./projectImages";

export type DiscoveredShot = {
  src: string;
  thumb: string;
  view: string;
  label: string;
  viewWidth: number;
  viewHeight: number;
};

export type GalleryImage = {
  src: string;
  thumb: string;
  preview: string;
  alt: string;
  width?: number;
  height?: number;
};

export const projectFolderFromImage = (src: string): string => {
  const [, root, folder] = src.split("/");
  if (root !== "projects" || !folder) return "";
  return folder;
};

const coverImage = (project: PortfolioProject): GalleryImage => {
  const preview = getProjectImage(project.image, "full");
  const thumb = getProjectImage(project.image, "cover");
  return {
    src: project.image,
    thumb: thumb.src,
    preview: preview.src,
    alt: project.imageAlt,
    width: preview.width,
    height: preview.height,
  };
};

const discoveredImage = (
  project: PortfolioProject,
  shot: DiscoveredShot
): GalleryImage => ({
  src: shot.src,
  thumb: shot.thumb,
  preview: shot.view,
  alt: `${project.title} — ${shot.label}`,
  width: shot.viewWidth,
  height: shot.viewHeight,
});

/** Cover first, then every other screenshot from that project folder. */
export const buildProjectGallery = (
  project: PortfolioProject
): GalleryImage[] => {
  const folder = projectFolderFromImage(project.image);
  const discovered = projectScreenshots[folder] ?? [];
  const rest = discovered
    .filter((shot) => shot.src !== project.image)
    .map((shot) => discoveredImage(project, shot));
  return [coverImage(project), ...rest];
};

export const stepGalleryIndex = (
  index: number,
  delta: number,
  length: number
): number => {
  if (length <= 1) return 0;
  return (index + delta + length) % length;
};

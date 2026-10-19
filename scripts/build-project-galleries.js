/* eslint-disable */
/**
 * Discovers screenshots under public/projects and writes gallery display
 * variants plus data/projectScreenshots.ts.
 *
 * Originals stay in place. Optimized files are written only under each
 * project's optimized/gallery directory and are not treated as source shots.
 *
 *   npx --yes --package=sharp@0.33 node scripts/build-project-galleries.js
 */
const fs = require("fs");
const path = require("path");

let sharp;
try {
  sharp = require("sharp");
} catch (error) {
  console.error(
    "sharp is required. Run: npx --yes --package=sharp@0.33 node scripts/build-project-galleries.js"
  );
  process.exit(1);
}

const root = path.join(__dirname, "..");
const projectsDir = path.join(root, "public", "projects");
const manifestFile = path.join(root, "data", "projectScreenshots.ts");
const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;
const MAX_WEBP_DIMENSION = 16383;
const ACTION_RANK = {
  view: 1,
  detail: 2,
  details: 2,
  add: 3,
  edit: 4,
  update: 5,
  delete: 6,
  deleted: 6,
  actions: 7,
  action: 7,
  generate: 8,
  filter: 9,
  expanded: 10,
  expand: 10,
  options: 11,
  range: 12,
};

const toPublicPath = (absolute) =>
  `/${path
    .relative(path.join(root, "public"), absolute)
    .split(path.sep)
    .join("/")}`;

const listSourceImages = (folderDir) => {
  const found = [];
  const walk = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "optimized") return;
        walk(absolute);
        return;
      }
      if (IMAGE_EXT.test(entry.name)) found.push(absolute);
    });
  };
  walk(folderDir);
  return found;
};

const splitName = (base) => {
  const parts = base.split("-");
  const actions = [];
  while (parts.length > 1 && ACTION_RANK[parts[parts.length - 1]] != null) {
    actions.unshift(parts.pop());
  }
  return { section: parts.join("-"), actions };
};

const sectionRank = (section) => {
  const value = section.toLowerCase();
  if (/(^|-)home$/.test(value)) return 0;
  if (/(^|-)dashboard$/.test(value)) return 1;
  if (/(^|-)about$/.test(value)) return 2;
  if (
    /(^|-)(privacy|privacy-policy|terms|terms-condition|legal|refund|refund-policy)$/.test(
      value
    )
  ) {
    return 80;
  }
  return 10;
};

const compareShots = (left, right) => {
  const a = splitName(path.basename(left, path.extname(left)));
  const b = splitName(path.basename(right, path.extname(right)));
  const rank = sectionRank(a.section) - sectionRank(b.section);
  if (rank !== 0) return rank;
  const section = a.section.localeCompare(b.section, "en", {
    numeric: true,
    sensitivity: "base",
  });
  if (section !== 0) return section;
  const actionA = a.actions.reduce(
    (total, name) => total * 20 + ACTION_RANK[name],
    0
  );
  const actionB = b.actions.reduce(
    (total, name) => total * 20 + ACTION_RANK[name],
    0
  );
  if (actionA !== actionB) return actionA - actionB;
  return path.basename(left).localeCompare(path.basename(right), "en", {
    numeric: true,
    sensitivity: "base",
  });
};

const labelFromFile = (file) => {
  const base = path.basename(file, path.extname(file));
  const raw = base.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  const fixed = raw
    .replace(/\breqister\b/gi, "register")
    .replace(/\bsubcription\b/gi, "subscription")
    .replace(/^lp\b/i, "Landing page")
    .replace(/\blp\b/gi, "landing page");
  return fixed.charAt(0).toUpperCase() + fixed.slice(1);
};

const writeVariant = async (input, output, { width, cropHeight, quality }) => {
  const meta = await sharp(input, { limitInputPixels: false }).metadata();
  const sourceWidth = meta.width || width;
  const sourceHeight = meta.height || width;
  let targetWidth = Math.min(width, sourceWidth);
  const scale = targetWidth / sourceWidth;
  let targetHeight = Math.round(sourceHeight * scale);
  if (cropHeight) targetHeight = Math.min(targetHeight, cropHeight);
  if (targetHeight > MAX_WEBP_DIMENSION) {
    const fit = MAX_WEBP_DIMENSION / targetHeight;
    targetWidth = Math.max(1, Math.round(targetWidth * fit));
    targetHeight = MAX_WEBP_DIMENSION;
  }
  const extractHeight = Math.min(
    sourceHeight,
    Math.round(targetHeight / (targetWidth / sourceWidth))
  );

  await sharp(input, { limitInputPixels: false })
    .extract({ left: 0, top: 0, width: sourceWidth, height: extractHeight })
    .resize({ width: targetWidth, height: targetHeight, fit: "fill" })
    .webp({ quality, effort: 4 })
    .toFile(output);

  return { width: targetWidth, height: targetHeight };
};

const existingCoverVariant = (file) => {
  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  const thumb = path.join(dir, "optimized", `${base}-cover-640.webp`);
  const view = path.join(dir, "optimized", `${base}-full-1280.webp`);
  if (!fs.existsSync(thumb) || !fs.existsSync(view)) return null;
  return { thumb, view };
};

const run = async () => {
  const manifest = {};
  const folders = fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  for (const folder of folders) {
    const files = listSourceImages(path.join(projectsDir, folder)).sort(
      compareShots
    );
    const shots = [];
    for (const file of files) {
      const relative = path
        .relative(path.join(projectsDir, folder), file)
        .split(path.sep)
        .join("-")
        .replace(path.extname(file), "");
      const galleryDir = path.join(projectsDir, folder, "optimized", "gallery");
      const reused = existingCoverVariant(file);
      let thumbPath;
      let viewPath;
      let viewSize;
      if (reused) {
        thumbPath = reused.thumb;
        viewPath = reused.view;
        const meta = await sharp(viewPath).metadata();
        viewSize = { width: meta.width || 1280, height: meta.height || 720 };
      } else {
        fs.mkdirSync(galleryDir, { recursive: true });
        thumbPath = path.join(galleryDir, `${relative}-thumb.webp`);
        viewPath = path.join(galleryDir, `${relative}-view.webp`);
        const fresh =
          !fs.existsSync(thumbPath) ||
          !fs.existsSync(viewPath) ||
          fs.statSync(thumbPath).mtimeMs < fs.statSync(file).mtimeMs ||
          fs.statSync(viewPath).mtimeMs < fs.statSync(file).mtimeMs;
        if (fresh) {
          await writeVariant(file, thumbPath, {
            width: 640,
            cropHeight: 400,
            quality: 72,
          });
          viewSize = await writeVariant(file, viewPath, {
            width: 1280,
            quality: 78,
          });
        } else {
          const meta = await sharp(viewPath).metadata();
          viewSize = { width: meta.width || 1280, height: meta.height || 720 };
        }
      }
      shots.push({
        src: toPublicPath(file),
        thumb: toPublicPath(thumbPath),
        view: toPublicPath(viewPath),
        label: labelFromFile(file),
        viewWidth: viewSize.width,
        viewHeight: viewSize.height,
      });
      console.log(`gallery ${toPublicPath(file)}`);
    }
    manifest[folder] = shots;
    console.log(`${folder}: ${shots.length}`);
  }

  const body = `/* eslint-disable import/prefer-default-export */
/**
 * Generated by scripts/build-project-galleries.js. Do not edit by hand.
 * Source screenshots stay in public/projects. Thumb and view files are display variants.
 */
import type { DiscoveredShot } from "../utilities/projectGallery";

export const projectScreenshots: Record<string, DiscoveredShot[]> = ${JSON.stringify(
    manifest,
    null,
    2
  )};
`;
  fs.writeFileSync(manifestFile, body);
  console.log(`wrote ${path.relative(root, manifestFile)}`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

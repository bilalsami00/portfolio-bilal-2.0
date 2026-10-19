/* eslint-disable */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const manifest = fs.readFileSync(
  path.join(root, "data", "projectScreenshots.ts"),
  "utf8"
);
const shots = [...manifest.matchAll(/"src": "([^"]+)"/g)].map((match) => match[1]);
const thumbs = [...manifest.matchAll(/"thumb": "([^"]+)"/g)].map(
  (match) => match[1]
);
const views = [...manifest.matchAll(/"view": "([^"]+)"/g)].map(
  (match) => match[1]
);
const folders = [...manifest.matchAll(/^ {2}"([^"]+)": \[/gm)].map(
  (match) => match[1]
);
const missing = [];
[...shots, ...thumbs, ...views].forEach((publicPath) => {
  const file = path.join(root, "public", publicPath.replace(/^\//, ""));
  if (!fs.existsSync(file)) missing.push(publicPath);
});

const projectsDir = path.join(root, "public", "projects");
const discovered = [];
const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "optimized") return;
      walk(absolute);
      return;
    }
    if (/\.(png|jpe?g|webp|avif)$/i.test(entry.name)) discovered.push(absolute);
  });
};
walk(projectsDir);
const discoveredPublic = discovered.map(
  (file) =>
    `/${path.relative(path.join(root, "public"), file).split(path.sep).join("/")}`
);
const shotSet = new Set(shots);
const unmapped = discoveredPublic.filter((file) => !shotSet.has(file));

if (missing.length || unmapped.length || shots.length !== discoveredPublic.length) {
  console.error(
    JSON.stringify(
      {
        shots: shots.length,
        discovered: discoveredPublic.length,
        missing: missing.slice(0, 20),
        unmapped: unmapped.slice(0, 20),
        folders,
      },
      null,
      2
    )
  );
  process.exit(1);
}

console.log(
  `verified ${shots.length} screenshots across ${folders.length} folders`
);

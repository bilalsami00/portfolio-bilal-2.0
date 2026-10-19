const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const cache = new Map();

const loadTs = (filename) => {
  const file = path.resolve(filename);
  const cached = cache.get(file);
  if (cached) return cached;

  const source = fs.readFileSync(file, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
      strict: true,
    },
    fileName: file,
  }).outputText;

  const mod = new Module(file);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  mod.require = (request) => {
    if (request.startsWith(".")) {
      const resolved = path.resolve(path.dirname(file), request);
      return loadTs(resolved.endsWith(".ts") ? resolved : `${resolved}.ts`);
    }
    return Module.createRequire(file)(request);
  };
  mod._compile(output, file);
  cache.set(file, mod.exports);
  return mod.exports;
};

const checks = loadTs(
  path.join(__dirname, "..", "utilities", "bulkDeleteChecks.ts")
);

checks
  .default()
  .then(() => {
    process.stdout.write("bulk delete checks passed\n");
  })
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : error}\n`);
    process.exitCode = 1;
  });

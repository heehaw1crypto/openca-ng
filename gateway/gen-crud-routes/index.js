const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");
const toSlugCase = require("to-slug-case");
const camelCase = require("camelcase");

// Provide table information to generate
const resourceName = "Resource";
// const routeSet = "user-api";
const routeSet = "global-admin-api";

//const resourceName = "HAZOP";
const config = {
  resourceName,
  resourceNameCamelCase: camelCase(resourceName, { pascalCase: true }),
  resourceNamePlural: `${resourceName}s`,
  uuidName: `${camelCase(resourceName, { pascalCase: false })}Uuid`,
  loaderName: `${camelCase(resourceName, { pascalCase: false })}s`,
  slugCase: `${toSlugCase(resourceName)}`,
  slugCasePlural: `${toSlugCase(resourceName)}s`,
};

const baseAppDir = path.normalize(path.join(__dirname, "../src"));

let filepath;
let fileText;

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const inputList = [
  {
    template: "./templates/components",
    outputPath: `api/v1/components/schemas/${config.resourceNamePlural}.js`,
  },
  {
    template: "./templates/loader",
    outputPath: `api/v1/lib/loaders/${config.loaderName}.ts`,
  },
  {
    template: "./templates/routes/handlers",
    outputPath: `api/v1/routes/${routeSet}/${config.slugCasePlural}/handlers.ts`,
  },
  {
    template: "./templates/routes/index",
    outputPath: `api/v1/routes/${routeSet}/${config.slugCasePlural}/index.ts`,
  },
  {
    template: "./templates/routes/schemas",
    outputPath: `api/v1/routes/${routeSet}/${config.slugCasePlural}/schemas.js`,
  },
];

// create output files
inputList.map((input) => {
  fileText = Mustache.render(require(input.template), config);
  filepath = path.join(baseAppDir, input.outputPath);
  ensureDirectoryExistence(filepath);
  fs.writeFileSync(filepath, fileText);
});

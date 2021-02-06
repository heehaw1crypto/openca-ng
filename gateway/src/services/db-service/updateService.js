const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const jsonAPIGenerator = requireGlobal("@technicity/microservice-generator");

main()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Done.");
    process.exit(0);
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.log(e.stack);
    process.exit(1);
  });

async function main() {
  const args = process.argv.slice(2);
  const dbUser = args[0];
  const dbPassword = args[1];
  const dbHost = args[2] || "localhost";
  const dbPort = args[3] ? parseInt(args[3]) : 3306;

  if (!dbUser) {
    // eslint-disable-next-line no-console
    console.error("Database user required as first argument");
    process.exit(1);
  }

  if (!dbPassword) {
    // eslint-disable-next-line no-console
    console.error("Database password required as second argument");
    process.exit(1);
  }

  await jsonAPIGenerator.genCode(
    Object.assign(
      {},
      {
        database: "AMZR_RiskAssessment",
        generateSdkTypescript: true,
        excludeViews: true,
        generateSdkDirect: true,
        overwritePackageJson: true,
      },
      {
        outdir: __dirname,
        databaseSchema: path.join(__dirname, "data", "data-model.sql"),
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
        updateExisting: true,
      }
    )
  );

  const sdkTSPath = path.join(__dirname, "sdk-ts");

  if (fs.existsSync(sdkTSPath)) {
    if (!fs.existsSync(path.join(sdkTSPath, "node_modules/.bin/ncc"))) {
      cp.spawnSync("npm", ["install"], { cwd: sdkTSPath, stdio: "inherit" });
    }
    cp.spawnSync("npm", ["run", "compile"], {
      cwd: sdkTSPath,
      stdio: "inherit",
    });
  }

  const sdkDirectPath = path.join(__dirname, "sdk-direct");

  if (fs.existsSync(sdkDirectPath)) {
    if (!fs.existsSync(path.join(sdkDirectPath, "node_modules/.bin/ncc"))) {
      cp.spawnSync("npm", ["install"], {
        cwd: sdkDirectPath,
        stdio: "inherit",
      });
    }
    cp.spawnSync("npm", ["run", "compile"], {
      cwd: sdkDirectPath,
      stdio: "inherit",
    });
  }
}

function requireGlobal(packageName) {
  const globalNodeModules = cp.execSync("npm root -g").toString().trim();

  let packageDir = path.join(globalNodeModules, packageName);
  if (!fs.existsSync(packageDir)) {
    packageDir = path.join(globalNodeModules, "npm/node_modules", packageName);
  }

  if (!fs.existsSync(packageDir)) {
    throw new Error("Cannot find global module '" + packageName + "'");
  }

  const packageJSON = JSON.parse(
    fs.readFileSync(path.join(packageDir, "package.json")).toString()
  );
  const main = path.join(packageDir, packageJSON.main);

  return require(main);
}

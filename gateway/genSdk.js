const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const { generate } = requireGlobal("@technicity/data-service-generator");

main()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((e) => {
    console.log(e.stack);
    process.exit(1);
  });

async function main() {
  // const args = process.argv.slice(2);
  // const dbUser = args[0];
  // const dbPassword = args[1];
  // const dbHost = args[2];
  // const dbPort = args[3];

  const dbUser = "root";
  const dbPassword = "root";
  const dbHost = "127.0.0.1";
  const dbPort = "3497";
  const database = "OpenCA_NG";

  const outdir = path.join(__dirname, "src/services/db-service-v2");

  if (!dbUser) {
    console.error("Database user required as first argument");
    process.exit(1);
  }

  if (!dbPassword) {
    console.error("Database password required as second argument");
    process.exit(1);
  }

  await generate({
    outdir,
    database,
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
  });
}

function requireGlobal(packageName) {
  const globalNodeModules = child_process
    .execSync("npm root -g")
    .toString()
    .trim();

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

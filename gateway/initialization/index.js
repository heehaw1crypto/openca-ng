const path = require("path");
const { execSync } = require("child_process");

const dbHost = process.env.DB_HOST || "localhost";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "password";

const sqlFileDir1 = path.join(__dirname, "../src/data");

const sqlFilesList = [{ dir: sqlFileDir1, file: "data-model.sql" }];

// Apply DBs
console.warn(`SQL File Directory 1: ${sqlFileDir1}`);

for (let sqlFile of sqlFilesList) {
  const command = `mysql -h${dbHost} -u${dbUser} -p${dbPassword} < ${sqlFile.file}`;
  console.warn(`Applying ${sqlFile.file}`);
  try {
    execSync(command, { cwd: sqlFile.dir });
  } catch (err) {
    console.error({ enum: "DB_APPLY_FAILED", msg: err });
  }
}

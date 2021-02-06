const path = require("path");
const globby = require("globby");
const db = require("./db");

module.exports = async function resetDB(sqlPaths, verbatim = false) {
  if (sqlPaths && verbatim) {
    // Don't use Promise.all, as we want to execute in order.
    for (let sqlPath of sqlPaths) {
      await db.queryFile(sqlPath);
    }
    return;
  }

  // https://stackoverflow.com/a/43960876
  const appRoot = process.mainModule.paths[0]
    .split("node_modules")[0]
    .slice(0, -1);
  const sqlDir = path.join(appRoot, "data");

  const paths = (await globby(sqlPaths || ["*.sql"], {
    cwd: sqlDir,
    absolute: true
  })).sort();
  // Execute in alphabetical order. Same behavior as Docker MySQL.
  // https://hub.docker.com/_/mysql/
  for (let sqlPath of paths) {
    await db.queryFile(sqlPath);
  }
};

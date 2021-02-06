const mysql = require("mysql");
const Promise = require("bluebird");
const readFile = require("./readFile");

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const xaConnections = new Map();

let pool;

function init(opts = {}) {
  pool = mysql.createPool(
    Object.assign({}, opts, {
      host: opts.host || process.env.DB_HOST,
      port: opts.port || process.env.DB_PORT,
      user: opts.user || process.env.DB_USER,
      password: opts.password || process.env.DB_PASSWORD,
      supportBigNumbers:
        typeof opts.supportBigNumbers === "boolean"
          ? opts.supportBigNumbers
          : true,
      typeCast:
        opts.typeCast ||
        ((field, next) => {
          if (field.type == "TINY" && field.length == 1) {
            return field.string() == "1";
          }
          if (field.type === "DATE") {
            return field.string();
          }
          if (field.type === "VAR_STRING" || field.type === "STRING") {
            return field.string();
          }
          return next();
        })
    })
  );
}

// http://bluebirdjs.com/docs/api/disposer.html
async function getConnection() {
  return pool.getConnectionAsync().disposer(connection => connection.release());
}

// http://bluebirdjs.com/docs/api/promise.using.html
// Don't use `async` keyword. Need to return Bluebird promise for compat,
// since there are services doing e.g. promise.map and promise.tap, which are
// specific to Bluebird.
function query(...args) {
  return Promise.using(getConnection(), connection =>
    connection.queryAsync(...args)
  );
}

async function queryHead(...args) {
  return query(...args).then(rows => rows[0]);
}

async function queryCount(table, database) {
  if (database) {
    return query("SELECT COUNT(*) FROM ??.??", [database, table]).then(
      rows => rows[0] && rows[0]["COUNT(*)"]
    );
  }
  return query("SELECT COUNT(*) FROM ??", [table]).then(
    rows => rows[0] && rows[0]["COUNT(*)"]
  );
}

async function queryFile(filePath) {
  return query(await readFile(filePath, { encoding: "utf8" }));
}

async function withTransaction(req, fn) {
  const xid = req.get("x-xid");
  if (xid && req.dbConn) {
    return fn(req.dbConn);
  }
  // http://bluebirdjs.com/docs/api/disposer.html#note-about-disposers-in-node
  return Promise.using(getConnection(), connection => {
    return connection.beginTransactionAsync().then(() =>
      Promise.try(fn, connection).then(
        res => connection.commitAsync().thenReturn(res),
        err => {
          return connection
            .rollbackAsync()
            .catch(e => {
              // eslint-disable-next-line no-console
              console.error(e);
            })
            .throw(err);
        }
      )
    );
  });
}

function removeXaConnection(xid) {
  const connection = xaConnections.get(xid);
  if (!connection) {
    return;
  }
  try {
    connection.release();
  } catch (e) {
    // Do nothing
  } finally {
    // eslint-disable-next-line no-console
    console.log(
      `XA connection released <${xid}> thread id: <${connection.threadId}>`
    );
  }
  xaConnections.delete(xid);
  // eslint-disable-next-line no-console
  console.log(
    `Removed connection from XA cache: <${xid}> thread id <${connection.threadId}>`
  );
  // eslint-disable-next-line no-console
  console.log(`XA cache size: ${xaConnections.size}`);
}

async function xaStart(req) {
  let xid;
  try {
    xid = req.get("x-xid");
    const connection = await pool.getConnectionAsync();
    await connection.queryAsync(
      "SET TRANSACTION ISOLATION LEVEL READ COMMITTED"
    );
    await connection.queryAsync("XA START ?", [xid]);
    xaConnections.set(xid, connection);
    // Don't use `connection` - Express already has a `req.connection`.
    req.dbConn = connection;
  } catch (err) {
    err.xid = xid;
    throw err;
  }
}

async function xaEnd(req) {
  const xid = req.get("x-xid");
  if (!xid) {
    // Preserve existing behavior
    return Promise.resolve();
  }
  try {
    const connection = req.dbConn || xaConnections.get(xid);
    await connection.queryAsync("XA END ?", [xid]);
    await connection.queryAsync("XA PREPARE ?", [xid]);
    xaConnections.set(xid, connection);
  } catch (err) {
    err.xid = xid;
    throw err;
  }
}

async function xaCommit(req) {
  let xid;
  try {
    xid = req.get("x-xid");
    const connection = req.dbConn || xaConnections.get(xid);
    await connection.queryAsync("XA COMMIT ?", [xid]);
  } catch (err) {
    err.xid = xid;
    throw err;
  } finally {
    if (req.dbConn) {
      delete req.dbConn;
    }
    removeXaConnection(xid);
  }
}

async function xaRollback(req) {
  let xid;
  try {
    xid = req.get("x-xid");
    const connection = req.dbConn || xaConnections.get(xid);
    await connection.queryAsync("XA ROLLBACK ?", [xid]);
  } catch (err) {
    err.xid = xid;
    throw err;
  } finally {
    if (req.dbConn) {
      delete req.dbConn;
    }
    removeXaConnection(xid);
  }
}

// Poor man's singleton by exporting an object.
module.exports = {
  init,
  query,
  // TODO: remove. Compat only. Needed because some services are using
  // tx.queryAsync and db.queryAsync/db.query interchangeably.
  queryAsync: (...args) => pool.queryAsync(...args),
  queryHead,
  queryCount,
  queryFile,
  withTransaction,
  xaStart,
  xaEnd,
  xaCommit,
  xaRollback,
  escape: mysql.escape,
  escapeId: mysql.escapeId
};

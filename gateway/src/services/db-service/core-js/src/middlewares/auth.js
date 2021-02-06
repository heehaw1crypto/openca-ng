const jwt = require("jwt-simple");
const Ajv = require("ajv");
const db = require("../db");

const ajv = new Ajv();

const secret = process.env.TOKEN_SECRET;

async function auth(req, res, next) {
  try {
    const validate = ajv.compile(require("./auth.json"));
    const valid = validate(req.headers);
    if (valid === false) {
      return res.status(401).json({ errors: validate.errors });
    }
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.decode(token, secret);
    const rows = await db.query("SELECT * FROM Authorization WHERE id = ?", [
      decoded.sub
    ]);
    const grantee = rows[0];
    if (grantee) {
      req.user = grantee;
      return next();
    }
    return res.status(401).json({ error: "Invalid token" });
  } catch (error) {
    return res.status(401).json({ error });
  }
}

module.exports = auth;

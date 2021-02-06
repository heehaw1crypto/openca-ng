const db = require("../db");
const generateToken = require("../generateToken");
const validateBody = require("../middlewares/validateBody");

async function giveToken(req, res) {
  try {
    const rows = await db.query(
      "SELECT id, serviceName, `key` FROM Authorization WHERE serviceName = ? AND `key` = ? AND secret = SHA2(?, 256)",
      [req.body.serviceName, req.body.key, req.body.secret]
    );
    const grantee = rows[0];
    if (grantee) {
      const token = generateToken(grantee.id);
      return res.status(200).json(Object.assign({}, grantee, { token }));
    }
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(401).json({ error });
  }
}

// https://github.com/expressjs/express/issues/1992#issuecomment-225107568
module.exports = [validateBody(require("./token.json")), giveToken];

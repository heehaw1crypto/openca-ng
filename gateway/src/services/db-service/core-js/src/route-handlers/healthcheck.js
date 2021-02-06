const db = require("../db");

module.exports = async function healthcheck(req, res) {
  try {
    await db.query("SELECT 1");
    return res.status(200).json({ healthy: true });
  } catch (error) {
    return res.status(500).json({ healthy: false, error });
  }
};

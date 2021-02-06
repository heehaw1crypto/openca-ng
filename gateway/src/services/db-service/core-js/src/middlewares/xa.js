const db = require("../db");

module.exports.start = async (req, res, next) => {
  try {
    const xid = req.get("x-xid");
    if (!xid) {
      return next(); // Preserve existing behavior
      // return res.status(400).json("Missing x-xid");
    }
    await db.xaStart(req);
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports.end = async (req, res, next) => {
  try {
    const xid = req.get("x-xid");
    if (!xid) {
      // Since this is usually used as last middleware in the
      // chain, just return instead of calling `next`.
      return;
      // return next(); // Preserve existing behavior
      // return res.status(400).json("Missing x-xid");
    }
    await db.xaEnd(req);
    // Since this is usually used as last middleware in the
    // chain, just return instead of calling `next`.
    return;
    // return res.status(200).json({ status: "success", xid });
  } catch (error) {
    return next(error);
  }
};

module.exports.commit = async (req, res, next) => {
  try {
    const xid = req.get("x-xid");
    if (!xid) {
      return res.status(400).json("Missing x-xid");
    }
    await db.xaCommit(req);
    return res.status(200).json({ status: "success", xid });
  } catch (error) {
    return next(error);
  }
};

module.exports.rollback = async (req, res, next) => {
  try {
    const xid = req.get("x-xid");
    if (!xid) {
      return res.status(400).json("Missing x-xid");
    }
    await db.xaRollback(req);
    return res.status(200).json({ status: "success", xid });
  } catch (error) {
    return next(error);
  }
};

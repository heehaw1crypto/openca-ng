const jwt = require("jwt-simple");

module.exports = function generateToken(
  id,
  secret = process.env.TOKEN_SECRET,
  expiryMS = 604800000 /* 7 days */
) {
  const now = Date.now();
  const exp = now + expiryMS;
  return jwt.encode({ sub: id, iat: now, exp }, secret);
};

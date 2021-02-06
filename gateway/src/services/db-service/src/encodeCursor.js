module.exports = function encodeCursor(cursor) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
};

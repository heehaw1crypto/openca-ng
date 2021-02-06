// Assumes input uses zero offset
module.exports = function getMySQLDateTimeString(dateTimeString) {
  return dateTimeString.replace("T", " ").slice(0, 19);
};

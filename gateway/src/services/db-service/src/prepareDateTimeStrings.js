const { getMySQLDateTimeString } = require("../core-js");

module.exports = function prepareDateTimeStrings(jsonSchema, o) {
  let out = {};
  for (let [k, v] of Object.entries(o)) {
    const format = jsonSchema.properties[k] && jsonSchema.properties[k].format;
    if (["date-time", "timestamp"].includes(format)) {
      out[k] = getMySQLDateTimeString(v);
    } else {
      out[k] = v;
    }
  }
  return out;
};

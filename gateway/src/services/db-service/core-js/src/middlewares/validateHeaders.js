const Ajv = require("ajv");

const ajv = new Ajv();

module.exports = function validateHeaders(schema) {
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const valid = validate(req.headers);
    if (valid === true) {
      return next();
    }
    return res.status(400).json({ errors: validate.errors });
  };
};

const Ajv = require("ajv");

const components = require("../../../api/v1/components");

const ajv = new Ajv({ nullable: true });

module.exports = (res, schema) => {
  const origResJson = res.json.bind(res);
  const origResStatus = res.status.bind(res);

  res.json = function (resBody, ...args) {
    const statusCode = this.statusCode;

    let resSchema =
      schema?.responses?.[statusCode]?.content?.["application/json"]?.schema;

    if (resSchema) {
      // Add components so that ajv can resolve `$ref`s
      resSchema = { ...resSchema };
      resSchema.components = components;

      const data = copyObj(resBody);
      const valid = ajv.validate(resSchema, data);
      if (!valid) {
        origResStatus(500);
        return origResJson({
          validationErrors: ajv.errors,
          validationSchema: resSchema,
          responseBody: data,
          statusCode: 500,
        });
      }
    }

    return origResJson(resBody, ...args);
  };

  res.json.bind(res);
};

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

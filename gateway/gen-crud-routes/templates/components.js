const output = `
const regexPatterns = require("../../lib/regex");

const _baseProperties = {
  fieldName: { type: "string", nullable: true },
};

const {{resourceName}}Schema = {
  type: "object",
  title: "{{resourceName}}",
  properties: {
    ..._baseProperties,
    uuid: { type: "string", format: "uuid" },
    created: { type: "string" },
  },
  required: ["uuid", "created"].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

module.exports.{{resourceName}} = {
  ...{{resourceName}}Schema,
};

module.exports.{{resourceName}}Nullable = {
  ...{{resourceName}}Schema,
  nullable: true,
};

module.exports.{{resourceName}}Update = {
  type: "object",
  title: "{{resourceName}}Update",
  properties: {
    ..._baseProperties,
  },
  additionalProperties: false,
};

module.exports.{{resourceName}}Create = {
  type: "object",
  title: "{{resourceName}}Create",
  properties: {
    ..._baseProperties,
  },
  required: [].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};
`;

module.exports = output;

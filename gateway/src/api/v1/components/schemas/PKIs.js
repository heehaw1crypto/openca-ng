const regexPatterns = require("../../lib/regex");

const _baseProperties = {
  name: { type: "string", maxLength: 255 },
  description: { type: "string", nullable: true },
  siteUrl: { type: "string", nullable: true },
  logoUrl: { type: "string", nullable: true },
  policyName: { type: "string", nullable: true },
  policyUrl: { type: "string", nullable: true },
  isEnabled: { type: "boolean" },
};

const PKISchema = {
  type: "object",
  title: "PKI",
  properties: {
    ..._baseProperties,
    uuid: { type: "string", format: "uuid" },
    created: { type: "string" },
  },
  required: ["uuid", "created"].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

module.exports.PKI = {
  ...PKISchema,
};

module.exports.PKINullable = {
  ...PKISchema,
  nullable: true,
};

module.exports.PKIUpdate = {
  type: "object",
  title: "PKIUpdate",
  properties: {
    ..._baseProperties,
  },
  additionalProperties: false,
};

module.exports.PKICreate = {
  type: "object",
  title: "PKICreate",
  properties: {
    ..._baseProperties,
  },
  required: [].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

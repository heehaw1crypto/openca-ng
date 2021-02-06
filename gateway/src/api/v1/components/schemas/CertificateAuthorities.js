const regexPatterns = require("../../lib/regex");

const _baseProperties = {
  pkiUuid: { type: "string", nullable: true },
  name: { type: "string", maxLength: 255 },
  description: { type: "string", nullable: true },
  status: { type: "string", enum: ["ENABLED", "DISABLED", "SUSPENDED"] },
  isRoot: { type: "boolean" },
};

const CertificateAuthoritySchema = {
  type: "object",
  title: "CertificateAuthority",
  properties: {
    ..._baseProperties,
    uuid: { type: "string", format: "uuid" },
    hasValidToken: { type: "boolean" },
    created: { type: "string" },
  },
  required: ["uuid", "created"].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

module.exports.CertificateAuthority = {
  ...CertificateAuthoritySchema,
};

module.exports.CertificateAuthorityNullable = {
  ...CertificateAuthoritySchema,
  nullable: true,
};

module.exports.CertificateAuthorityUpdate = {
  type: "object",
  title: "CertificateAuthorityUpdate",
  properties: {
    ..._baseProperties,
  },
  additionalProperties: false,
};

module.exports.CertificateAuthorityCreate = {
  type: "object",
  title: "CertificateAuthorityCreate",
  properties: {
    ..._baseProperties,
  },
  required: [].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

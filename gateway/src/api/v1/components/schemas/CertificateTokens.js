const regexPatterns = require("../../lib/regex");

const _baseProperties = {
  issuerCertificateAuthorityUuid: { type: "string", format: "uuid" },
  standard: { type: "string", enum: ["X509"] },
  key: { type: "string" },
  cert: { type: "string" },
  caOwned: { type: "boolean" },
  expires: { type: "integer" },
};

const CertificateTokenSchema = {
  type: "object",
  title: "CertificateToken",
  properties: {
    ..._baseProperties,
    uuid: { type: "string", format: "uuid" },
    isSelfSigned: { type: "boolean" },
    revoked: { type: "boolean" },
    created: { type: "string" },
  },
  required: ["uuid", "isSelfSigned", "revoked", "created"].concat(
    Object.keys(_baseProperties)
  ),
  additionalProperties: false,
};

module.exports.CertificateToken = {
  ...CertificateTokenSchema,
};

module.exports.CertificateTokenNullable = {
  ...CertificateTokenSchema,
  nullable: true,
};

module.exports.CertificateTokenUpdate = {
  type: "object",
  title: "CertificateTokenUpdate",
  properties: {
    ..._baseProperties,
    revoked: { type: "boolean" },
  },
  additionalProperties: false,
};

module.exports.CertificateTokenCreate = {
  type: "object",
  title: "CertificateTokenCreate",
  properties: {
    ..._baseProperties,
  },
  required: [].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

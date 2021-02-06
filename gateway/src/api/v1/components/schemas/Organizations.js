const _baseProperties = {
  name: { type: "string", maxLength: 255 },
  description: { type: "string", nullable: true },
  siteUrl: { type: "string", nullable: true },
  logoUrl: { type: "string", nullable: true },
  isEnabled: { type: "boolean" },
};

const OrganizationSchema = {
  type: "object",
  title: "Organization",
  properties: {
    ..._baseProperties,
    uuid: { type: "string", format: "uuid" },
    created: { type: "string" },
  },
  required: ["uuid", "created"].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

module.exports.Organization = {
  ...OrganizationSchema,
};

module.exports.OrganizationNullable = {
  ...OrganizationSchema,
  nullable: true,
};

module.exports.OrganizationUpdate = {
  type: "object",
  title: "OrganizationUpdate",
  properties: {
    ..._baseProperties,
  },
  additionalProperties: false,
};

module.exports.OrganizationCreate = {
  type: "object",
  title: "OrganizationCreate",
  properties: {
    ..._baseProperties,
  },
  required: [].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

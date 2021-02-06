module.exports.Role = {
  type: "object",
  title: "Role",
  properties: {
    uuid: { type: "string", format: "uuid" },
    enum: { type: "string", maxLength: 255 },
    name: { type: "string", maxLength: 255 },
    created: { type: "string" },
  },
  required: ["uuid", "enum", "name", "created"],
  additionalProperties: false,
};

module.exports.RoleEnum = {
  type: "string",
  title: "RoleEnum",
  enum: ["USER", "ADMIN", "GLOBAL_ADMIN"],
};

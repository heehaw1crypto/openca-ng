const _baseProperties = {
  firstName: { type: "string", maxLength: 50, nullable: true },
  lastName: { type: "string", maxLength: 50, nullable: true },
  username: { type: "string", maxLength: 50 },
  email: { type: "string", format: "email" },
};

module.exports.User = {
  type: "object",
  title: "User",
  properties: {
    ..._baseProperties,
    uuid: { type: "string", format: "uuid" },
    created: { type: "string" },
    roleList: { type: "array", items: { $ref: "#/components/schemas/Role" } },
    // selectedOrganization: { $ref: "#/components/schemas/OrganizationNullable" },
  },
  required: ["uuid", "created", "roleList"].concat(
    Object.keys(_baseProperties)
  ),
  additionalProperties: false,
};

module.exports.UserUpdate = {
  type: "object",
  title: "UserUpdate",
  properties: {
    ..._baseProperties,
    selectedOrganizationUuid: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
};

module.exports.UserRegister = {
  type: "object",
  title: "UserRegister",
  properties: {
    ..._baseProperties,
    password: { type: "string", minLength: 8, maxLength: 72 },
  },
  required: ["password"].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

module.exports.UserLogin = {
  type: "object",
  title: "UserLogin",
  properties: {
    email: { type: "string", format: "email" },
    username: { type: "string" },
    password: { type: "string", minLength: 8, maxLength: 72 },
  },
  required: ["password"],
  additionalProperties: false,
};

module.exports.UserLoginResponse = {
  type: "object",
  title: "UserLoginResponse",
  properties: {
    user: { $ref: "#/components/schemas/User" },
    token: { type: "string" },
    tokenExpires: { type: "integer" },
  },
  required: ["user", "token", "tokenExpires"],
  additionalProperties: false,
};

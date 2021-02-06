
const regexPatterns = require("../../lib/regex");

const _baseProperties = {
  fieldName: { type: "string", nullable: true },
};

const OrderSchema = {
  type: "object",
  title: "Order",
  properties: {
    ..._baseProperties,
    uuid: { type: "string", format: "uuid" },
    created: { type: "string" },
  },
  required: ["uuid", "created"].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

module.exports.Order = {
  ...ResourceNameSchema,
};

module.exports.OrderNullable = {
  ...OrderSchema,
  nullable: true,
};

module.exports.OrderUpdate = {
  type: "object",
  title: "OrderUpdate",
  properties: {
    ..._baseProperties,
  },
  additionalProperties: false,
};

module.exports.OrderCreate = {
  type: "object",
  title: "OrderCreate",
  properties: {
    ..._baseProperties,
  },
  required: [].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

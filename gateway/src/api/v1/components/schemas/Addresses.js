const _baseProperties = {
  street1: { type: "string", nullable: true },
  street2: { type: "string", nullable: true },
  city: { type: "string", nullable: true },
  state: { type: "string", nullable: true },
  postalCode: { type: "string", nullable: true },
  country: { type: "string", nullable: true },
};

const AddressSchema = {
  type: "object",
  title: "Address",
  properties: {
    ..._baseProperties,
    uuid: { type: "string", format: "uuid" },
    created: { type: "string" },
  },
  required: ["uuid", "created"].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

module.exports.Address = {
  ...AddressSchema,
};

module.exports.AddressNullable = {
  ...AddressSchema,
  nullable: true,
};

module.exports.AddressUpdate = {
  type: "object",
  title: "AddressUpdate",
  properties: {
    ..._baseProperties,
  },
  additionalProperties: false,
};

module.exports.AddressCreate = {
  type: "object",
  title: "AddressCreate",
  properties: {
    ..._baseProperties,
  },
  required: [].concat(Object.keys(_baseProperties)),
  additionalProperties: false,
};

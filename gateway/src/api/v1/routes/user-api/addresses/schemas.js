const {
  requestSchemaBoilerplate,
  responseSchemaBoilerplate,
  getStandardListSchema,
  deleteResponse,
  noContentResponse,
} = require("../../../lib/utils/schemaTemplates");

const {
  paginationQueryParamList,
} = require("../../../components/schemas/Pagination");

const { getFilterQueryParamList } = require("../../../lib/utils/filtering");

const resourceSchemas = require("../../../components/schemas/Addresses");

const fullParamList = getFilterQueryParamList(resourceSchemas.Address).concat(
  paginationQueryParamList
);

const tags = ["Addresses"];

module.exports.createOne = {
  ...requestSchemaBoilerplate({
    sdkName: "createAddress",
    summary: "Create an Address.",
    parameters: [
      {
        name: "organizationUuid",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
    ],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/AddressCreate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The Address.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/Address",
    },
  }),
  tags,
};

module.exports.getList = {
  ...requestSchemaBoilerplate({
    sdkName: "getAddressList",
    summary: "Get a list of Addresses.",
    parameters: fullParamList,
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "A paginated list of Addresses.",
    schema: getStandardListSchema({
      items: {
        $ref: "#/components/schemas/Address",
      },
    }),
  }),
  tags,
};

module.exports.getOne = {
  ...requestSchemaBoilerplate({
    sdkName: "getAddress",
    summary: "Get an Address.",
    parameters: [
      {
        name: "addressUuid",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
    ],
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "The Address.",
    schema: {
      $ref: "#/components/schemas/Address",
    },
  }),
  tags,
};

module.exports.updateOne = {
  ...requestSchemaBoilerplate({
    sdkName: "updateAddress",
    summary: "Update an Address.",
    parameters: [
      {
        name: "addressUuid",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
    ],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/AddressUpdate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The Address.",
    schema: {
      $ref: "#/components/schemas/Address",
    },
  }),
  tags,
};

module.exports.deleteOne = {
  ...requestSchemaBoilerplate({
    sdkName: "deleteAddress",
    summary: "Delete an Address.",
    parameters: [
      {
        name: "addressUuid",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
    ],
    requestBody: null,
  }),
  ...deleteResponse({ resourceName: "Address" }),
  tags,
};

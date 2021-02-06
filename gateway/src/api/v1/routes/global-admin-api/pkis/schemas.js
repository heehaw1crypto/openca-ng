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

const resourceSchemas = require("../../../components/schemas/PKIs");

const fullParamList = getFilterQueryParamList(
  resourceSchemas.PKI
).concat(paginationQueryParamList);

const tags = ["PKIs"];

module.exports.createOne = {
  ...requestSchemaBoilerplate({
    sdkName: "createPKI",
    summary: "Create a PKI.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/PKICreate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The PKI.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/PKI",
    },
  }),
  tags,
};

module.exports.getList = {
  ...requestSchemaBoilerplate({
    sdkName: "getPKIList",
    summary: "Get a list of PKIs.",
    parameters: fullParamList,
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "A paginated list of PKIs.",
    schema: getStandardListSchema({
      items: {
        $ref: "#/components/schemas/PKI",
      },
    }),
  }),
  tags,
};

module.exports.getOne = {
  ...requestSchemaBoilerplate({
    sdkName: "getPKI",
    summary: "Get a PKI.",
    parameters: [
      {
        name: "pkiUuid",
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
    description: "The PKI.",
    schema: {
      $ref: "#/components/schemas/PKI",
    },
  }),
  tags,
};

module.exports.updateOne = {
  ...requestSchemaBoilerplate({
    sdkName: "updatePKI",
    summary: "Update a PKI.",
    parameters: [
      {
        name: "pkiUuid",
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
        $ref: "#/components/schemas/PKIUpdate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The PKI.",
    schema: {
      $ref: "#/components/schemas/PKI",
    },
  }),
  tags,
};

module.exports.deleteOne = {
  ...requestSchemaBoilerplate({
    sdkName: "deletePKI",
    summary: "Delete a PKI.",
    parameters: [
      {
        name: "pkiUuid",
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
  ...deleteResponse({ resourceName: "PKI" }),
  tags,
};
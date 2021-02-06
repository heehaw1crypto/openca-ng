const output = `const {
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

const resourceSchemas = require("../../../components/schemas/{{resourceNamePlural}}");

const fullParamList = getFilterQueryParamList(
  resourceSchemas.{{resourceName}}
).concat(paginationQueryParamList);

const tags = ["{{resourceNamePlural}}"];

module.exports.createOne = {
  ...requestSchemaBoilerplate({
    sdkName: "create{{resourceName}}",
    summary: "Create a {{resourceName}}.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/{{resourceName}}Create",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The {{resourceName}}.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/{{resourceName}}",
    },
  }),
  tags,
};

module.exports.getList = {
  ...requestSchemaBoilerplate({
    sdkName: "get{{resourceName}}List",
    summary: "Get a list of {{resourceNamePlural}}.",
    parameters: fullParamList,
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "A paginated list of {{resourceNamePlural}}.",
    schema: getStandardListSchema({
      items: {
        $ref: "#/components/schemas/{{resourceName}}",
      },
    }),
  }),
  tags,
};

module.exports.getOne = {
  ...requestSchemaBoilerplate({
    sdkName: "get{{resourceName}}",
    summary: "Get a {{resourceName}}.",
    parameters: [
      {
        name: "{{uuidName}}",
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
    description: "The {{resourceName}}.",
    schema: {
      $ref: "#/components/schemas/{{resourceName}}",
    },
  }),
  tags,
};

module.exports.updateOne = {
  ...requestSchemaBoilerplate({
    sdkName: "update{{resourceName}}",
    summary: "Update a {{resourceName}}.",
    parameters: [
      {
        name: "{{uuidName}}",
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
        $ref: "#/components/schemas/{{resourceName}}Update",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The {{resourceName}}.",
    schema: {
      $ref: "#/components/schemas/{{resourceName}}",
    },
  }),
  tags,
};

module.exports.deleteOne = {
  ...requestSchemaBoilerplate({
    sdkName: "delete{{resourceName}}",
    summary: "Delete a {{resourceName}}.",
    parameters: [
      {
        name: "{{uuidName}}",
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
  ...deleteResponse({ resourceName: "{{resourceName}}" }),
  tags,
};`;

module.exports = output;

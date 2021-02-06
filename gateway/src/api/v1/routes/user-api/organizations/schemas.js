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

const resourceSchemas = require("../../../components/schemas/Organizations");

const fullParamList = getFilterQueryParamList(
  resourceSchemas.Organization
).concat(paginationQueryParamList);

const tags = ["Organizations"];

module.exports.createOne = {
  ...requestSchemaBoilerplate({
    sdkName: "createOrganization",
    summary: "Create an Organization.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/OrganizationCreate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The Organization.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/Organization",
    },
  }),
  tags,
};

module.exports.getList = {
  ...requestSchemaBoilerplate({
    sdkName: "getOrganizationList",
    summary: "Get a list of Organizations.",
    parameters: fullParamList,
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "A paginated list of Organizations.",
    schema: getStandardListSchema({
      items: {
        $ref: "#/components/schemas/Organization",
      },
    }),
  }),
  tags,
};

module.exports.getOne = {
  ...requestSchemaBoilerplate({
    sdkName: "getOrganization",
    summary: "Get an Organization.",
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
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "The Organization.",
    schema: {
      $ref: "#/components/schemas/Organization",
    },
  }),
  tags,
};

module.exports.updateOne = {
  ...requestSchemaBoilerplate({
    sdkName: "updateOrganization",
    summary: "Update an Organization.",
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
        $ref: "#/components/schemas/OrganizationUpdate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The Organization.",
    schema: {
      $ref: "#/components/schemas/Organization",
    },
  }),
  tags,
};

module.exports.deleteOne = {
  ...requestSchemaBoilerplate({
    sdkName: "deleteOrganization",
    summary: "Delete an Organization.",
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
    requestBody: null,
  }),
  ...deleteResponse({ resourceName: "Organization" }),
  tags,
};

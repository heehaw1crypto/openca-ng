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

const resourceSchemas = require("../../../components/schemas/CertificateTokens");

const fullParamList = getFilterQueryParamList(
  resourceSchemas.CertificateToken
).concat(paginationQueryParamList);

const tags = ["CertificateTokens"];

module.exports.createOneForCertificateAuthority = {
  ...requestSchemaBoilerplate({
    sdkName: "createCertificateTokenForCertificateAuthority",
    summary: "Create a CertificateToken for CertificateAuthority.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/CertificateTokenCreate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The CertificateToken.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/CertificateToken",
    },
  }),
  tags,
};

module.exports.createOneForOrganization = {
  ...requestSchemaBoilerplate({
    sdkName: "createCertificateTokenForOrganization",
    summary: "Create a CertificateToken for Organization.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/CertificateTokenCreate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The CertificateToken.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/CertificateToken",
    },
  }),
  tags,
};

module.exports.getList = {
  ...requestSchemaBoilerplate({
    sdkName: "getCertificateTokenList",
    summary: "Get a list of CertificateTokens.",
    parameters: fullParamList,
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "A paginated list of CertificateTokens.",
    schema: getStandardListSchema({
      items: {
        $ref: "#/components/schemas/CertificateToken",
      },
    }),
  }),
  tags,
};

module.exports.getOne = {
  ...requestSchemaBoilerplate({
    sdkName: "getCertificateToken",
    summary: "Get a CertificateToken.",
    parameters: [
      {
        name: "certificateTokenUuid",
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
    description: "The CertificateToken.",
    schema: {
      $ref: "#/components/schemas/CertificateToken",
    },
  }),
  tags,
};

module.exports.updateOne = {
  ...requestSchemaBoilerplate({
    sdkName: "updateCertificateToken",
    summary: "Update a CertificateToken.",
    parameters: [
      {
        name: "certificateTokenUuid",
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
        $ref: "#/components/schemas/CertificateTokenUpdate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The CertificateToken.",
    schema: {
      $ref: "#/components/schemas/CertificateToken",
    },
  }),
  tags,
};

module.exports.deleteOne = {
  ...requestSchemaBoilerplate({
    sdkName: "deleteCertificateToken",
    summary: "Delete a CertificateToken.",
    parameters: [
      {
        name: "certificateTokenUuid",
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
  ...deleteResponse({ resourceName: "CertificateToken" }),
  tags,
};

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

const resourceSchemas = require("../../../components/schemas/CertificateAuthorities");

const fullParamList = getFilterQueryParamList(
  resourceSchemas.CertificateAuthority
).concat(paginationQueryParamList);

const tags = ["CertificateAuthorities"];

module.exports.createOne = {
  ...requestSchemaBoilerplate({
    sdkName: "createCertificateAuthority",
    summary: "Create a CertificateAuthority.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/CertificateAuthorityCreate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The CertificateAuthority.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/CertificateAuthority",
    },
  }),
  tags,
};

module.exports.getList = {
  ...requestSchemaBoilerplate({
    sdkName: "getCertificateAuthorityList",
    summary: "Get a list of CertificateAuthorities.",
    parameters: fullParamList,
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "A paginated list of CertificateAuthorities.",
    schema: getStandardListSchema({
      items: {
        $ref: "#/components/schemas/CertificateAuthority",
      },
    }),
  }),
  tags,
};

module.exports.getOne = {
  ...requestSchemaBoilerplate({
    sdkName: "getCertificateAuthority",
    summary: "Get a CertificateAuthority.",
    parameters: [
      {
        name: "certificateAuthorityUuid",
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
    description: "The CertificateAuthority.",
    schema: {
      $ref: "#/components/schemas/CertificateAuthority",
    },
  }),
  tags,
};

module.exports.updateOne = {
  ...requestSchemaBoilerplate({
    sdkName: "updateCertificateAuthority",
    summary: "Update a CertificateAuthority.",
    parameters: [
      {
        name: "certificateAuthorityUuid",
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
        $ref: "#/components/schemas/CertificateAuthorityUpdate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The CertificateAuthority.",
    schema: {
      $ref: "#/components/schemas/CertificateAuthority",
    },
  }),
  tags,
};

module.exports.deleteOne = {
  ...requestSchemaBoilerplate({
    sdkName: "deleteCertificateAuthority",
    summary: "Delete a CertificateAuthority.",
    parameters: [
      {
        name: "certificateAuthorityUuid",
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
  ...deleteResponse({ resourceName: "CertificateAuthority" }),
  tags,
};

const {
  requestSchemaBoilerplate,
  responseSchemaBoilerplate,
  noContentResponse,
  getStandardListSchema,
  deleteResponse,
} = require("../../../lib/utils/schemaTemplates");

const {
  paginationQueryParamList,
} = require("../../../components/schemas/Pagination");

const { getFilterQueryParamList } = require("../../../lib/utils/filtering");

const resourceSchemas = require("../../../components/schemas/Users");

const fullParamList = getFilterQueryParamList(resourceSchemas.User).concat(
  paginationQueryParamList
);

const tags = ["No Auth"];

module.exports.registerUser = {
  ...requestSchemaBoilerplate({
    sdkName: "registerUser",
    summary: "Register a user.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/UserRegister",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The registered user.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/User",
    },
  }),
  tags,
};

module.exports.loginUser = {
  ...requestSchemaBoilerplate({
    sdkName: "loginUser",
    summary: "Login a user.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/UserLogin",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The user with JWT tokens.",
    statusCode: 200,
    schema: {
      $ref: "#/components/schemas/UserLoginResponse",
    },
  }),
  tags,
};

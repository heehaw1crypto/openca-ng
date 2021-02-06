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

const resourceSchemas = require("../../../components/schemas/Orders");

const fullParamList = getFilterQueryParamList(
  resourceSchemas.Order
).concat(paginationQueryParamList);

const tags = ["Orders"];

module.exports.createOne = {
  ...requestSchemaBoilerplate({
    sdkName: "createOrder",
    summary: "Create a Order.",
    parameters: [],
    requestBody: {
      description: "",
      schema: {
        $ref: "#/components/schemas/OrderCreate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The Order.",
    statusCode: 201,
    schema: {
      $ref: "#/components/schemas/Order",
    },
  }),
  tags,
};

module.exports.getList = {
  ...requestSchemaBoilerplate({
    sdkName: "getOrderList",
    summary: "Get a list of Orders.",
    parameters: fullParamList,
    requestBody: null,
  }),
  ...responseSchemaBoilerplate({
    description: "A paginated list of Orders.",
    schema: getStandardListSchema({
      items: {
        $ref: "#/components/schemas/Order",
      },
    }),
  }),
  tags,
};

module.exports.getOne = {
  ...requestSchemaBoilerplate({
    sdkName: "getOrder",
    summary: "Get a Order.",
    parameters: [
      {
        name: "orderUuid",
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
    description: "The Order.",
    schema: {
      $ref: "#/components/schemas/Order",
    },
  }),
  tags,
};

module.exports.updateOne = {
  ...requestSchemaBoilerplate({
    sdkName: "updateOrder",
    summary: "Update a Order.",
    parameters: [
      {
        name: "orderUuid",
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
        $ref: "#/components/schemas/OrderUpdate",
      },
    },
  }),
  ...responseSchemaBoilerplate({
    description: "The Order.",
    schema: {
      $ref: "#/components/schemas/Order",
    },
  }),
  tags,
};

module.exports.deleteOne = {
  ...requestSchemaBoilerplate({
    sdkName: "deleteOrder",
    summary: "Delete a Order.",
    parameters: [
      {
        name: "orderUuid",
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
  ...deleteResponse({ resourceName: "Order" }),
  tags,
};
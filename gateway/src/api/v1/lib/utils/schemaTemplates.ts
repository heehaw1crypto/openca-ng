export const requestSchemaBoilerplate = ({
  summary = "API Description",
  sdkName,
  parameters = [],
  requestBody = null,
}: {
  summary: string;
  sdkName: string;
  parameters: any[];
  requestBody: { description: string | null; schema: any } | null;
}) => {
  let schemaInfo: any = {
    summary,
    "x-technicity-sdk-name": sdkName,
    parameters,
  };

  if (requestBody !== null) {
    const { description, schema } = requestBody;
    schemaInfo = {
      ...schemaInfo,
      requestBody: { description, content: { "application/json": { schema } } },
    };
  }

  return schemaInfo;
};

export const responseSchemaBoilerplate = ({
  description = "Response",
  statusCode = 200,
  schema,
}) => {
  return {
    responses: {
      [statusCode]: {
        description,
        content: {
          "application/json": { schema },
        },
      },
    },
  };
};

export const getStandardListSchema = ({ items }) => {
  return {
    type: "object",
    properties: {
      results: { type: "array", items },
      paging: { $ref: "#/components/schemas/Pagination" },
    },
    additionalProperties: false,
    required: ["results", "paging"],
  };
};

export const deleteResponse = ({ resourceName = "Resource" }) => {
  return {
    responses: {
      [204]: {
        description: `${resourceName} deleted.`,
      },
    },
  };
};

export const noContentResponse = ({ description }) => {
  return {
    responses: {
      [204]: {
        description,
      },
    },
  };
};

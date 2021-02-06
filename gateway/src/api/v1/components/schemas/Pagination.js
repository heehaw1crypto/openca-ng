module.exports.PaginationObject = {
  type: "object",
  properties: {
    totalCount: { type: "integer" },
    cursors: {
      type: "object",
      properties: {
        after: { type: "string", nullable: true },
        before: { type: "string", nullable: true },
      },
      additionalProperties: false,
      required: ["after", "before"],
    },
    previous: { type: "string", nullable: true },
    next: { type: "string", nullable: true },
  },
  additionalProperties: false,
  required: ["totalCount", "cursors", "previous", "next"],
};

module.exports.paginationQueryParamList = [
  {
    name: "limit",
    in: "query",
    required: false,
    schema: {
      type: "integer",
      minimum: 1,
      maximum: 100,
    },
  },
  {
    name: "order",
    in: "query",
    required: false,
    schema: {
      type: "string",
      enum: ["asc", "desc"],
    },
  },
  {
    name: "before",
    in: "query",
    required: false,
    schema: { type: "string" },
  },
  {
    name: "after",
    in: "query",
    required: false,
    schema: { type: "string" },
  },
];

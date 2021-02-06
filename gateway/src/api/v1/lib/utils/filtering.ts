const {
  paginationQueryParamList,
} = require("../../components/schemas/Pagination");

import { getScalarKeys } from "../loaders/utils";

export const getWhereQuery = (req, objSchema) => {
  const reservedNameList = paginationQueryParamList.map((x) => x.name);
  const allowedNameList: any[] = getScalarKeys(objSchema);

  let $where = { valid: true };

  Object.keys(req.query).map((key) => {
    if (!reservedNameList.includes(key) && allowedNameList.includes(key)) {
      $where[key] = req.query[key];
    }
  });

  return $where;
};

export const getFilterQueryParamList = (objSchema) => {
  const filterQueryParamList = Object.keys(objSchema.properties)
    .map((key) => {
      const fieldType = objSchema.properties[key].type;

      if (!["string", "number", "integer", "boolean"].includes(fieldType)) {
        return null;
      }

      const oneOf: any = [
        {
          type: objSchema.properties[key].type,
        },
      ];

      if (fieldType === "string") {
        oneOf.push({
          type: "object",
          properties: { $like: { type: "string" } },
          required: ["$like"],
          additionalProperties: false,
        });
      }

      return {
        name: key,
        in: "query",
        style: "deepObject",
        explode: true,
        required: false,
        schema: {
          oneOf: oneOf,
        },
      };
    })
    .filter((x) => x !== null);

  return filterQueryParamList;
};

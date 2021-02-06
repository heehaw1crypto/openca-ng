const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/Users";

import { getScalarKeys } from "./utils";

import * as roleLoader from "./roles";

const scalarKeyList = getScalarKeys(resourceSchemas.User);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  // many-to-many
  fieldsList.push({
    name: "roleList",
    fields: roleLoader.getFieldsList(),
    args: { $where: { valid: true }, $orderBy: { id: "desc" } },
  });

  return fieldsList;
};

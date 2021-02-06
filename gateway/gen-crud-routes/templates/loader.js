const output = `
const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/{{resourceNamePlural}}";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.{{resourceName}});

export const getFieldsList = () => {
  const fieldsList = [...scalarKeyList];

  return fieldsList;
};
`;

module.exports = output;

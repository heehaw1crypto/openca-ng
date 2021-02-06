const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/RiskClasses";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.RiskClass);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

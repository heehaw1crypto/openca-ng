const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/RiskSeverities";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.RiskSeverity);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/RiskAvoidabilities";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.RiskAvoidability);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

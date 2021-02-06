const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/RiskReductionMeasureTypes";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.RiskReductionMeasureType);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

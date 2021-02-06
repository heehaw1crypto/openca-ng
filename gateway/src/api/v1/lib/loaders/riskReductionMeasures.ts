const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/RiskReductionMeasures";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.RiskReductionMeasure);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

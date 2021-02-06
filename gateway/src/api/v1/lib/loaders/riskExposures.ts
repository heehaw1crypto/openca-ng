const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/RiskExposures";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.RiskExposure);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

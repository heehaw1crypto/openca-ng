const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/HazardTypes";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.HazardType);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

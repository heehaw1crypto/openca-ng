const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/ExistingExternalMeasures";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.ExistingExternalMeasure);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

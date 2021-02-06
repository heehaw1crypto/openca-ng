const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/ConsideredSituationalAttributes";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(
  resourceSchemas.ConsideredSituationalAttribute
);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

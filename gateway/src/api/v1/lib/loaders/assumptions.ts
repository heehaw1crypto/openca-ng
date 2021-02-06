const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/Assumptions";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.Assumption);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/SILs";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.SIL);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

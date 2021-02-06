const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/PLs";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.PL);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

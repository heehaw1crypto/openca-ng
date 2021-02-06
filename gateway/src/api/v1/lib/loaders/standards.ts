const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/Standards";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.Standard);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

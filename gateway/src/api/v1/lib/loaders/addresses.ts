const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/Addresses";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.Address);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

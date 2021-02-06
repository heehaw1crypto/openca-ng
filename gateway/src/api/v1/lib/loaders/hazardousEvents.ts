const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/HazardousEvents";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.HazardousEvent);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

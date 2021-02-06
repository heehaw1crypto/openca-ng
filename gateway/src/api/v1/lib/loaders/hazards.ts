const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/Hazards";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.Hazard);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

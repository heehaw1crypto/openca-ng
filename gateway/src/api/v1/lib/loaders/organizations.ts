const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/Organizations";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.Organization);

export const getFieldsList = () => {
  const fieldsList = [...scalarKeyList];

  return fieldsList;
};

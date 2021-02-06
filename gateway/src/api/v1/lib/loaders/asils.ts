const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/ASILs";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.ASIL);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

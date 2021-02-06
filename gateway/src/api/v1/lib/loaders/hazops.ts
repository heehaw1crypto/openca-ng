const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/HAZOPs";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.HAZOP);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};

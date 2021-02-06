
const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/PKIs";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.PKI);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  return fieldsList;
};


const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/CertificateTokens";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.CertificateToken);

export const getFieldsList = () => {
  const fieldsList = [...scalarKeyList];

  return fieldsList;
};

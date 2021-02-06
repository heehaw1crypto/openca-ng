const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/CertificateAuthorities";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.CertificateAuthority);

export const getFieldsList = () => {
  const fieldsList = [...scalarKeyList];

  return fieldsList;
};

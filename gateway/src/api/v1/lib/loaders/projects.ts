const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/Projects";

const properties = Object.keys(resourceSchemas.ProjectBase.properties);

export const getFieldsList = () => {
  const fieldsList: any[] = [...properties];

  return fieldsList;
};

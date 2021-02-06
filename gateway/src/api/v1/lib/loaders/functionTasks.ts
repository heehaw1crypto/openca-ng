const _ = require("lodash");

import * as resourceSchemas from "../../components/schemas/FunctionTasks";

import * as projectsLoader from "./projects";

import { getScalarKeys } from "./utils";

const scalarKeyList = getScalarKeys(resourceSchemas.FunctionTask);

export const getFieldsList = () => {
  const fieldsList: any[] = [...scalarKeyList];

  // fieldsList.push({ name: "project", fields: projectsLoader.getFieldsList() });

  return fieldsList;
};

"use strict";
const schemas = new Map();

module.exports = {
  set: (handler, schema, namespace) => {
    schemas.set(
      namespace
        ? namespace.name + handler.__SCHEMA_MAP_KEY__
        : handler.__SCHEMA_MAP_KEY__,
      schema
    );

    schemas.set("___SPECIAL___" + handler.__SCHEMA_MAP_KEY__, schema);
  },
  get: (handler, namespace) => {
    if (namespace?.all) {
      return schemas.get("___SPECIAL___" + handler.__SCHEMA_MAP_KEY__);
    }

    if (namespace) {
      return schemas.get(namespace.name + handler.__SCHEMA_MAP_KEY__);
    }

    return schemas.get(handler.__SCHEMA_MAP_KEY__);
  },
};

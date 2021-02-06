"use strict";
const pathToRegexp = require("path-to-regexp");
const { v4: uuidv4 } = require("uuid");
const minimumViableDocument = require("./minimum-doc");
const { get: getSchema, set: setSchema } = require("./layer-schema");

module.exports = function generateDocument(baseDocument, router, namespace) {
  // Merge document with select minimum defaults
  const doc = Object.assign(
    {
      openapi: minimumViableDocument.openapi,
    },
    baseDocument,
    {
      info: Object.assign({}, minimumViableDocument.info, baseDocument.info),
      paths: Object.assign({}, minimumViableDocument.paths, baseDocument.paths),
    }
  );

  // Iterate the middleware stack and add any paths and schemas, etc
  router &&
    router.stack.forEach((_layer) => {
      iterateStack("", null, _layer, (path, routeLayer, layer) => {
        if (layer.handle && layer.handle.stack) {
          layer.handle.stack.forEach((x) => {
            // console.log(x);
          });
        }

        const schema = getSchema(layer.handle, namespace);
        if (!schema || !layer.method) {
          return;
        }

        const operation = Object.assign({}, schema);

        // Add route params to schema
        if (routeLayer && routeLayer.keys && routeLayer.keys.length) {
          const keys = {};

          const params = routeLayer.keys.map((k) => {
            let param;
            if (schema.parameters) {
              param = schema.parameters.find(
                (p) => p.name === k.name && p.in === "path"
              );
            }

            // Reformat the path
            keys[k.name] = "{" + k.name + "}";

            return Object.assign(
              {
                name: k.name,
                in: "path",
                required: !k.optional,
                schema: { type: "string" },
              },
              param || {}
            );
          });

          if (schema.parameters) {
            schema.parameters.forEach((p) => {
              if (!params.find((pp) => p.name === pp.name)) {
                params.push(p);
              }
            });
          }

          operation.parameters = params;
          path = pathToRegexp.compile(path)(keys, { encode: (value) => value });
        }

        doc.paths[path] = doc.paths[path] || {};
        doc.paths[path][layer.method] = operation;
        layer.handle.__SCHEMA_MAP_KEY__ =
          layer.handle.__SCHEMA_MAP_KEY__ || uuidv4();
        setSchema(layer.handle, operation, namespace);
      });
    });

  return doc;
};

function iterateStack(path, routeLayer, layer, cb) {
  cb(path, routeLayer, layer);

  if (layer.name === "router") {
    layer.handle.stack.forEach((l) => {
      path = path ? path : "";

      // try {
      //   split(layer.regexp).join("/");
      // } catch (err) {
      //   let s = split(layer.regexp);
      //   console.log(layer.regexp);
      //   console.log(s);
      //   console.log(Array.isArray(s));
      //   console.log(s.join);
      //   // return;
      // }
      iterateStack(path + split(layer.regexp).join("/"), layer, l, cb);
    });
  }

  if (!layer.route) {
    return;
  }
  layer.route.stack.forEach((l) => {
    iterateStack(path + layer.route.path, layer, l, cb);
  });
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return [];
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

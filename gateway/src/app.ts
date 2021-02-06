const express = require("express");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routesV1 = require("./api/v1/routes").default;
const components = require("./api/v1/components/index");
const openapi = require("./lib/openapi");
const config = require("./configuration/index");
const uuid = require("uuid");

// Initialize DB Connections
require("./lib/databaseInit")();

// Express App Setup
const app = express();
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// system `creator` and `correlationId`
app.use((req, res, next) => {
  req.headers[config.system.headerNames.correlationId] = uuid.v4();
  req.creator = "SYSTEM"; // provide default creator
  return next();
});

// Intialize OpenAPI
const oapi = openapi(
  "/v1",
  {
    openapi: "3.0.0",
    info: {
      title: config.openapi.v1.title,
      description: config.openapi.v1.description,
      version: config.openapi.v1.version,
    },
  },
  { namespace: { name: "v1" } }
);

// configurator components
for (let type of Object.keys(components)) {
  for (let name of Object.keys(components[type])) {
    oapi.component(type, name, components[type][name]);
  }
}

app.use(oapi);
app.use("/docs", oapi.redoc);
app.use("/swagger", oapi.swaggerui);
app.use("/redoc", oapi.redoc);

// V1
app.use("/v1", routesV1);

// Error Handler
const errorHandler = (err, req, res, next) => {
  const statusCode: number =
    err.statusCode === undefined ? 500 : err.statusCode;

  const errorEnum: any = err.validationErrors
    ? "VALIDATION_ERROR"
    : err.enum === undefined
    ? "SYSTEM_ERROR"
    : err.enum;

  const message: any =
    err.message === undefined ? "There was a system error" : err.message;

  // show stack for a thrown error
  const stack = err.wasThrown === false ? undefined : err;

  if (err.validationErrors) {
    console.error(err.validationErrors);
  }

  delete req.body.password;
  console.error({
    error: err,
    params: req.params,
    url: req.url,
    body: req.body,
    query: req.query,
    stack,
  });
  err.resBody && console.error(JSON.stringify(err.resBody));

  return res.status(statusCode).json({
    statusCode: statusCode,
    enum: errorEnum,
    message: message,
    validationErrors: err.validationErrors,
    stack: process.env.NODE_ENV !== "production" ? stack : undefined,
  });
};

app.use(errorHandler);

// 404 Response
app.use((req, res) => {
  res.status(404).json({ error: "Not Found." });
});

module.exports = app;

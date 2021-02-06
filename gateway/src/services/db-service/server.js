const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const qs = require("qs");
const swaggerUi = require("swagger-ui-express");
const { db, error, token, healthcheck, notFound } = require("./core-js");
const routes = require("./src/router");
const customRoutes = require("./custom/router");

db.init({ database: "AMZR_RiskAssessment" });

const app = express();

// https://github.com/ljharb/qs/issues/186
app.set("query parser", (str) => {
  const parsed = qs.parse(str);
  if (parsed._q) {
    return JSON.parse(parsed._q);
  }
  return parsed;
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("common"));
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(require("./api.json")));

app.use("/", customRoutes);

app.get("/healthcheck", healthcheck);
app.post("/token", token);

app.use("/", routes);

app.use(error);
app.use(notFound);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Starting server on port " + port);
});

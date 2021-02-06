const output = `import * as express from "express";
import * as openapi from "../../../../../lib/openapi";
import * as schemas from "./schemas";
import * as handlers from "./handlers";

const router = express.Router();
const oapi = openapi({}, { namespace: { name: "v1" } });

router.post(
  "/{{slugCasePlural}}",
  oapi.validPath(schemas.createOne),
  handlers.createOne
);

router.get(
  "/{{slugCasePlural}}",
  oapi.validPath(schemas.getList),
  handlers.getList
);

router.get(
  "/{{slugCasePlural}}/:{{uuidName}}",
  oapi.validPath(schemas.getOne),
  handlers.getOne
);

router.patch(
  "/{{slugCasePlural}}/:{{uuidName}}",
  oapi.validPath(schemas.updateOne),
  handlers.updateOne
);

router.delete(
  "/{{slugCasePlural}}/:{{uuidName}}",
  oapi.validPath(schemas.deleteOne),
  handlers.deleteOne
);

export default router;`;

module.exports = output;

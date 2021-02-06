import * as express from "express";
import * as openapi from "../../../../../lib/openapi";
import * as schemas from "./schemas";
import * as handlers from "./handlers";

const router = express.Router();
const oapi = openapi({}, { namespace: { name: "v1" } });

router.post(
  "/organizations",
  oapi.validPath(schemas.createOne),
  handlers.createOne
);

router.get("/organizations", oapi.validPath(schemas.getList), handlers.getList);

router.get(
  "/organizations/:organizationUuid",
  oapi.validPath(schemas.getOne),
  handlers.getOne
);

router.patch(
  "/organizations/:organizationUuid",
  oapi.validPath(schemas.updateOne),
  handlers.updateOne
);

router.delete(
  "/organizations/:organizationUuid",
  oapi.validPath(schemas.deleteOne),
  handlers.deleteOne
);

export default router;

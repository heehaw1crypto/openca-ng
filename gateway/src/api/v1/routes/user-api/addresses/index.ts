import * as express from "express";
import * as openapi from "../../../../../lib/openapi";
import * as schemas from "./schemas";
import * as handlers from "./handlers";

const router = express.Router();
const oapi = openapi({}, { namespace: { name: "v1" } });

router.post(
  "/organizations/:organizationUuid/addresses",
  oapi.validPath(schemas.createOne),
  handlers.createOne
);

router.get("/addresses", oapi.validPath(schemas.getList), handlers.getList);

router.get(
  "/addresses/:addressUuid",
  oapi.validPath(schemas.getOne),
  handlers.getOne
);

router.patch(
  "/addresses/:addressUuid",
  oapi.validPath(schemas.updateOne),
  handlers.updateOne
);

router.delete(
  "/addresses/:addressUuid",
  oapi.validPath(schemas.deleteOne),
  handlers.deleteOne
);

export default router;

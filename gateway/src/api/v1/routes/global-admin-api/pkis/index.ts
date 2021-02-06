import * as express from "express";
import * as openapi from "../../../../../lib/openapi";
import * as schemas from "./schemas";
import * as handlers from "./handlers";

const router = express.Router();
const oapi = openapi({}, { namespace: { name: "v1" } });

router.post(
  "/pkis",
  oapi.validPath(schemas.createOne),
  handlers.createOne
);

router.get(
  "/pkis",
  oapi.validPath(schemas.getList),
  handlers.getList
);

router.get(
  "/pkis/:pkiUuid",
  oapi.validPath(schemas.getOne),
  handlers.getOne
);

router.patch(
  "/pkis/:pkiUuid",
  oapi.validPath(schemas.updateOne),
  handlers.updateOne
);

router.delete(
  "/pkis/:pkiUuid",
  oapi.validPath(schemas.deleteOne),
  handlers.deleteOne
);

export default router;
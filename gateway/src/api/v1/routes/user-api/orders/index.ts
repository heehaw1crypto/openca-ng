import * as express from "express";
import * as openapi from "../../../../../lib/openapi";
import * as schemas from "./schemas";
import * as handlers from "./handlers";

const router = express.Router();
const oapi = openapi({}, { namespace: { name: "v1" } });

router.post(
  "/orders",
  oapi.validPath(schemas.createOne),
  handlers.createOne
);

router.get(
  "/orders",
  oapi.validPath(schemas.getList),
  handlers.getList
);

router.get(
  "/orders/:orderUuid",
  oapi.validPath(schemas.getOne),
  handlers.getOne
);

router.patch(
  "/orders/:orderUuid",
  oapi.validPath(schemas.updateOne),
  handlers.updateOne
);

router.delete(
  "/orders/:orderUuid",
  oapi.validPath(schemas.deleteOne),
  handlers.deleteOne
);

export default router;
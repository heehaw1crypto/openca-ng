import * as express from "express";
import * as openapi from "../../../../../lib/openapi";
import * as schemas from "./schemas";
import * as handlers from "./handlers";

const router = express.Router();
const oapi = openapi({}, { namespace: { name: "v1" } });

router.post(
  "/certificate-authorities",
  oapi.validPath(schemas.createOne),
  handlers.createOne
);

router.get(
  "/certificate-authorities",
  oapi.validPath(schemas.getList),
  handlers.getList
);

router.get(
  "/certificate-authorities/:certificateAuthorityUuid",
  oapi.validPath(schemas.getOne),
  handlers.getOne
);

router.patch(
  "/certificate-authorities/:certificateAuthorityUuid",
  oapi.validPath(schemas.updateOne),
  handlers.updateOne
);

router.delete(
  "/certificate-authorities/:certificateAuthorityUuid",
  oapi.validPath(schemas.deleteOne),
  handlers.deleteOne
);

export default router;

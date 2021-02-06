import * as express from "express";
import * as openapi from "../../../../../lib/openapi";
import * as schemas from "./schemas";
import * as handlers from "./handlers";

const router = express.Router();
const oapi = openapi({}, { namespace: { name: "v1" } });

router.post(
  "/certificate-authorities/:certificateAuthorityUuid/certificate-tokens",
  oapi.validPath(schemas.createOneForCertificateAuthority),
  handlers.createOneForCertificateAuthority
);

router.post(
  "/organizations/:organizationUuid/certificate-tokens",
  oapi.validPath(schemas.createOneForOrganization),
  handlers.createOneForOrganization
);

router.get(
  "/certificate-tokens",
  oapi.validPath(schemas.getList),
  handlers.getList
);

router.get(
  "/certificate-tokens/:certificateTokenUuid",
  oapi.validPath(schemas.getOne),
  handlers.getOne
);

router.patch(
  "/certificate-tokens/:certificateTokenUuid",
  oapi.validPath(schemas.updateOne),
  handlers.updateOne
);

router.delete(
  "/certificate-tokens/:certificateTokenUuid",
  oapi.validPath(schemas.deleteOne),
  handlers.deleteOne
);

export default router;

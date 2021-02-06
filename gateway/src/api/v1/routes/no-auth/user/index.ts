import * as express from "express";
import * as openapi from "../../../../../lib/openapi";
import * as schemas from "./schemas";
import * as handlers from "./handlers";

const router = express.Router();
const oapi = openapi({}, { namespace: { name: "v1" } });

router.put(
  "/actions/register",
  oapi.validPath(schemas.registerUser),
  handlers.registerUser
);

router.put(
  "/actions/login",
  oapi.validPath(schemas.loginUser),
  handlers.loginUser
);

export default router;

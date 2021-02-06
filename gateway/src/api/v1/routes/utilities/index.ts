import * as express from "express";
import * as handlers from "./handlers";

const router = express.Router();

router.get("/health-check", handlers.runHealthCheck);

router.get("/system-test-error", handlers.testSystemError);

export default router;

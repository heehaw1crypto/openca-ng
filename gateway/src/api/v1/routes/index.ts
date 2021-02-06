import * as express from "express";

// routers

const router = express.Router();

// middleware
import attachUser from "../lib/middleware/attach/attachUser";

// Auth
import { authShield, or } from "../lib/middleware/permissions/shieldFunctions";
import { userHasRole, RoleEnum } from "../lib/middleware/permissions/users";

// utils
import utilityRoutes from "./utilities";
router.use("/utilities", utilityRoutes);

// no auth
import noAuthUsers from "./no-auth/user";
router.use("/user-api/users", noAuthUsers);

// ----------------------------------------------------
// API - Global Admin
// ----------------------------------------------------

// pkis
import gaaPkis from "./global-admin-api/pkis";
router.use("/global-admin-api", attachUser, gaaPkis);

// certificate authorities
import gaaCertificateAuthorities from "./global-admin-api/certificate-authorities";
router.use("/global-admin-api", attachUser, gaaCertificateAuthorities);

// organizations
import gaaOrganizations from "./global-admin-api/organizations";
router.use("/global-admin-api", attachUser, gaaOrganizations);

// certificate tokens
import gaaCertificateTokens from "./global-admin-api/certificate-tokens";
router.use("/global-admin-api", attachUser, gaaCertificateTokens);

// ----------------------------------------------------
// API - Users
// ----------------------------------------------------

// organizations
import uaOrganizations from "./user-api/organizations";
router.use("/user-api", attachUser, uaOrganizations);

// addresses
import uaAddresses from "./user-api/addresses";
router.use("/user-api", attachUser, uaAddresses);

export default router;

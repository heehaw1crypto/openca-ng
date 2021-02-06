/* eslint-env mocha */

// imports
const { expect } = require("chai");
const { execSync } = require("child_process");

const moment = require("moment");

// utils
const {
  getWithHeaders,
  patchWithHeaders,
  postWithHeaders,
  putNoAuth,
  deleteWithHeaders,
  putWithHeaders,
} = require("../utils");

const globalAdminApiHelpers = require("../globalAdminApiHelpers");

// begin tests
describe("Global Admin API (v1) Tests", function () {
  this.timeout(500000);

  const apiPrefix = "/v1/global-admin-api";

  describe("PKIs", () => {
    const headers = {};
    let pkiUuid;

    before(async () => {
      let rr, req, res;

      rr = await globalAdminApiHelpers.loginGlobalAdmin();
      headers["Authorization"] = `Bearer ${rr.res.token}`;
    });

    it("should create a PKI", async () => {
      const { req, res } = await globalAdminApiHelpers.createPKI({ headers });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.name).to.equal(req.name);
      pkiUuid = res.uuid;
    });

    it("should get a list of PKIs", async () => {
      const res = await getWithHeaders(`${apiPrefix}/pkis`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one PKI", async () => {
      const res = await getWithHeaders(`${apiPrefix}/pkis/${pkiUuid}`, headers);

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(pkiUuid);
    });

    it("should update one PKI", async () => {
      const req = {
        name: "updated name",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/pkis/${pkiUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.uuid).to.equal(pkiUuid);
      expect(res.name).to.equal(req.name);
    });

    it("should delete one PKI", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/pkis/${pkiUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });

  describe("Certificate Authorities", () => {
    const headers = {};
    let pkiUuid;
    let certificateAuthorityUuid;

    before(async () => {
      let rr, req, res;

      rr = await globalAdminApiHelpers.loginGlobalAdmin();
      headers["Authorization"] = `Bearer ${rr.res.token}`;

      rr = await globalAdminApiHelpers.createPKI({ headers });
      pkiUuid = rr.res.uuid;
    });

    it("should create a CertificateAuthority", async () => {
      const {
        req,
        res,
      } = await globalAdminApiHelpers.createCertificateAuthority({
        pkiUuid,
        headers,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.name).to.equal(req.name);
      certificateAuthorityUuid = res.uuid;
    });

    it("should get a list of CertificateAuthorities", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/certificate-authorities`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one CertificateAuthority", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/certificate-authorities/${certificateAuthorityUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(certificateAuthorityUuid);
    });

    it("should update one CertificateAuthority", async () => {
      const req = {
        name: "updated name",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/certificate-authorities/${certificateAuthorityUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.uuid).to.equal(certificateAuthorityUuid);
      expect(res.name).to.equal(req.name);
    });

    it("should delete one CertificateAuthority", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/certificate-authorities/${certificateAuthorityUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });

  describe("Organizations", () => {
    const headers = {};
    let organizationUuid;

    before(async () => {
      let rr, req, res;

      rr = await globalAdminApiHelpers.loginGlobalAdmin();
      headers["Authorization"] = `Bearer ${rr.res.token}`;
    });

    it("should create an Organization", async () => {
      const { req, res } = await globalAdminApiHelpers.createOrganization({
        headers,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.name).to.equal(req.name);
      organizationUuid = res.uuid;
    });

    it("should get a list of Organizations", async () => {
      const res = await getWithHeaders(`${apiPrefix}/organizations`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one Organization", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/organizations/${organizationUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(organizationUuid);
    });

    it("should update one Organization", async () => {
      const req = {
        name: "updated name",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/organizations/${organizationUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.uuid).to.equal(organizationUuid);
      expect(res.name).to.equal(req.name);
    });

    it("should delete one Organization", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/organizations/${organizationUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });

  describe("Certificate Tokens", () => {
    const headers = {};
    let pkiUuid;
    let certificateAuthorityUuid;
    let organizationUuid;
    let certificateTokenUuid;

    before(async () => {
      let rr, req, res;

      rr = await globalAdminApiHelpers.loginGlobalAdmin();
      headers["Authorization"] = `Bearer ${rr.res.token}`;

      rr = await globalAdminApiHelpers.createPKI({ headers });
      pkiUuid = rr.res.uuid;

      rr = await globalAdminApiHelpers.createCertificateAuthority({
        pkiUuid,
        headers,
      });
      certificateAuthorityUuid = rr.res.uuid;

      rr = await globalAdminApiHelpers.createOrganization({
        headers,
      });
      organizationUuid = rr.res.uuid;
    });

    it("should create a CertificateToken for a CertificateAuthority", async () => {
      const {
        req,
        res,
      } = await globalAdminApiHelpers.createCertificateTokenForCertificateAuthority(
        {
          certificateAuthorityUuid: certificateAuthorityUuid,
          issuerCertificateAuthorityUuid: certificateAuthorityUuid,
          headers,
        }
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("issuerCertificateAuthorityUuid");
      expect(res.issuerCertificateAuthorityUuid).to.equal(
        req.issuerCertificateAuthorityUuid
      );
      certificateTokenUuid = res.uuid;
    });

    it("should create a CertificateToken for an Organization", async () => {
      const {
        req,
        res,
      } = await globalAdminApiHelpers.createCertificateTokenForOrganization({
        organizationUuid: organizationUuid,
        issuerCertificateAuthorityUuid: certificateAuthorityUuid,
        headers,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("issuerCertificateAuthorityUuid");
      expect(res.issuerCertificateAuthorityUuid).to.equal(
        req.issuerCertificateAuthorityUuid
      );
    });

    it("should get a list of CertificateTokens", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/certificate-tokens`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one CertificateToken", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/certificate-tokens/${certificateTokenUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(certificateTokenUuid);
    });

    it("should update one CertificateToken", async () => {
      const req = {
        revoked: true,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/certificate-tokens/${certificateTokenUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("revoked");
      expect(res.uuid).to.equal(certificateTokenUuid);
      expect(res.revoked).to.equal(req.revoked);
    });

    it("should delete one CertificateAuthority", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/certificate-tokens/${certificateTokenUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
});

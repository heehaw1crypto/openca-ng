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

const helpers = require("../userApiHelpers");

// begin tests
describe("User API (v1) Tests", function () {
  this.timeout(500000);

  const apiPrefix = "/v1/user-api";

  describe("Organizations", () => {
    const headers = {};
    let organizationUuid;

    before(async () => {
      let rr, req, res;

      rr = await helpers.createUser();
      req = {
        email: rr.req.email,
        password: rr.req.password,
      };

      res = await putNoAuth(`${apiPrefix}/users/actions/login`, req);
      headers["Authorization"] = `Bearer ${res.token}`;
    });

    it("should create an Organization", async () => {
      const { req, res } = await helpers.createOrganization({ headers });

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
  describe("Addresses", () => {
    const headers = {};
    let organizationUuid;
    let addressUuid;

    before(async () => {
      let rr, req, res;

      rr = await helpers.createUser();
      req = {
        email: rr.req.email,
        password: rr.req.password,
      };

      res = await putNoAuth(`${apiPrefix}/users/actions/login`, req);
      headers["Authorization"] = `Bearer ${res.token}`;

      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;
    });

    it("should create an Address", async () => {
      const { req, res } = await helpers.createAddress({
        organizationUuid,
        headers,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("country");
      expect(res.country).to.equal(req.country);
      addressUuid = res.uuid;
    });

    it("should get a list of Addresses", async () => {
      const res = await getWithHeaders(`${apiPrefix}/addresses`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one Address", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/addresses/${addressUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(addressUuid);
    });

    it("should update one Address", async () => {
      const req = {
        country: "updated country",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/addresses/${addressUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("country");
      expect(res.uuid).to.equal(addressUuid);
      expect(res.country).to.equal(req.country);
    });

    it("should delete one Address", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/addresses/${addressUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
});

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

const helpers = require("../helpers");

// begin tests
describe("API (v1) Tests", function () {
  this.timeout(500000);

  const apiPrefix = "/v1";

  describe("ResourceNames", () => {
    const headers = {};
    let resourceNameUuid;

    before(async () => {
      let rr, req, res;

      // first adult user account and login
      rr = await helpers.createUser({ gender: "FEMALE" });
      req = {
        email: rr.req.email,
        password: rr.req.password,
      };
      res = await putNoAuth(`${apiPrefix}/users/actions/login`, req);
      headers["Authorization"] = `Bearer ${res.token}`;
    });

    it("should create a ResourceName", async () => {
      const { req, res } = await helpers.createResourceName({
        headers,
      });

      expect(res).to.haveOwnProperty("uuid");
      resourceNameUuid = res.uuid;
    });

    it("should get a list of ResourceNames", async () => {
      const res = await getWithHeaders(`${apiPrefix}/resource-names`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one ResourceName", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/resource-names/${resourceNameUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(resourceNameUuid);
    });

    it("should update one ResourceName", async () => {
      const req = {
        field: "updated value",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/resource-names/${resourceNameUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("field");
      expect(res.uuid).to.equal(resourceNameUuid);
      expect(res.field).to.equal(req.field);
    });

    it("should delete one ResourceName", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/resource-names/${resourceNameUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
});

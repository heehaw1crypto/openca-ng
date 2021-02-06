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

  describe("Users", () => {
    const headers = {};
    let userEmail;
    let userPassword;
    let userUuid;
    let username;

    it("should register a user", async () => {
      const { req, res } = await helpers.createUser({ gender: "FEMALE" });
      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("email");
      userUuid = res.uuid;
      userEmail = req.email;
      userPassword = req.password;
      username = req.username;
    });

    it("should login a user", async () => {
      const req = {
        email: userEmail,
        password: userPassword,
      };
      const res = await putNoAuth(`${apiPrefix}/users/actions/login`, req);
      headers["Authorization"] = `Bearer ${res.token}`;
    });

    it("should get a user's own info", async () => {
      const res = await getWithHeaders(`${apiPrefix}/users/me`, headers);
      expect(res).to.have.property("uuid");
      expect(res).to.have.property("lastName");
      expect(res).to.have.property("email");
    });

    it("should get a user uuid via username", async () => {
      const req = {
        username,
      };
      const res = await putWithHeaders(
        `${apiPrefix}/users/actions/get-user-uuid-via-username`,
        req,
        headers
      );
      expect(res).to.have.property("userUuid");
      expect(res.userUuid).to.equal(userUuid);
    });

    it("should update an user's own info", async () => {
      const req = {
        firstName: "Evan",
      };

      const res = await patchWithHeaders(`${apiPrefix}/users/me`, req, headers);
      expect(res).to.have.property("uuid");
      expect(res).to.have.property("firstName");
      expect(res.firstName).to.equal(req.firstName);
    });

    it("should allow user to delete own account", async () => {
      const res = await deleteWithHeaders(`${apiPrefix}/users/me`, headers);
      expect(res.status).to.equal(204);
    });
  });
  describe("Organizations", () => {
    const headers = {};
    let organizationUuid;

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

    it("should create an organization", async () => {
      const { res } = await helpers.createOrganization({ headers });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("enum");
      organizationUuid = res.uuid;
    });

    it("should get a list of organizations", async () => {
      const res = await getWithHeaders(`${apiPrefix}/organizations`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one organization", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/organizations/${organizationUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(organizationUuid);
    });

    it("should update one organization", async () => {
      const req = {
        name: "Updated name",
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

    it("should delete one organization", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/organizations/${organizationUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Organization Roles", () => {
    const headers = {};
    let organizationUuid;
    let organizationRoleUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;
    });

    it("should create an organization role", async () => {
      const req = {
        name: "Organization Role 1",
        enum: "ORGANIZATION_ROLE_1",
      };

      const res = await postWithHeaders(
        `${apiPrefix}/organizations/${organizationUuid}/roles`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("enum");
      organizationRoleUuid = res.uuid;
    });

    it("should get a list of organization roles", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/organization-roles`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one organization role", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/organization-roles/${organizationRoleUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(organizationRoleUuid);
    });

    it("should update one organization role", async () => {
      const req = {
        name: "Updated name",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/organization-roles/${organizationRoleUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.uuid).to.equal(organizationRoleUuid);
      expect(res.name).to.equal(req.name);
    });

    it("should delete one organization role", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/organization-roles/${organizationRoleUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Tags", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;
    });

    it("should create a tag", async () => {
      const { res } = await helpers.createTag({ organizationUuid, headers });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      tagUuid = res.uuid;
    });

    it("should get a list of tags", async () => {
      const res = await getWithHeaders(`${apiPrefix}/tags`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one tag", async () => {
      const res = await getWithHeaders(`${apiPrefix}/tags/${tagUuid}`, headers);

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(tagUuid);
    });

    it("should update one tag", async () => {
      const req = {
        name: "Updated name",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/tags/${tagUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.name).to.equal(req.name);
    });

    it("should delete one tag", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/tags/${tagUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Projects", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let tagUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create tag
      rr = await helpers.createTag({ organizationUuid, headers });
      tagUuid = rr.res.uuid;
    });

    it("should create a project", async () => {
      const { res } = await helpers.createProject({
        organizationUuid,
        headers,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("enum");
      projectUuid = res.uuid;
    });

    it("should get a list of projects", async () => {
      const res = await getWithHeaders(`${apiPrefix}/projects`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one project", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/projects/${projectUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(projectUuid);
    });

    it("should update one project", async () => {
      const req = {
        name: "Updated name",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/projects/${projectUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.uuid).to.equal(projectUuid);
      expect(res.name).to.equal(req.name);
    });

    it("should add a tag to a project", async () => {
      const req = {
        tagUuid,
      };

      const res = await postWithHeaders(
        `${apiPrefix}/projects/${projectUuid}/tags`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(projectUuid);
      expect(res).to.haveOwnProperty("tagList");
      expect(res.tagList.length).to.equal(1);
    });

    it("should remove a tag from a project", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/projects/${projectUuid}/tags/${tagUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(projectUuid);
      expect(res).to.haveOwnProperty("tagList");
      expect(res.tagList.length).to.equal(0);
    });

    it("should delete one project", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/projects/${projectUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Project Attribute Types", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let projectAttributeTypeUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;
    });

    it("should create a project attribute type", async () => {
      const { res } = await helpers.createProjectAttributeType({
        projectUuid,
        headers,
      });

      expect(res).to.haveOwnProperty("uuid");
      projectAttributeTypeUuid = res.uuid;
    });

    it("should get a list of project attribute types", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/project-attribute-types`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one project attribute type", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/project-attribute-types/${projectAttributeTypeUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(projectAttributeTypeUuid);
    });

    it("should update one project attribute type", async () => {
      const req = {
        name: "Updated name",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/project-attribute-types/${projectAttributeTypeUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.uuid).to.equal(projectAttributeTypeUuid);
      expect(res.name).to.equal(req.name);
    });

    it("should delete one project attribute type", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/project-attribute-types/${projectAttributeTypeUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Project Attribute Type Values", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let projectAttributeTypeUuid;
    let projectAttributeTypeValueUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create project attribute type
      rr = await helpers.createProjectAttributeType({
        projectUuid,
        headers,
      });
      projectAttributeTypeUuid = rr.res.uuid;
    });

    it("should create a project attribute type value", async () => {
      const { res } = await helpers.createProjectAttributeTypeValue({
        projectAttributeTypeUuid,
        headers,
      });

      expect(res).to.haveOwnProperty("uuid");
      projectAttributeTypeValueUuid = res.uuid;
    });

    it("should get a list of project attribute type values", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/project-attribute-type-values`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one project attribute type value", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/project-attribute-type-values/${projectAttributeTypeValueUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(projectAttributeTypeValueUuid);
    });

    it("should update one project attribute type value", async () => {
      const req = {
        name: "Updated name",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/project-attribute-type-values/${projectAttributeTypeValueUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.uuid).to.equal(projectAttributeTypeValueUuid);
      expect(res.name).to.equal(req.name);
    });

    it("should delete one project attribute type value", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/project-attribute-type-values/${projectAttributeTypeValueUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Project Attributes", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let projectAttributeTypeUuid_1;
    let projectAttributeTypeUuid_2;
    let projectAttributeTypeUuid_3;
    let projectAttributeTypeValueUuid_1;
    let projectAttributeTypeValueUuid_2;
    let projectAttributeUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create project attribute type
      rr = await helpers.createProjectAttributeType({
        projectUuid,
        headers,
      });
      projectAttributeTypeUuid_1 = rr.res.uuid;

      // create project attribute type
      rr = await helpers.createProjectAttributeType({
        projectUuid,
        headers,
      });
      projectAttributeTypeUuid_2 = rr.res.uuid;

      // create project attribute type
      rr = await helpers.createProjectAttributeType({
        projectUuid,
        headers,
      });
      projectAttributeTypeUuid_3 = rr.res.uuid;

      // create project attribute type value
      rr = await helpers.createProjectAttributeTypeValue({
        projectAttributeTypeUuid: projectAttributeTypeUuid_2,
        headers,
      });
      projectAttributeTypeValueUuid_1 = rr.res.uuid;

      // create project attribute type value
      rr = await helpers.createProjectAttributeTypeValue({
        projectAttributeTypeUuid: projectAttributeTypeUuid_2,
        headers,
      });
      projectAttributeTypeValueUuid_2 = rr.res.uuid;
    });

    it("should create a project attribute", async () => {
      const req = {
        value: "value",
        projectAttributeTypeUuid: projectAttributeTypeUuid_1,
        projectAttributeTypeValueUuid: null,
      };

      const res = await postWithHeaders(
        `${apiPrefix}/projects/${projectUuid}/attributes`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      projectAttributeUuid = res.uuid;
    });

    it("should create a project attribute (discrete)", async () => {
      const req = {
        value: null,
        projectAttributeTypeUuid: projectAttributeTypeUuid_2,
        projectAttributeTypeValueUuid: projectAttributeTypeValueUuid_1,
      };

      const res = await postWithHeaders(
        `${apiPrefix}/projects/${projectUuid}/attributes`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      projectAttributeUuid = res.uuid;
    });

    it("should get one project with attributes", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/projects/${projectUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(projectUuid);
      expect(res).to.haveOwnProperty("attributeTypeList");
      expect(res.attributeTypeList.length).to.equal(3);
      expect(res).to.haveOwnProperty("attributeList");
      expect(res.attributeList.length).to.equal(2);
    });

    it("should get a list of project attributes", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/project-attributes`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one project attribute", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/project-attributes/${projectAttributeUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(projectAttributeUuid);
    });

    it("should update one project attribute", async () => {
      const req = {
        value: "updated value",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/project-attributes/${projectAttributeUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("value");
      expect(res.uuid).to.equal(projectAttributeUuid);
      expect(res.value).to.equal(req.value);
    });

    it("should delete one project attribute", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/project-attributes/${projectAttributeUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Standards", () => {
    const headers = {};
    let standardUuid;

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

    it("should create a standard", async () => {
      const { req, res } = await helpers.createStandard({ headers });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hrId");
      expect(res.hrId).to.equal(req.hrId);
      standardUuid = res.uuid;
    });

    it("should get a list of standards", async () => {
      const res = await getWithHeaders(`${apiPrefix}/standards`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one standard", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/standards/${standardUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(standardUuid);
    });

    it("should update one standard", async () => {
      const req = {
        strict: true,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/standards/${standardUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("strict");
      expect(res.uuid).to.equal(standardUuid);
      expect(res.strict).to.equal(req.strict);
    });

    it("should delete one standard", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/standards/${standardUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Risk Severities", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let riskSeverityUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;
    });

    it("should create a risk severity", async () => {
      const { req, res } = await helpers.createRiskSeverity({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("classId");
      expect(res.classId).to.equal(req.classId);
      riskSeverityUuid = res.uuid;
    });

    it("should get a list of risk severities", async () => {
      const res = await getWithHeaders(`${apiPrefix}/risk-severities`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one risk severity", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-severities/${riskSeverityUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(riskSeverityUuid);
    });

    it("should update one risk severity", async () => {
      const req = {
        title: "updated title",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/risk-severities/${riskSeverityUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("title");
      expect(res.uuid).to.equal(riskSeverityUuid);
      expect(res.title).to.equal(req.title);
    });

    it("should delete one risk severity", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/risk-severities/${riskSeverityUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Risk Exposures", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let riskExposureUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;
    });

    it("should create a risk exposure", async () => {
      const { req, res } = await helpers.createRiskExposure({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("classId");
      expect(res.classId).to.equal(req.classId);
      riskExposureUuid = res.uuid;
    });

    it("should get a list of risk exposures", async () => {
      const res = await getWithHeaders(`${apiPrefix}/risk-exposures`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one risk exposure", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-exposures/${riskExposureUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(riskExposureUuid);
    });

    it("should update one risk exposure", async () => {
      const req = {
        guidance: "updated title",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/risk-exposures/${riskExposureUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("guidance");
      expect(res.uuid).to.equal(riskExposureUuid);
      expect(res.guidance).to.equal(req.guidance);
    });

    it("should delete one risk exposure", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/risk-exposures/${riskExposureUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Risk Avoidabilities", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let riskAvoidabilityUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;
    });

    it("should create a risk avoidability", async () => {
      const { req, res } = await helpers.createRiskAvoidability({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("classId");
      expect(res.classId).to.equal(req.classId);
      riskAvoidabilityUuid = res.uuid;
    });

    it("should get a list of risk avoidabilities", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-avoidabilities`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one risk avoidability", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-avoidabilities/${riskAvoidabilityUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(riskAvoidabilityUuid);
    });

    it("should update one risk avoidability", async () => {
      const req = {
        guidance: "updated guidance",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/risk-avoidabilities/${riskAvoidabilityUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("guidance");
      expect(res.uuid).to.equal(riskAvoidabilityUuid);
      expect(res.guidance).to.equal(req.guidance);
    });

    it("should delete one risk avoidability", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/risk-avoidabilities/${riskAvoidabilityUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Risk Classes", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let riskClassUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;
    });

    it("should create a risk class", async () => {
      const { req, res } = await helpers.createRiskClass({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("classId");
      expect(res.classId).to.equal(req.classId);
      riskClassUuid = res.uuid;
    });

    it("should get a list of risk classes", async () => {
      const res = await getWithHeaders(`${apiPrefix}/risk-classes`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one risk class", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-classes/${riskClassUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(riskClassUuid);
    });

    it("should update one risk class", async () => {
      const req = {
        interpretation: "updated interpretation",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/risk-classes/${riskClassUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("interpretation");
      expect(res.uuid).to.equal(riskClassUuid);
      expect(res.interpretation).to.equal(req.interpretation);
    });

    it("should delete one risk class", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/risk-classes/${riskClassUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Function Tasks", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let functionTaskUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;
    });

    it("should create a function-task", async () => {
      const { req, res } = await helpers.createFunctionTask({
        headers,
        projectUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hrId");
      expect(res.hrId).to.equal(req.hrId);
      functionTaskUuid = res.uuid;
    });

    it("should get a list of function-tasks", async () => {
      const res = await getWithHeaders(`${apiPrefix}/function-tasks`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one function-task", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/function-tasks/${functionTaskUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(functionTaskUuid);
    });

    it("should update one function task", async () => {
      const req = {
        description: "updated description",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/function-tasks/${functionTaskUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("description");
      expect(res.uuid).to.equal(functionTaskUuid);
      expect(res.description).to.equal(req.description);
    });

    it("should delete one function task", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/function-tasks/${functionTaskUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("SILs", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let silUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;
    });

    it("should create a SIL", async () => {
      const { req, res } = await helpers.createSIL({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("level");
      expect(res.level).to.equal(req.level);
      silUuid = res.uuid;
    });

    it("should get a list of SILs", async () => {
      const res = await getWithHeaders(`${apiPrefix}/sils`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one SIL", async () => {
      const res = await getWithHeaders(`${apiPrefix}/sils/${silUuid}`, headers);

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(silUuid);
    });

    it("should update one SIL", async () => {
      const req = {
        remarks: "updated remarks",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/sils/${silUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("remarks");
      expect(res.uuid).to.equal(silUuid);
      expect(res.remarks).to.equal(req.remarks);
    });

    it("should delete one SIL", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/sils/${silUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("PLs", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let plUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;
    });

    it("should create a PL", async () => {
      const { req, res } = await helpers.createPL({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("level");
      expect(res.level).to.equal(req.level);
      plUuid = res.uuid;
    });

    it("should get a list of PLs", async () => {
      const res = await getWithHeaders(`${apiPrefix}/pls`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one PL", async () => {
      const res = await getWithHeaders(`${apiPrefix}/pls/${plUuid}`, headers);

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(plUuid);
    });

    it("should update one PL", async () => {
      const req = {
        remarks: "updated remarks",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/pls/${plUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("remarks");
      expect(res.uuid).to.equal(plUuid);
      expect(res.remarks).to.equal(req.remarks);
    });

    it("should delete one PL", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/pls/${plUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("ASILs", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let asilUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;
    });

    it("should create a ASIL", async () => {
      const { req, res } = await helpers.createASIL({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("level");
      expect(res.level).to.equal(req.level);
      asilUuid = res.uuid;
    });

    it("should get a list of ASILs", async () => {
      const res = await getWithHeaders(`${apiPrefix}/asils`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one ASIL", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/asils/${asilUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(asilUuid);
    });

    it("should update one ASIL", async () => {
      const req = {
        remarks: "updated remarks",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/asils/${asilUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("remarks");
      expect(res.uuid).to.equal(asilUuid);
      expect(res.remarks).to.equal(req.remarks);
    });

    it("should delete one ASIL", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/asils/${asilUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("RiskReductionMeasureTypes", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let riskReductionMeasureTypeUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;
    });

    it("should create a RiskReductionMeasureType", async () => {
      const { req, res } = await helpers.createRiskReductionMeasureType({
        headers,
        projectUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("name");
      expect(res.name).to.equal(req.name);
      riskReductionMeasureTypeUuid = res.uuid;
    });

    it("should get a list of RiskReductionMeasureTypes", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-reduction-measure-types`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one RiskReductionMeasureType", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-reduction-measure-types/${riskReductionMeasureTypeUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(riskReductionMeasureTypeUuid);
    });

    it("should update one RiskReductionMeasureType", async () => {
      const req = {
        description: "updated description",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/risk-reduction-measure-types/${riskReductionMeasureTypeUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("description");
      expect(res.uuid).to.equal(riskReductionMeasureTypeUuid);
      expect(res.description).to.equal(req.description);
    });

    it("should delete one RiskReductionMeasureType", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/risk-reduction-measure-types/${riskReductionMeasureTypeUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("RiskReductionMeasures", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let silUuid;
    let riskReductionMeasureTypeUuid;
    let riskReductionMeasureTypeUuid_2;
    let riskReductionMeasureUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;

      // create SIL
      rr = await helpers.createSIL({
        headers,
        projectUuid,
        standardUuid,
      });
      silUuid = rr.res.uuid;

      // create RiskReductionMeasureType
      rr = await helpers.createRiskReductionMeasureType({
        headers,
        projectUuid,
      });
      riskReductionMeasureTypeUuid = rr.res.uuid;

      // create another RiskReductionMeasureType
      rr = await helpers.createRiskReductionMeasureType({
        headers,
        projectUuid,
      });
      riskReductionMeasureTypeUuid_2 = rr.res.uuid;
    });

    it("should create a RiskReductionMeasure", async () => {
      const { req, res } = await helpers.createRiskReductionMeasure({
        headers,
        projectUuid,
        typeUuid: riskReductionMeasureTypeUuid,
        targetSILUuid: silUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hrId");
      expect(res.hrId).to.equal(req.hrId);
      riskReductionMeasureUuid = res.uuid;
    });

    it("should get a list of RiskReductionMeasures", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-reduction-measures`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one RiskReductionMeasure", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/risk-reduction-measures/${riskReductionMeasureUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(riskReductionMeasureUuid);
    });

    it("should update one RiskReductionMeasure", async () => {
      const req = {
        typeUuid: riskReductionMeasureTypeUuid_2,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/risk-reduction-measures/${riskReductionMeasureUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("typeUuid");
      expect(res.uuid).to.equal(riskReductionMeasureUuid);
      expect(res.typeUuid).to.equal(req.typeUuid);
    });

    it("should delete one RiskReductionMeasure", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/risk-reduction-measures/${riskReductionMeasureUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("ConsideredSituationalAttribute", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let consideredSituationalAttributeUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;
    });

    it("should create a ConsideredSituationalAttribute", async () => {
      const { req, res } = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "MOTION",
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hrId");
      expect(res.hrId).to.equal(req.hrId);
      consideredSituationalAttributeUuid = res.uuid;
    });

    it("should get a list of ConsideredSituationalAttributes", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/considered-situational-attributes`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one ConsideredSituationalAttributes", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/considered-situational-attributes/${consideredSituationalAttributeUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(consideredSituationalAttributeUuid);
    });

    it("should update one ConsideredSituationalAttributes", async () => {
      const req = {
        value: "stopping",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/considered-situational-attributes/${consideredSituationalAttributeUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("value");
      expect(res.uuid).to.equal(consideredSituationalAttributeUuid);
      expect(res.value).to.equal(req.value);
    });

    it("should delete one ConsideredSituationalAttributes", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/considered-situational-attributes/${consideredSituationalAttributeUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Assumptions", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let assumptionUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;
    });

    it("should create an Assumption", async () => {
      const { req, res } = await helpers.createAssumption({
        headers,
        projectUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hrId");
      expect(res.hrId).to.equal(req.hrId);
      assumptionUuid = res.uuid;
    });

    it("should get a list of Assumptions", async () => {
      const res = await getWithHeaders(`${apiPrefix}/assumptions`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one Assumption", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/assumptions/${assumptionUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(assumptionUuid);
    });

    it("should update one Assumption", async () => {
      const req = {
        description: "new description",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/assumptions/${assumptionUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("description");
      expect(res.uuid).to.equal(assumptionUuid);
      expect(res.description).to.equal(req.description);
    });

    it("should delete one Assumption", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/assumptions/${assumptionUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("ExistingExternalMeasures", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let existingExternalMeasureUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;
    });

    it("should create an ExistingExternalMeasure", async () => {
      const { req, res } = await helpers.createExistingExternalMeasure({
        headers,
        projectUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hrId");
      expect(res.hrId).to.equal(req.hrId);
      existingExternalMeasureUuid = res.uuid;
    });

    it("should get a list of ExistingExternalMeasures", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/existing-external-measures`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one ExistingExternalMeasures", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/existing-external-measures/${existingExternalMeasureUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(existingExternalMeasureUuid);
    });

    it("should update one ExistingExternalMeasures", async () => {
      const req = {
        description: "new description",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/existing-external-measures/${existingExternalMeasureUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("description");
      expect(res.uuid).to.equal(existingExternalMeasureUuid);
      expect(res.description).to.equal(req.description);
    });

    it("should delete one ExistingExternalMeasures", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/existing-external-measures/${existingExternalMeasureUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("ODDs", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;

    let csaModeUuid;
    let csaModeUuid_2;
    let csaMotionUuid;
    let csaLoadUuid;
    let csaObstacleExposureUuid;

    let oddUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "MODE",
      });
      csaModeUuid = rr.res.uuid;

      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "MODE",
      });
      csaModeUuid_2 = rr.res.uuid;

      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "MOTION",
      });
      csaMotionUuid = rr.res.uuid;

      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "LOAD",
      });
      csaLoadUuid = rr.res.uuid;

      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "OBSTACLE_EXPOSURE",
      });
      csaObstacleExposureUuid = rr.res.uuid;
    });

    it("should create an ODD", async () => {
      const { req, res } = await helpers.createODD({
        headers,
        projectUuid,
        csaModeUuid,
        csaMotionUuid,
        csaLoadUuid,
        csaObstacleExposureUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hrId");
      expect(res.hrId).to.equal(req.hrId);
      oddUuid = res.uuid;
    });

    it("should get a list of ODDs", async () => {
      const res = await getWithHeaders(`${apiPrefix}/odds`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one ODDs", async () => {
      const res = await getWithHeaders(`${apiPrefix}/odds/${oddUuid}`, headers);

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(oddUuid);
    });

    it("should update one ODDs", async () => {
      const req = {
        csaModeUuid: csaModeUuid_2,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/odds/${oddUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("csaModeUuid");
      expect(res.uuid).to.equal(oddUuid);
      expect(res.csaModeUuid).to.equal(req.csaModeUuid);
    });

    it("should delete one ODDs", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/odds/${oddUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Hazard Types", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let hazardTypeUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;
    });

    it("should create a HazardType", async () => {
      const { req, res } = await helpers.createHazardType({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("value");
      expect(res.value).to.equal(req.value);
      hazardTypeUuid = res.uuid;
    });

    it("should get a list of HazardTypes", async () => {
      const res = await getWithHeaders(`${apiPrefix}/hazard-types`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one HazardType", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/hazard-types/${hazardTypeUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(hazardTypeUuid);
    });

    it("should update one HazardType", async () => {
      const req = {
        value: "updated value",
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/hazard-types/${hazardTypeUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("value");
      expect(res.uuid).to.equal(hazardTypeUuid);
      expect(res.value).to.equal(req.value);
    });

    it("should delete one HazardType", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/hazard-types/${hazardTypeUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Hazards", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let hazardTypeUuid;
    let hazardTypeUuid_2;
    let riskSeverityUuid;
    let hazardUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;

      // create risk severity
      rr = await helpers.createRiskSeverity({
        headers,
        projectUuid,
        standardUuid,
      });
      riskSeverityUuid = rr.res.uuid;

      // create hazard type
      rr = await helpers.createHazardType({
        headers,
        projectUuid,
        standardUuid,
      });
      hazardTypeUuid = rr.res.uuid;

      // create another hazard type
      rr = await helpers.createHazardType({
        headers,
        projectUuid,
        standardUuid,
      });
      hazardTypeUuid_2 = rr.res.uuid;
    });

    it("should create a Hazard", async () => {
      const { req, res } = await helpers.createHazard({
        headers,
        projectUuid,
        hazardTypeUuid,
        suggestedSeverityUuid: riskSeverityUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hazardTypeUuid");
      expect(res.hazardTypeUuid).to.equal(req.hazardTypeUuid);
      hazardUuid = res.uuid;
    });

    it("should get a list of Hazards", async () => {
      const res = await getWithHeaders(`${apiPrefix}/hazards`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one Hazard", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/hazards/${hazardUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(hazardUuid);
    });

    it("should update one Hazard", async () => {
      const req = {
        hazardTypeUuid: hazardTypeUuid_2,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/hazards/${hazardUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hazardTypeUuid");
      expect(res.uuid).to.equal(hazardUuid);
      expect(res.hazardTypeUuid).to.equal(req.hazardTypeUuid);
    });

    it("should delete one Hazard", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/hazards/${hazardUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("Guidewords", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let standardUuid_2;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;

      // create another standard
      rr = await helpers.createStandard({ headers });
      standardUuid_2 = rr.res.uuid;
    });

    it("should create a Guideword", async () => {
      const { req, res } = await helpers.createGuideword({
        headers,
        projectUuid,
        standardUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("standardUuid");
      expect(res.standardUuid).to.equal(req.standardUuid);
      guidewordUuid = res.uuid;
    });

    it("should get a list of Guidewords", async () => {
      const res = await getWithHeaders(`${apiPrefix}/guidewords`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one Guideword", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/guidewords/${guidewordUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(guidewordUuid);
    });

    it("should update one Guideword", async () => {
      const req = {
        standardUuid: standardUuid_2,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/guidewords/${guidewordUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("standardUuid");
      expect(res.uuid).to.equal(guidewordUuid);
      expect(res.standardUuid).to.equal(req.standardUuid);
    });

    it("should delete one Guideword", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/guidewords/${guidewordUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("HAZOPs", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let functionTaskUuid;
    let guidewordUuid_1;
    let guidewordUuid_2;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;

      // create function-task
      rr = await helpers.createFunctionTask({ headers, projectUuid });
      functionTaskUuid = rr.res.uuid;

      // create guideword
      rr = await helpers.createGuideword({
        headers,
        projectUuid,
        standardUuid,
      });
      guidewordUuid_1 = rr.res.uuid;

      // create another guideword
      rr = await helpers.createGuideword({
        headers,
        projectUuid,
        standardUuid,
      });
      guidewordUuid_2 = rr.res.uuid;
    });

    it("should create a HAZOP", async () => {
      const { req, res } = await helpers.createHAZOP({
        headers,
        projectUuid,
        functionTaskUuid,
        guidewordUuid: guidewordUuid_1,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("functionTaskUuid");
      expect(res.functionTaskUuid).to.equal(req.functionTaskUuid);
      hazopUuid = res.uuid;
    });

    it("should get a list of HAZOPs", async () => {
      const res = await getWithHeaders(`${apiPrefix}/hazops`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one HAZOP", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/hazops/${hazopUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(hazopUuid);
    });

    it("should update one HAZOP", async () => {
      const req = {
        guidewordUuid: guidewordUuid_2,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/hazops/${hazopUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("guidewordUuid");
      expect(res.uuid).to.equal(hazopUuid);
      expect(res.guidewordUuid).to.equal(req.guidewordUuid);
    });

    it("should delete one HAZOP", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/hazops/${hazopUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
  describe("HazardousEvents", () => {
    const headers = {};
    let organizationUuid;
    let projectUuid;
    let standardUuid;
    let functionTaskUuid;
    let guidewordUuid_1;
    let hazopUuid;
    let hazopUuid_2;

    let csaModeUuid;
    let csaMotionUuid;
    let csaLoadUuid;
    let csaObstacleExposureUuid;
    let oddUuid;

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

      // create an organization
      rr = await helpers.createOrganization({ headers });
      organizationUuid = rr.res.uuid;

      // create project
      rr = await helpers.createProject({ organizationUuid, headers });
      projectUuid = rr.res.uuid;

      // create standard
      rr = await helpers.createStandard({ headers });
      standardUuid = rr.res.uuid;

      // create function-task
      rr = await helpers.createFunctionTask({ headers, projectUuid });
      functionTaskUuid = rr.res.uuid;

      // create guideword
      rr = await helpers.createGuideword({
        headers,
        projectUuid,
        standardUuid,
      });
      guidewordUuid_1 = rr.res.uuid;

      // create HAZOP
      rr = await helpers.createHAZOP({
        headers,
        projectUuid,
        functionTaskUuid,
        guidewordUuid: guidewordUuid_1,
      });
      hazopUuid = rr.res.uuid;

      // create another HAZOP
      rr = await helpers.createHAZOP({
        headers,
        projectUuid,
        functionTaskUuid,
        guidewordUuid: guidewordUuid_1,
      });
      hazopUuid_2 = rr.res.uuid;

      // create CSAs
      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "MODE",
      });
      csaModeUuid = rr.res.uuid;

      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "MOTION",
      });
      csaMotionUuid = rr.res.uuid;

      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "LOAD",
      });
      csaLoadUuid = rr.res.uuid;

      rr = await helpers.createConsideredSituationalAttribute({
        headers,
        projectUuid,
        type: "OBSTACLE_EXPOSURE",
      });
      csaObstacleExposureUuid = rr.res.uuid;

      // create ODD
      rr = await helpers.createODD({
        headers,
        projectUuid,
        csaModeUuid,
        csaMotionUuid,
        csaLoadUuid,
        csaObstacleExposureUuid,
      });
      oddUuid = rr.res.uuid;
    });

    it("should create a HazardousEvent", async () => {
      const { req, res } = await helpers.createHazardousEvent({
        headers,
        projectUuid,
        hazopUuid,
        oddUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hazopUuid");
      expect(res.hazopUuid).to.equal(req.hazopUuid);
      hazardousEventUuid = res.uuid;
    });

    it("should get a list of HazardousEvents", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/hazardous-events`,
        headers
      );

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one HazardousEvent", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/hazardous-events/${hazardousEventUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(hazardousEventUuid);
    });

    it("should update one HazardousEvent", async () => {
      const req = {
        hazopUuid: hazopUuid_2,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/hazardous-events/${hazardousEventUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hazopUuid");
      expect(res.uuid).to.equal(hazardousEventUuid);
      expect(res.hazopUuid).to.equal(req.hazopUuid);
    });

    it("should delete one HazardousEvent", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/hazardous-events/${hazardousEventUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
});

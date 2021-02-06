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

  describe("HARAs", () => {
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

    let hazardousEventUuid;

    let hazardTypeUuid;

    let hazardUuid;

    let existingExternalMeasureUuid;

    let initialSeverityUuid;
    let finalSeverityUuid;

    let initialExposureUuid;
    let finalExposureUuid;

    let initialAvoidabilityUuid;
    let finalAvoidabilityUuid;

    let initialRiskClassUuid;
    let finalRiskClassUuid;

    let targetRiskReductionMeasureTypeUuid;

    let allocatedSILUuid;

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

      // risk severity
      rr = await helpers.createRiskSeverity({
        headers,
        projectUuid,
        standardUuid,
      });
      initialSeverityUuid = rr.res.uuid;
      rr = await helpers.createRiskSeverity({
        headers,
        projectUuid,
        standardUuid,
      });
      finalSeverityUuid = rr.res.uuid;

      // create hazard type
      rr = await helpers.createHazardType({
        headers,
        projectUuid,
        standardUuid,
      });
      hazardTypeUuid = rr.res.uuid;

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

      // hazardous event
      rr = await helpers.createHazardousEvent({
        headers,
        projectUuid,
        hazopUuid,
        oddUuid,
      });
      hazardousEventUuid = rr.res.uuid;

      // hazard
      rr = await helpers.createHazard({
        headers,
        projectUuid,
        hazardTypeUuid,
        suggestedSeverityUuid: initialSeverityUuid,
      });
      hazardUuid = rr.res.uuid;

      // existing external measure
      rr = await helpers.createExistingExternalMeasure({
        headers,
        projectUuid,
      });
      existingExternalMeasureUuid = rr.res.uuid;

      // risk exposure
      rr = await helpers.createRiskExposure({
        headers,
        projectUuid,
        standardUuid,
      });
      initialExposureUuid = rr.res.uuid;
      rr = await helpers.createRiskExposure({
        headers,
        projectUuid,
        standardUuid,
      });
      finalExposureUuid = rr.res.uuid;

      // risk avoidability
      rr = await helpers.createRiskAvoidability({
        headers,
        projectUuid,
        standardUuid,
      });
      initialAvoidabilityUuid = rr.res.uuid;
      rr = await helpers.createRiskAvoidability({
        headers,
        projectUuid,
        standardUuid,
      });
      finalAvoidabilityUuid = rr.res.uuid;

      // risk class
      rr = await helpers.createRiskClass({
        headers,
        projectUuid,
        standardUuid,
      });
      initialRiskClassUuid = rr.res.uuid;
      rr = await helpers.createRiskClass({
        headers,
        projectUuid,
        standardUuid,
      });
      finalRiskClassUuid = rr.res.uuid;

      // risk reduction measure type
      rr = await helpers.createRiskReductionMeasureType({
        headers,
        projectUuid,
      });
      targetRiskReductionMeasureTypeUuid = rr.res.uuid;

      // SIL
      rr = await helpers.createSIL({
        headers,
        projectUuid,
        standardUuid,
      });
      allocatedSILUuid = rr.res.uuid;

      // risk reduction measure
      rr = await helpers.createRiskReductionMeasure({
        headers,
        projectUuid,
        typeUuid: targetRiskReductionMeasureTypeUuid,
        targetSILUuid: allocatedSILUuid,
      });
      riskReductionMeasureUuid = rr.res.uuid;
    });

    it("should create a HARA", async () => {
      const { req, res } = await helpers.createHARA({
        headers,
        projectUuid,
        hazardousEventUuid,
        hazardUuid,
        existingExternalMeasureUuid,
        initialSeverityUuid,
        initialExposureUuid,
        initialAvoidabilityUuid,
        initialRiskClassUuid,
        targetRiskReductionMeasureTypeUuid,
        allocatedSILUuid,
        riskReductionMeasureUuid,
        finalSeverityUuid,
        finalExposureUuid,
        finalAvoidabilityUuid,
        finalRiskClassUuid,
      });

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("hazardousEventUuid");
      expect(res.hazardousEventUuid).to.equal(req.hazardousEventUuid);
      haraUuid = res.uuid;
    });

    it("should get a list of HARAs", async () => {
      const res = await getWithHeaders(`${apiPrefix}/haras`, headers);

      expect(res).to.haveOwnProperty("results");
      expect(res).to.haveOwnProperty("paging");
      expect(res.results.length).to.be.greaterThan(0);
    });

    it("should get one HARA", async () => {
      const res = await getWithHeaders(
        `${apiPrefix}/haras/${haraUuid}`,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res.uuid).to.equal(haraUuid);
    });

    it("should update one HARA", async () => {
      const req = {
        hazardousEventUuid,
        hazardUuid,
        existingExternalMeasureUuid,
        initialSeverityUuid,
        initialExposureUuid,
        initialAvoidabilityUuid,
        initialRiskClassUuid,
        targetRiskReductionMeasureTypeUuid,
        allocatedSILUuid,
        riskReductionMeasureUuid,
        finalSeverityUuid,
        finalExposureUuid,
        finalAvoidabilityUuid,
        finalRiskClassUuid,
      };

      const res = await patchWithHeaders(
        `${apiPrefix}/haras/${haraUuid}`,
        req,
        headers
      );

      expect(res).to.haveOwnProperty("uuid");
      expect(res).to.haveOwnProperty("finalRiskClassUuid");
      expect(res.uuid).to.equal(haraUuid);
      expect(res.finalRiskClassUuid).to.equal(req.finalRiskClassUuid);
    });

    it("should delete one HARA", async () => {
      const res = await deleteWithHeaders(
        `${apiPrefix}/haras/${haraUuid}`,
        headers
      );
      expect(res.status).to.equal(204);
    });
  });
});

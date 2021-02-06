/* eslint-env mocha */

// imports
const { expect } = require("chai");
const { execSync } = require("child_process");

// utils
const { getNoAuth, putNoAuth } = require("../utils");

const helpers = require("../helpers");

const serverOs = process.env.SERVER_OS || "macOs";

// begin tests
describe("Backend Initialization ", function () {
  this.timeout(500000);

  it("should initialize mysql database", () => {
    return new Promise((resolve, reject) => {
      try {
        let npmScript = "load-data";
        if (serverOs === "linux") {
          npmScript = "load-data-bash";
        }

        execSync(`npm run ${npmScript}`, {
          cwd: ".",
        });
        resolve(true);
      } catch (err) {
        console.error({ err });
        reject(err);
      }
    });
  });

  it("should check for backend running", async () => {
    const res = await getNoAuth(`/v1/utilities/health-check`);
    expect(res.status).to.equal("alive");
  });

  it("should run system test error", async () => {
    const suppress = true;
    const err = await getNoAuth(`/v1/utilities/system-test-error`, suppress);
    expect(err).to.have.property("statusCode");
    expect(err).to.have.property("enum");
    expect(err).to.have.property("message");
    expect(err.statusCode).to.equal(500);
    expect(err.enum).to.equal("SYSTEM_ERROR");
    expect(err.message).to.equal("This is a test error");
  });
  it("should have valid OpenAPI doc", async () => {
    // This request has a rather interesting side effect. The validate handler
    // calls `SwaggerParser.validate`, which dereferences the doc,
    // which means that after this request, `middleware.document` is
    // dereferenced. We don't rely on this, though.
    const res = await getNoAuth(`/v1/validate`);
    if (res.valid === false) {
      // console.log(JSON.stringify(res, null, 2));
      console.log(res);
      console.log(res.details);
    }
    expect(res.valid).to.be.true;
  });
  it("should register and login a user", async () => {
    // register  user
    const rr = await helpers.createUser({ gender: "FEMALE" });
    const userInfo = rr.req;
    expect(rr.res).to.haveOwnProperty("uuid");

    const req = {
      email: userInfo.email,
      password: userInfo.password,
    };
    // login  user
    const res = await putNoAuth(`/v1/users/actions/login`, req);
    expect(res).to.haveOwnProperty("user");
    expect(res).to.haveOwnProperty("token");
  });
});

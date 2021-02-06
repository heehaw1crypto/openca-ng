// setup example accounts, etc.

const helpers = require("../helpers");

// utils
const {
  getWithHeaders,
  patchWithHeaders,
  postWithHeaders,
  putNoAuth,
  deleteWithHeaders,
  putWithHeaders,
} = require("../utils");

const apiPrefix = "/v1";

const headers = {};
const headers2 = {};
let user1;
let user2;

let rr, req, res;

async function main() {
  // first  user account and login
  rr = await helpers.createUser({ gender: "FEMALE" });
  req = {
    email: rr.req.email,
    password: rr.req.password,
  };
  res = await putNoAuth(`${apiPrefix}/users/actions/login`, req);
  user1 = { ...res.user };
  user1.token = res.token;
  headers["Authorization"] = `Bearer ${user1.token}`;

  // second  user account and login
  rr = await helpers.createUser({ gender: "MALE" });
  req = {
    email: rr.req.email,
    password: rr.req.password,
  };
  res = await putNoAuth(`${apiPrefix}/users/actions/login`, req);
  user2 = { ...res.user };
  user2.token = res.token;
  headers2["Authorization"] = `Bearer ${user2.token}`;

  console.log("SETUP COMPLETE");
  console.log({
    user1,
    user2,
  });
}

main();

const moment = require("moment");
const uuid = require("uuid");
const qs = require("qs");

const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const { postWithHeaders, putNoAuth, uploadWithHeaders } = require("./utils");

const { generateUser } = require("./userUtils");

const apiPrefix = "/v1/user-api";

const makeCounter = (initialValue = 0) => {
  let count = initialValue;
  return () => {
    count += 1;
    return count;
  };
};

const userCounter = makeCounter();
exports.createUser = async (input = { gender: null }) => {
  const count = userCounter();

  let thisGender = input.gender;
  if (!thisGender) {
    thisGender = count % 2 == 0 ? "FEMALE" : "MALE";
  }

  const info = generateUser({ gender: thisGender });

  const req = _.pick(info, [
    "firstName",
    "lastName",
    "username",
    "email",
    "password",
  ]);

  const res = await putNoAuth(`${apiPrefix}/users/actions/register`, req);
  return { req, res };
};

const organizationCounter = makeCounter((initialValue = 10000));
exports.createOrganization = async ({ headers }) => {
  const count = organizationCounter();

  const req = {
    name: `Organization ${count}`,
    description: null,
    siteUrl: null,
    logoUrl: null,
    isEnabled: true,
  };

  const res = await postWithHeaders(`${apiPrefix}/organizations`, req, headers);
  return { req, res };
};

const addressCounter = makeCounter();
exports.createAddress = async ({ organizationUuid, headers }) => {
  const count = addressCounter();

  const req = {
    street1: `${count * 100} 14th Ave.`,
    street2: `Suite ${count}`,
    city: "New York",
    state: "New York",
    postalCode: "10001",
    country: "US",
  };

  const res = await postWithHeaders(
    `${apiPrefix}/organizations/${organizationUuid}/addresses`,
    req,
    headers
  );
  return { req, res };
};

const moment = require("moment");
const uuid = require("uuid");
const qs = require("qs");

const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const { postWithHeaders, putNoAuth, uploadWithHeaders } = require("./utils");

const { generateUser } = require("./userUtils");

const apiPrefix = "/v1/global-admin-api";

const makeCounter = (initialValue = 0) => {
  let count = initialValue;
  return () => {
    count += 1;
    return count;
  };
};

exports.loginGlobalAdmin = async () => {
  const req = {
    username: "gadmin",
    password: "69c5ncWxZWXVVA3N",
  };

  const res = await putNoAuth(`/v1/user-api/users/actions/login`, req);

  return { req, res };
};

const pkiCounter = makeCounter();
exports.createPKI = async ({ headers }) => {
  const count = pkiCounter();

  const req = {
    name: `PKI ${count}`,
    description: null,
    siteUrl: null,
    logoUrl: null,
    policyName: null,
    policyUrl: null,
    isEnabled: true,
  };

  const res = await postWithHeaders(`${apiPrefix}/pkis`, req, headers);
  return { req, res };
};

const certificateAuthorityCounter = makeCounter();
exports.createCertificateAuthority = async ({ pkiUuid, headers }) => {
  const count = certificateAuthorityCounter();

  const req = {
    pkiUuid,
    name: `CA ${count}`,
    description: "description here",
    status: "ENABLED",
    isRoot: true,
  };

  const res = await postWithHeaders(
    `${apiPrefix}/certificate-authorities`,
    req,
    headers
  );

  return { req, res };
};

const organizationCounter = makeCounter();
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

exports.createCertificateTokenForCertificateAuthority = async ({
  certificateAuthorityUuid,
  issuerCertificateAuthorityUuid,
  headers,
}) => {
  const thirtyDaysFromNow = moment().unix() + 3600 * 24 * 30;

  const req = {
    issuerCertificateAuthorityUuid,
    standard: "X509",
    key: "KEY",
    cert: "CERT",
    caOwned: true,
    expires: thirtyDaysFromNow,
  };

  const res = await postWithHeaders(
    `${apiPrefix}/certificate-authorities/${certificateAuthorityUuid}/certificate-tokens`,
    req,
    headers
  );

  return { req, res };
};

exports.createCertificateTokenForOrganization = async ({
  organizationUuid,
  issuerCertificateAuthorityUuid,
  headers,
}) => {
  const thirtyDaysFromNow = moment().unix() + 3600 * 24 * 30;

  const req = {
    issuerCertificateAuthorityUuid,
    standard: "X509",
    key: "KEY",
    cert: "CERT",
    caOwned: true,
    expires: thirtyDaysFromNow,
  };

  const res = await postWithHeaders(
    `${apiPrefix}/organizations/${organizationUuid}/certificate-tokens`,
    req,
    headers
  );

  return { req, res };
};

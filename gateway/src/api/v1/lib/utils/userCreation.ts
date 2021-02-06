import * as uuid from "uuid";
import * as _ from "lodash";

import dbService from "../../../../services/dbService";

import dbSdk from "../../../../services/dbServiceV2";

// libs
import { createError } from "./createError";

export const checkUsername = async ({ username, correlationId }) => {
  // skip if username is null
  if (!username) return;

  // const userList = await dbService.getUserList(
  //   { $where: { username, valid: true } },
  //   { correlationId }
  // );

  const userList = await dbSdk.getUserList(
    { $where: { username, valid: true } },
    { correlationId }
  );

  if (userList.length) {
    throw createError({
      statusCode: 400,
      errorEnum: "USERNAME_TAKEN",
      message: `The username ${username} is already in use.`,
    });
  }
};

export const checkUserEmail = async ({ email, correlationId }) => {
  // skip if email is null
  if (!email) return;

  // const userList = await dbService.getUserList(
  //   { $where: { email, valid: true } },
  //   { correlationId }
  // );

  const userList = await dbSdk.getUserList(
    { $where: { email, valid: true } },
    { correlationId }
  );

  if (userList.length) {
    throw createError({
      statusCode: 400,
      errorEnum: "EMAIL_TAKEN",
      message: `The email ${email} is already in use.`,
    });
  }
};

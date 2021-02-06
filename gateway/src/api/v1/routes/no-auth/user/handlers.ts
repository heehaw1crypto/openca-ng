import * as uuid from "uuid";
import * as crypto from "crypto";
import * as _ from "lodash";

import * as config from "../../../../../configuration";

import dbSdk from "../../../../../services/dbServiceV2";

// libs
import * as loader from "../../../lib/loaders/users";

import { createError, ErrorType } from "../../../lib/utils/createError";

import { createUserToken } from "../../../lib/utils/jwtTokens";

import { checkUserEmail, checkUsername } from "../../../lib/utils/userCreation";

export const registerUser = async (req, res, next) => {
  const correlationId = req.headers[config.system.headerNames.correlationId];

  const creator = req.creator;

  const { username, email, password } = req.body;

  const usernameFinal = username.toLowerCase();

  // check for duplicate username, email, phone
  try {
    await checkUsername({ username: usernameFinal, correlationId });
    await checkUserEmail({ email, correlationId });
  } catch (err) {
    return next(err);
  }

  const hashedPw = crypto.createHash("sha256").update(password).digest("hex");

  const roleList = await dbSdk.getRoleList(
    {
      $where: { enum: "USER", valid: true },
    },
    { fields: ["id", "enum"] }
  );

  if (!roleList.length) {
    throw new Error("Role USER not found in system.");
  }

  const role = roleList[0];

  const record = await dbSdk.postUser(
    {
      ...req.body,
      email,
      username: usernameFinal,
      password: hashedPw,
      primaryRoleEnum: role.enum,
      primaryRoleId: role.id,
      creator,
    },
    { fields: ["id", "uuid"] }
  );

  await dbSdk.postUserRole({
    userId: record.id!,
    roleId: role.id!,
    creator,
  });

  const out = await dbSdk.getUser(
    { uuid: record.uuid! },
    { fields: loader.getFieldsList() }
  );

  return res.status(201).json(out);
};

export const loginUser = async (req, res, next) => {
  const { password, email, username } = req.body;

  const hashedPw = crypto.createHash("sha256").update(password).digest("hex");

  let userUuidList: string[] = [];

  if (username) {
    const usernameLower = username.toLowerCase();

    const userList = await dbSdk.getUserList(
      {
        $where: { username: usernameLower, valid: true },
      },
      { fields: ["id", "uuid"] }
    );

    if (!userList.length) {
      return next(createError(ErrorType.UNAUTHORIZED));
    }
    userUuidList = userList.map((x) => x.uuid!);
  }

  if (email) {
    const userList = await dbSdk.getUserList(
      {
        $where: { email, archived: false, valid: true },
      },
      { fields: ["id", "uuid"] }
    );

    if (!userList.length) {
      return next(createError(ErrorType.UNAUTHORIZED));
    }
    userUuidList = userList.map((x) => x.uuid!);
  }

  const userList = await dbSdk.getUserList(
    {
      $where: {
        uuid: { $in: userUuidList },
        password: hashedPw,
        valid: true,
      },
    },
    { fields: ["id", "uuid"] }
  );

  if (!userList.length) {
    return next(createError(ErrorType.UNAUTHORIZED));
  }

  const user = await dbSdk.getUser(
    { uuid: userList[0].uuid! },
    { fields: loader.getFieldsList() }
  );

  const { token, tokenExpires } = createUserToken({
    userInfo: { uuid: user.uuid, email: user.email },
  });

  const out = { user, token, tokenExpires };

  return res.status(200).json(out);
};

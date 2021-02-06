// services
import dbSdk from "../../../../../services/dbServiceV2";

// tokens
import { decodeUserToken } from "../../utils/jwtTokens";

export default async (req, res, next) => {
  const { authorization } = req.headers;

  const token =
    (authorization && authorization.replace("Bearer ", "")) ||
    req.headers["x-access-token"];

  if (!token) {
    return next();
  }

  let record: any;

  try {
    const userInfo = decodeUserToken({ token });
    record = await dbSdk.getUser(
      { uuid: userInfo.uuid },
      { fields: ["id", "uuid"] }
    );
  } catch (err) {
    // invalid token or user not found
    return next();
  }

  // attach user
  req.user = record;
  req.creator = record.uuid;

  return next();
};

import * as jwt from "jwt-simple";
import * as moment from "moment";

import * as config from "../../../../configuration";

export const createUserToken = ({ userInfo }) => {
  const exp = moment().add(config.jwt.user.expiration, "second").valueOf();

  const token = jwt.encode(
    {
      sub: JSON.stringify(userInfo),
      iat: Date.now(),
      exp,
    },
    config.jwt.user.secret
  );

  return {
    token,
    tokenExpires: exp,
    expiresIn: exp - moment().valueOf(),
  };
};

export const decodeUserToken = ({ token }) => {
  const decoded = jwt.decode(token, config.jwt.user.secret);
  const userInfo = JSON.parse(decoded.sub);
  return userInfo;
};

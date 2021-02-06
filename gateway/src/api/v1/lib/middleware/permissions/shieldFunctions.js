const { ErrorType, createError } = require("../../utils/createError");

function or(...rules) {
  return (req, res, next) => {
    return Promise.all(rules.map((r) => r(req, res, next))).then(
      (resultArray) => {
        let result = true;
        if (resultArray.every((r) => r !== true)) {
          result = false;
        }
        return result;
      }
    );
  };
}

function and(...rules) {
  return (req, res, next) =>
    Promise.all(rules.map((r) => r(req, res, next))).then((resultArray) => {
      let result = true;
      if (resultArray.some((r) => r !== true)) {
        result = false;
      }
      return result;
    });
}

function authShield(logicStatement) {
  return async (req, res, next) => {
    const result = await logicStatement(req, res, next);
    if (result) {
      next();
    } else {
      next(createError(ErrorType.UNAUTHORIZED));
    }
  };
}

/**
 * Example authorization function
 * @param {*} req Express `req`
 * @returns {Promise} Promise that resolves to a boolean
 */
async function isAuthorized(req) {
  return true;
}

async function isUnauthorized(req) {
  return false;
}

module.exports = {
  or,
  and,
  authShield,
  isAuthorized,
  isUnauthorized,
};

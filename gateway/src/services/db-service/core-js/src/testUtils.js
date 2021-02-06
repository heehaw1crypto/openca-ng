const jsonFetch = require("./jsonFetch");
const generateToken = require("./generateToken");

let exp = new Date();
exp.setMinutes(exp.getMinutes() + 5);

// This is a thunk because otherwise TOKEN_SECRET needs to be
// set just to import this module.
function getHeaders() {
  return {
    Authorization: "Bearer " + generateToken(1, undefined, exp)
  };
}

// Export so it's easy to customize as needed e.g.
// let headers = Object.assign({}, testUtils.getHeaders());
// headers["x-user-uuid"] = "foo";
// headers["Authorization"] = undefined;
module.exports.getHeaders = getHeaders;

module.exports.api = function api(url, opts = {}) {
  return jsonFetch(
    process.env.SERVICE_BASE_URL + url,
    Object.assign({}, opts, {
      headers: Object.assign({}, getHeaders(), opts.headers)
    })
  );
};

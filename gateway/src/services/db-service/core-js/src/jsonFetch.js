const fetch = require("node-fetch");

module.exports = async function jsonFetch(url, opts = {}) {
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
  opts.headers = opts.headers
    ? Object.assign({}, defaultHeaders, opts.headers)
    : defaultHeaders;
  opts.body = opts.body !== undefined ? JSON.stringify(opts.body) : undefined;

  return fetch(url, opts);
};

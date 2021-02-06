module.exports = function error(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  // Delegate to Express's default error handler
  // http://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json(err);
};

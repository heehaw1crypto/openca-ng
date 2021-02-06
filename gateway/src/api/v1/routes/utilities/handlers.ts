export const runHealthCheck = async (req, res, next) => {
  return res.json({ status: "alive" });
};

export const testSystemError = async (req, res, next) => {
  throw new Error("This is a test error");
};

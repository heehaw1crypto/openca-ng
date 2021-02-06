export const isUuidString = (value) => {
  if (typeof value !== "string") return false;

  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return pattern.test(value);
};

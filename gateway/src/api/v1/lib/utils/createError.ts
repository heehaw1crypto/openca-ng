const moment = require("moment");

export const ErrorType = {
  UNAUTHORIZED: {
    statusCode: 401,
    errorEnum: "UNAUTHORIZED",
    message: "Not allowed.",
  },
  FORBIDDEN: {
    statusCode: 403,
    errorEnum: "FORBIDDEN",
    message: "Forbidden.",
  },
  DUPLICATE_HR_ID: {
    statusCode: 400,
    errorEnum: "DUPLICATE_HR_ID",
    message: "Human-readable ID has already been used.",
  },
  DUPLICATE_ENUM: {
    statusCode: 400,
    errorEnum: "DUPLICATE_ENUM",
    message: "Enum has already been used.",
  },
  BAD_QUERY_PARAMETER: {
    statusCode: 400,
    errorEnum: "BAD_QUERY_PARAMETER",
    message: "An invalid query parameter value was supplied.",
  },
  DUPLICATE_MESSAGE_ID: {
    statusCode: 420,
    errorEnum: "DUPLICATE_MESSAGE_ID",
    message: "This message has already been received.",
  },
  UPDATE_FAILED: {
    statusCode: 500,
    errorEnum: "UPDATE_FAILED",
    message: "Update failed.",
  },
  DELETE_FAILED: {
    statusCode: 500,
    errorEnum: "DELETE_FAILED",
    message: "Delete failed.",
  },
  USER_NOT_VERIFIED: {
    statusCode: 401,
    errorEnum: "USER_NOT_VERIFIED",
    message: "User is not verified. Look for or resend verification email.",
  },
  COLLISION_DETECTED: {
    statusCode: 409,
    errorEnum: "COLLISION_DETECTED",
    message: "A collision has been detected. Unable to resolve unique entity.",
  },
  RESOURCE_NOT_FOUND: {
    statusCode: 404,
    errorEnum: "RESOURCE_NOT_FOUND",
    message: "A resource was not found. Verify the identifier.",
  },
};

export const createError = (
  {
    statusCode,
    errorEnum,
    message,
  }: {
    statusCode: number;
    errorEnum: string;
    message?: string;
  },
  wasThrown: boolean = false,
  stack?: object
) => {
  return {
    statusCode,
    enum: errorEnum,
    message,
    timestamp: moment().unix(),
    wasThrown,
    stack: process.env.NODE_ENV === "production" ? null : stack,
  };
};

module.exports = {
  port: process.env.PORT || 8000,
  info: {
    companyAddress:
      process.env.COMPANY_ADDRESS ||
      "858 Coal Creek Circle Louisville, CO 80027",
    companyName: process.env.COMPANY_NAME || "OpenCA Labs",
    helpUrl: process.env.HELP_URL || "https://openca.org",
    productName: process.env.PRODUCT_NAME || "OpenCA NG",
    productUrl: process.env.PRODUCT_URL || "https://openca.org",
  },
  jwt: {
    user: {
      secret: process.env.USER_TOKEN_SECRET || "USER_TOKEN_SECRET",
      expiration: process.env.USER_TOKEN_EXPIRATION || 3600 * 24 * 30,
    },
  },
  database: {
    mysql: {
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "root",
      host: process.env.DB_HOST || "0.0.0.0",
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || "OpenCA_NG",
    },
  },
  system: {
    resourceListLimit: 200,
    maxRecursionDepth: 100,
    headerNames: {
      correlationId: "x-correlation-id",
    },
    apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8000",
  },
  socketio: {
    port: process.env.SOCKET_IO_PORT || 8001,
  },
  openapi: {
    v1: {
      title: process.env.OPENAPI_TITLE || "API",
      description: process.env.OPENAPI_DESCRIPTION || "API",
      version: process.env.OPENAPI_VERSION || "1.0.0",
    },
  },
};

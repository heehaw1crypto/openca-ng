const http = require("http");
const fullApp = require("./app");

// const { socketIo } = require("./lib/realtime");
const configuration = require("./configuration");

const port = configuration.port;
const socketIoPort = configuration.socketio.port;

// @ts-ignore
Error.prototype.id = "0";

const httpServer = http.createServer(fullApp);
// socketIo.attach(httpServer, {
//   pingInterval: 10000,
//   pingTimeout: 5000,
//   cookie: false,
// });

httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on ${port}`);
  // eslint-disable-next-line no-console
  console.log(`PID: ${process.pid}`);
});

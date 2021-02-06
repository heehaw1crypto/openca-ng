const io = require("socket.io")({ path: "/socket.io", serveClient: false });

const { decodeUserToken } = require("../api/v1/lib/utils/jwtTokens");

// check user token middleware
io.use(async (socket, next) => {
  const { token } = socket.handshake.query;

  if (!token) {
    return next(new Error("Need to provide a token query parameter."));
  }

  try {
    decodeUserToken({ token });
  } catch (err) {
    return next(new Error("Client not authorized to access socket.io"));
  }

  return next();
});

// user namespace

const usersNamespace = io.of("/users");

usersNamespace.use((socket, next) => {
  const { token } = socket.handshake.query;

  const userInfo = decodeUserToken({ token });

  // attach user info
  socket.userInfo = userInfo;

  return next();
});

usersNamespace.on("connect", (socket) => {
  const { userInfo } = socket;

  const userUuid = userInfo.uuid;

  console.log(`User ${userUuid} (${userInfo.email}) connected to /users`);

  // assign socket to userUuid room
  const room = userUuid;
  socket.join(room);

  // setup diconnect handler
  socket.on("disconnect", () => {
    console.log(
      `User ${userUuid} (${userInfo.email}) disconnected from /users`
    );
  });
});

module.exports = {
  socketIo: io,
  socketIoUsers: usersNamespace,
};

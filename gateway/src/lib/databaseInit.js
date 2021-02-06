const dbSdk = require("../services/dbServiceV2").default;

function timeout(timeMs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done");
    }, timeMs);
  });
}

async function connectSDK(dbSdk, name, count) {
  try {
    await dbSdk.getRoleList({});
    console.log(`${name} Connected`);
    return;
  } catch (err) {
    console.error(`${name} Connection Failed`);
    if (count > 1000) return;
    await timeout(2000);
    return await connectSDK(dbSdk, name, count + 1);
  }
}

const initDb = () => {
  connectSDK(dbSdk, "DB SDK", 0);
};

module.exports = initDb;

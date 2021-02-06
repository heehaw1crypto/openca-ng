import SDK from "./db-service/sdk-direct";
import * as config from "../configuration/index";

export default new SDK({ ...config.database.mysql, loggingMode: "none" });

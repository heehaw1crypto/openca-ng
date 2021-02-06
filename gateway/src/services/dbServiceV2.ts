import { SDK } from "./db-service-v2/sdk-ts"
import * as config from "../configuration/index";

// debug options: debug: ["ComQueryPacket"], debug: ["RowDataPacket"]
export default new SDK({ dialect: "mysql", driverOpts: { ...config.database.mysql, debug: [] } })

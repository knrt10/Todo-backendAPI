/**
 * This file stores info for api, db, keys, logs
 * @constant Config
 */
export const Config = {
  apiSettings: {
    host: process.env.API_HOST || "localhost",
  },
  dbSettings: {
    authEnabled: process.env.MONGO_AUTH || false,
    localDatabase: false,
    dockerconnectionString: process.env.MONGO_DB_HOST_DOCKER || "mongodb:27017",
    connectionString: process.env.MONGO_DB_HOST || "localhost:27017",
    database: process.env.DATABASE || "todoapp",
    password: process.env.MONGO_AUTH_PASSWORD,
    username: process.env.MONGO_AUTH_USERNAME,
  },
  serviceSettings: {
    logsDir: "logs/",
    env: process.env.environment || "local",
  },
  secretKeys: {
    jwtSecret: process.env.SECRET || "yes1234$ASDASD/SA",
    cryptoSecret: process.env.CRYPTO || "DASD2233312S;!`W21",
  },
};

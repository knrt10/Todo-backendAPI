/**
 * This file stores info for api, db, keys, logs
 * @constant Config
 */
export const Config = {
  apiSettings: {
    host: process.env.API_HOST || "localhost",
  },
  dbSettings: {
    authEnabled: process.env.POSTGRESS_AUTH || false,
    localDatabase: true,
    dockerconnectionString: process.env.POSTGRESS_DB_HOST_DOCKER || "postgres",
    connectionString: process.env.POSTGRESS_DB_HOST || "localhost",
    database: process.env.DATABASE || "hasura",
    password: process.env.POSTGRESS_AUTH_PASSWORD || "knrt10",
    username: process.env.POSTGRESS_AUTH_USERNAME || "knrt10",
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

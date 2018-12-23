import { Config } from "../shared";
export function databaseString(): string {
  let infoString: string;
  if (Config.dbSettings.authEnabled) {
    infoString = "postgres://" + Config.dbSettings.username + ":" + Config.dbSettings.password + "@"
      + Config.dbSettings.connectionString + "/" + Config.dbSettings.database;
  } else if (Config.dbSettings.localDatabase) {
    infoString = "postgres://" + Config.dbSettings.connectionString + "/" + Config.dbSettings.database;
  } else {
    infoString = "postgres://" + Config.dbSettings.username + ":" + Config.dbSettings.password + "@"
      + Config.dbSettings.dockerconnectionString + "/" + Config.dbSettings.database;
  }
  return infoString;
}

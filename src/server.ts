"use strict";
/*
  Import modules
*/
import bluebird = require("bluebird");
import bodyParser = require("body-parser");
import cors = require("cors");
import express = require("express");
import fs = require("fs");
import mongoose = require("mongoose");

// Importing Routes

import { Config } from "./shared";
global.Promise = bluebird;
mongoose.Promise = global.Promise;

/**
 * @exports Hasura
 * @class
 * @method startServer
 * @method initEnv
 * @method initWinston
 * @method initExpress
 * @method initCORS
 * @method initAppRoutes
 * @method initServices
 */
export class Hasura {
  public infoString: string;
  public port: any;
  private pkg = require("../package.json"); // information about package version
  private winston: any = require("winston"); // for logging
  private app: any; // express server
  constructor(private portGiven) {
    if (Config.dbSettings.authEnabled) {
      this.infoString = "mongodb://" + Config.dbSettings.username + ":" + Config.dbSettings.password + "@"
        + Config.dbSettings.connectionString + "/" + Config.dbSettings.database;
    } else if (Config.dbSettings.localDatabase) {
      this.infoString = "mongodb://" + Config.dbSettings.connectionString + "/" + Config.dbSettings.database;
    } else {
      this.infoString = "mongodb://" + Config.dbSettings.dockerconnectionString + "/" + Config.dbSettings.database;
    }
    this.port = portGiven;
  }

  /**
   * This starts express server
   * @method startServer @public
   */
  public startServer() {
    this.initEnv().then(() => {
      // logs/ Folder already
      // Initilatizing the winston as per documentation
      this.initWinston();

      this.initServices().then(() => {

        // start the express server(s)
        this.initExpress();

        // all done
        this.winston.info(this.pkg.name + " startup sequence completed", {
          version: this.pkg.version,
        });
      });
    });
  }

  /**
   * This setups the log folder and any other environment needs
   * @method initEnv @private
   * @returns {Promise<void>}
   */
  private initEnv(): Promise<void> {
    return new Promise<void>((resolve) => {
      const logPath: string = Config.serviceSettings.logsDir;
      fs.stat(logPath, (err) => {
        resolve();
      });
    });
  }

  /**
   * This Initilatizes the winston
   * @method initWinston @private
   */
  private initWinston() {
    // winston is configured as a private variable to the main app.ts
    // it can then be spread to child modules or routeModules. This way only one winston object needs to be setup
    this.winston.remove(this.winston.transports.Console);
    this.winston.add(this.winston.transports.Console, {
      colorize: true,
      prettyPrint: true,
      timestamp: true,
    });

    this.winston.add(this.winston.transports.File, {
      name: "error",
      level: "error",
      filename: "logs/error.log",
      maxsize: 10485760,
      maxFiles: "10",
      timestamp: true,
    });
    this.winston.add(this.winston.transports.File, {
      name: "warn",
      level: "warn",
      filename: "logs/warn.log",
      maxsize: 10485760,
      maxFiles: "10",
      timestamp: true,
    });
    this.winston.add(this.winston.transports.File, {
      name: "info",
      level: "info",
      filename: "logs/info.log",
      maxsize: 10485760,
      maxFiles: "10",
      timestamp: true,
    });
    this.winston.add(this.winston.transports.File, {
      name: "verbose",
      level: "verbose",
      filename: "logs/verbose.log",
      maxsize: 10485760,
      maxFiles: "10",
      timestamp: true,
    });

    this.winston.info("Winston has been init");
  }

  /**
   * This Initilatizes express server
   * @method initExpress @private
   */
  private initExpress() {
    // create express
    this.app = express();
    this.initCORS();
    // make express use the bodyParser for json middleware
    this.app.use(bodyParser.json({}));

    // add in any routes you might want
    this.initAppRoutes();

    // and start!
    this.app.listen(this.port);
    this.winston.info("Express started on (http://localhost:" + this.port + "/)");
  }

  /**
   * This Initilatizes cors package
   * @method initCORS @private
   */
  private initCORS() {
    this.app.use(cors());
  }

  /**
   * This Initilatizes routes for server
   * @method initAppRoutes @private
   */
  private initAppRoutes() {

    this.app.get("/", (req, res) => {
      res.status(200).send("Yep this check route is working");
    });
  }

  /**
   * This Initilatizes services we want if expanding the application
   * @method initServices @private
   * @returns {Promise<boolean>}
   */
  private initServices(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // connect to mongodb
      mongoose.connect(this.infoString, { useNewUrlParser: true }).then(() => {
        this.winston.info("Mongo Connected!");
        resolve(true);
      });
    });
  }
}

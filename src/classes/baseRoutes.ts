import express = require("express");
import winston = require("winston");
import { Response } from "../models";

/**
 * This is a base class for routes
 * @class
 * @method getRoutes
 * @method initRoutes
 */
export class BaseRoutes {
  protected router: express.Router = express.Router();

  public constructor(protected winston: winston) {
    this.initRoutes();
  }

  /**
   * This returns epress router
   * @method
   * @returns {express.Router}
   */
  public getRoutes(): express.Router {
    return this.router;
  }

  /**
   * This method intitializes routes
   * @method initRoutes
   */
  protected initRoutes() {
    //
  }

  /**
   * This method completes request
   * @param {promise}
   * @param {res}
   */
  protected completeRequest(promise: Promise<Response>, res: express.Response): void {
    promise.then((response) => {
      res.status(response.code).send(response);
    }).catch((errorRes) => {
      res.status(errorRes.code).send(errorRes);
    });
  }
}

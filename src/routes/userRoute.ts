import express = require("express");
import { BaseRoutes } from "../classes";
import { Response } from "../models";

export class UserRoutes extends BaseRoutes {

  protected initRoutes() {
    this.router.route("/").get((req, res) => this.homePageUser(req, res));
  }

  private homePageUser(req: express.Request, res: express.Response) {
    const promise: Promise<Response> = new Promise((resolve) => {
      resolve(new Response(200, "Successfull Response", {
        msg: "User home page route working correctly",
      }));
    });

    this.completeRequest(promise, res);
  }
}

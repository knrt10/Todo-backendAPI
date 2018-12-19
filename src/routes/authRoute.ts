import express = require("express");
import jwt = require("jsonwebtoken");
import { model } from "mongoose";
import winston = require("winston");
import { BaseRoutes } from "../classes";
import { Response } from "../models";
import { UserSchema } from "../schemas";
import { Config } from "../shared";

const User = model("User", UserSchema);

export class AuthRoutes extends BaseRoutes {

  public constructor(protected winston: winston) {
    super();
    this.initRoutes();
  }
  protected initRoutes() {
    this.router.route("/login").post((req, res, next) => this.loginUser(req, res, next));
  }

  /**
   * This is route for logging user
   * @param req
   * @param res
   */
  private loginUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const promise: Promise<Response> = new Promise<Response>((resolve, reject) => {

      if (!req.body.username || !req.body.password) {
        res.send(new Response(200, "Please enter both field {username} and {password}", {
          success: false,
        }));
        return next();
      }
      // Getting data from req.body
      const username = req.body.username;
      const secret: any = Config.secretKeys.jwtSecret;
      // Searching for User in database
      User.findOne({username}).select("password").then((user: any) => {
        if (!user) {
          reject(new Response(200, "Sorry, No user found", {
            success: false,
          }));
        } else {
          if (!user.validPassword(req.body.password)) {
            reject(new Response(200, "Incorrect Password", {
              success: false,
            }));
          } else {
            const token = jwt.sign({ id: user._id }, secret, {
              expiresIn: "23h",
            });

            resolve(new Response(200, "Successful response", {
              success: true,
              user,
              token,
            }));
          }
        }
      });
    });

    this.completeRequest(promise, res);
  }

}

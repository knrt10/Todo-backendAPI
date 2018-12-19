import express = require("express");
import jwt = require("jsonwebtoken");
import { model } from "mongoose";
import winston = require("winston");
import { BaseRoutes } from "../classes";
import { IUser } from "../interfaces";
import { Response } from "../models";
import { UserSchema } from "../schemas";
import { Config } from "../shared";

const User = model("User", UserSchema);

export class UserRoutes extends BaseRoutes {

  public constructor(protected winston: winston) {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.route("/register").post((req, res) => this.registerUser(req, res));
  }

  /**
   * This is route for registering user in database
   * @param req
   * @param res
   */
  private registerUser(req: express.Request, res: express.Response) {
    const promise: Promise<Response> = new Promise<Response>((resolve, reject) => {

      const secret: any = Config.secretKeys.jwtSecret;
      // getting data from req.body
      const username = String(req.body.username).trim();

      if (!username || !req.body.username || !req.body.name) {
        resolve(new Response(200, "Please fill both username and name", {
          success: false,
        }));
      } else if (username.length < 4 || req.body.name.trim().length < 4) {
        resolve(new Response(200, "Username and name should be contain atleast 4 characters", {
          success: false,
        }));
      } else {
        const name = req.body.name.trim();
        User.findOne({ username }).then((user: any) => {
          if (user !== null) {
            resolve(new Response(200, "username already in use", {
              success: false,
            }));
          } else {
            const newUser: any = new User({
              username,
              name,
            });
            // generating new hashed password
            newUser.password = newUser.generateHash(req.body.password);
            newUser.save().then((user: IUser) => {

              const token = jwt.sign({ id: user._id }, secret, {
                expiresIn: "23h",
              });

              resolve(new Response(200, "Successful response", {
                success: true,
                user,
                token,
              }));
            });
          }
        });
      }
    });

    this.completeRequest(promise, res);
  }
}

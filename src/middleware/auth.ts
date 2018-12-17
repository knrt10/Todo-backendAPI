import express = require("express");
import jwt = require("jsonwebtoken");
import { model } from "mongoose";
import { Authenticated } from "../interfaces";
import {Response} from "../models";
import {UserSchema} from "../schemas";
import {Config} from "../shared";
const User = model("User", UserSchema);

/**
 * This is middleware to validate jwt token.
 * @param req
 * @param res
 * @param next
 */
export const isAuthenticated = (req: Authenticated, res: express.Response, next: express.NextFunction) => {

  const token: any = req.headers["x-access-token"];
  const secret: any = Config.secretKeys.jwtSecret;
  if (!token) {
    return res.send(new Response(403, "Auth token missing", {
      success: false,
    }));
  } else {
    // verify jwt token
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.send(new Response(500, "Unable to authenticate user", {
          success: false,
        }));
      } else {
        User.findById(decoded.id).select("password").then((user) => {
          req.user = user;
          next();
        });
      }
    });
  }
};

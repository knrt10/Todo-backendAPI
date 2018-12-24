import jwt = require("jsonwebtoken");
import { model } from "mongoose";
import { completeRequest } from "../functions/complete";
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
export async function isAuthenticated(context) {
  const promise: Promise<Response> = new Promise((resolve, reject) => {
    const token: any = context.headers["x-access-token"];
    const secret: any = Config.secretKeys.jwtSecret;
    if (!token) {
      reject(new Response(403, "Auth token missing", {
        success: false,
      }));
    } else {
      // verify jwt token
      if (token) {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            reject(new Response(500, "Unable to authenticate user", {
              success: false,
            }));
          } else {
            User.findById(decoded.id).select("password").then((user) => {
              resolve(new Response(200, "Successfull Response", {
                success: true,
                user,
                token,
              }));
            });
          }
        });
      }
    }
  });
  const val = await completeRequest(promise);
  return val;
}

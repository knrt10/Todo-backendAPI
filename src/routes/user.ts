import jwt = require("jsonwebtoken");
import { model } from "mongoose";
import { completeRequest } from "../functions/complete";
import { IUser } from "../interfaces";
import { Response } from "../models";
import { UserSchema } from "../schemas";
import { Config } from "../shared";

const User = model("User", UserSchema);

  /**
   * This is route for registering user in database
   * @param args
   */

export async function register(args) {
  const promise: Promise<Response> = new Promise<Response>((resolve, reject) => {

    const secret: any = Config.secretKeys.jwtSecret;
      // getting data from args
    const username = String(args.input.username).trim();
    if (!username || !args.input.username || !args.input.name) {
      reject(new Response(200, "Please fill both username and name", {
        success: false,
      }));
    } else if (username.length < 4 || args.input.name.trim().length < 4) {
      reject(new Response(200, "Username and name should be contain atleast 4 characters", {
        success: false,
      }));
    } else {
      const name = args.input.name.trim();
      User.findOne({ username }).then((user: any) => {
        if (user !== null) {
          reject(new Response(200, "username already in use", {
            success: false,
          }));
        } else {
          const newUser: any = new User({
            username,
            name,
          });

          newUser.id = newUser._id;
          // generating new hashed password
          newUser.password = newUser.generateHash(args.input.password);
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
  const val = await completeRequest(promise);
  return val;
}

export async function login(args) {
  const promise: Promise<Response> = new Promise<Response>((resolve, reject) => {

    if (!args.input.username || !args.input.password) {
      reject(new Response(200, "Please enter both field username and password", {
        success: false,
      }));
    }
    // Getting data from req.body
    const username = args.input.username;
    const secret: any = Config.secretKeys.jwtSecret;
    // Searching for User in database
    User.findOne({ username }).select("password id createdAt updatedAt").then((user: any) => {
      if (!user) {
        reject(new Response(200, "Sorry, No user found", {
          success: false,
        }));
      } else {
        if (!user.validPassword(args.input.password)) {
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
  const val = await completeRequest(promise);
  return val;
}

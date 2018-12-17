import express = require("express");
import jwt = require("jsonwebtoken");
import { model } from "mongoose";
import { BaseRoutes } from "../classes";
import { Authenticated, IUser } from "../interfaces";
import { Response } from "../models";
import { BlogSchema, UserSchema } from "../schemas";
import { Config } from "../shared";

import { isAuthenticated } from "../middleware";
const User = model("User", UserSchema);
const Blog = model("Blog", BlogSchema);

export class UserRoutes extends BaseRoutes {

  protected initRoutes() {
    this.router.route("/register").post((req, res) => this.registerUser(req, res));
    this.router.route("/addBlog").post(isAuthenticated, (req: Authenticated, res) => this.addBlog(req, res));
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

  /**
   * This is a route for Adding Blog
   * @param req
   * @param res
   */
  private addBlog(req: Authenticated, res: express.Response) {
    const promise: Promise<Response> = new Promise((resolve, reject) => {
      if (!req.body.title || !req.body.description) {
        reject(new Response(200, "Please enter both title and description", {
          success: false,
        }));
      }

      const title = req.body.title.trim();
      const description = req.body.description.trim();
      if (!title.length || !description.length) {
        reject(new Response(200, "Title or description cannot be blank", {
          success: false,
        }));
      }

      User.findById({_id: req.user._id}, () => {
        const blog = new Blog({
          postedBy: req.user._id,
          name: req.user.name,
          title,
          description,
        });

        blog.save((err) => {
          if (err) {
            reject(new Response(200, "Error in saving blog", {
              success: false,
            }));
          }
          resolve(new Response(200, "Successfully saved blog", {
            success: true,
            blog,
          }));
        });
      });
    });
    this.completeRequest(promise, res);
  }
}

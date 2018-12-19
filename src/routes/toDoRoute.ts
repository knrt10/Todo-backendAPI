import express = require("express");
import { model } from "mongoose";
import winston = require("winston");
import { BaseRoutes } from "../classes";
import { Authenticated } from "../interfaces";
import { Response } from "../models";
import { TodoSchema, UserSchema } from "../schemas";

import { isAuthenticated } from "../middleware";
const User = model("User", UserSchema);
const Todo = model("Todo", TodoSchema);

export class ToDoRoute extends BaseRoutes {

  public constructor(protected winston: winston) {
    super();
    this.initRoutes();
  }

  protected initRoutes() {
    this.router.route("/addTodo").post(isAuthenticated, (req: Authenticated, res) => this.addTodo(req, res));
    this.router.route("deleteTodo/:id").get(isAuthenticated, (req: Authenticated, res) => this.deleteTodo(req, res));
  }

  /**
   * This is a route for Adding Blog
   * @param req
   * @param res
   */
  private addTodo(req: Authenticated, res: express.Response) {
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

      User.findById({ _id: req.user._id }, () => {
        const todo = new Todo({
          postedBy: req.user._id,
          name: req.user.name,
          title,
          description,
        });

        todo.save((err) => {
          if (err) {
            reject(new Response(200, "Error in saving Todo", {
              success: false,
            }));
          }
          resolve(new Response(200, "Successfully saved Todo", {
            success: true,
            todo,
          }));
        });
      });
    });
    this.completeRequest(promise, res);
  }

  /**
   * This gets particular blog
   * @param req
   * @param res
   */
  private deleteTodo(req: Authenticated, res: express.Response) {
    const promise: Promise<Response> = new Promise((resolve, reject) => {
      const todoId = req.params.id;
      Todo.findById({ _id: todoId}, (err, blog) => {
        if (err) {
          reject(new Response(200, "Not able to get blog", {
            success: false,
          }));
        }
        this.winston.info(blog);
      });
    });
    this.completeRequest(promise, res);
  }
}

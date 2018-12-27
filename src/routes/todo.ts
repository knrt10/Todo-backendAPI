import { model } from "mongoose";
import { completeRequest } from "../functions/complete";
import { Response } from "../models";
import { TodoSchema, UserSchema } from "../schemas";
const User = model("User", UserSchema);
const Todo = model("Todo", TodoSchema);

/**
 * This function creates a new Todo
 * @param args
 * @param user
 */
export async function addTodo(args, user) {
  const promise: Promise<Response> = new Promise((resolve, reject) => {
    if (!args.input.title || !args.input.description) {
      reject(new Response(200, "Please enter both title and description", {
        success: false,
      }));
    }

    const title = args.input.title.trim();
    const description = args.input.description.trim();
    if (!title.length || !description.length) {
      reject(new Response(200, "Title or description cannot be blank", {
        success: false,
      }));
    }

    User.findById({ _id: user._id }, (err, user) => {
      const todo = new Todo({
        postedBy: user.id,
        name: user.name,
        title,
        description,
      });

      todo.id = todo._id;
      todo.postedByid = user.id;
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
  const val = await completeRequest(promise);
  return val;
}

/**
 * This returns all todos for user
 * @param user
 */
export async function getAlltodosForUser(user) {
  const promise: Promise<Response> = new Promise((resolve) => {
    Todo.find({ postedBy: user._id }, (err, todos) => {
      resolve(new Response(200, "All todos", {
        success: true,
        todos,
      }));
    });
  });
  const val = await completeRequest(promise);
  return val;
}

/**
 * This updates the todo information
 * @param user
 */
export async function update(args, user) {
  const promise: Promise<Response> = new Promise((resolve, reject) => {
    const todoId = args.input.id;
    if (!args.input.title || !args.input.description || !todoId) {
      reject(new Response(200, "Please enter all fields", {
        success: false,
      }));
    }

    const title = args.input.title.trim();
    const description = args.input.description.trim();
    if (!title.length || !description.length) {
      reject(new Response(200, "Title or description cannot be blank", {
        success: false,
      }));
    }

    Todo.findById({ _id: todoId }, (err, todo) => {
      if (err) {
        reject(new Response(200, "Not able to get todo", {
          success: false,
        }));
      } else if (String(todo.postedBy) !== String(user._id)) {
        reject(new Response(200, "You don't have access to update this todo", {
          success: false,
        }));
      } else {
        Todo.findOneAndUpdate({ _id: todoId }, { $set: { title, description } }, { new: true }, (err, todo) => {
          resolve(new Response(200, "Updated Todo", {
            success: true,
            todo,
          }));
        });
      }
    });
  });
  const val = await completeRequest(promise);
  return val;
}

/**
 * This function deletes the particular todo we want
 * @param args
 */
export async function deleteTodo(args, user) {
  const promise: Promise<Response> = new Promise((resolve, reject) => {
    const todoId = args.id;
    Todo.findById({ _id: todoId }, (err, data) => {
      if (err) {
        reject(new Response(200, "Not able to get todo", {
          success: false,
        }));
      } else if (!data) {
        reject(new Response(200, "Todo already deleted", {
          success: false,
        }));
      } else if (String(data.postedBy) !== String(user._id)) {
        reject(new Response(200, "You don't have access to delete this todo", {
          success: false,
        }));
      } else {
        Todo.findOneAndDelete({ _id: todoId }, () => {
          resolve(new Response(200, "Successfully deleted todo", {
            success: true,
          }));
        });
      }
    });
  });
  const val = await completeRequest(promise);
  return val;
}

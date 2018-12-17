import express = require("express");
import {Document} from "mongoose";

/**
 * This is interface for Authenticated user
 * @interface
 * @extends {express.Request}
 */
export interface Authenticated extends express.Request {
  user;
}

/**
 * This is interface for user
 * @interface
 * @extends {Document}
 */
export interface IUser extends Document {
  // tslint:disable-next-line:semicolon
  username: string,
  // tslint:disable-next-line:semicolon
  password: string,
  // tslint:disable-next-line:semicolon
  _id: any,
  // tslint:disable-next-line:semicolon
  name: string,
}

/**
 * This is interface of user for testing
 * @interface
 */
export interface IUserTest {
  // tslint:disable-next-line:semicolon
  username: string,
  // tslint:disable-next-line:semicolon
  password: string,
  // tslint:disable-next-line:semicolon
  name: string,
}

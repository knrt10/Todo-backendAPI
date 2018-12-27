import {Document} from "mongoose";

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

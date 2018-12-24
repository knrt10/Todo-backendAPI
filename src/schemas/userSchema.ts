import bcrypt = require("bcrypt-nodejs");
import { Schema } from "mongoose";
import mongoose = require("mongoose");

mongoose.Promise = global.Promise;

/**
 * This is Schema for User
 * @constant {UserSchema}
 */
export const UserSchema = new Schema({
  id: {
    type: String,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    select: true,
  },
  name: {
    type: String,
    select: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
  },
}, {
  timestamps: {},
});

UserSchema.methods.generateHash = function(password): boolean {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password): boolean {
  return bcrypt.compareSync(password, this.password);
};

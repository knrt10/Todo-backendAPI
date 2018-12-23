import bcrypt = require("bcrypt-nodejs");
import Sequelize from "sequelize";
import { databaseString } from "../functions/infoString";

const sequelize = new Sequelize(databaseString(), { operatorsAliases: false });

/**
 * This is Schema for User
 * @constant {UserSchema}
 */
export const UserSchema = sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export function generateHash(password): boolean {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

export function validPassword(password): boolean {
  return bcrypt.compareSync(password, this.password);
}

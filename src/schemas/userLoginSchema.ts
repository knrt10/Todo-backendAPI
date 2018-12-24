import { GraphQLInputObjectType, GraphQLString } from "graphql";

// User input is getting input from user
const UserInput = new GraphQLInputObjectType({
  name: "UserInputLogin",
  fields: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
});

export const userLoginSchema = {
  UserInput,
};

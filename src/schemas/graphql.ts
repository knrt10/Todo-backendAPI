import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull,  GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { isAuthenticated } from "../middleware";
import { login, register } from "../routes";
import { userLoginSchema } from "./userLoginSchema";
import { userRegisterSchema } from "./userRegisterSchema";

// Define the Query type
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    loginUser: {
      type: new GraphQLNonNull(userRegisterSchema.responseType),
      // `args` describes the arguments that the `user` query accepts
      args: {
        input: { type: userLoginSchema.UserInput },
      },
      async resolve(_, args) {
        const val = await login(args);
        return val;
      },
    },
    profileUser: {
      type: new GraphQLNonNull(userRegisterSchema.responseType),
      // `args` describes the arguments that the `user` query accepts
      async resolve(parent, args, context, info) {
        const authenticated = await isAuthenticated(context);
        return authenticated;
      },
    },
  },
});

// Defining Mutation
const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    registerUser: {
      type: new GraphQLNonNull(userRegisterSchema.responseType),
      // `args` describes the arguments that the `user` query accepts
      args: {
        input: { type: userRegisterSchema.UserInput },
      },
      async resolve(_, args) {
        const val = await register(args);
        return val;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

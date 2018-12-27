import { GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { isAuthenticated } from "../middleware";
import { addTodo, deleteTodo, getAlltodosForUser, login, register, update } from "../routes";
import { todographqlSchema } from "./todographqlSchema";
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
    todoUsers: {
      type: new GraphQLNonNull(todographqlSchema.userTodoResponse),
      // `args` describes the arguments that the `user` query accepts
      async resolve(parent, args, context, info) {
        const authenticated = await isAuthenticated(context);
        if (authenticated.code !== 200) {
          return authenticated;
        } else {
          const val = await getAlltodosForUser(authenticated.data.user);
          return val;
        }
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
    addTodo: {
      type: new GraphQLNonNull(todographqlSchema.responseType),
      // `args` describes the arguments that the `user` query accepts
      args: {
        input: { type: todographqlSchema.toDoInput },
      },
      async resolve(parent, args, context, info) {
        const authenticated = await isAuthenticated(context);
        if (authenticated.code !== 200) {
          return authenticated;
        } else {
          const val = await addTodo(args, authenticated.data.user);
          return val;
        }
      },
    },
    updateTodo: {
      type: new GraphQLNonNull(todographqlSchema.responseType),
      // `args` describes the arguments that the `user` query accepts
      args: {
        input: { type: todographqlSchema.toDoInputUpdate },
      },
      async resolve(parent, args, context, info) {
        const authenticated = await isAuthenticated(context);
        if (authenticated.code !== 200) {
          return authenticated;
        } else {
          const val = await update(args, authenticated.data.user);
          return val;
        }
      },
    },
    deleteTodo: {
      type: new GraphQLNonNull(todographqlSchema.userTodoDeleteResponse),
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parent, args, context, info) {
        const authenticated = await isAuthenticated(context);
        if (authenticated.code !== 200) {
          return authenticated;
        } else {
          const val = await deleteTodo(args, authenticated.data.user);
          return val;
        }
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

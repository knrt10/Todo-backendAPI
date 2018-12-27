import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

// User type
const todoType = new GraphQLObjectType({
  name: "todo",
  fields: {
    id: { type: GraphQLID },
    postedByid: { type: GraphQLID },
    name: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

// Data reponse of user
const DataResponse = new GraphQLObjectType({
  name: "todoDataResponse",
  fields: {
    success: { type: GraphQLBoolean },
    todo: { type: todoType },
    token: { type: GraphQLString },
  },
});

// Response from User
const responseType = new GraphQLObjectType({
  name: "toDoResponse",
  fields: {
    code: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(DataResponse) },
  },
});

const toDoInput = new GraphQLInputObjectType({
  name: "todoInput",
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const toDoInputUpdate = new GraphQLInputObjectType({
  name: "todoInputUpdate",
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

// For getting todo

// Data reponse of user
const todoUsersDataResponse = new GraphQLObjectType({
  name: "todoUsersDataResponse",
  fields: {
    success: { type: GraphQLBoolean },
    todos: { type: new GraphQLList(todoType) },
  },
});

const userTodoResponse = new GraphQLObjectType({
  name: "userTodoResponse",
  fields: {
    code: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(todoUsersDataResponse) },
  },
});

// For deleting Todo

const todoDeleteResponse = new GraphQLObjectType({
  name: "todoDeleteResponse",
  fields: {
    success: { type: GraphQLBoolean },
  },
});

const userTodoDeleteResponse = new GraphQLObjectType({
  name: "userTodoDeleteResponse",
  fields: {
    code: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(todoDeleteResponse) },
  },
});

export const todographqlSchema = {
  todoType,
  DataResponse,
  responseType,
  toDoInput,
  toDoInputUpdate,
  todoUsersDataResponse,
  userTodoResponse,
  userTodoDeleteResponse,
};

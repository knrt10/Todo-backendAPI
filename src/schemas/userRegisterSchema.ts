import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

// User type
const userType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

// Data reponse of user
const DataResponse = new GraphQLObjectType({
  name: "DataResponse",
  fields: {
    success: { type: GraphQLBoolean },
    user: { type: userType },
    token: { type: GraphQLString },
  },
});

// Response from User
const responseType = new GraphQLObjectType({
  name: "Response",
  fields: {
    code: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(DataResponse) },
  },
});

// User input is getting input from user
const UserInput = new GraphQLInputObjectType({
  name: "UserInputRegister",
  fields: {
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
  },
});

export const userRegisterSchema = {
  userType,
  DataResponse,
  responseType,
  UserInput,
};

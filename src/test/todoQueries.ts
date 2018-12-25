const UserRoute = require("./user-test.spec");
const todoId = UserRoute.toDoSavedData;

const query = `mutation addTodo($input: todoInput) {
  addTodo(input: $input) {
    code
    message
    data {
      success
     	todo {
        id
        postedByid
        description
        updatedAt
        createdAt
        name
      }
    }
  }
}`;

const deleteQuery = `mutation deleteTodo($id: String) {
  deleteTodo(id: $id) {
    code
    message
    data {
      success
    }
  }
}`;

const allTodos = `query todoUsers {
  todoUsers{
    code
    message
    data {
      success
      todos {
        title
        description
      }
    }
  }
}`;

const toDoSuccessfullyQuery = {
  query: query,
  operationName: "addTodo"
  ,
  variables: {
    input: {
      title: "Test title",
      description: "test description",
    },
  },
};

const toDoFailNotitleOrDescyQuery = {
  query: query,
  operationName: "addTodo"
  ,
  variables: {
    input: {
      title: "",
      description: "",
    },
  },
};

const toDoFailNotitleQuery = {
  query: query,
  operationName: "addTodo"
  ,
  variables: {
    input: {
      title: "   ",
      description: "dasdasda",
    },
  },
};

const toDoFailDeleteQuery = {
  query: deleteQuery,
  operationName: "deleteTodo"
  ,
  variables: {
    id: "anything",
  },
};

const TodoAllQuery = {
  query: allTodos,
  operationName: "todoUsers"
  ,
};

export const todoQueries = {
  toDoSuccessfullyQuery,
  toDoFailNotitleOrDescyQuery,
  toDoFailNotitleQuery,
  toDoFailDeleteQuery,
  deleteQuery,
  TodoAllQuery,
};

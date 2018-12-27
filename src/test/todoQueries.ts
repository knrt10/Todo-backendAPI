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

const updateQuery = `mutation updateTodo($input: todoInputUpdate) {
  updateTodo(input: $input) {
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
        title
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

const toDoUpdateQuery = {
  query: updateQuery,
  operationName: "updateTodo"
  ,
  variables: {
    input: {
      id: "anything",
      title: "Test title",
      description: "test description",
    },
  },
};

const toDoFailNoIdUpdateQuery = {
  query: updateQuery,
  operationName: "updateTodo"
  ,
  variables: {
    input: {
      id: "",
      title: "fsdfs",
      description: "fsdsdf",
    },
  },
};

const toDoFailNotitleOrDescUpdateQuery = {
  query: updateQuery,
  operationName: "updateTodo"
  ,
  variables: {
    input: {
      id: "anything",
      title: "  ",
      description: "   ",
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
  toDoUpdateQuery,
  toDoFailNoIdUpdateQuery,
  toDoFailNotitleOrDescUpdateQuery,
  toDoFailDeleteQuery,
  updateQuery,
  deleteQuery,
  TodoAllQuery,
};

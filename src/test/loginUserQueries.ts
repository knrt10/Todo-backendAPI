const query = `query loginUser($input: UserInputLogin) {
  loginUser(input: $input) {
    code,
    message,
    data {
      success
      user {
        id
        name
        username
        password
      }
      token
    }
  }
}`;

const loginSuccessfullyQuery = {
  query: query,
  operationName: "loginUser"
  ,
  variables: {
    input: {
      username: "knrt10",
      password: "test",
    },
  },
};

const loginFailWrongPasswordQuery = {
  query: query,
  operationName: "loginUser"
  ,
  variables: {
    input: {
      username: "knrt10",
      password: "test1",
    },
  },
};

const loginFailNopassWordorUsernameQuery = {
  query: query,
  operationName: "loginUser"
  ,
  variables: {
    input: {
      username: "",
      password: "",
    },
  },
};

const loginFailwrongUsernamQuery = {
  query: query,
  operationName: "loginUser"
  ,
  variables: {
    input: {
      username: " bla ",
      password: "shit this is bro",
    },
  },
};

export const loginQueries = {
  loginSuccessfullyQuery,
  loginFailWrongPasswordQuery,
  loginFailNopassWordorUsernameQuery,
  loginFailwrongUsernamQuery,
};

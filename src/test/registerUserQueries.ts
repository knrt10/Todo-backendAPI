const query = `mutation registerUser($input: UserInputRegister) {
  registerUser(input: $input) {
    code
    message
    data {
      token
      success
      user {
        id
        createdAt
        username
        name
        password
        updatedAt
      }
    }
  }
}
`;

const registerSuccessfullyQuery = {
  query: query,
  operationName: "registerUser"
  ,
  variables: {
    input: {
      username: "knrt10",
      name: "Kautilya",
      password: "test",
    },
  },
};

const registerFailNoUsernameQuery = {
  query: query ,
  operationName: "registerUser"
  ,
  variables: {
    input: {
      username: "",
      name: "Kautilya",
      password: "test",
    },
  },
};

const registerFailSmallUsernameQuery = {
  query: query,
  operationName: "registerUser"
  ,
  variables: {
    input: {
      username: "d   ",
      name: "Kautilya",
      password: "test",
    },
  },
};

export const registerqueries = {
  registerSuccessfullyQuery,
  registerFailNoUsernameQuery,
  registerFailSmallUsernameQuery,
};

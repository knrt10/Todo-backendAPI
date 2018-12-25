const query = `query profileUser{
  profileUser {
    code
    message
    data {
      success
      token
      user {
        name
      }
    }
  }
}`;

const profileSuccessfullyQuery = {
  query: query,
  operationName: "profileUser"
  ,
};

export const profileUser = {
  profileSuccessfullyQuery,
};

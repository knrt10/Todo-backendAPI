## Hasura Todo application backend

[![Build Status](https://travis-ci.com/knrt10/Hasura-Todo-backend.svg?token=jpzxxGzyKiuro5NSsCF5&branch=master)](https://travis-ci.com/knrt10/Hasura-Todo-backend)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)


## Registering User

```ts
mutation register($input: UserInputRegister) {
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

and input

{
  "input": {
    "username": "knrt10",
    "name": "Kautilya",
    "password": "test"
  }
}
```

## Logging User

```ts
query Login($input: UserInputLogin) {
  loginUser(input: $input) {
    code,
    message,
    data {
      user {
        id
        name
        username
        password
      }
      token
    }
  }
}

and input

{
  "input": {
    "username": "knrt10",
    "password": "test"
  }
}
```

## Profile User 

```ts
query {
  profileUser {
    code
    message
    data {
      token
      user {
        name
      }
    }
  }
}

and headers

{
  "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjBkNzRiMGJjNTc4MTRmOGE4YjQ5ZSIsImlhdCI6MTU0NTY1NzI5OSwiZXhwIjoxNTQ1NzQwMDk5fQ.wG4i5gvxTG6Ts-6jfQp1ZdDtF6RysMh-WtXQYACBl74"
}
```


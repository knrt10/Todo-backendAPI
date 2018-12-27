<p align="center">
  <img src="https://user-images.githubusercontent.com/24803604/50481874-edac8280-0a09-11e9-837b-3e64409c21fb.png" />
</p>

[![Build Status](https://travis-ci.org/knrt10/Hasura-Todo-backend.svg?branch=master)](https://travis-ci.org/knrt10/Hasura-Todo-backend)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/97bd422023ea446bab65dbb78fd80a3c)](https://www.codacy.com/app/knrt10/Hasura-Todo-backend?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=knrt10/Hasura-Todo-backend&amp;utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/knrt10/Hasura-Todo-backend/branch/master/graph/badge.svg)](https://codecov.io/gh/knrt10/Hasura-Todo-backend)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)

## Contents

1. [About the Project](#about-the-project)
2. [Requirements](#requirements)
3. [Tech Stack and Packages used](#tech-stack-and-packages-used)
4. [Initial Setup](#initial-setup)
5. [Working with docker](#working-with-docker)
6. [Running Project locally](#running-project-locally)  
    - [Initial Steps](#initial-steps)
    - [Running Tests](#running-tests)
    - [Linting Code](#linting-code)
7. [API of application](#api-of-application)
    - [Registering User](#registering-user)
    - [Login User](#login-user)
    - [Profile of User](#profile-of-user)
    - [Create TODO](#create-todo)
    - [Get all todos](#get-all-todos)
    - [Updating a Todo](#updating-a-todo)
    - [Deleting a Todo](#deleting-a-todo)
8. [Support](#support)    

### About the Project

Just a simple but effective backend for a todo application.

### Requirements

- [Node.js](https://nodejs.org/en/) and **npm** installed for your OS.
- You need to have [docker](https://www.docker.com/) installed for your OS.
- [GraphQL-Playground](https://github.com/prisma/graphql-playground) for testing your API.

### Tech Stack and Packages used

* Docker used to contain dependencies and tooling
* `node` >= 8.9.0
* `npm` >= 5.5.1
* `TypeScript` >= 3.0.1
* `graphql` for making API queries
* `mongoDb` for database
* `winston` for logging/monitoring application
* `gulp` for solving problem of repetition
* `bluebird` for promises
* `mocha and chai` for testing
* `nyc` for code coverage
* `ts-node` for traspiling TypeScript on the server so that it could be used in Node.js
* `tslint` for linting code

### Initial Setup
```git
// Cloning the repository

git clone https://github.com/knrt10/Todo-backendAPI.git

// Change directory to project folder

cd Todo-backendAPI/

```

### Working with docker
After following above intital steps, its very easy to access the api using docker. All you need is to do it follow small steps given below.

#### Changing `shared/config.ts` 

Initial mongoDb is setup for localhost. `master` branch contains setup for running server using `npm` so you need to change branch

`git checkout docker`

After changing that run this command 

`npm run dockerStart`

This will run a script `scripts/dockerCompose.sh` and create docker image and with help of `docker-compose.yml` from our project directory it will start server automatically. Now to access the application proceed to [API of application](#api-of-application).

To Stop Our Docker process type this command in your terminal

`npm run dockerStop`

### Running Project locally

#### Initial Steps

Follow these simple steps

1. Installing dependencies
    - `npm i`
    - This will create a `node_modules` folder.
2. Building the project
    - After dependencies are installed run `npm run build` 
    - This will build the application and create a `dist/` folder 
3. Starting mongodb Server
    - You need to start your mongodb server for your OS. For **Mac and Unix** it is `mongod`.
4. Running the application
    - Start your application by running `npm start` or `npm run dev`
5. Accessing API of application
    - Now to access the application proceed to [API of application](#api-of-application).   
6. Stopping the application
    - press **ctrl + c** in your terminal where server is runnning.
7. Running docker again. 
    - If you want to run docker again follow [Working with docker](#working-with-docker).

#### Running Tests    

**IMPORTANT:-** To run tests your config should be `localDatabase: true` in `shared/config.ts` and your local mongoDB server should be running. If so then run simple command

`npm run build && npm run coverage`

#### Linting Code

You can lint the code automatically by running this is your terminal

`npm run lint`

### API of application

This is simple API of application. Go to `http://localhost:3000/graphql` or open [GraphQL-Playground](https://github.com/prisma/graphql-playground) and enter above URL for testing your API.

#### Registering User

```ts
mutation registerUser($input: UserInputRegister) {
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

#### Login User

```ts
query loginUser($input: UserInputLogin) {
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
}
and input

{
  "input": {
    "username": "knrt10",
    "password": "test"
  }
}
```

#### Profile of User 

```ts
query profileUser{
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
}

and headers

{
  "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjBkNzRiMGJjNTc4MTRmOGE4YjQ5ZSIsImlhdCI6MTU0NTY1NzI5OSwiZXhwIjoxNTQ1NzQwMDk5fQ.wG4i5gvxTG6Ts-6jfQp1ZdDtF6RysMh-WtXQYACBl74"
}
```

#### Create TODO

```ts
mutation addTodo($input: todoInput) {
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
}

and input

{
  "input": {
    "title": "knrt10",
    "description": "test"
  }
}

and also headers

{
  "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjBkNzRiMGJjNTc4MTRmOGE4YjQ5ZSIsImlhdCI6MTU0NTY1NzI5OSwiZXhwIjoxNTQ1NzQwMDk5fQ.wG4i5gvxTG6Ts-6jfQp1ZdDtF6RysMh-WtXQYACBl74"
}
```

#### Get all todos

```ts

query todoUsers {
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
}

and also headers

{
  "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjBkNzRiMGJjNTc4MTRmOGE4YjQ5ZSIsImlhdCI6MTU0NTY1NzI5OSwiZXhwIjoxNTQ1NzQwMDk5fQ.wG4i5gvxTG6Ts-6jfQp1ZdDtF6RysMh-WtXQYACBl74"
}
``` 

#### Updating a Todo

```ts
mutation updateTodo($input: todoInputUpdate) {
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
}

and input 
{
  "input": {
    "id": "5c2503576c89915ab8ac3572",
    "title": "Woooa this is working?",
    "description": "Yep."
  }
}

and also header
{
  "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjUwMzIwNmM4OTkxNWFiOGFjMzU3MSIsImlhdCI6MTU0NTkyOTUwNCwiZXhwIjoxNTQ2MDEyMzA0fQ.hn4csdGR5w-2yXWVUEmW4wh8U0s5SfWXfClmP0jVgOY"
}
```

#### Deleting a Todo

```ts

mutation deleteTodo($id: String) {
  deleteTodo(id: $id) {
    code
    message
    data {
      success
    }
  }
}

and input

{
  "id": "5c20ecda2e62db1ae4d9ff42"
}

and also headers

{
  "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjBkNzRiMGJjNTc4MTRmOGE4YjQ5ZSIsImlhdCI6MTU0NTY1NzI5OSwiZXhwIjoxNTQ1NzQwMDk5fQ.wG4i5gvxTG6Ts-6jfQp1ZdDtF6RysMh-WtXQYACBl74"
}
```

## Support

I wrote this repo by using my free time. A little motivation and support helps me a lot. If you like this nifty hack you can support me by doing any (or all :wink: ) of the following:
- :star: Star it on [Github](https://github.com/knrt10/Todo-backendAPI) and make it trend so that other people can know about our project.
- :clap: Clap for the series of article on [Medium](https://medium.com/@knrt/3423a6004b96)
- Tweet about it
- Share this on Facebook

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import chaiHttp = require("chai-http");
import { suite, test } from "mocha-typescript";
import { model } from "mongoose";
import sinon = require("sinon");
import { Response } from "../models";
import { UserSchema } from "../schemas";
import { TodoApp } from "../server";
import { Config } from "../shared";
import { loginQueries } from "./loginUserQueries";
import { profileUser } from "./profileQueries";
import { registerqueries } from "./registerUserQueries";
import { todoQueries } from "./todoQueries";
const User = model("User", UserSchema);

const server: TodoApp = new TodoApp(process.env.API_PORT || 3001);
server.startServer();
// starting the server
chai.use(chaiAsPromised);
chai.use(chaiHttp);

@suite("User Test Class")
class UserTests {
  static user: any;
  static toDoSavedData: any;
  static before() {
    this.testData = {
      input: {
        username: "knrt10",
        name: "Kautilya",
        password: "test",
      },
    };
  }

  static after() {
    // Delete User Created So that it does not provide error in next test
    User.findOneAndDelete({ username: UserTests.testData.input.username }, () => {
      process.exit(0);
    });
  }

  private static testData: any;
  private static token: string;

  @test("Testing wrong URL - try hit the wrong API")
  public wrongURl(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/bla")
        .end((err, res) => {
          chai.expect(res).to.have.status(404);
          done();
        });
    }, 1000);
  }

  @test("Testing Local Connection - try connection for Local mongodb")
  public localDb(done) {
    setTimeout(() => {
      Config.dbSettings.localDatabase = true;
      const mock = sinon.mock(new TodoApp(process.env.API_PORT || 3001), "constructor");
      chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.connectionString + "/" + Config.dbSettings.database);
      done();
    }, 1000);
  }

  @test("Testing Docker Connection - try connection for docker mongodb")
  public dockerDb(done) {
    setTimeout(() => {
      Config.dbSettings.localDatabase = false;
      const mock = sinon.mock(new TodoApp(process.env.API_PORT || 3001), "constructor");
      chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.dockerconnectionString + "/" + Config.dbSettings.database);
      done();
    }, 1000);
  }

  @test("Testing Online Connection - try connection for online mongodb")
  public OnlineDb(done) {
    setTimeout(() => {
      Config.dbSettings.authEnabled = true;
      const mock = sinon.mock(new TodoApp(process.env.API_PORT || 3001), "constructor");
      chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.username + ":" + Config.dbSettings.password + "@"
        + Config.dbSettings.connectionString + "/" + Config.dbSettings.database);
      done();
    }, 1000);
  }

  @test("POST Register - try Register User Successfuly")
  public createUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(registerqueries.registerSuccessfullyQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.registerUser).to.deep.equal(new Response(200, "Successful response", {
            success: true,
            user: res.body.data.registerUser.data.user,
            token: res.body.data.registerUser.data.token,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Register - Don't register as user already registered")
  public dontRegisterUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(registerqueries.registerSuccessfullyQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.registerUser).to.deep.equal(new Response(200, "username already in use", {
            success: false,
            token: null,
            user : null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Register - try No username field")
  public dontCreateUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(registerqueries.registerFailNoUsernameQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.registerUser).to.deep.equal(new Response(200, "Please fill both username and name", {
            success: false,
            token: null,
            user: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Register - try username of small length")
  public dontCreateUserLessLength(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(registerqueries.registerFailSmallUsernameQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.registerUser).to.deep.equal(new Response(200, "Username and name should be contain atleast 4 characters", {
            success: false,
            token: null,
            user: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Login - try Successful Login")
  public login(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(loginQueries.loginSuccessfullyQuery)
        .end((err, res) => {
          UserTests.user = res.body.data.loginUser.data.user;
          UserTests.token = res.body.data.loginUser.data.token;
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.loginUser).to.deep.equal(new Response(200, "Successful response", {
            success: true,
            user: res.body.data.loginUser.data.user,
            token: res.body.data.loginUser.data.token,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Login - try hit the login with incorrect credentials route")
  public loginWithIncorrect(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(loginQueries.loginFailWrongPasswordQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.loginUser).to.deep.equal(new Response(200, "Incorrect Password", {
            success: false,
            user: null,
            token: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Login - try hit the login no password")
  public wrongInputFields(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(loginQueries.loginFailNopassWordorUsernameQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.loginUser).to.deep.equal(new Response(200, "Please enter both field username and password", {
            success: false,
            user: null,
            token: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Login - try Posting wrong username")
  public NoUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(loginQueries.loginFailwrongUsernamQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.loginUser).to.deep.equal(new Response(200, "Sorry, No user found", {
            success: false,
            user: null,
            token: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Profile - try getting user profile")
  public ProfileUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(profileUser.profileSuccessfullyQuery)
        .set("x-access-token", UserTests.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.profileUser).to.deep.equal(new Response(200, "Successfull Response", {
            success: true,
            token: res.body.data.profileUser.data.token,
            user: res.body.data.profileUser.data.user,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try Posting todo without token")
  public NoToken(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(todoQueries.toDoSuccessfullyQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.addTodo).to.deep.equal(new Response(403, "Auth token missing", {
            success: false,
            todo: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try Posting todo with wrong token")
  public WrongToken(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(todoQueries.toDoSuccessfullyQuery)
        .set("x-access-token", "wrongtoken")
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.addTodo).to.deep.equal(new Response(500, "Unable to authenticate user", {
            success: false,
            todo: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try to post todo with no body or title")
  public noBodyOrTitle(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(todoQueries.toDoFailNotitleOrDescyQuery)
        .set("x-access-token", UserTests.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.addTodo).to.deep.equal(new Response(200, "Please enter both title and description", {
            success: false,
            todo: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try Empty title or description")
  public emptyTodo(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(todoQueries.toDoFailNotitleQuery)
        .set("x-access-token", UserTests.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.addTodo).to.deep.equal(new Response(200, "Title or description cannot be blank", {
            success: false,
            todo: null,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try Save todo Successfully")
  public saveTodo(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(todoQueries.toDoSuccessfullyQuery)
        .set("x-access-token", UserTests.token)
        .end((err, res) => {
          UserTests.toDoSavedData = res.body.data.addTodo.data.todo;
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.addTodo).to.deep.equal(new Response(200, "Successfully saved Todo", {
            success: true,
            todo: res.body.data.addTodo.data.todo,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try don't delete todo as no Token Provided")
  public dontDeleteTodoAsNotoken(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(todoQueries.toDoFailDeleteQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.deleteTodo).to.deep.equal(new Response(403, "Auth token missing", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try don't delete todo")
  public dontDeleteTodoBy(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(todoQueries.toDoFailDeleteQuery)
        .set("x-access-token", UserTests.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.deleteTodo).to.deep.equal(new Response(200, "Not able to get todo", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try Sucessfully delete todo")
  public deleteTodo(done) {
    setTimeout(() => {
      const toDoSuccessFullDeleteQuery = {
        query: todoQueries.deleteQuery,
        operationName: "deleteTodo"
        ,
        variables: {
          id: UserTests.toDoSavedData.id ,
        },
      };
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(toDoSuccessFullDeleteQuery)
        .set("x-access-token", UserTests.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.deleteTodo).to.deep.equal(new Response(200, "Successfully deleted todo", {
            success: true,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try Again deleting same todo")
  public deleteSameTodo(done) {
    setTimeout(() => {
      const toDoSuccessFullDeleteQuery = {
        query: todoQueries.deleteQuery,
        operationName: "deleteTodo"
        ,
        variables: {
          id: UserTests.toDoSavedData.id,
        },
      };
      chai.request("http://localhost:" + server.port)
        .post("/graphql")
        .send(toDoSuccessFullDeleteQuery)
        .set("x-access-token", UserTests.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.deleteTodo).to.deep.equal(new Response(200, "Todo already deleted", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try get all todos for a User")
  public getAllTodosForAUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .get("/graphql")
        .send(todoQueries.TodoAllQuery)
        .set("x-access-token", UserTests.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.todoUsers).to.deep.equal(new Response(200, "All todos", {
            success: true,
            todos: res.body.data.todoUsers.data.todos,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Todo - try getting Todo for user without token")
  public NotokenTodoForuser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .get("/graphql")
        .send(todoQueries.TodoAllQuery)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.data.todoUsers).to.deep.equal(new Response(403, "Auth token missing", {
            success: false,
            todos: null,
          }));
          done();
        });
    }, 1000);
  }
}

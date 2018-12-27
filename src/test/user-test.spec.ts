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
// starting the server
const server: TodoApp = new TodoApp(process.env.API_PORT || 3001);
server.startServer();

chai.use(chaiAsPromised);
chai.use(chaiHttp);

@suite("User Test class")
class UserTests {
  static user: any;
  static secondUser: any;
  static secondUserToken: any;
  static thirdUserToken: any;
  static toDoSavedData: any;

  static before() {
    this.testData = {
      input: {
        username: "knrt10",
        name: "Kautilya",
        password: "test",
      },
    };

    this.testDataSecondUser = {
      input: {
        username: "knrt191",
        name: "Second",
        password: "test",
      },
    };
  }

  static after() {
    // Delete User Created So that it does not provide error in next test
    User.findOneAndDelete({ username: UserTests.testData.input.username }, () => {
      // Delete Second User
      User.findOneAndDelete({ username: UserTests.testDataSecondUser.input.username }, () => {
        process.exit(0);
      });
    });
  }

  private static testData: any;
  private static testDataSecondUser: any;
  private static token: string;

  @test("Testing Local Connection - try connection for Local mongodb")
  public localDb(done) {
    setTimeout(() => {
      Config.dbSettings.localDatabase = true;
      const mock = sinon.mock(new TodoApp(process.env.API_PORT || 3001), "constructor");
      chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.connectionString + "/" + Config.dbSettings.database);
      done();
    }, 100);
  }

  @test("Testing Docker Connection - try connection for docker mongodb")
  public dockerDb(done) {
    Config.dbSettings.localDatabase = false;
    const mock = sinon.mock(new TodoApp(process.env.API_PORT || 3001), "constructor");
    chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.dockerconnectionString + "/" + Config.dbSettings.database);
    done();
  }

  @test("Testing Online Connection - try connection for online mongodb")
  public OnlineDb(done) {
    Config.dbSettings.authEnabled = true;
    const mock = sinon.mock(new TodoApp(process.env.API_PORT || 3001), "constructor");
    chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.username + ":" + Config.dbSettings.password + "@"
      + Config.dbSettings.connectionString + "/" + Config.dbSettings.database);
    done();
  }

  @test("POST Register - try Register User Successfuly")
  public createUser(done) {
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
  }

  @test("POST Register - try Register second User Successfuly")
  public createUserSecond(done) {
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(registerqueries.registerSuccessfullyQuerySecondUser)
      .end((err, res) => {
        UserTests.secondUser = res.body.data.registerUser.data.user;
        UserTests.secondUserToken = res.body.data.registerUser.data.token;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.registerUser).to.deep.equal(new Response(200, "Successful response", {
          success: true,
          user: res.body.data.registerUser.data.user,
          token: res.body.data.registerUser.data.token,
        }));
        done();
      });
  }

  @test("POST Register - try Register third User Successfuly")
  public createUserThird(done) {
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(registerqueries.registerSuccessfullyQueryThirdUser)
      .end((err, res) => {
        UserTests.thirdUserToken = res.body.data.registerUser.data.token;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.registerUser).to.deep.equal(new Response(200, "Successful response", {
          success: true,
          user: res.body.data.registerUser.data.user,
          token: res.body.data.registerUser.data.token,
        }));
        User.findOneAndDelete({ username: res.body.data.registerUser.data.user.username }, () => {
          done();
        });
      });
  }

  @test("POST Register - Don't register as user already registered")
  public dontRegisterUser(done) {
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(registerqueries.registerSuccessfullyQuery)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.registerUser).to.deep.equal(new Response(200, "username already in use", {
          success: false,
          token: null,
          user: null,
        }));
        done();
      });
  }

  @test("POST Register - try No username field")
  public dontCreateUser(done) {
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
  }

  @test("POST Register - try username of small length")
  public dontCreateUserLessLength(done) {
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
  }

  @test("POST Login - try Successful Login")
  public login(done) {
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
  }

  @test("POST Login - try hit the login with incorrect credentials route")
  public loginWithIncorrect(done) {
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
  }

  @test("POST Login - try hit the login no password")
  public wrongInputFields(done) {
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
  }

  @test("POST Login - try Posting wrong username")
  public NoUser(done) {
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
  }

  @test("POST Profile - try getting user profile")
  public ProfileUser(done) {
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
  }

  @test("POST Todo add - try Posting todo without token")
  public NoToken(done) {
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
  }

  @test("POST Todo add - try Posting todo with wrong token")
  public WrongToken(done) {
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
  }

  @test("POST Todo add - try Posting todo with correct token but user deleted")
  public UserDeletedButTokenValid(done) {
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(todoQueries.toDoSuccessfullyQuery)
      .set("x-access-token", UserTests.thirdUserToken)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.addTodo).to.deep.equal(new Response(400, "Sorry No user found", {
          success: false,
          todo: null,
        }));
        done();
      });
  }

  @test("POST Todo add - try to post todo with no body or title")
  public noBodyOrTitle(done) {
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
  }

  @test("POST Todo add - try Empty title or description")
  public emptyTodo(done) {
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
  }

  @test("POST Todo add - try Save todo Successfully")
  public saveTodo(done) {
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
  }

  // This part is for updating Todo

  @test("POST Todo update - try Posting todo without token")
  public NoTokenUpdate(done) {
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(todoQueries.toDoUpdateQuery)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.updateTodo).to.deep.equal(new Response(403, "Auth token missing", {
          success: false,
          todo: null,
        }));
        done();
      });
  }

  @test("POST Todo update - try to post todo with no id")
  public noBodyOrTitleupdate(done) {
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(todoQueries.toDoFailNoIdUpdateQuery)
      .set("x-access-token", UserTests.token)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.updateTodo).to.deep.equal(new Response(200, "Please enter all fields", {
          success: false,
          todo: null,
        }));
        done();
      });
  }

  @test("POST Todo update - try Empty title or description")
  public emptyTodoUpdate(done) {
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(todoQueries.toDoFailNotitleOrDescUpdateQuery)
      .set("x-access-token", UserTests.token)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.updateTodo).to.deep.equal(new Response(200, "Title or description cannot be blank", {
          success: false,
          todo: null,
        }));
        done();
      });
  }

  @test("POST Todo update - try don't update todo as not found")
  public dontUpdateNoTodo(done) {
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(todoQueries.toDoUpdateQuery)
      .set("x-access-token", UserTests.token)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.updateTodo).to.deep.equal(new Response(200, "Not able to get todo", {
          success: false,
          todo: null,
        }));
        done();
      });
  }

  @test("POST Todo update - try first user updating second user todo")
  public dontUpdateTodoForSecondUser(done) {
    const toDoSuccessFullUpdateQuery = {
      query: todoQueries.updateQuery,
      operationName: "updateTodo"
      ,
      variables: {
        input: {
          id: UserTests.toDoSavedData.id,
          title: "Test title",
          description: "test description",
        },
      },
    };
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(toDoSuccessFullUpdateQuery)
      .set("x-access-token", UserTests.secondUserToken)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.updateTodo).to.deep.equal(new Response(200, "You don't have access to update this todo", {
          success: false,
          todo: null,
        }));
        done();
      });
  }

  @test("POST Todo update - try update todo Successfully")
  public updateTodo(done) {
    const toDoSuccessFullUpdateQuery = {
      query: todoQueries.updateQuery,
      operationName: "updateTodo"
      ,
      variables: {
        input: {
          id: UserTests.toDoSavedData.id,
          title: "Test title",
          description: "test description",
        },
      },
    };
    chai.request("http://localhost:" + server.port)
      .post("/graphql")
      .send(toDoSuccessFullUpdateQuery)
      .set("x-access-token", UserTests.token)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.updateTodo).to.deep.equal(new Response(200, "Updated Todo", {
          success: true,
          todo: res.body.data.updateTodo.data.todo,
        }));
        done();
      });
  }

  // This part is for deleting todo

  @test("POST Todo delete - try don't delete todo as no Token Provided")
  public dontDeleteTodoAsNotoken(done) {
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
  }

  @test("POST Todo delete - try don't delete todo")
  public dontDeleteTodoBy(done) {
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
  }

  @test("POST Todo delete - try first user deleting second user todo")
  public dontDeleteTodo(done) {
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
      .set("x-access-token", UserTests.secondUserToken)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res.body.data.deleteTodo).to.deep.equal(new Response(200, "You don't have access to delete this todo", {
          success: false,
        }));
        done();
      });
  }

  @test("POST Todo delete - try Sucessfully delete todo")
  public deleteTodo(done) {
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
        chai.expect(res.body.data.deleteTodo).to.deep.equal(new Response(200, "Successfully deleted todo", {
          success: true,
        }));
        done();
      });
  }

  @test("POST Todo delete - try Again deleting same todo")
  public deleteSameTodo(done) {
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
  }

  // This part is for getting all todos.
  @test("POST Todo get - try get all todos for a User")
  public getAllTodosForAUser(done) {
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
  }

  @test("POST Todo get - try getting Todo for user without token")
  public NotokenTodoForuser(done) {
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
  }
}

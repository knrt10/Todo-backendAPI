import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import chaiHttp = require("chai-http");
import { suite, test } from "mocha-typescript";
import { model } from "mongoose";
import sinon = require("sinon");
import { IUserTest } from "../interfaces";
import { Response } from "../models";
import { BlogSchema, UserSchema } from "../schemas";
import { Hasura } from "../server";
import { Config } from "../shared";
const User = model("User", UserSchema);
const Blog = model("Blog", BlogSchema);

const server: Hasura = new Hasura(process.env.API_PORT || 3001);
server.startServer();
// starting the server
chai.use(chaiAsPromised);
chai.use(chaiHttp);

@suite("User Test Class")
class UserRouteTest {
  static user: any;

  static before() {
    this.testData = {
      username: "knrt1",
      password: "knrt101",
      name: "Kautilya Tripathi",
    };

    this.testDataNoUsername = {
      username: "     ",
      password: "knrt10",
    };

    this.testDataUsernameLessLength = {
      username: "     as ",
      password: "knrt10",
      name: "  sa ",
    };

    this.noBodyorDescBlogData = {
      title: "dasdasd",
      dsc: "sadsadasd",
    };

    this.emptyBodyorDesBlogData = {
      title: "  ",
      description: "    ",
    };

    this.correctCredentials = this.testData;
    this.inCorrectCredentials = {
      username: "knrt1",
      password: "test",
    };

    this.wrongUsername = {
      username: "knrt121",
      password: "test",
    };

    this.testDataNoPasswordField = {
      username: "knrt",
      passwordNo: "a",
    };

    this.blogData = {
      title: "test blog",
      description: "yep working and saving",
    };
  }

  static after() {
    // Delete User Created So that it does not provide error in next test
    User.findOneAndDelete({ username: UserRouteTest.testData.username }, () => {
      process.exit(0);
    });
  }

  private static testData: IUserTest;
  private static testDataNoUsername: object;
  private static testDataUsernameLessLength: object;
  private static correctCredentials: object;
  private static inCorrectCredentials: object;
  private static testDataNoPasswordField: object;
  private static wrongUsername: object;
  private static token: string;
  private static noBodyorDescBlogData: object;
  private static emptyBodyorDesBlogData: object;
  private static blogData: object;

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

  @test("Testing Local Connection - try connection for Local mongoDb")
  public localDb(done) {
    setTimeout(() => {
      Config.dbSettings.localDatabase = true;
      const mock = sinon.mock(new Hasura(process.env.API_PORT || 3001), "constructor");
      chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.connectionString + "/" + Config.dbSettings.database);
      done();
    }, 1000);
  }

  @test("Testing Docker Connection - try connection for docker mongoDb")
  public dockerDb(done) {
    setTimeout(() => {
      Config.dbSettings.localDatabase = false;
      const mock = sinon.mock(new Hasura(process.env.API_PORT || 3001), "constructor");
      chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.dockerconnectionString + "/" + Config.dbSettings.database);
      done();
    }, 1000);
  }

  @test("Testing Online Connection - try connection for online mongoDb")
  public OnlineDb(done) {
    setTimeout(() => {
      Config.dbSettings.authEnabled = true;
      const mock = sinon.mock(new Hasura(process.env.API_PORT || 3001), "constructor");
      chai.expect(mock.object.infoString).to.deep.equal("mongodb://" + Config.dbSettings.username + ":" + Config.dbSettings.password + "@"
        + Config.dbSettings.connectionString + "/" + Config.dbSettings.database);
      done();
    }, 1000);
  }

  @test("POST Register - Register User Successfuly")
  public createUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/register")
        .send(UserRouteTest.testData)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Successful response", {
            success: true,
            user: res.body.data.user,
            token: res.body.data.token,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Register - Don't register as user already registered")
  public dontRegisterUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/register")
        .send(UserRouteTest.testData)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "username already in use", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Register - try No username field")
  public dontCreateUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/register")
        .send(UserRouteTest.testDataNoUsername)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Please fill both username and name", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Register - try username of small length")
  public dontCreateUserLessLength(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/register")
        .send(UserRouteTest.testDataUsernameLessLength)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Username and name should be contain atleast 4 characters", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Login - try hit the login with correct credentials route")
  public login(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/auth/login")
        .send(UserRouteTest.correctCredentials)
        .end((err, res) => {
          UserRouteTest.user = res.body.data.user;
          UserRouteTest.token = res.body.data.token;
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Successful response", {
            success: true,
            user: res.body.data.user,
            token: res.body.data.token,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Login - try hit the login with incorrect credentials route")
  public loginWithIncorrect(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/auth/login")
        .send(UserRouteTest.inCorrectCredentials)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Incorrect Password", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Login - try hit the login no password")
  public wrongInputFields(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/auth/login")
        .send(UserRouteTest.testDataNoPasswordField)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Please enter both field {username} and {password}", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Login - Posting wrong username")
  public NoUser(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/auth/login")
        .send(UserRouteTest.wrongUsername)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Sorry, No user found", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Blog - Posting without token")
  public NoToken(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/addBlog")
        .send(UserRouteTest.noBodyorDescBlogData)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(403, "Auth token missing", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Blog - Posting with wrong token")
  public WrongToken(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/addBlog")
        .send(UserRouteTest.noBodyorDescBlogData)
        .set("x-access-token", "wrongtoken")
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(500, "Unable to authenticate user", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Blog - try to post blog with no body or title")
  public noBodyOrTitle(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/addBlog")
        .send(UserRouteTest.noBodyorDescBlogData)
        .set("x-access-token", UserRouteTest.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Please enter both title and description", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Blog - Empty title or description")
  public emptyBlog(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/addBlog")
        .send(UserRouteTest.emptyBodyorDesBlogData)
        .set("x-access-token", UserRouteTest.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Title or description cannot be blank", {
            success: false,
          }));
          done();
        });
    }, 1000);
  }

  @test("POST Blog - Save new Blog")
  public saveBlog(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .post("/user/addBlog")
        .send(UserRouteTest.blogData)
        .set("x-access-token", UserRouteTest.token)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body).to.deep.equal(new Response(200, "Successfully saved blog", {
            success: true,
            blog: res.body.data.blog,
          }));

          Blog.findOneAndDelete({ _id: res.body.data.blog._id }, () => {
            // Deleting that blog
            done();
          });
        });
    }, 1000);
  }
}

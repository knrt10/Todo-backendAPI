import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import chaiHttp = require("chai-http");
import { suite, test } from "mocha-typescript";
import mongoose = require("mongoose");
import sinon = require("sinon");
import { Hasura } from "../server";
import { Config } from "../shared";

const server: Hasura = new Hasura(process.env.API_PORT || 3001);
server.startServer();
// starting the server
chai.use(chaiAsPromised);
chai.use(chaiHttp);

@suite("User Test Class")
class UserRouteTest {

  static after() {
    process.exit(0);
  }

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

  @test("Testing Example URL - try hit the Get API")
  public getURL(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .get("/")
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.text).to.deep.equal("Yep this check route is working");
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

  @test("GET User - User Home page route test")
  public userHomePage(done) {
    setTimeout(() => {
      chai.request("http://localhost:" + server.port)
        .get("/user/")
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.msg).to.deep.equal("User home page route working correctly");
          done();
        });
    }, 1000);
  }
}

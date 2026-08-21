const chai = require("chai");
const chaiHttp = require("chai-http");
const express = require("express");
const jwt = require("jsonwebtoken");

const protectedRoutes = require("../routes/protectedRoutes");

const { expect } = chai;

chai.use(chaiHttp);

describe("Role-Based Access Control Tests", () => {
  let app;

  const JWT_SECRET = "test-jwt-secret";

  before(() => {
    process.env.JWT_SECRET = JWT_SECRET;

    // Create a small Express app only for automated route testing.
    // This avoids connecting to the real MongoDB database.
    app = express();

    app.use(express.json());
    app.use("/api/protected", protectedRoutes);
  });

  const createToken = (role) => {
    return jwt.sign(
      {
        userId: `${role.toLowerCase()}-001`,
        role,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  };

  it("should return 401 when no token is provided", async () => {
    const response = await chai
      .request(app)
      .get("/api/protected/passenger");

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal({
      message: "Authentication required",
    });
  });

  it("should return 401 when an invalid token is provided", async () => {
    const response = await chai
      .request(app)
      .get("/api/protected/passenger")
      .set("Authorization", "Bearer invalid-token");

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal({
      message: "Invalid or expired token",
    });
  });

  it("should return 401 when an expired token is provided", async () => {
    const expiredToken = jwt.sign(
      {
        userId: "passenger-001",
        role: "Passenger",
      },
      JWT_SECRET,
      {
        expiresIn: "-1s",
      }
    );

    const response = await chai
      .request(app)
      .get("/api/protected/passenger")
      .set(
        "Authorization",
        `Bearer ${expiredToken}`
      );

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal({
      message: "Invalid or expired token",
    });
  });

  it("should allow Passenger to access Passenger endpoint", async () => {
    const passengerToken = createToken("Passenger");

    const response = await chai
      .request(app)
      .get("/api/protected/passenger")
      .set(
        "Authorization",
        `Bearer ${passengerToken}`
      );

    expect(response).to.have.status(200);

    expect(response.body.message).to.equal(
      "Passenger access granted"
    );

    expect(response.body.user.role).to.equal(
      "Passenger"
    );
  });

  it("should deny Passenger access to Staff endpoint", async () => {
    const passengerToken = createToken("Passenger");

    const response = await chai
      .request(app)
      .get("/api/protected/staff")
      .set(
        "Authorization",
        `Bearer ${passengerToken}`
      );

    expect(response).to.have.status(403);

    expect(response.body).to.deep.equal({
      message: "Access denied",
    });
  });

  it("should allow Staff to access Staff endpoint", async () => {
    const staffToken = createToken("Staff");

    const response = await chai
      .request(app)
      .get("/api/protected/staff")
      .set(
        "Authorization",
        `Bearer ${staffToken}`
      );

    expect(response).to.have.status(200);

    expect(response.body.message).to.equal(
      "Staff access granted"
    );

    expect(response.body.user.role).to.equal(
      "Staff"
    );
  });

  it("should deny Staff access to Passenger endpoint", async () => {
    const staffToken = createToken("Staff");

    const response = await chai
      .request(app)
      .get("/api/protected/passenger")
      .set(
        "Authorization",
        `Bearer ${staffToken}`
      );

    expect(response).to.have.status(403);

    expect(response.body).to.deep.equal({
      message: "Access denied",
    });
  });
});
const chai = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { login } = require("../controllers/authController");

const { expect } = chai;

describe("Login Function Tests", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    process.env.JWT_SECRET = "test-jwt-secret";
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 when email or password is missing", async () => {
    req.body = {
      email: "",
      password: "",
    };

    await login(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Email and password are required",
      })
    ).to.be.true;
  });

  it("should return 400 for an invalid email format", async () => {
    req.body = {
      email: "invalid-email",
      password: "Password123",
    };

    await login(req, res);

    expect(res.status.calledWith(400)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Please enter a valid email address",
      })
    ).to.be.true;
  });

  it("should return 401 when the user does not exist", async () => {
    req.body = {
      email: "unknown@airport.com",
      password: "Password123",
    };

    sinon.stub(User, "findOne").resolves(null);

    await login(req, res);

    expect(
      User.findOne.calledWith({
        email: "unknown@airport.com",
      })
    ).to.be.true;

    expect(res.status.calledWith(401)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Invalid email or password",
      })
    ).to.be.true;
  });

  it("should return 401 when the password is incorrect", async () => {
    req.body = {
      email: "passenger@airport.com",
      password: "WrongPassword",
    };

    const mockUser = {
      _id: "passenger-001",
      email: "passenger@airport.com",
      password: "hashed-password",
      role: "Passenger",
    };

    sinon.stub(User, "findOne").resolves(mockUser);
    sinon.stub(bcrypt, "compare").resolves(false);

    await login(req, res);

    expect(res.status.calledWith(401)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Invalid email or password",
      })
    ).to.be.true;
  });

  it("should successfully log in a Passenger", async () => {
    req.body = {
      email: "passenger@airport.com",
      password: "Test123",
    };

    const mockUser = {
      _id: "passenger-001",
      email: "passenger@airport.com",
      password: "hashed-password",
      role: "Passenger",
    };

    sinon.stub(User, "findOne").resolves(mockUser);
    sinon.stub(bcrypt, "compare").resolves(true);
    sinon.stub(jwt, "sign").returns("mock-passenger-token");

    await login(req, res);

    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Login successful",
        token: "mock-passenger-token",
        user: {
          id: "passenger-001",
          email: "passenger@airport.com",
          role: "Passenger",
        },
      })
    ).to.be.true;
  });

  it("should successfully log in a Staff user", async () => {
    req.body = {
      email: "staff@airport.com",
      password: "Test123"
    };

    const mockUser = {
      _id: "staff-001",
      email: "staff@airport.com",
      password: "hashed-password",
      role: "Staff",
    };

    sinon.stub(User, "findOne").resolves(mockUser);
    sinon.stub(bcrypt, "compare").resolves(true);
    sinon.stub(jwt, "sign").returns("mock-staff-token");

    await login(req, res);

    expect(res.status.calledWith(200)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Login successful",
        token: "mock-staff-token",
        user: {
          id: "staff-001",
          email: "staff@airport.com",
          role: "Staff",
        },
      })
    ).to.be.true;
  });

  it("should return 500 when an unexpected server error occurs", async () => {
    req.body = {
      email: "passenger@airport.com",
      password: "Password123",
    };

    sinon
      .stub(User, "findOne")
      .rejects(new Error("Database error"));

    await login(req, res);

    expect(res.status.calledWith(500)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Server error",
      })
    ).to.be.true;
  });
});
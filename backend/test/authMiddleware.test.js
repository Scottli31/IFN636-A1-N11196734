const chai = require("chai");
const sinon = require("sinon");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

const { expect } = chai;

describe("Role Authorization Middleware Tests", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 401 when authenticated user information is missing", () => {
    const middleware = authorizeRoles("Passenger");

    middleware(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Authentication required",
      })
    ).to.be.true;

    expect(next.called).to.be.false;
  });

  it("should allow Passenger to access Passenger resources", () => {
    req.user = {
      userId: "passenger-001",
      role: "Passenger",
    };

    const middleware = authorizeRoles("Passenger");

    middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it("should allow Staff to access Staff resources", () => {
    req.user = {
      userId: "staff-001",
      role: "Staff",
    };

    const middleware = authorizeRoles("Staff");

    middleware(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it("should return 403 when Passenger tries to access Staff resources", () => {
    req.user = {
      userId: "passenger-001",
      role: "Passenger",
    };

    const middleware = authorizeRoles("Staff");

    middleware(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Access denied",
      })
    ).to.be.true;

    expect(next.called).to.be.false;
  });

  it("should return 403 when Staff tries to access Passenger resources", () => {
    req.user = {
      userId: "staff-001",
      role: "Staff",
    };

    const middleware = authorizeRoles("Passenger");

    middleware(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;

    expect(
      res.json.calledWith({
        message: "Access denied",
      })
    ).to.be.true;

    expect(next.called).to.be.false;
  });
});
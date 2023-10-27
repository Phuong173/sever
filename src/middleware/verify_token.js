const responses = require("../config/responses");

const jwt = require("jsonwebtoken");
const { TokenExpiredError, JsonWebTokenError  } = require("jsonwebtoken");
const security = require("../config/security");

module.exports = verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (req.path === "/users/register" || req.path === "/users/login" 
  || req.path === "/" || req.path === "/api-docs") {
    return next();
  }

  if (!token) {
    return res.status(401).json(responses.error401("unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, security.secretKey);
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json(responses.error401("Token has expired"));
    } else if (err instanceof JsonWebTokenError) {
      return res.status(401).json(responses.error401("Invalid token"));
    } else {
      return res.status(500).json(responses.error500(err, null));
    }
  }
};

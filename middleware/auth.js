const jwt = require("jsonwebtoken");
const config = require("config");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;

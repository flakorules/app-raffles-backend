const { response } = require("express");

const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  const token = req.header("x-token");


  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "There is no token on request",
    });
  }

  try {
    const { uid, userName } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = uid;
    req.userName = userName;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token is not valid",
    });
  }

  next();
};

module.exports = {
  validateJWT,
};

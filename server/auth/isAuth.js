const jwt = require("jsonwebtoken");
const users = require("../schema/userSchema");

exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({ msg: "No token provided" });
    }

    const verify = jwt.verify(token, "abc123");
    console.log("this is the verify :", verify);

    const userFound = await users.findById(verify.id);

    if (!userFound) {
      res.status(400).send({ msg: " isauth user does not exist " });
      console.log("user not found");
    } else {
      req.user = userFound;
      console.log(req.user.id);
      next();
    }
  } catch (error) {
    res.status(500).send({
      msg: "error while trying to authentificate u ",
      error: error.message,
    });
  }
};

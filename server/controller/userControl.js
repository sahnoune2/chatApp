const users = require("../schema/userSchema");

exports.getCurrent = (req, res) => {
  const user = req.user;
  if (user) {
    console.log("this is the getcurrent user", user);
    res.status(200).send({ msg: "u r logged in ", user });
  } else {
    res.status(400).send({ msg: "u need to log in" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find();
    res.status(200).send({ msg: "all useres", users: allUsers });
  } catch (error) {
    res.status(500).send({ msg: "error getting users", error: error.message });
  }
};

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { auth } = require("../auth/isAuth");
const { getCurrent, getAllUsers } = require("../controller/userControl");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send({ msg: "failed to create an account or login " }); //session failure
});

userRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log(req.user);
    const token = jwt.sign({ id: req.user._id }, process.env.secretJWT, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    // Redirect back to the frontend with a query parameter
    res.redirect("http://localhost:3000/");
    // res.redirect("/profile");
  }
);
userRouter.get("/profile", auth, getCurrent);
userRouter.get("/allusers", getAllUsers);

module.exports = userRouter;

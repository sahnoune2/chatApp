const express = require("express");
const cors = require("cors");
const session = require("express-session"); //opens  a session when i want to connect using gmail
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/congif");
const cookieParser = require("cookie-parser");
const userRouter = require("./router/router");
const { auth } = require("./auth/isAuth");
const { getCurrent } = require("./controller/userControl");
const http = require("http");
const initialization = require("./socket");

const port = process.env.port || 5000;
const app = express();
require("./config/passport"); // using require alone will unleash it immediately

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    secret: process.env.secretSession,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize()); // passport's initialization
app.use(passport.session()); // passport's initialization
app.use(cookieParser());
app.use("/auth", userRouter);

const server = http.createServer(app);
initialization(server);

connectDB();
server.listen(port, console.log("server is running"));

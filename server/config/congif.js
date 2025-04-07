const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const mongoUrl = process.env.mongoURL;

module.exports = async () => {
  try {
    mongoose.connect(mongoUrl);
    console.log("database is connected ");
  } catch (error) {
    console.log("error while trying to connect to ur database");
  }
};

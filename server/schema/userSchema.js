const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  method: { type: String, required: true },
  methodID: { type: String, required: true },
  fullName: { type: String, required: true },
  picture: { type: String },
  email: { type: String, required: true },
});
const userCollection = mongoose.model("users", userSchema);

module.exports = userCollection;

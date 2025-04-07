const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  recieverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  conversationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversations",
    required: true,
  },
  date: { type: Date, default: Date.now },
});

messageSchema.index({ conversationID: 1 });

const messageCollection = mongoose.model("messages", messageSchema);
module.exports = messageCollection;

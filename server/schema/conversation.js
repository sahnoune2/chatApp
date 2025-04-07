const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "messages" },
});

conversationSchema.index({ participants: 1 });

const collectionConversation = mongoose.model(
  "conversations",
  conversationSchema
);

module.exports = collectionConversation;

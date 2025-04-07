const socket = require("socket.io");
const conversation = require("./schema/conversation");
const message = require("./schema/message.js");

function initialization(server) {
  const io = new socket.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("setuser", (id) => {
      socket.join(id);
      console.log(`user ${id} joined the room`);
    });
    socket.on("sendmessage", async (data) => {
      const newMessage = new message({
        text: data.text,
        senderID: data.senderID,
        recieverID: data.recieverID,
      });
      await newMessage.save();

      const existConversation = await conversation.findOne({
        participants: [data.senderID, data.recieverID],
      });

      var conversationUpdated;

      if (existConversation) {
        existConversation.lastMessage = newMessage._id;
        await existConversation.save();
        conversationUpdated = existConversation;
      } else {
        const newConversation = new conversation({
          participants: [data.senderID, data.recieverID],
          lastMessage: newMessage._id,
        });
        await newConversation.save();
        conversationUpdated = newConversation;
      }

      socket.to(data.recieverID).emit("recievemessage", (data) => {
        return { newMessage, senderID: data.senderID };
      });

      io.to(data.senderID).emit("conversationupdated", conversationUpdated);
      io.to(data.recieverID).emit("conversationupdated", conversationUpdated);

      socket.on("disconnect", () => {
        console.log(`user disconnect ${socket.id}`);
      });
    });
  });
}

module.exports = initialization;

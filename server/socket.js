const socket = require("socket.io");
const conversation = require("./schema/conversation");
const message = require("./schema/message.js");

const findOrCreate = async (senderID, recieverID) => {
  const participants = [senderID, recieverID].sort();
  console.log("findOrcreate clg", participants);

  try {
    const existConversation = await conversation.findOne({ participants });

    if (existConversation) {
      return existConversation;
    }

    const newConversation = new conversation({
      participants: participants,
    });
    await newConversation.save();
    return newConversation;
  } catch (error) {
    console.log(error);
  }
};

function initialization(server) {
  const io = new socket.Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("room id ", socket.id);
    socket.on("setuser", (id) => {
      socket.join(id);
      console.log(`user ${id} joined the room`);
    });
    socket.on("sendmessage", async (data) => {
      console.log("data of message", data);
      const foundConversation = await findOrCreate(
        data.senderID,
        data.recieverID
      );

      const newMessage = new message({
        text: data.text,
        senderID: data.senderID,
        recieverID: data.recieverID,
        conversationID: foundConversation._id,
      });
      await newMessage.save();

      socket.to(data.recieverID).emit("recievemessage", {
        ...newMessage._doc,
      });

      io.to(data.senderID).emit("conversationupdated", foundConversation);
      io.to(data.recieverID).emit("conversationupdated", foundConversation);

      socket.on("disconnect", () => {
        console.log(`user disconnect ${socket.id}`);
      });
    });
  });
}

module.exports = initialization;

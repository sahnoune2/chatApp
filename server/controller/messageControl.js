const conversations = require("../schema/conversation");
const messages = require("../schema/message");

const getMessage = async (req, res) => {
  const { senderID, recieverID } = req.params;
  console.log("sender receiever", senderID, recieverID);
  try {
    const conversationFound = await conversations.findOne({
      participants: [senderID, recieverID].sort(),
    });
    console.log("conversationFound", conversationFound);
    if (!conversationFound) {
      res.status(200).send({ messages: [] });
    } else {
      const existMessages = await messages.find({
        conversationID: conversationFound._id,
      });
      console.log("exist", existMessages);
      res.status(200).send({ messages: existMessages });
    }
  } catch (error) {
    res.status(500).send({ message: "error getMessage" });
  }
};

module.exports = getMessage;

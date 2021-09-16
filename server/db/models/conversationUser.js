const Conversation = require("./conversation");
const User = require("./user");

const ConversationUser = db.define("conversation_user", {
  lastReadDate: Sequelize.DATE,
});

module.exports = Conversation;

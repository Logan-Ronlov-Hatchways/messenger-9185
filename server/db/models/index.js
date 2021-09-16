const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ConversationUser = require("");

// associations

User.belongsToMany(Conversation, { through: ConversationUser });
Conversation.belongsToMany(User, { through: ConversationUser });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
};

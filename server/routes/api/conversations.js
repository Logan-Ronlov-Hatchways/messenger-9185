const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "user1Unread", "user2Unread"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" and "lastReadTime" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        convoJSON.lastReadTime = convoJSON.user2Unread;
        convoJSON.lastReadTimeOther = convoJSON.user1Unread;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        convoJSON.lastReadTime = convoJSON.user1Unread;
        convoJSON.lastReadTimeOther = convoJSON.user2Unread;
        delete convoJSON.user2;
      }
      delete convoJSON.user2Unread;
      delete convoJSON.user1Unread;

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      //count number of unread messages
      convoJSON.numUnread = 0;
      for (let i = 0; i < convoJSON.messages.length; i++) {
        if (
          convoJSON.lastReadTime &&
          convoJSON.messages[i].createdAt <= convoJSON.lastReadTime
        ) {
          break;
        }
        if (userId !== convoJSON.messages[i].senderId) {
          convoJSON.numUnread++;
        }
      }

      //find last message of user that they read
      for (let i = convoJSON.messages.length - 1; i >= 0; i--) {
        if (
          convoJSON.lastReadTimeOther &&
          convoJSON.messages[i].createdAt > convoJSON.lastReadTimeOther
        ) {
          break;
        }
        if (userId === convoJSON.messages[i].senderId) {
          convoJSON.otherUserLastRead = convoJSON.messages[i].id;
        }
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;

      convoJSON.messages.reverse();

      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const router = require("express").Router();
const { Conversation, User } = require("../../db/models");
const Sequelize = require("sequelize");

router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { conversationId } = req.body;

    let conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      throw "conversation not in database";
    }

    if (conversation.user1Id == req.user.id) {
      conversation.user1Unread = Sequelize.fn("NOW");
    } else if (conversation.user2Id == req.user.id) {
      conversation.user2Unread = Sequelize.fn("NOW");
    } else {
      throw "username not in database";
    }

    conversation.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

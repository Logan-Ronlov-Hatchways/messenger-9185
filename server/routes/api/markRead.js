const router = require("express").Router();
const { Conversation, User } = require("../../db/models");
const Sequelize = require("sequelize");

router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { conversationId } = req.body;

    let conversation;
    try {
      conversation = await Conversation.findByPk(conversationId);
    } catch (error) {
      conversation = null;
    }

    if (!conversation) {
      const resText = "conversation not in database: id " + conversationId;
      res.status(400).send(resText);
    }

    if (conversation.user1Id === req.user.id) {
      conversation.user1Unread = Sequelize.fn("NOW");
    } else if (conversation.user2Id === req.user.id) {
      conversation.user2Unread = Sequelize.fn("NOW");
    } else {
      const resText =
        "user " + req.user.id + " not in conversation id " + conversationId;
      res.status(400).send(resText);
    }

    conversation.save();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

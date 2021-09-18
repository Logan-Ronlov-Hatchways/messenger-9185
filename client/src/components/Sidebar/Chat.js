import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { updateActiveChat } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  badge: {
    fontWeight: "bold",
    textAlign: "center",
    paddingRight: "5px",
    paddingLeft: "5px",
    minWidth: 20,
    height: 20,
    borderRadius: "20px",
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async (conversation) => {
    await props.updateActiveChat(
      conversation.otherUser.username,
      conversation.id
    );
  };

  const unreadDisplay =
    conversation.numUnread < 100 ? conversation.numUnread : "99+";

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {conversation.numUnread > 0 && (
        <Box bgcolor="primary.main" color="white" className={classes.badge}>
          {unreadDisplay}
        </Box>
      )}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateActiveChat: (name, convoId) => {
      dispatch(updateActiveChat(name, convoId));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);

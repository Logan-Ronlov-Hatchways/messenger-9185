export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      numUnread: 1,
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = [...convoCopy.messages];
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const setUnreadInStore = (state, name, numUnread, op) => {
  return state.map((convo) => {
    if (convo.otherUser.username === name) {
      const convoCopy = { ...convo };
      if (op === "add") {
        convoCopy.numUnread += numUnread;
      } else if (op === "set") {
        convoCopy.numUnread = numUnread;
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const setOtherReadInStore = (state, payload) => {
  const { convoId, username } = payload;
  return state.map((convo) => {
    if (convo.id === convoId && convo.otherUser.username === username) {
      const convoCopy = { ...convo };
      for (let i = convoCopy.messages.length - 1; i >= 0; i--) {
        if (convoCopy.otherUser.id !== convoCopy.messages[i].senderId) {
          convoCopy.otherUserLastRead = convoCopy.messages[i].id;
          break;
        }
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [...convoCopy.messages];
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.numUnread = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

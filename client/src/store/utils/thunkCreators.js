import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  setUnread,
  addToUnread,
} from "../conversations";

import { gotUser, setFetchingStatus } from "../user";
import { setActiveChat } from "../activeConversation";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

export const updateActiveChat = (username, convoId) => {
  return async (dispatch, getState) => {
    dispatch(setActiveChat(username));

    const { user } = getState();

    try {
      await axios.put("/api/markRead", { conversationId: convoId });
      await socket.emit("mark-read", { convoId, username: user.username });
      dispatch(setUnread(username, 0));
    } catch (error) {
      console.error(error);
    }
  };
};

export const receiveNewMessage = (message, sender) => {
  return async (dispatch, getState) => {
    dispatch(setNewMessage(message, sender));

    const { user, activeConversation, conversations } = getState();

    // if we're not looking at the chat for the message we just got,
    // add 1 to its unread count. otherwise tell the server that we read it
    conversations.forEach((convo) => {
      if (convo.id === message.conversationId) {
        if (convo.otherUser.username === activeConversation) {
          try {
            axios.put("/api/markRead", { conversationId: convo.id });
            socket.emit("mark-read", {
              convoId: convo.id,
              username: user.username,
            });
          } catch (error) {
            console.error(error);
          }
        } else {
          dispatch(addToUnread(convo.otherUser.username, 1));
        }
      }
    });
  };
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => {
  return async (dispatch) => {
    try {
      const data = await saveMessage(body);

      if (!body.conversationId) {
        dispatch(addConversation(body.recipientId, data.message));
      } else {
        dispatch(setNewMessage(data.message));
      }

      sendMessage(data, body);
    } catch (error) {
      console.error(error);
    }
  };
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

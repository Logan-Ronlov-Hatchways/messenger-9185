import io from "socket.io-client";
import store from "./store";
import {
  removeOfflineUser,
  addOnlineUser,
  setOtherRead,
} from "./store/conversations";
import { receiveNewMessage } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    store.dispatch(receiveNewMessage(data.message, data.sender));
  });

  socket.on("mark-read", (convoId, username) => {
    store.dispatch(setOtherRead(convoId, username));
  });
});

export default socket;

import { messageModel } from "../models/message.models.js";
import socket from "../../socket.js";

export default class MessagesManager {
  constructor() {}

  getMessages = async () => {
    try {
      const messages = await messageModel.find().lean();
      return messages;
    } catch (error) {
      console.log(error);
    }
  };

  saveMessage = async (message) => {
    try {
      const createdMessage = await messageModel.create(message);
      socket.io.emit("message_add", createdMessage);
      return createdMessage;
    } catch (error) {
      console.log(error);
    }
  };
}
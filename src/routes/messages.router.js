import { Router } from "express";

import MessageManager from "../dao/dbManagers/messageManager.js";

const messageManager = new MessageManager();
const router = Router();

router.get("/", async (req, res) => {
  const messages = await messageManager.getMessages();
  return res.send({ status: "success", payload: messages });
});

export default router;
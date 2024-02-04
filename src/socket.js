import { Server } from "socket.io";
import ProductManager from "./dao/dbManagers/productManager.js";
import MessagesManager from "./dao/dbManagers/messageManager.js";

const socket = {};

socket.connect = (server) => {
  const productManager = new ProductManager();
  const messageManager = new MessagesManager();

  socket.io = new Server(server);

  let { io } = socket;

  io.on("connection", async (socket) => {
    console.log(`Socket ${socket.id} is online!`);

    const products = await productManager.getProducts();
    io.emit("products", products);

    socket.on("add-message", async (message) => {
      const timestamp = new Date()
      const options = {
        weekday: 'long', // Día de la semana en formato largo (ejemplo: "lunes")
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      };
      const spanishDate = timestamp.toLocaleString('es-ES', options);
console.log(spanishDate);
      const messageWithTimestamp = { ...message, timestamp };
      await messageManager.saveMessage(messageWithTimestamp);
    });

    socket.on("user-auth", async (user) => {
      if (user) {
        socket.broadcast.emit("user-connected", user);
      }
    });
  });
};

export default socket;
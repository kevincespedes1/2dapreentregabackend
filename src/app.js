import express from "express";
import handlebars from "express-handlebars";
import database from "./db.js";
import __dirname from "./utils.js";
import { multiply } from "./views/helpers.js";
import socket from "./socket.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import messagesRouter from "./routes/messages.router.js";
import viewsRouter from "./routes/views.router.js";

const env = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${__dirname}/public`));

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/", viewsRouter);

  app.engine("handlebars",    handlebars.engine({      helpers: {        multiply: multiply,      },
      defaultLayout: "main",
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", __dirname + "/views");

  const httpServer = app.listen(8080, () =>
    console.log("Server up in port 8080!")
  );

  database.connect();

  socket.connect(httpServer);
};

env();
import { Router } from "express";

import ProductManager from "../dao/dbManagers/productManager.js";

import MessageManager from "../dao/dbManagers/messageManager.js";

import CartManager from "../dao/dbManagers/cartManager.js";


const productManager = new ProductManager();
const messageManager = new MessageManager();
const cartManager = new CartManager();

const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, category, available, sort } = req.query;
  const {
    docs: products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  } = await productManager.getProducts(page, limit, category, available, sort);
  res.render("home", {
    products,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    style: "styles.css",
    title: "Products",
  });
});

router.get("/product/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  res.render("product", {
    product,
    style: "styles.css",
    title: "Product Detail",
  });
});

router.get("/cart/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  res.render("cart", {
    cart,
    style: "styles.css",
    title: "Product Detail",
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const { limit = 10, page = 1, category, available, sort } = req.query;
  const {
    docs: products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  } = await productManager.getProducts(page, limit, category, available, sort);

  res.render("realTimeProducts", {
    products,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    style: "styles.css",
    title: "Real Time Products",
  });
});

router.get("/chat", async (req, res) => {
  const messages = await messageManager.getMessages();
  res.render("chat", {
    messages,
    style: "styles.css",
    title: "Coder Chat",
  });
});

export default router;
import { Router } from "express";

import CartManager from "../dao/dbManagers/cartManager.js";

const cartManager = new CartManager();
const router = Router();

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    let filteredCart = await cartManager.getCartById(cid);

    if (!filteredCart || !cid)
      return res.status(404).send({
        status: "error",
        message: { error: `Incomplete values` },
      });

    return res.status(200).send({
      status: "success",
      payload: filteredCart,
    });
  } catch (error) {
    console.log(`Cannot get cart with mongoose ${error}`);
  }
});


router.post("/", async (req, res) => {
  try {
    let newCart = await cartManager.createCart();
    res.status(201).send({ status: "Success", payload: newCart });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!cid || !pid)
      return res.status(404).send({
        status: "error",
        message: { error: `Incomplete values` },
      });

    const productAddedToCart = await cartManager.addToCart(cid, pid, quantity);

    return res
      .status(201)
      .send({ status: "Success", payload: productAddedToCart });
  } catch (error) {
    console.log(`Cannot add to cart with mongoose ${error}`);
  }
});


router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;

    if (!cid || !products)
      return res.status(400).send({
        status: "error",
        message: { error: `Incomplete values` },
      });

    let updatedCart = await cartManager.updateCart(cid, products);

    if (updatedCart.modifiedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: `Could not update cart. No cart found with ID ${cid} in the database`,
      });
    }

    return res.status(200).send({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.log(`Cannot delete cart with mongoose ${error}`);
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    if (!cid || !pid)
      return res.status(400).send({
        status: "error",
        message: { error: `Incomplete values` },
      });

    let updatedProductFromCart = await cartManager.updateProductFromCart(
      cid,
      pid,
      quantity
    );

    if (updatedProductFromCart.modifiedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: `Could not update product from cart. No product ID ${pid} found in cart ID ${cid}.`,
      });
    }

    return res.status(200).send({
      status: "success",
      payload: updatedProductFromCart,
    });
  } catch (error) {
    console.log(`Cannot update cart with mongoose ${error}`);
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!cid)
      return res.status(400).send({
        status: "error",
        message: { error: `Incomplete values` },
      });

    let deletedCart = await cartManager.deleteCart(cid);

    if (deletedCart.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: `Could not delete cart. No cart found with ID ${cid} in the database`,
      });
    }

    return res.status(200).send({
      status: "success",
      payload: deletedCart,
    });
  } catch (error) {
    console.log(`Cannot delete cart with mongoose ${error}`);
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!cid || !pid)
      return res.status(400).send({
        status: "error",
        message: { error: `Incomplete values` },
      });

    let deletedProductFromCart = await cartManager.deleteProductFromCart(
      cid,
      pid
    );

    if (deletedProductFromCart.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: `Could not delete product from cart. No product ID ${pid} found in cart ID ${cid}.`,
      });
    }

    return res.status(200).send({
      status: "success",
      payload: deletedProductFromCart,
    });
  } catch (error) {
    console.log(`Cannot delete cart with mongoose ${error}`);
  }
});

export default router;
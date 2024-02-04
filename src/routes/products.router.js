import { Router } from "express";
import { uploader } from "../utils.js";
import { productModel } from "../dao/models/products.model.js";

import ProductManager from "../dao/dbManagers/productManager.js";

const productManager = new ProductManager();
const router = Router();


router.get("/", async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      category = null,
      available = null,
      sort = null,
    } = req.query;

    const products = await productManager.getProducts(
      page,
      limit,
      category,
      available,
      sort
    );

    if (!products)
      return res.status(404).send({
        status: "error",
        error: `No products found`,
      });

    if (isNaN(limit)) {
      return res.status(400).send({
        status: "error",
        error: `Limit ${limit} is not a valid value`,
      });
    }

    if (isNaN(page)) {
      return res.status(400).send({
        status: "error",
        error: `Page ${page} is not a valid value`,
      });
    }

    if (isNaN(sort) && sort !== null) {
      return res.status(400).send({
        status: "error",
        error: `Sort value ${sort} is not a valid value`,
      });
    }

    res.status(200).send({
      status: "success",
      payload: products,
    });
  }catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor.",
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const filteredProduct = await productManager.getProductById(pid);

    if (!filteredProduct || filteredProduct == 0)
      return res.status(404).send({
        status: "error",
        error: `Product with ID ${pid} was not found`,
      });

    return res.status(200).send({
      status: "success",
      payload: filteredProduct,
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor.",
    });
  }
});
const thumbnailBaseUrl = '/img/';

router.post("/", uploader.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    const thumbnail = req.file ? req.file.filename : null;
    const existingProduct = await productModel.findOne({ code });
    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: `Ya existe un producto con el código ${code}.`,
      });
    }
    const thumbnailUrl = thumbnail ? thumbnailBaseUrl + thumbnail : null;

    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail: thumbnailUrl,
    });

res.status(201).json({
  status: "success",
  payload: newProduct,
});
} catch (error) {
console.error("Error al agregar el producto:", error);
res.status(500).json({
  status: "error",
  message: "Error interno del servidor.",
});
}
});
router.post("/:cartId/add-product", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartId = req.params.cartId;

    // Verificar si el carrito existe (debes implementar la lógica para verificarlo)
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Verificar si el producto existe
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Agregar el producto al carrito
    // (Debes implementar la lógica para agregar el producto al carrito)

    res.status(200).json({ message: "Producto agregado al carrito exitosamente" });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



router.put("/:pid", async (req, res) => {
  try {
    const updateProd = req.body;
    const updateId = req.params.pid;

    if (!updateProd || !updateId) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const updatedProduct = await productManager.updateProduct(
      updateId,
      updateProd
    );

    return res.status(200).send({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor.",
    });
  }
});


router.delete("/:pid", async (req, res) => {
  try {
    const deleteId = req.params.pid;

    if (!deleteId) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    let deletedProduct = await productManager.deleteProduct(deleteId);

    if (deletedProduct.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: `Could not delete product. No product found with ID ${deleteId} in the database`,
      });
    }

    return res.status(200).send({
      status: "success",
      payload: deletedProduct,
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor.",
    });
  }
});

export default router;
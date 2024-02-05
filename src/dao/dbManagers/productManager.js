import { productModel } from "../models/products.model.js";
import socket from "../../socket.js";

export default class ProductManager {
  constructor() { }

  getProducts = async (page, limit, category, available, sort) => {
    try {
      let queries = {};
      category ? (queries.category = category) : null;
      available ? (queries.status = available) : null;
      let sortOption = {};
      if (sort) {
        if (parseInt(sort) === 1) {
          sortOption = { price: 1 };
        } else if (parseInt(sort) === -1) {
          sortOption = { price: -1 };
        }
      }
      const products = await productModel.paginate(queries, {
        limit: parseInt(limit),
        page,
        lean: true,
        sort: sortOption,
      });

      products.hasPrevPage
        ? (products.prevLink = `/?page=${products.prevPage}`)
        : (products.prevLink = null);
      products.hasNextPage
        ? (products.nextLink = `/?page=${products.nextPage}`)
        : (products.nextLink = null);

      return products;
    } catch (error) {
      console.log(error);
    }
  };

  getProductById = async (productId) => {
    try {
      const filteredProduct = await productModel
        .findOne({ _id: productId })
        .lean();
      return filteredProduct;
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (product) => {
    try {

      const existingProduct = await productModel.findOne({ code: product.code });
      if (existingProduct) {
        throw new Error(`Ya existe un producto con el código ${product.code}.`);
      }
      product.stock > 0
        ? (product = { status: true, ...product })
        : (product = { status: false, ...product });
      const newProduct = await productModel.create(product);

      socket.io.emit("product_add", newProduct);

      return newProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updateProduct = async (productId, updateProd) => {
    try {
      const updatedProduct = await productModel.updateOne(
        { _id: productId },
        updateProd
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (deleteId) => {
    try {
      socket.io.emit("product_remove", deleteId);
      const deletedProduct = await productModel.deleteOne({ _id: deleteId });
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  };
}
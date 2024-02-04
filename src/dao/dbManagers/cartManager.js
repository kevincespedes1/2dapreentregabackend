import { cartModel } from "../../dao/models/carts.model.js";

export default class CartManager {
  constructor() {}

  getCartById = async (cartId) => {
    try {
      const filteredCart = await cartModel.findOne({ _id: cartId }).lean();
      return filteredCart;
    } catch (error) {
      console.log(error);
    }
  };

  createCart = async () => {
    try {
      const newCart = await cartModel.create({
        products: [],
      });
      return newCart;
    } catch (error) {
      console.log(error);
    }
  };

  addToCart = async (cartId, productId, quantity) => {
    try {
      let cartFound = await cartModel.findOne({ _id: cartId });

      const productIdInCart = cartFound.products.findIndex((product) => {
        return product.productId._id.toString() === productId;
      });

      if (productIdInCart !== -1) {
        await cartModel.updateOne(
          { _id: cartId, "products.productId": productId },
          { $inc: { "products.$.quantity": 1 } }
        );
        const updatedCartWithProduct = await cartModel.findOne({ _id: cartId });
        return updatedCartWithProduct;
      } else {
        const productAddToCart = {
          productId: productId,
          quantity: quantity ? quantity : 1,
        };
        await cartModel.updateOne(
          { _id: cartId },
          { $push: { products: productAddToCart } }
        );
        const updatedCartWithProduct = await cartModel.findOne({ _id: cartId });
        return updatedCartWithProduct;
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateCart = async (cartId, products) => {
    try {
      const updatedCart = await cartModel.updateOne(
        { _id: cartId },
        { products: products }
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };

  updateProductFromCart = async (cartId, productId, quantity) => {
    try {
      const updatedCartProduct = await cartModel.updateOne(
        { _id: cartId, "products.productId": productId },
        { "products.$.quantity": quantity }
      );
      return updatedCartProduct;
    } catch (error) {
      console.log(error);
    }
  };

  deleteCart = async (cartId) => {
    try {
      const deletedCart = await cartModel.deleteOne({ _id: cartId });
      return deletedCart;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const updatedCart = await cartModel.updateOne(
        { _id: cartId },
        { $pull: { products: { productId: productId } } }
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };
}
